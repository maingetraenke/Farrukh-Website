-- Exposes real end-customer pricing on the public catalog view now that
-- authoritative gross sale prices exist (see the data migration that
-- follows this one). Previously public_products deliberately excluded all
-- pricing — see the comment on the original view
-- (20260806090100_public_product_catalog_view.sql) and docs/database.md.
--
-- Still narrow by design: purchase_price_cents and any other
-- finance/EK-sensitive column from product_prices/products is NOT
-- selected here. Only what an anonymous shopper is allowed to see:
--   - sale_price_cents: the current gross (inkl. MwSt.) case price, latest
--     product_prices row with valid_from <= now() (see docs/database.md
--     "Pricing"). Null if no price has been entered yet for a product —
--     the frontend must handle that (no price shown / "auf Anfrage").
--   - tax_rate_percent: so the frontend can label prices correctly.
--   - deposit_name / deposit_amount_cents: Pfand is always shown
--     separately from the sale price, never folded into it. Amount is
--     null until an admin enters a real Pfand value (see CLAUDE.md rule 5)
--     — the frontend must not display 0,00 € in that case.
--
-- Runs with the view owner's privileges (not the caller's), same as the
-- base view — this is what lets an anonymous visitor read a current price
-- out of product_prices despite that table's RLS restricting SELECT to
-- DISPOSITION/BUCHHALTUNG. The safety boundary is still "which columns are
-- selected", not a grant on product_prices/deposit_types themselves.
create or replace view public.public_products as
select
  p.id,
  p.organization_id,
  p.article_number,
  p.name,
  p.brand,
  p.category,
  p.variant,
  p.bottles_per_case,
  p.bottle_volume_ml,
  p.bottle_material,
  p.image_url,
  p.tax_rate_percent,
  current_price.sale_price_cents,
  dt.name as deposit_name,
  dt.amount_cents as deposit_amount_cents
from public.products p
left join lateral (
  select pp.sale_price_cents
  from public.product_prices pp
  where pp.product_id = p.id
    and pp.valid_from <= now()
  order by pp.valid_from desc
  limit 1
) current_price on true
left join public.deposit_types dt on dt.id = p.deposit_type_id
where p.active = true;

comment on view public.public_products is 'Anonymous-readable subset of products for the public marketing site, including the current gross sale price, tax rate, and Pfand (shown separately, never included in sale_price_cents). Still no purchase price or stock levels.';

grant select on public.public_products to anon, authenticated;
