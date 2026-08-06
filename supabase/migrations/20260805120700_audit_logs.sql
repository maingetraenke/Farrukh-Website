-- Phase 1: audit log for prices, stock, order/invoice/payment status,
-- roles, and settings changes. Written by domain services (Server
-- Actions), not by database triggers, since the audited "action" is
-- usually a business event richer than a raw row diff.

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Append-only. entity_type/action are free text (e.g. "product_price"/"update", "order"/"status_change") rather than enums so new domains do not require a migration.';

create index audit_logs_org_idx on public.audit_logs (organization_id, created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

alter table public.audit_logs enable row level security;

create policy audit_logs_select on public.audit_logs
  for select using (
    organization_id = public.current_org_id()
    and public.has_role('BUCHHALTUNG')
  );

-- Any authenticated org member's server-side action can write an audit
-- entry for its own actor_id; entries are otherwise immutable (no
-- update/delete policy exists).
create policy audit_logs_insert on public.audit_logs
  for insert with check (
    organization_id = public.current_org_id()
    and actor_id = auth.uid()
  );
