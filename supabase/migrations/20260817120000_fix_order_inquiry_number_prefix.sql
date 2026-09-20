-- Fixes a prefix collision: order_inquiries numbering
-- (20260806100000_order_inquiries_numbering.sql) hardcoded "MG-L-", but
-- organization_settings.delivery_note_number_prefix already reserves
-- "MG-L-" for Lieferscheine (see 20260805120100_organizations_and_profiles.sql).
-- Gives inquiries their own configurable prefix, following the same
-- coalesce-with-fallback pattern as next_customer_number/next_article_number.

alter table public.organization_settings
  add column order_inquiry_number_prefix text not null default 'MG-ANF-';

comment on column public.organization_settings.order_inquiry_number_prefix is
  'Prefix for order_inquiries (unverbindliche Bestellanfragen) — distinct from order_number_prefix (MG-B-, reserved for confirmed orders once that pipeline exists) and delivery_note_number_prefix (MG-L-).';

create or replace function public.next_inquiry_number(p_organization_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select order_inquiry_number_prefix from public.organization_settings where organization_id = p_organization_id),
    'MG-ANF-'
  ) || to_char(now(), 'YYYY') || '-'
    || lpad(public.next_sequence_value(p_organization_id, 'order_inquiry', to_char(now(), 'YYYY'))::text, 6, '0');
$$;

-- Re-number existing rows still on the old, colliding MG-L- prefix. Safe
-- pre-launch: nothing external references these numbers yet. Each call
-- advances the shared sequence, so rows get fresh, still-unique numbers.
update public.order_inquiries
set inquiry_number = public.next_inquiry_number(organization_id)
where inquiry_number like 'MG-L-%';
