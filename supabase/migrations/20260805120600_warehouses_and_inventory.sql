-- Phase 1: warehouses and stock. inventory_movements is the append-only
-- source of truth; inventory_balances is a materialized cache kept in sync
-- by a trigger so every read gets a consistent on_hand/reserved without
-- re-aggregating the movement log.

create table public.warehouses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  street text,
  postal_code text,
  city text,
  is_default boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.warehouses is 'Currently a single ~10m² ground-floor warehouse per spec, modeled as a table so a second location is a data change, not a schema change.';

create trigger warehouses_set_updated_at
  before update on public.warehouses
  for each row execute function public.set_updated_at();

create table public.inventory_balances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  warehouse_id uuid not null references public.warehouses (id) on delete cascade,
  on_hand integer not null default 0 check (on_hand >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  updated_at timestamptz not null default now(),
  unique (product_id, warehouse_id)
);

comment on table public.inventory_balances is 'available = on_hand - reserved, computed at read time. Not constrained to >= 0 here: an admin override can intentionally over-reserve; the non-override path is enforced by the domain service, not this table.';

create index inventory_balances_org_idx on public.inventory_balances (organization_id);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  warehouse_id uuid not null references public.warehouses (id) on delete cascade,
  movement_type public.inventory_movement_type not null,
  -- Signed delta; meaning depends on movement_type, see docs/database.md.
  quantity integer not null check (quantity <> 0),
  reason text,
  -- Loosely typed reference to the originating record (purchase order,
  -- sales order, ...). Tightened to real foreign keys as those tables land
  -- in Phase 2/3 rather than forward-declared now.
  reference_type text,
  reference_id uuid,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint inventory_movements_reason_required check (
    movement_type not in ('STOCKTAKE_CORRECTION', 'BREAKAGE', 'MANUAL_CORRECTION')
    or (reason is not null and length(trim(reason)) > 0)
  )
);

comment on table public.inventory_movements is 'Append-only audit trail of every stock change. Never update/delete a row — post an offsetting movement instead.';

create index inventory_movements_product_idx on public.inventory_movements (product_id, created_at desc);
create index inventory_movements_org_idx on public.inventory_movements (organization_id, created_at desc);

create function public.apply_inventory_movement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_on_hand_delta integer := 0;
  v_reserved_delta integer := 0;
begin
  case new.movement_type
    when 'GOODS_RECEIPT' then
      v_on_hand_delta := new.quantity;
    when 'RESERVATION' then
      v_reserved_delta := new.quantity;
    when 'DELIVERY' then
      v_on_hand_delta := -new.quantity;
      v_reserved_delta := -new.quantity;
    when 'CANCELLATION' then
      v_reserved_delta := -new.quantity;
    when 'STOCKTAKE_CORRECTION', 'BREAKAGE', 'MANUAL_CORRECTION' then
      v_on_hand_delta := new.quantity;
  end case;

  insert into public.inventory_balances (organization_id, product_id, warehouse_id, on_hand, reserved)
  values (new.organization_id, new.product_id, new.warehouse_id, greatest(v_on_hand_delta, 0), greatest(v_reserved_delta, 0))
  on conflict (product_id, warehouse_id)
  do update set
    on_hand = public.inventory_balances.on_hand + v_on_hand_delta,
    reserved = public.inventory_balances.reserved + v_reserved_delta,
    updated_at = now();

  return new;
end;
$$;

create trigger inventory_movements_apply
  after insert on public.inventory_movements
  for each row execute function public.apply_inventory_movement();

alter table public.warehouses enable row level security;
alter table public.inventory_balances enable row level security;
alter table public.inventory_movements enable row level security;

create policy warehouses_select on public.warehouses
  for select using (organization_id = public.current_org_id());

create policy warehouses_write on public.warehouses
  for all using (organization_id = public.current_org_id() and public.is_admin())
  with check (organization_id = public.current_org_id() and public.is_admin());

create policy inventory_balances_select on public.inventory_balances
  for select using (organization_id = public.current_org_id());

-- Balances are only ever written by the apply_inventory_movement trigger
-- (which runs as the definer, bypassing RLS) — no direct write policy.

create policy inventory_movements_select on public.inventory_movements
  for select using (organization_id = public.current_org_id());

create policy inventory_movements_insert on public.inventory_movements
  for insert with check (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER')
  );
