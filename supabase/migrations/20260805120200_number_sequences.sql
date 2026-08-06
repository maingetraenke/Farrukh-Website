-- Phase 1: atomic number sequence engine.
--
-- Rule: numbering is always generated server-side via this function, never
-- "select count(*) + 1" from the UI/application layer, to avoid duplicate
-- numbers under concurrent inserts.

create table public.number_sequences (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  -- e.g. 'customer', 'order', 'invoice', 'delivery_note', 'route'
  sequence_key text not null,
  -- '' for sequences that never reset, otherwise a period key such as
  -- '2026' (yearly) or '20260806' (daily) that the sequence resets on.
  period_key text not null default '',
  last_value bigint not null default 0,
  primary key (organization_id, sequence_key, period_key)
);

comment on table public.number_sequences is 'Per-organization, per-period counters. Advance only via public.next_sequence_value.';

-- Atomically advances and returns the next value for (organization_id,
-- sequence_key, period_key). Safe under concurrent callers: the upsert
-- takes a row lock for the duration of the statement.
create function public.next_sequence_value(
  p_organization_id uuid,
  p_sequence_key text,
  p_period_key text default ''
)
returns bigint
language sql
security definer
set search_path = public
as $$
  insert into public.number_sequences (organization_id, sequence_key, period_key, last_value)
  values (p_organization_id, p_sequence_key, p_period_key, 1)
  on conflict (organization_id, sequence_key, period_key)
  do update set last_value = public.number_sequences.last_value + 1
  returning last_value;
$$;

alter table public.number_sequences enable row level security;

create policy number_sequences_select on public.number_sequences
  for select using (organization_id = public.current_org_id());
