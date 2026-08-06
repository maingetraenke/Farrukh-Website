-- Phase 1: customers and their delivery addresses.
-- Billing address lives on the customer row; customer_addresses holds the
-- (possibly multiple) delivery addresses per spec.

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_number text not null,
  customer_type public.customer_type not null,
  company_name text,
  first_name text,
  last_name text,
  billing_street text,
  billing_postal_code text,
  billing_city text,
  billing_country text not null default 'DE',
  phone text,
  email text,
  preferred_payment_method public.payment_method,
  -- null = falls back to organization_settings.default_payment_terms_days
  payment_terms_days integer check (payment_terms_days is null or payment_terms_days >= 0),
  delivery_notes text,
  notes text,
  vat_id text,
  active boolean not null default true,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, customer_number),
  constraint customers_company_name_required check (
    customer_type <> 'COMPANY' or company_name is not null
  ),
  constraint customers_last_name_required check (
    customer_type <> 'PRIVATE' or last_name is not null
  )
);

comment on table public.customers is 'Private and company customers. customer_number is generated server-side (MG-K-000001), never client-supplied.';

create index customers_organization_id_idx on public.customers (organization_id);
create index customers_search_idx on public.customers using gin (
  to_tsvector('german', coalesce(company_name, '') || ' ' || coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(phone, '') || ' ' || coalesce(email, ''))
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  label text,
  street text not null,
  postal_code text not null,
  city text not null,
  country text not null default 'DE',
  delivery_notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.customer_addresses is 'Delivery addresses. A customer may have several; is_default marks the one preselected on new orders.';

create index customer_addresses_customer_id_idx on public.customer_addresses (customer_id);

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

create trigger customer_addresses_set_updated_at
  before update on public.customer_addresses
  for each row execute function public.set_updated_at();

-- Generates MG-K-000001 style numbers using the org's configured prefix
-- and the shared atomic sequence engine.
create function public.next_customer_number(p_organization_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select customer_number_prefix from public.organization_settings where organization_id = p_organization_id),
    'MG-K-'
  ) || lpad(public.next_sequence_value(p_organization_id, 'customer')::text, 6, '0');
$$;

create function public.customers_assign_number()
returns trigger
language plpgsql
as $$
begin
  if new.customer_number is null or new.customer_number = '' then
    new.customer_number := public.next_customer_number(new.organization_id);
  end if;
  return new;
end;
$$;

create trigger customers_assign_number_trigger
  before insert on public.customers
  for each row execute function public.customers_assign_number();

alter table public.customers enable row level security;
alter table public.customer_addresses enable row level security;

-- FAHRER is intentionally excluded here in Phase 1: drivers get customer
-- visibility scoped to their own route/stops once routes exist (Phase 3),
-- not blanket read access to the customer list.
create policy customers_rw on public.customers
  for all using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER', 'BUCHHALTUNG')
  )
  with check (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER', 'BUCHHALTUNG')
  );

create policy customer_addresses_rw on public.customer_addresses
  for all using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER', 'BUCHHALTUNG')
  )
  with check (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'LAGER', 'BUCHHALTUNG')
  );
