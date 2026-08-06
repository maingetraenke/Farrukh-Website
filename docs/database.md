# Database

Schema lives entirely in `supabase/migrations/*.sql`, applied in filename
(timestamp) order. Never hand-edit a live database — see CLAUDE.md rule 2.
Phase 1 covers the tables below; purchase orders/goods receipts, order
lines, routes/stops, deposit transactions, invoices, and payments are added
by their respective phase's migrations (see `implementation-plan.md`).

## Multi-tenancy

Every business table has `organization_id uuid references organizations`.
Two SQL helper functions (defined in
`20260805120100_organizations_and_profiles.sql`) drive Row Level Security:

- `public.current_org_id()` — the calling user's `organization_id`, read
  from `profiles`.
- `public.has_role(variadic roles user_role[])` — true if the caller's role
  is in the given list, or `ADMIN` (which always passes).

The standard policy shape used throughout:

```sql
create policy some_table_rw on public.some_table
  for all using (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'BUCHHALTUNG')
  )
  with check (
    organization_id = public.current_org_id()
    and public.has_role('DISPOSITION', 'BUCHHALTUNG')
  );
```

`profiles.organization_id` is nullable: a Supabase Auth user can exist
(invited) before an admin assigns them to an organization. While null,
`current_org_id()` resolves to null and every RLS policy above denies
access — there is no separate "unassigned user" code path to maintain.

## Phase 1 tables

| Table | Purpose |
| --- | --- |
| `organizations` | Tenant root. |
| `organization_settings` | One row per org: bank/tax data, default delivery fee (250 cents), numbering prefixes. |
| `profiles` | Extends `auth.users` with `organization_id`, `role`, `full_name`. Auto-created by the `on_auth_user_created` trigger on `auth.users` insert. |
| `number_sequences` / `next_sequence_value()` | Generic atomic counter engine, see [Numbering](#numbering). |
| `customers` / `customer_addresses` | Private/company customers; billing address on the customer row, delivery addresses (1:N) in `customer_addresses`. |
| `suppliers` | Purchasing master data (e.g. Volpert/Zell — seeded with no invented pricing terms). |
| `deposit_types` | Pfand master data. `amount_cents` nullable until an admin enters the real value. |
| `products` | Case-only (`sales_unit = 'KASTEN'`), category enum with no energy-drink value, `tax_rate_percent` nullable pending legal review. |
| `product_prices` | Append-only price history, see [Pricing](#pricing). |
| `warehouses` / `inventory_balances` / `inventory_movements` | See [Inventory](#inventory). |
| `audit_logs` | Append-only; see architecture.md. |

## Numbering

`number_sequences (organization_id, sequence_key, period_key) → last_value`
plus `next_sequence_value(org_id, sequence_key, period_key)`, an
`INSERT ... ON CONFLICT ... DO UPDATE ... RETURNING` upsert. The `ON
CONFLICT DO UPDATE` takes a row lock for the statement's duration, so
concurrent callers never get the same number — this is what "atomic,
never `count(*) + 1`" (CLAUDE.md rule 9's sibling in the spec) means in
practice.

`period_key` lets a sequence reset on a period without a second table:
`''` for sequences that never reset (customers: `MG-K-000001`), a year
string for yearly sequences (orders/invoices/delivery notes:
`MG-B-2026-000001`), a `YYYYMMDD` string for daily sequences (routes:
`MG-T-20260806-001`).

Phase 1 wires up `next_customer_number()` (and `next_article_number()`,
`next_supplier_number()` for internal, non-formal numbering). The
order/invoice/delivery-note/route generators are added in the migration
that introduces their table, to keep each migration self-contained.

## Pricing

`product_prices` is append-only: insert a new row with a later
`valid_from` rather than updating a past one. The "current" price for a
product is the latest row with `valid_from <= now()`:

```sql
select purchase_price_cents, sale_price_cents
from product_prices
where product_id = $1 and valid_from <= now()
order by valid_from desc
limit 1;
```

This is a query pattern, not a table, on purpose — a materialized "current
price" column on `products` would drift from the history the moment
someone forgets to update both. `tax_rate_percent` is master data on
`products` directly (not historized) per spec.

Purchase prices are finance-sensitive: `product_prices` RLS only grants
`DISPOSITION`/`BUCHHALTUNG` (+`ADMIN`) access. `products` itself (name,
EAN, case size, ...) is readable by every org member, since drivers and
warehouse staff need it without seeing EK.

## Inventory

`inventory_movements` is the append-only source of truth; `inventory_balances`
(`on_hand`, `reserved`, `available` = `on_hand - reserved` at read time) is
a cache kept in sync by the `apply_inventory_movement()` trigger, so every
read gets a consistent balance without re-aggregating the movement log.

Movement types and their effect on the balance:

| `movement_type` | Effect | Reason required? |
| --- | --- | --- |
| `GOODS_RECEIPT` | `on_hand += quantity` | no |
| `RESERVATION` | `reserved += quantity` | no |
| `DELIVERY` | `on_hand -= quantity`, `reserved -= quantity` | no |
| `CANCELLATION` | `reserved -= quantity` | no |
| `STOCKTAKE_CORRECTION` | `on_hand += quantity` (signed) | **yes** |
| `BREAKAGE` | `on_hand += quantity` (signed, usually negative) | **yes** |
| `MANUAL_CORRECTION` | `on_hand += quantity` (signed) | **yes** |

`quantity` is always signed; the constraint
`inventory_movements_reason_required` enforces the "Pflichtgrund" rule for
the three correction types.

`on_hand >= 0` and `reserved >= 0` are hard `CHECK` constraints (physical
stock and reservations are never negative individually). `available`
(computed, not stored) is **not** constrained to `>= 0` — the spec's
"keine negative Verfügbarkeit ohne Admin-Override" is enforced by the
domain service that posts `RESERVATION` movements (Phase 2), which checks
`available >= requested` unless the caller is an admin explicitly
overriding. This is a deliberate app-layer enforcement point, documented
here so it isn't "discovered" as a missing DB constraint later.

## Regenerating TypeScript types

`apps/web/src/lib/supabase/types.ts` is hand-written to match the
migrations above (see the comment at the top of that file). Once this
repo is linked to a real Supabase project:

```bash
pnpm dlx supabase gen types typescript --linked > apps/web/src/lib/supabase/types.ts
```

and delete the "hand-written" comment.
