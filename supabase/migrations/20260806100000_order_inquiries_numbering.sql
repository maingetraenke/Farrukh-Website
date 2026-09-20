-- Adds a human-readable reference number to order_inquiries, using the
-- same atomic sequence engine as customers/products (see
-- 20260805120200_number_sequences.sql). Yearly-resetting, like the
-- orders/invoices numbering documented in docs/database.md.
--
-- Prefix is MG-L- ("Lead"), deliberately distinct from the MG-B- prefix
-- reserved for real orders once the Phase 2 pipeline exists — an inquiry
-- is not yet a priced, confirmed order (see the comment on
-- order_inquiries in 20260806090000_public_leads.sql).

alter table public.order_inquiries
  add column inquiry_number text;

create function public.next_inquiry_number(p_organization_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select 'MG-L-' || to_char(now(), 'YYYY') || '-'
    || lpad(public.next_sequence_value(p_organization_id, 'order_inquiry', to_char(now(), 'YYYY'))::text, 6, '0');
$$;

create function public.order_inquiries_assign_number()
returns trigger
language plpgsql
as $$
begin
  if new.inquiry_number is null or new.inquiry_number = '' then
    new.inquiry_number := public.next_inquiry_number(new.organization_id);
  end if;
  return new;
end;
$$;

create trigger order_inquiries_assign_number_trigger
  before insert on public.order_inquiries
  for each row execute function public.order_inquiries_assign_number();

-- Backfill existing rows (if any) so every inquiry has a number.
update public.order_inquiries
set inquiry_number = public.next_inquiry_number(organization_id)
where inquiry_number is null;

alter table public.order_inquiries
  alter column inquiry_number set not null;

create unique index order_inquiries_number_unique_idx
  on public.order_inquiries (organization_id, inquiry_number);
