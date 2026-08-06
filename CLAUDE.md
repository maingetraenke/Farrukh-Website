# MainGetränke ERP

Internal ERP/CRM/Warenwirtschaft/Touren-/Pfand-/Zahlungs-/Rechnungssystem für
MainGetränke, einen regionalen Getränkelieferdienst im Raum Kitzingen.

Full specification: see project history / `docs/implementation-plan.md`.
Architecture: `docs/architecture.md`. Data model: `docs/database.md`.

Next.js in `apps/web` is on a very recent major version — read
`apps/web/AGENTS.md` (imported via `apps/web/CLAUDE.md`) before writing App
Router code, it points at the bundled version-matched docs.

## Company & business rules (do not violate)

- Brand: MainGetränke · info@maingetraenke.de · 0177 8085911
- Default delivery fee: 2,50 € (configurable in `organization_settings`)
- Sale unit is always the **Kasten** (case) — no single-bottle sales
- No energy drinks at launch. No 1.5 L soft drinks.
- Water only: Gerolsteiner, Franken Brunnen, Alasia/Alasia PUR, Bad Brückenauer
- Soft drinks: Coca-Cola (Original/Light/Zero), Fanta, Sprite, Mezzo Mix,
  Paulaner Spezi — only as 1,0 L Gebinde or 24×0,33 L Glas
- Beer is a configurable assortment (Augustiner, Paulaner, Erdinger,
  Krombacher, Bitburger, Distelhäuser, Würzburger Hofbräu discussed so far)
- Never invent real prices, deposit (Pfand) amounts, or tax rates. Seed data
  and fixtures must leave these fields empty/null with a TODO rather than
  fabricate plausible-looking numbers.

## Rules

1. Read the specification first before implementing a feature.
2. Schema changes only via Supabase migrations in `supabase/migrations/`,
   never hand-edited in a live database.
3. Business logic must be enforced server-side (Server Actions / Route
   Handlers / RLS policies) — never trust client-only validation.
4. No secrets in the repo. `.env.example` documents variable names only.
5. No invented prices, deposit values, or tax rates — see above.
6. Run/update tests before and after making changes.
7. Prefer small, reviewable changes over large sweeping ones.
8. Where tax/legal logic is unclear, make it configurable and leave a
   `// TODO(tax):` comment — do not guess.
9. Money is exact: integer cents or exact `NUMERIC`, never `float`/`double`.
10. Status transitions (orders, invoices, routes, payments) go through a
    domain service function, never a raw UPDATE from the UI layer.
11. No destructive migration without a documented rollback path.
12. Stabilize the MVP (Phase 1–4 scope below) before adding Release 1.1/2
    features.

## Roles

ADMIN (all) · DISPOSITION (customers, orders, routes, delivery notes) ·
LAGER (stock, goods receipt, picking, inventory — no purchase-price/finance
rights beyond that) · FAHRER (own route/stops, delivery data, deposits,
payment, status — no purchase prices) · BUCHHALTUNG (invoices, payments,
receivables, exports). Enforce permissions server-side, always — RLS plus a
server-side role check, never client-only.

## Implementation phases

Work through these in order; stop and check in after each phase rather than
jumping ahead:

1. **Phase 1** (current): repo/architecture, DB schema for
   organizations/auth/customers/products/suppliers/warehouse, app shell,
   login, design system, seed (no invented prices), test/CI baseline.
2. **Phase 2**: customer/supplier CRUD, products + price history, inventory +
   goods receipt, orders + line items + stock reservation.
3. **Phase 3**: picking, drivers/vehicles, routes, mobile driver view,
   delivery, deposits (Pfand), payments.
4. **Phase 4**: invoice/delivery-note PDFs, email, reports, exports, audit
   hardening, E2E tests, deployment.

## Stack

Next.js App Router + TypeScript strict · Tailwind + shadcn/ui + Lucide ·
PostgreSQL/Supabase (Auth, RLS, Storage) · React Hook Form + Zod · TanStack
Table · React-PDF · Resend · Maps via provider adapter (Google Maps/Mapbox) ·
Vercel · Vitest + Playwright · pnpm.

## Repo structure

```
apps/web                 Next.js app
  src/app                 App Router routes
  src/components/ui       shadcn/ui primitives
  src/features/{customers,products,inventory,orders,routes,invoices,
                payments,deposits,reports}
  src/lib/{auth,db,domain,pdf,email,maps}
supabase/migrations       SQL migrations (source of truth for schema)
tests/{unit,integration,e2e}
docs
```

## Design system

Primary `#0B5FA5`, secondary `#2E86DE`, background `#F8FAFC`, font Inter,
clean cards with subtle shadows, 10–14px radius. No heavy glassmorphism.
