-- Public-facing capture tables for the marketing site: cart-based order
-- inquiries and general contact messages. Both are anonymous submissions
-- (no auth), so RLS grants INSERT broadly and restricts SELECT/UPDATE to
-- staff.
--
-- These are NOT the real orders pipeline (that lands in Phase 2 with
-- proper pricing, stock reservation, and status flow). Until then, an
-- inquiry is just a lead a staff member follows up on manually — no
-- price is computed or promised here, since no real sale prices exist
-- yet (see product_prices). Real spam/rate-limit protection is Release
-- 1.1 per spec; validation here is best-effort only.

create type public.lead_status as enum ('NEW', 'CONTACTED', 'CONVERTED', 'DECLINED');

create table public.order_inquiries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_name text not null,
  email text not null,
  phone text,
  delivery_street text,
  delivery_postal_code text,
  delivery_city text,
  requested_date date,
  -- Snapshot of what was in the cart at submission time: array of
  -- { product_id, name, brand, gebinde, quantity }. Not normalized into
  -- order_items since this isn't a real order yet — see comment above.
  items jsonb not null,
  notes text,
  status public.lead_status not null default 'NEW',
  created_at timestamptz not null default now()
);

comment on table public.order_inquiries is 'Cart submissions from the public marketing site. A staff member turns these into a real order (Phase 2) manually for now.';

create index order_inquiries_org_idx on public.order_inquiries (organization_id, created_at desc);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status public.lead_status not null default 'NEW',
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is 'Contact form submissions from the public marketing site.';

create index contact_messages_org_idx on public.contact_messages (organization_id, created_at desc);

alter table public.order_inquiries enable row level security;
alter table public.contact_messages enable row level security;

create policy order_inquiries_insert_public on public.order_inquiries
  for insert with check (
    length(trim(customer_name)) > 0
    and length(trim(email)) > 0
    and jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) > 0
  );

create policy order_inquiries_select_staff on public.order_inquiries
  for select using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'BUCHHALTUNG')
  );

create policy order_inquiries_update_staff on public.order_inquiries
  for update using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'BUCHHALTUNG')
  );

create policy contact_messages_insert_public on public.contact_messages
  for insert with check (
    length(trim(name)) > 0
    and length(trim(email)) > 0
    and length(trim(message)) > 0
  );

create policy contact_messages_select_staff on public.contact_messages
  for select using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'BUCHHALTUNG')
  );

create policy contact_messages_update_staff on public.contact_messages
  for update using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'BUCHHALTUNG')
  );
