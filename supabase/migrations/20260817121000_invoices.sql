-- Phase 4: invoices. Snapshot-based like order_inquiries (no separate
-- normalized line-items table) — an invoice is generated from a single
-- order_inquiry and must never change afterwards even if the source
-- inquiry, product prices, or catalog change later (append-only document).
--
-- Populates organization_settings.tax_id with the business owner's
-- confirmed Steuernummer (2026-08-16 chat) — explicitly authorized for
-- internal/invoice use only, never the public Impressum. Also corrects
-- default_payment_terms_days to 7, matching the explicit business rule
-- ("Standard-Zahlungsziel = 7 Tage") — was left at the generic
-- Phase-1-scaffold default of 14. bank_name/iban/bic/vat_id remain null:
-- not provided, not guessed — see CLAUDE.md rule 5.
update public.organization_settings
set tax_id = '227/208/80729',
    default_payment_terms_days = 7
where organization_id = '00000000-0000-0000-0000-000000000001';

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  -- Nullable at creation, assigned by the before-insert trigger below (see
  -- customers/order_inquiries for the same pattern) — then set not null.
  invoice_number text,
  order_inquiry_id uuid references public.order_inquiries (id) on delete set null,

  -- Customer/delivery snapshot at invoice time — never joined live against
  -- order_inquiries, so the document can't silently change if the source
  -- row is edited later.
  customer_name text not null,
  customer_email text not null,
  delivery_street text,
  delivery_postal_code text,
  delivery_city text,

  -- Line items: same shape as CartItemSnapshot (product_id, name, brand,
  -- gebinde, quantity, sale_price_cents, deposit_name,
  -- deposit_amount_cents) — the price/deposit snapshot already captured
  -- on the order_inquiry, copied forward so the invoice is self-contained.
  items jsonb not null,

  -- Money: integer cents throughout, never float (CLAUDE.md rule 9).
  goods_total_cents integer not null check (goods_total_cents >= 0),
  deposit_total_cents integer not null check (deposit_total_cents >= 0),
  delivery_fee_cents integer not null check (delivery_fee_cents >= 0),
  -- 19% MwSt. is included in goods_total_cents (gross prices throughout,
  -- see docs/database.md); this is the derived tax portion, shown
  -- separately on the PDF per invoice requirements, not an additional
  -- charge.
  tax_total_cents integer not null check (tax_total_cents >= 0),
  total_cents integer not null check (total_cents >= 0),

  payment_terms_days integer not null,
  issued_at timestamptz not null default now(),
  due_date date not null,

  email_status text not null default 'PENDING' check (email_status in ('PENDING', 'SENT', 'FAILED')),
  email_sent_at timestamptz,
  email_error text,

  -- Cancellation (Storno), not hard delete — CLAUDE.md rule 18. Nothing
  -- writes these yet (no cancellation UI in this pass), the columns exist
  -- so a follow-up can add it without another migration.
  cancelled_at timestamptz,
  cancellation_reason text,

  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.invoices is 'Append-only. Never update items/totals after creation — a corrected invoice is a Storno (cancelled_at/cancellation_reason) plus a new invoice, not an edit.';

create index invoices_organization_id_idx on public.invoices (organization_id);
create unique index invoices_number_unique_idx on public.invoices (organization_id, invoice_number);
create index invoices_order_inquiry_id_idx on public.invoices (order_inquiry_id);

create trigger invoices_touch_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

create function public.next_invoice_number(p_organization_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select invoice_number_prefix from public.organization_settings where organization_id = p_organization_id),
    'MG-R-'
  ) || to_char(now(), 'YYYY') || '-'
    || lpad(public.next_sequence_value(p_organization_id, 'invoice', to_char(now(), 'YYYY'))::text, 6, '0');
$$;

create function public.invoices_assign_number()
returns trigger
language plpgsql
as $$
begin
  if new.invoice_number is null or new.invoice_number = '' then
    new.invoice_number := public.next_invoice_number(new.organization_id);
  end if;
  return new;
end;
$$;

create trigger invoices_assign_number_trigger
  before insert on public.invoices
  for each row execute function public.invoices_assign_number();

alter table public.invoices
  alter column invoice_number set not null;

alter table public.invoices enable row level security;

-- Finance-sensitive, same role gate as product_prices (docs/database.md).
create policy invoices_rw on public.invoices
  for all using (
    organization_id = public.current_org_id()
    and public.has_role('BUCHHALTUNG')
  )
  with check (
    organization_id = public.current_org_id()
    and public.has_role('BUCHHALTUNG')
  );
