-- Phase 1: deposit types, products, and historized pricing.

create type public.product_category as enum (
  'WASSER',
  'BIER',
  'WEIN_SEKT',
  'SAFT_SCHORLEN',
  'SOFTDRINKS',
  'SONSTIGES'
);

comment on type public.product_category is 'No ENERGY_DRINK value on purpose: energy drinks are out of scope at launch per spec.';

create table public.deposit_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  -- Never seeded with an invented value — set by an admin who knows the
  -- real Pfand amount. See CLAUDE.md rule 5.
  amount_cents integer check (amount_cents is null or amount_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

comment on table public.deposit_types is 'Pfand master data (e.g. Kasten Glas 0,5L, Kasten PET). amount_cents is nullable until a real value is entered.';

create trigger deposit_types_set_updated_at
  before update on public.deposit_types
  for each row execute function public.set_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  article_number text not null,
  ean text,
  name text not null,
  brand text not null,
  category public.product_category not null,
  variant text,
  bottles_per_case integer not null check (bottles_per_case > 0),
  bottle_volume_ml integer not null check (bottle_volume_ml > 0),
  bottle_material public.bottle_material not null,
  -- Hard business rule: sale is always by the case. Loosening this is a
  -- deliberate schema change, not a runtime toggle.
  sales_unit text not null default 'KASTEN' check (sales_unit = 'KASTEN'),
  supplier_id uuid references public.suppliers (id) on delete set null,
  deposit_type_id uuid references public.deposit_types (id) on delete set null,
  -- Master-data tax rate. Left null until finance/legal confirms real
  -- rates per product; never guessed. See CLAUDE.md rule 8.
  tax_rate_percent numeric(4, 2) check (tax_rate_percent is null or tax_rate_percent >= 0),
  min_stock integer not null default 0 check (min_stock >= 0),
  target_stock integer check (target_stock is null or target_stock >= 0),
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, article_number),
  constraint products_no_1_5l_softdrinks check (
    category <> 'SOFTDRINKS' or bottle_volume_ml <> 1500
  )
);

comment on table public.products is 'Sold exclusively by the case (Kasten). Brand/category assortment rules beyond the hard constraints here are curated by admins, not enforced in schema.';

create index products_organization_id_idx on public.products (organization_id);
create index products_category_idx on public.products (organization_id, category);
create unique index products_ean_unique_idx on public.products (organization_id, ean) where ean is not null;
create index products_search_idx on public.products using gin (
  to_tsvector('german', name || ' ' || brand || ' ' || coalesce(variant, '') || ' ' || coalesce(ean, ''))
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create function public.next_article_number(p_organization_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select 'MG-A-' || lpad(public.next_sequence_value(p_organization_id, 'product')::text, 5, '0');
$$;

create function public.products_assign_number()
returns trigger
language plpgsql
as $$
begin
  if new.article_number is null or new.article_number = '' then
    new.article_number := public.next_article_number(new.organization_id);
  end if;
  return new;
end;
$$;

create trigger products_assign_number_trigger
  before insert on public.products
  for each row execute function public.products_assign_number();

-- Historized purchase/sale prices. "Current" price = latest row with
-- valid_from <= now(), see docs/database.md for the read pattern.
create table public.product_prices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  purchase_price_cents integer check (purchase_price_cents is null or purchase_price_cents >= 0),
  sale_price_cents integer check (sale_price_cents is null or sale_price_cents >= 0),
  valid_from timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.product_prices is 'Append-only price history. Never update/delete a past row — insert a new one with a later valid_from instead.';

create index product_prices_product_id_idx on public.product_prices (product_id, valid_from desc);

alter table public.deposit_types enable row level security;
alter table public.products enable row level security;
alter table public.product_prices enable row level security;

create policy deposit_types_select on public.deposit_types
  for select using (organization_id = public.current_org_id());

create policy deposit_types_write on public.deposit_types
  for insert with check (organization_id = public.current_org_id() and public.is_admin());

create policy deposit_types_update on public.deposit_types
  for update using (organization_id = public.current_org_id() and public.is_admin());

-- Everyone in the org can read the catalog (drivers need names/case sizes
-- while picking/delivering); purchase price visibility is restricted at
-- the application layer per role (LAGER/FAHRER must not see EK).
create policy products_select on public.products
  for select using (organization_id = public.current_org_id());

create policy products_write on public.products
  for all using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER')
  )
  with check (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER')
  );

-- Purchase-price history is finance-sensitive: only roles with EK rights
-- may read/write it (LAGER and FAHRER are excluded, per spec).
create policy product_prices_rw on public.product_prices
  for all using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'BUCHHALTUNG')
  )
  with check (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'BUCHHALTUNG')
  );
