-- Phase 1: suppliers (Lieferanten/Einkauf master data).
-- Purchase orders and goods receipts land in Phase 2 alongside inventory
-- movements from real purchasing flows; this migration only covers the
-- supplier master record referenced by products.

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  supplier_number text not null,
  name text not null,
  contact_name text,
  street text,
  postal_code text,
  city text,
  country text not null default 'DE',
  phone text,
  email text,
  payment_terms_days integer check (payment_terms_days is null or payment_terms_days >= 0),
  minimum_order_value_cents integer check (minimum_order_value_cents is null or minimum_order_value_cents >= 0),
  opening_hours text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, supplier_number)
);

comment on table public.suppliers is 'Beverage suppliers we pick up stock from ourselves. Known supplier "Volpert" in Zell is master data here, not hard-coded.';

create index suppliers_organization_id_idx on public.suppliers (organization_id);

create trigger suppliers_set_updated_at
  before update on public.suppliers
  for each row execute function public.set_updated_at();

create function public.next_supplier_number(p_organization_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select supplier_number_prefix from public.organization_settings where organization_id = p_organization_id),
    'MG-LF-'
  ) || lpad(public.next_sequence_value(p_organization_id, 'supplier')::text, 4, '0');
$$;

create function public.suppliers_assign_number()
returns trigger
language plpgsql
as $$
begin
  if new.supplier_number is null or new.supplier_number = '' then
    new.supplier_number := public.next_supplier_number(new.organization_id);
  end if;
  return new;
end;
$$;

create trigger suppliers_assign_number_trigger
  before insert on public.suppliers
  for each row execute function public.suppliers_assign_number();

alter table public.suppliers enable row level security;

create policy suppliers_rw on public.suppliers
  for all using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER', 'BUCHHALTUNG')
  )
  with check (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER', 'BUCHHALTUNG')
  );
