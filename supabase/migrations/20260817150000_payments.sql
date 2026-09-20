-- Phase 3: payments. MainGetränke's confirmed business model is payment
-- at handover (Barzahlung/Kartenzahlung bei Lieferung) — there is no bank
-- transfer / Rechnungskauf flow live yet, so this records what the driver
-- actually collected against an invoice, not a payment gateway integration.
-- One invoice can have multiple payment rows (Teilzahlungen), matching the
-- existing Zahlungen page description.

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  method public.payment_method not null,
  amount_cents integer not null check (amount_cents > 0),
  paid_at timestamptz not null default now(),
  notes text,
  recorded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.payments is 'What was actually collected against an invoice (cash/card at handover today; other methods once offered). Sum per invoice_id vs. invoices.total_cents determines paid/partial/open — no separate status column, so it can never drift out of sync.';

create index payments_organization_id_idx on public.payments (organization_id);
create index payments_invoice_id_idx on public.payments (invoice_id, paid_at desc);

alter table public.payments enable row level security;

-- Finance-sensitive, same role gate as invoices/product_prices.
create policy payments_rw on public.payments
  for all using (
    organization_id = public.current_org_id()
    and public.has_role('BUCHHALTUNG')
  )
  with check (
    organization_id = public.current_org_id()
    and public.has_role('BUCHHALTUNG')
  );
