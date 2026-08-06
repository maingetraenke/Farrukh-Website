# MainGetränke ERP

Internal ERP/CRM/Warenwirtschaft for MainGetränke. See
[CLAUDE.md](CLAUDE.md) for the project rules and
[docs/implementation-plan.md](docs/implementation-plan.md) for scope and
phase status (currently: **Phase 1 done**).

## Setup

```bash
corepack enable pnpm   # if pnpm isn't installed yet
pnpm install
```

Create a [Supabase](https://supabase.com) project, then:

```bash
cp .env.example apps/web/.env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Apply the schema (via the Supabase CLI, once linked to your project, or by
running the files in `supabase/migrations/` in order through the SQL
editor) and load demo data with `supabase/seed.sql`. Then create your
first user via Supabase Auth and run the bootstrap `UPDATE` at the bottom
of `seed.sql` to make them an admin — see
[docs/implementation-plan.md](docs/implementation-plan.md#before-this-goes-to-production).

## Develop

```bash
pnpm dev            # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test           # Vitest (unit)
pnpm test:e2e       # Playwright (builds/starts the app first)
pnpm build
```

## Docs

- [docs/architecture.md](docs/architecture.md) — stack, layering, auth/RLS model, deployment
- [docs/database.md](docs/database.md) — schema, RLS pattern, numbering, pricing, inventory
- [docs/implementation-plan.md](docs/implementation-plan.md) — phases and current status
