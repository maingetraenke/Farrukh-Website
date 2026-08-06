# Implementation plan

Source: MainGetränke ERP – Claude Code Master Specification, v1.0,
05.08.2026. Work proceeds phase by phase; stop and check in after each
phase rather than jumping ahead (CLAUDE.md rule 12).

## Phase 1 — Foundation (this delivery)

**Status: done.**

- [x] Repo/workspace: pnpm workspace, `apps/web` (Next.js 16 App Router,
      TypeScript strict, Tailwind v4 + shadcn/ui)
- [x] `docs/architecture.md`, `docs/database.md`, `docs/implementation-plan.md`
- [x] `.env.example`, root `CLAUDE.md`
- [x] Supabase base migrations: organizations, organization_settings,
      profiles (+ auto-provisioning trigger), number sequence engine,
      customers, customer_addresses, suppliers, deposit_types, products,
      product_prices, warehouses, inventory_balances, inventory_movements
      (+ balance-sync trigger), audit_logs — all with RLS
- [x] Auth/organization model (role enum, `current_org_id()`/`has_role()`
      helpers)
- [x] App shell: sidebar (all 14 nav destinations, role-filtered), topbar
      (disabled global-search stub, user menu, sign-out), protected route
      group
- [x] Login (Supabase Auth email/password, Server Action, per-role
      redirect scaffold via `requireUser`/`requireRole`)
- [x] Design system: `#0B5FA5`/`#2E86DE`/`#F8FAFC`, Inter, shadcn `radix-nova`
      style, 12px radius, subtle shadows
- [x] Seed data (`supabase/seed.sql`): demo org, warehouse, deposit type
      names, Volpert supplier, product catalog per the allowed
      assortment — no invented prices/deposit amounts/tax rates
- [x] Test/CI baseline: Vitest (money/delivery-fee unit tests), Playwright
      (login + auth-redirect E2E smoke tests), GitHub Actions
      (lint → typecheck → unit → build → E2E)

Every nav destination other than Dashboard and Login renders a
`PagePlaceholder` naming the phase that implements it — intentional, not
an oversight: Phase 1 is schema + shell + login per the spec, not feature
UI.

### Not done yet (by design, see Phase 2+)

Customer/product/supplier CRUD UI, orders, purchase orders/goods receipt
UI, picking, routes, driver mobile view, deposits UI, payments UI,
invoices/delivery notes, PDFs, email, reports, exports, non-login
settings/user-management UI.

### Before this goes to production

- Create the first real user via Supabase Auth, then run the bootstrap
  `UPDATE profiles SET organization_id = ..., role = 'ADMIN'` at the
  bottom of `supabase/seed.sql`.
- Have finance/legal fill in real tax rates (`products.tax_rate_percent`),
  deposit amounts (`deposit_types.amount_cents`), and purchase/sale prices
  (`product_prices`) — all intentionally left null.
- Replace `apps/web/src/lib/supabase/types.ts` with generated types once
  linked to a real Supabase project (see `docs/database.md`).

## Phase 2 — Core operations

Customer/supplier CRUD, products + price-history UI, inventory + goods
receipt UI, orders + line items + stock reservation, settings/user
management UI, tests for the above.

## Phase 3 — Fulfillment

Picking (Kommissionierschein), drivers/vehicles, routes (disposition,
manual + later map-assisted ordering), mobile driver view, delivery
completion, deposits (Pfand) ledger, payments (manual documentation per
spec MVP scope).

## Phase 4 — Documents & reporting

Invoice/delivery-note PDF generation (server-side/React-PDF), email
(Resend: confirmation, invoice, payment reminder), reports (revenue,
margin, receivables, stock value, ...), CSV/XLSX exports, audit-log
hardening (confirm every listed event type is actually written), E2E
coverage of the full order→delivery→invoice→payment flow, deployment.

## Release 1.1 (post-MVP)

Public website ordering (via a rate-limited, idempotent, server-priced
API — the website never gets privileged DB access), email automation,
maps/routing provider integration, CSV import assistant, dunning
(Mahnwesen), PWA/offline for drivers.

## Release 2

Customer portal, recurring orders/subscriptions, multi-warehouse,
purchasing forecasts, barcode scanning, extended driver PWA, DATEV export
(after legal/tax review).

## Acceptance flow (target end state, not yet fully built)

Find/create customer → delivery address → products/cases → system
computes goods value/deposit/€2.50 delivery fee → delivery window →
confirm → stock reserved → picking → route → driver → deposit return +
payment → delivery completed → stock/deposit/payment consistent → PDF
documents available.

## Explicit non-goals for the MVP

No public full storefront, no automated bookkeeping, no AI-driven
dispatch, no hard dependency on a card terminal, no invented supplier
prices, no energy drinks, no 1.5 L soft drinks, no single-bottle sales.
