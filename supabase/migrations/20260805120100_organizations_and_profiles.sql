-- Phase 1: organizations, organization-level settings, and user profiles.

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_form text,
  street text,
  postal_code text,
  city text,
  country text not null default 'DE',
  phone text,
  email text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organizations is 'Top-level tenant. All business tables scope to one organization_id.';

create table public.organization_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  logo_url text,
  bank_name text,
  iban text,
  bic text,
  tax_id text,
  vat_id text,
  -- Default delivery fee in integer cents. Spec default: 2,50 EUR.
  default_delivery_fee_cents integer not null default 250 check (default_delivery_fee_cents >= 0),
  default_payment_terms_days integer not null default 14 check (default_payment_terms_days >= 0),
  currency text not null default 'EUR',
  timezone text not null default 'Europe/Berlin',
  -- Numbering sequence prefixes, kept configurable rather than hard-coded.
  customer_number_prefix text not null default 'MG-K-',
  -- Not one of the spec's formal Nummernkreise, kept configurable for
  -- consistency with the others; distinct from the delivery-note prefix.
  supplier_number_prefix text not null default 'MG-LF-',
  order_number_prefix text not null default 'MG-B-',
  invoice_number_prefix text not null default 'MG-R-',
  delivery_note_number_prefix text not null default 'MG-L-',
  route_number_prefix text not null default 'MG-T-',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organization_settings is 'One row per organization. Editable company/tax/numbering defaults — see CLAUDE.md rule 8 for tax fields left intentionally unset.';

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- Nullable: a user can exist (invited) before an admin assigns them to an
  -- organization. RLS on every business table denies access while this is
  -- null, since current_org_id() resolves to null.
  organization_id uuid references public.organizations (id) on delete set null,
  role public.user_role not null default 'DISPOSITION',
  full_name text not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Extends auth.users with organization membership and app role.';

create index profiles_organization_id_idx on public.profiles (organization_id);

-- Helper functions used throughout RLS policies.

create function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

create function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() = 'ADMIN', false);
$$;

-- True if the calling user's role is one of the given roles. ADMIN always
-- passes, so callers don't need to list it explicitly.
create function public.has_role(variadic roles public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() = any(roles) or public.current_role() = 'ADMIN', false);
$$;

-- Auto-provisions a minimal profile row (organization_id null, role
-- defaulted) whenever a new Supabase Auth user is created, so the
-- "invite via Auth, admin assigns org/role afterwards" bootstrap flow in
-- supabase/seed.sql has a row to update.
create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'Unbenannt'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- updated_at maintenance trigger, reused by every table below.

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

create trigger organization_settings_set_updated_at
  before update on public.organization_settings
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.organization_settings enable row level security;
alter table public.profiles enable row level security;

create policy organizations_select on public.organizations
  for select using (id = public.current_org_id());

create policy organizations_update on public.organizations
  for update using (id = public.current_org_id() and public.is_admin());

create policy organization_settings_select on public.organization_settings
  for select using (organization_id = public.current_org_id());

create policy organization_settings_update on public.organization_settings
  for update using (organization_id = public.current_org_id() and public.is_admin());

create policy profiles_select_own_org on public.profiles
  for select using (organization_id = public.current_org_id());

create policy profiles_select_self on public.profiles
  for select using (id = auth.uid());

create policy profiles_update_self on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_admin_manage on public.profiles
  for all using (organization_id = public.current_org_id() and public.is_admin())
  with check (organization_id = public.current_org_id() and public.is_admin());
