-- Public, read-only view of the product catalog for the marketing site's
-- Sortiment/cart pages. Deliberately a narrow view rather than opening up
-- RLS on public.products itself: exposes only fields that are safe for an
-- anonymous visitor (no purchase price, no min/target stock, no EAN).
--
-- Views default to running with the owner's privileges (not the caller's),
-- so this bypasses products' RLS by design — the safety boundary is which
-- columns are selected below, not a grant on the base table.
create view public.public_products as
select
  id,
  organization_id,
  article_number,
  name,
  brand,
  category,
  variant,
  bottles_per_case,
  bottle_volume_ml,
  bottle_material,
  image_url
from public.products
where active = true;

comment on view public.public_products is 'Anonymous-readable subset of products for the public marketing site. No pricing, stock levels, or supplier data.';

grant select on public.public_products to anon, authenticated;
