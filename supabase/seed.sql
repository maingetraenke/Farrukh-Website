-- Phase 1 demo seed data.
--
-- Designed to run once against a freshly migrated, empty database (e.g.
-- `supabase db reset`, which runs migrations then this file).
--
-- Intentionally does NOT seed:
--   - any auth.users / login — create your first user via Supabase Auth
--     (sign up, or Dashboard > Authentication), then run the bootstrap
--     UPDATE at the bottom of this file to attach it to the demo org as
--     ADMIN. Never hardcode a password in a committed seed file.
--   - any purchase price, sale price, deposit (Pfand) amount, or tax rate —
--     per CLAUDE.md rule 5, these are left null for an admin to fill in
--     with real figures before go-live.
--   - "Getränke Fritze" as a supplier — explicitly excluded, see spec.
--
-- Bottle/case configurations below use standard German trade formats
-- (e.g. 20x0,5L Glas-Mehrwegkasten for beer, 24x0,33L Glas for soft
-- drinks) as a starting point; verify against actual supplier packaging
-- before relying on them operationally.

insert into public.organizations (id, name, country, phone, email, website)
values (
  '00000000-0000-0000-0000-000000000001',
  'MainGetränke',
  'DE',
  '0177 8085911',
  'info@maingetraenke.de',
  'https://www.maingetraenke.de'
);

insert into public.organization_settings (organization_id, default_delivery_fee_cents)
values ('00000000-0000-0000-0000-000000000001', 250);

insert into public.warehouses (organization_id, name, is_default)
values ('00000000-0000-0000-0000-000000000001', 'Hauptlager', true);

insert into public.suppliers (organization_id, name, city, notes)
values (
  '00000000-0000-0000-0000-000000000001',
  'Volpert',
  'Zell',
  'Möglicher Lieferant. Konditionen (Zahlungsziel, Mindestbestellwert, Preise) noch als Stammdaten zu pflegen — nicht erfunden.'
);

insert into public.deposit_types (organization_id, name)
values
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 0,75L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 0,7L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 0,5L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 0,33L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 1,0L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten PET Einweg'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten PET Mehrweg');

-- Wasser: Gerolsteiner, Franken Brunnen, Alasia/Alasia PUR, Bad Brückenauer.
-- Gebinde per organization-supplied product overview (each brand sold as
-- both a 12x1,0L PET and a 12x0,7L/0,75L Glas case).
insert into public.products (organization_id, name, brand, category, variant, bottles_per_case, bottle_volume_ml, bottle_material, deposit_type_id)
select '00000000-0000-0000-0000-000000000001', v.name, v.brand, 'WASSER', v.variant, v.bottles, v.ml, v.material::public.bottle_material,
  (select id from public.deposit_types where organization_id = '00000000-0000-0000-0000-000000000001' and name = v.deposit)
from (values
  ('Gerolsteiner 1,0L PET', 'Gerolsteiner', null, 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg'),
  ('Gerolsteiner 0,75L Glas', 'Gerolsteiner', null, 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L'),
  ('Alasia PUR 1,0L PET', 'Alasia PUR', null, 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg'),
  ('Alasia PUR 0,7L Glas', 'Alasia PUR', null, 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L'),
  ('Alasia Medium 1,0L PET', 'Alasia', 'Medium', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg'),
  ('Alasia Medium 0,75L Glas', 'Alasia', 'Medium', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L'),
  ('Alasia Spritzig 1,0L PET', 'Alasia', 'Spritzig', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg'),
  ('Alasia Spritzig 0,7L Glas', 'Alasia', 'Spritzig', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L'),
  ('Franken Brunnen 1,0L PET', 'Franken Brunnen', null, 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg'),
  ('Franken Brunnen 0,75L Glas', 'Franken Brunnen', null, 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L'),
  ('Bad Brückenauer 1,0L PET', 'Bad Brückenauer', null, 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg'),
  ('Bad Brückenauer 0,75L Glas', 'Bad Brückenauer', null, 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L')
) as v(name, brand, variant, bottles, ml, material, deposit)
;

-- Softgetränke: nur 1,0-l-Gebinde und 24x0,33-l Glas (keine 1,5L, keine
-- Energy Drinks). Paulaner Spezi/Spezi Zero are listed as 20x0,5L Glas on
-- the organization-supplied overview — that's the beer Kasten format, not
-- one of the two allowed soft-drink formats above. Left as given pending
-- confirmation; see chat. Flag before relying on this operationally.
insert into public.products (organization_id, name, brand, category, variant, bottles_per_case, bottle_volume_ml, bottle_material, deposit_type_id)
select '00000000-0000-0000-0000-000000000001', v.name, v.brand, 'SOFTDRINKS', v.variant, v.bottles, v.ml, v.material::public.bottle_material,
  (select id from public.deposit_types where organization_id = '00000000-0000-0000-0000-000000000001' and name = v.deposit)
from (values
  ('Coca-Cola 1,0L PET', 'Coca-Cola', 'Original', 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Coca-Cola 24x0,33L Glas', 'Coca-Cola', 'Original', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L'),
  ('Coca-Cola Zero 1,0L PET', 'Coca-Cola', 'Zero', 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Coca-Cola Zero 24x0,33L Glas', 'Coca-Cola', 'Zero', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L'),
  ('Coca-Cola Light 1,0L PET', 'Coca-Cola', 'Light', 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Coca-Cola Light 24x0,33L Glas', 'Coca-Cola', 'Light', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L'),
  ('Fanta 1,0L PET', 'Fanta', null, 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Fanta 24x0,33L Glas', 'Fanta', null, 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L'),
  ('Sprite 1,0L PET', 'Sprite', null, 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Sprite 24x0,33L Glas', 'Sprite', null, 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L'),
  ('Mezzo Mix 1,0L PET', 'Mezzo Mix', null, 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Mezzo Mix 24x0,33L Glas', 'Mezzo Mix', null, 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L'),
  ('Paulaner Spezi 20x0,5L Glas', 'Paulaner Spezi', null, 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Paulaner Spezi Zero 20x0,5L Glas', 'Paulaner Spezi', 'Zero', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L')
) as v(name, brand, variant, bottles, ml, material, deposit)
;

-- Bier: konfigurierbares Sortiment (besprochene Marken als Startpunkt)
insert into public.products (organization_id, name, brand, category, variant, bottles_per_case, bottle_volume_ml, bottle_material, deposit_type_id)
select '00000000-0000-0000-0000-000000000001', v.name, v.brand, 'BIER', v.variant, v.bottles, v.ml, v.material::public.bottle_material,
  (select id from public.deposit_types where organization_id = '00000000-0000-0000-0000-000000000001' and name = v.deposit)
from (values
  ('Augustiner Hell', 'Augustiner', 'Hell', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Augustiner Edelstoff', 'Augustiner', 'Edelstoff', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Paulaner Helles', 'Paulaner', 'Helles', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Paulaner Hefe-Weißbier', 'Paulaner', 'Hefe-Weißbier', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Erdinger Weißbier', 'Erdinger', 'Weißbier', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Krombacher Pils', 'Krombacher', 'Pils', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Bitburger Pils', 'Bitburger', 'Pils', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Distelhäuser Pils', 'Distelhäuser', 'Pils', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Würzburger Hofbräu Pils', 'Würzburger Hofbräu', 'Pils', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L')
) as v(name, brand, variant, bottles, ml, material, deposit)
;

-- Wein & Sekt, Saft & Schorlen: leichte Startauswahl
insert into public.products (organization_id, name, brand, category, variant, bottles_per_case, bottle_volume_ml, bottle_material, deposit_type_id)
values
  ('00000000-0000-0000-0000-000000000001', 'Fränkischer Müller-Thurgau', 'Winzer Region Kitzingen', 'WEIN_SEKT', 'trocken', 6, 750, 'GLASS', null),
  ('00000000-0000-0000-0000-000000000001', 'Fränkischer Silvaner', 'Winzer Region Kitzingen', 'WEIN_SEKT', 'trocken', 6, 750, 'GLASS', null),
  ('00000000-0000-0000-0000-000000000001', 'Apfelschorle', 'Regionaler Safthersteller', 'SAFT_SCHORLEN', null, 12, 1000, 'GLASS', null),
  ('00000000-0000-0000-0000-000000000001', 'Orangensaft', 'Regionaler Safthersteller', 'SAFT_SCHORLEN', null, 12, 1000, 'GLASS', null);

-- Attach the (organization-known, but unpriced) Volpert supplier to a
-- couple of demo products so the products <-> suppliers relation has an
-- example row. Purchase prices remain unset.
update public.products
set supplier_id = (select id from public.suppliers where organization_id = '00000000-0000-0000-0000-000000000001' and name = 'Volpert')
where organization_id = '00000000-0000-0000-0000-000000000001' and category = 'BIER';

-- Product images for admin review before launch. Redone after the first
-- pass was rejected for containing lifestyle/review-style photos (hand
-- holding a bottle, bar-counter shots, angled can photos) instead of clean
-- product packshots. Every image below is a genuine isolated e-commerce/
-- press packshot: plain white (or near-white) background, no hands, no
-- bars, no outdoor scenes. Sourced mostly from manufacturers' own official
-- product/press pages (Coca-Cola, Paulaner, Krombacher, Erdinger,
-- Distelhäuser, Würzburger Hofbräu, Gerolsteiner, Bad Brückenauer all
-- publish their own bottle packshots) and, for a few brands, from German
-- beverage retailers' (Globus, getraenkedienst.com) own product photos,
-- cropped to isolate a single bottle where the source photo showed a case.
-- Full source/license table: docs/product-images-overview.md. One image is
-- reused across bottle-size variants of the same brand/flavor. Every
-- product from the previous pass's "not found" list now has a genuine
-- image (Gerolsteiner, Alasia PUR/Medium/Spritzig, Bad Brückenauer,
-- Paulaner Spezi Zero, Distelhäuser Pils) — none were left out this time.
update public.products
set image_url = '/products/gerolsteiner.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Gerolsteiner';

update public.products
set image_url = '/products/alasia-pur.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Alasia PUR';

update public.products
set image_url = '/products/alasia-medium.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Alasia' and variant = 'Medium';

update public.products
set image_url = '/products/alasia-spritzig.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Alasia' and variant = 'Spritzig';

update public.products
set image_url = '/products/franken-brunnen.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Franken Brunnen';

update public.products
set image_url = '/products/bad-brueckenauer.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Bad Brückenauer';

update public.products
set image_url = '/products/coca-cola-original.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Coca-Cola' and variant = 'Original';

update public.products
set image_url = '/products/coca-cola-zero.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Coca-Cola' and variant = 'Zero';

update public.products
set image_url = '/products/coca-cola-light.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Coca-Cola' and variant = 'Light';

update public.products
set image_url = '/products/fanta.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Fanta';

update public.products
set image_url = '/products/sprite.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Sprite';

update public.products
set image_url = '/products/mezzo-mix.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Mezzo Mix';

update public.products
set image_url = '/products/paulaner-spezi.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Paulaner Spezi' and variant is null;

update public.products
set image_url = '/products/paulaner-spezi-zero.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Paulaner Spezi' and variant = 'Zero';

update public.products
set image_url = '/products/augustiner-hell.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Augustiner' and variant = 'Hell';

update public.products
set image_url = '/products/augustiner-edelstoff.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Augustiner' and variant = 'Edelstoff';

update public.products
set image_url = '/products/paulaner-helles.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Paulaner' and variant = 'Helles';

update public.products
set image_url = '/products/paulaner-hefeweissbier.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Paulaner' and variant = 'Hefe-Weißbier';

update public.products
set image_url = '/products/erdinger-weissbier.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Erdinger' and variant = 'Weißbier';

update public.products
set image_url = '/products/krombacher-pils.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Krombacher' and variant = 'Pils';

update public.products
set image_url = '/products/bitburger-pils.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Bitburger' and variant = 'Pils';

update public.products
set image_url = '/products/distelhaeuser-pils.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Distelhäuser' and variant = 'Pils';

update public.products
set image_url = '/products/wuerzburger-hofbraeu-pils.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and brand = 'Würzburger Hofbräu' and variant = 'Pils';

-- Wein & Saft: brand is a placeholder supplier name shared by both wine (or
-- both juice) rows, so match on the product name instead to keep each
-- UPDATE scoped to one row. All three images are unbranded, label-free
-- studio packshots from a glass-bottle manufacturer's own product catalog
-- (Wiegand-Glas) — appropriate since the supplier names in this section are
-- explicitly placeholders, not real wineries/Keltereien, so no real brand's
-- labeled bottle should be shown.
update public.products
set image_url = '/products/fraenkischer-wein.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and name in ('Fränkischer Müller-Thurgau', 'Fränkischer Silvaner');

update public.products
set image_url = '/products/apfelschorle.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and name = 'Apfelschorle';

update public.products
set image_url = '/products/orangensaft.jpg'
where organization_id = '00000000-0000-0000-0000-000000000001' and name = 'Orangensaft';

-- Official assortment & pricing, 2026-08-10. Mirrors
-- supabase/migrations/20260810120200_official_catalog_2026_08.sql exactly
-- (kept in sync deliberately, see that migration's header for the sourcing
-- and non-destructive/idempotent rationale) so a fresh `supabase db reset`
-- produces the same real catalog as the live database. Everything above
-- this block (Alasia PUR, Mezzo Mix, Krombacher, the Wein/Saft
-- placeholders, ...) is intentionally left as-is.
do $$
declare
  v_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_row record;
  v_product_id uuid;
begin
  for v_row in
    select * from (values
      ('Alasia Spritzig 12×0,7L Glas', 'Alasia', 'Spritzig', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 699::integer),
      ('Alasia Medium 12×0,7L Glas', 'Alasia', 'Medium', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 699::integer),
      ('Alasia Spritzig 12×1,0L PET', 'Alasia', 'Spritzig', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 849::integer),
      ('Alasia Medium 12×1,0L PET', 'Alasia', 'Medium', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 849::integer),
      ('Franken Brunnen Spritzig 12×0,7L Glas', 'Franken Brunnen', 'Spritzig', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 749::integer),
      ('Franken Brunnen Sanft 12×0,7L Glas', 'Franken Brunnen', 'Sanft', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 749::integer),
      ('Franken Brunnen Medium 12×0,7L Glas', 'Franken Brunnen', 'Medium', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 749::integer),
      ('Franken Brunnen Naturell 12×0,7L Glas', 'Franken Brunnen', 'Naturell', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 749::integer),
      ('Franken Brunnen Spritzig 12×1,0L PET', 'Franken Brunnen', 'Spritzig', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 849::integer),
      ('Franken Brunnen Sanft 12×1,0L PET', 'Franken Brunnen', 'Sanft', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 849::integer),
      ('Franken Brunnen Medium 12×1,0L PET', 'Franken Brunnen', 'Medium', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 849::integer),
      ('Franken Brunnen Naturell 12×1,0L PET', 'Franken Brunnen', 'Naturell', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 849::integer),
      ('Bad Brückenauer Spritzig 12×0,7L Glas', 'Bad Brückenauer', 'Spritzig', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 799::integer),
      ('Bad Brückenauer Medium 12×0,7L Glas', 'Bad Brückenauer', 'Medium', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 799::integer),
      ('Bad Brückenauer Naturell 12×0,7L Glas', 'Bad Brückenauer', 'Naturell', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 799::integer),
      ('Bad Brückenauer Spritzig 12×1,0L PET', 'Bad Brückenauer', 'Spritzig', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 899::integer),
      ('Bad Brückenauer Medium 12×1,0L PET', 'Bad Brückenauer', 'Medium', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 899::integer),
      ('Bad Brückenauer Naturell 12×1,0L PET', 'Bad Brückenauer', 'Naturell', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 899::integer),
      ('Gerolsteiner Spritzig 12×1,0L PET', 'Gerolsteiner', 'Spritzig', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 1049::integer),
      ('Gerolsteiner Medium 12×1,0L PET', 'Gerolsteiner', 'Medium', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 1049::integer),
      ('Gerolsteiner Naturell 12×1,0L PET', 'Gerolsteiner', 'Naturell', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 1049::integer),
      ('Black Forest Spritzig 12×0,7L Glas', 'Black Forest', 'Spritzig', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 849::integer),
      ('Black Forest Feinperlig 12×0,7L Glas', 'Black Forest', 'Feinperlig', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 849::integer),
      ('Black Forest Still 12×0,7L Glas', 'Black Forest', 'Still', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 849::integer),
      ('Black Forest Still 20×0,5L PET', 'Black Forest', 'Still', 'WASSER', 20, 500, 'PET', 'Pfand Kasten PET Mehrweg', 999::integer),
      ('Bayla Sauerkirsch 6×1,0L Karton', 'Bayla', 'Sauerkirsch', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1349::integer),
      ('Bayla Apfel-Kirsch Nektar 6×1,0L Karton', 'Bayla', 'Apfel-Kirsch Nektar', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1099::integer),
      ('Bayla Maracuja Nektar 6×1,0L Karton', 'Bayla', 'Maracuja Nektar', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1299::integer),
      ('Bayla Bananen Nektar 6×1,0L Karton', 'Bayla', 'Bananen Nektar', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 999::integer),
      ('Bayla Apfel – trüb 6×1,0L Karton', 'Bayla', 'Apfel – trüb', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1049::integer),
      ('Bayla Orange 6×1,0L Karton', 'Bayla', 'Orange', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1249::integer),
      ('Bayla Wellness Blutorange 6×1,0L Karton', 'Bayla', 'Wellness Blutorange', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1149::integer),
      ('Bayla Johannisbeer 6×1,0L Karton', 'Bayla', 'Johannisbeer', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1299::integer),
      ('Bayla Multivitamin 100 % 6×1,0L Karton', 'Bayla', 'Multivitamin 100 %', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1099::integer),
      ('Bayla Traube Rot Direktsaft 6×1,0L Karton', 'Bayla', 'Traube Rot Direktsaft', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1099::integer),
      ('Bayla Vollwert Apfel 6×1,0L Karton', 'Bayla', 'Vollwert Apfel', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1049::integer),
      ('Bayla Ananas 6×1,0L Karton', 'Bayla', 'Ananas', 'SAFT_NEKTAR', 6, 1000, 'KARTON', null, 1349::integer),
      ('Bayla Apfel klar 12×0,2L Karton', 'Bayla', 'Apfel klar', 'SAFT_NEKTAR', 12, 200, 'KARTON', null, 949::integer),
      ('Bayla Orange 12×0,2L Karton', 'Bayla', 'Orange', 'SAFT_NEKTAR', 12, 200, 'KARTON', null, 999::integer),
      ('Bayla Johannisbeer 12×0,2L Karton', 'Bayla', 'Johannisbeer', 'SAFT_NEKTAR', 12, 200, 'KARTON', null, 1049::integer),
      ('Bayla Traube Rot 12×0,2L Karton', 'Bayla', 'Traube Rot', 'SAFT_NEKTAR', 12, 200, 'KARTON', null, 1049::integer),
      ('Coca-Cola 24×0,33L Glas', 'Coca-Cola', null, 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2199::integer),
      ('Coca-Cola Zero 24×0,33L Glas', 'Coca-Cola', 'Zero', 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2199::integer),
      ('Coca-Cola Light 24×0,33L Glas', 'Coca-Cola', 'Light', 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2199::integer),
      ('Fanta Orange 24×0,33L Glas', 'Fanta', 'Orange', 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2199::integer),
      ('Sprite 24×0,33L Glas', 'Sprite', null, 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2199::integer),
      ('Paulaner Spezi 24×0,33L Glas', 'Paulaner Spezi', null, 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 1899::integer),
      ('Paulaner Spezi 20×0,5L Glas', 'Paulaner Spezi', null, 'SOFTDRINKS', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1999::integer),
      ('Paulaner Spezi Zero 20×0,5L Glas', 'Paulaner Spezi', 'Zero', 'SOFTDRINKS', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1999::integer),
      ('Paulaner Cola 24×0,33L Glas', 'Paulaner Cola', null, 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2199::integer),
      ('Paulaner Limo Zitrone 24×0,33L Glas', 'Paulaner Limo Zitrone', null, 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2099::integer),
      ('Paulaner Limo Orange 24×0,33L Glas', 'Paulaner Limo Orange', null, 'SOFTDRINKS', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2099::integer),
      ('Augustiner Hell 20×0,5L Glas', 'Augustiner', 'Hell', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 2099::integer),
      ('Augustiner Hell 24×0,33L Glas', 'Augustiner', 'Hell', 'BIER', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2199::integer),
      ('Augustiner Edelstoff 20×0,5L Glas', 'Augustiner', 'Edelstoff', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 2199::integer),
      ('Augustiner Dunkel 20×0,5L Glas', 'Augustiner', 'Dunkel', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 2199::integer),
      ('Augustiner Alkoholfrei 20×0,5L Glas', 'Augustiner', 'Alkoholfrei', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 2099::integer),
      ('Beck''s Pils 20×0,5L Glas', 'Beck''s', 'Pils', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1899::integer),
      ('Beck''s Gold 20×0,5L Glas', 'Beck''s', 'Gold', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1899::integer),
      ('Beck''s Blue alkoholfrei 20×0,5L Glas', 'Beck''s', 'Blue alkoholfrei', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1899::integer),
      ('Beck''s Pils 24×0,33L Glas', 'Beck''s', 'Pils', 'BIER', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 1999::integer),
      ('Beck''s Gold 24×0,33L Glas', 'Beck''s', 'Gold', 'BIER', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 1999::integer),
      ('Beck''s Blue alkoholfrei 24×0,33L Glas', 'Beck''s', 'Blue alkoholfrei', 'BIER', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 1999::integer),
      ('Beck''s Blue Lemon 0,0 % 24×0,33L Glas', 'Beck''s', 'Blue Lemon 0,0 %', 'BIER', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2099::integer),
      ('Beck''s Green Lemon 24×0,33L Glas', 'Beck''s', 'Green Lemon', 'BIER', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2099::integer),
      ('Bitburger Pils Premium 20×0,5L Glas', 'Bitburger', 'Pils Premium', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1899::integer),
      ('Bitburger 0,0 % alkoholfrei 20×0,5L Glas', 'Bitburger', '0,0 % alkoholfrei', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1899::integer),
      ('Bitburger Natur-Radler 20×0,5L Glas', 'Bitburger', 'Natur-Radler', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1899::integer),
      ('Erdinger Hefe hell 20×0,5L Glas', 'Erdinger', 'Hefe hell', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1999::integer),
      ('Erdinger Urweisse 20×0,5L Glas', 'Erdinger', 'Urweisse', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 2099::integer),
      ('Erdinger Alkoholfrei 20×0,5L Glas', 'Erdinger', 'Alkoholfrei', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 2099::integer),
      ('Tegernseer Hell 20×0,5L Glas', 'Tegernseer', 'Hell', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 2199::integer),
      ('Tegernseer Hell 24×0,33L Glas', 'Tegernseer', 'Hell', 'BIER', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L', 2249::integer),
      ('Tegernseer Alkoholfrei 20×0,5L Glas', 'Tegernseer', 'Alkoholfrei', 'BIER', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 2199::integer)
    ) as v(name, brand, variant, category, bottles, ml, material, deposit_name, price_cents)
  loop
    select p.id into v_product_id
    from public.products p
    where p.organization_id = v_org_id
      and p.brand = v_row.brand
      and p.variant is not distinct from v_row.variant
      and p.category = v_row.category::public.product_category
      and p.bottles_per_case = v_row.bottles
      and p.bottle_volume_ml = v_row.ml
      and p.bottle_material = v_row.material::public.bottle_material;

    if v_product_id is null then
      insert into public.products (
        organization_id, name, brand, variant, category,
        bottles_per_case, bottle_volume_ml, bottle_material,
        deposit_type_id, tax_rate_percent, active
      )
      values (
        v_org_id, v_row.name, v_row.brand, v_row.variant, v_row.category::public.product_category,
        v_row.bottles, v_row.ml, v_row.material::public.bottle_material,
        (
          select id from public.deposit_types
          where organization_id = v_org_id and name = v_row.deposit_name
        ),
        19.00, true
      )
      returning id into v_product_id;
    else
      update public.products
      set tax_rate_percent = 19.00, active = true
      where id = v_product_id;
    end if;

    if not exists (
      select 1 from public.product_prices where product_id = v_product_id
    ) then
      insert into public.product_prices (organization_id, product_id, sale_price_cents, valid_from)
      values (v_org_id, v_product_id, v_row.price_cents, now());
    end if;
  end loop;
end $$;

update public.products
set active = false
where organization_id = '00000000-0000-0000-0000-000000000001'
  and brand = 'Würzburger Hofbräu'
  and variant = 'Pils';

-- Ergänzende Preise für 9 Wasser-Legacy-Artikel, siehe
-- supabase/migrations/20260810130000_wasser_legacy_pricing.sql (mirrors
-- that migration exactly, same rationale).
do $$
declare
  v_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_row record;
  v_product_id uuid;
begin
  for v_row in
    select * from (values
      ('MG-A-00006', 749::integer),
      ('MG-A-00004', 699::integer),
      ('MG-A-00003', 849::integer),
      ('MG-A-00012', 799::integer),
      ('MG-A-00011', 899::integer),
      ('MG-A-00010', 749::integer),
      ('MG-A-00009', 849::integer),
      ('MG-A-00002', 999::integer),
      ('MG-A-00001', 1049::integer)
    ) as v(article_number, price_cents)
  loop
    select p.id into v_product_id
    from public.products p
    where p.organization_id = v_org_id and p.article_number = v_row.article_number;

    if v_product_id is null then
      raise exception 'article_number % not found', v_row.article_number;
    end if;

    update public.products
    set tax_rate_percent = 19.00
    where id = v_product_id;

    if not exists (select 1 from public.product_prices where product_id = v_product_id) then
      insert into public.product_prices (organization_id, product_id, sale_price_cents, valid_from)
      values (v_org_id, v_product_id, v_row.price_cents, now());
    end if;
  end loop;
end $$;

-- Mezzo Mix pricing + old/duplicate/demo product deactivation, see
-- supabase/migrations/20260810140000_softdrinks_pricing_and_legacy_cleanup.sql
-- (mirrors that migration exactly, same rationale).
do $$
declare
  v_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_row record;
  v_product_id uuid;
begin
  for v_row in
    select * from (values
      ('MG-A-00024', 1899::integer),
      ('MG-A-00023', 1999::integer)
    ) as v(article_number, price_cents)
  loop
    select p.id into v_product_id
    from public.products p
    where p.organization_id = v_org_id and p.article_number = v_row.article_number;

    if v_product_id is null then
      raise exception 'article_number % not found', v_row.article_number;
    end if;

    update public.products set tax_rate_percent = 19.00 where id = v_product_id;

    if not exists (select 1 from public.product_prices where product_id = v_product_id) then
      insert into public.product_prices (organization_id, product_id, sale_price_cents, valid_from)
      values (v_org_id, v_product_id, v_row.price_cents, now());
    end if;
  end loop;

  update public.products
  set active = false
  where organization_id = v_org_id
    and article_number in (
      'MG-A-00017', 'MG-A-00014', 'MG-A-00013', 'MG-A-00015',
      'MG-A-00020', 'MG-A-00019', 'MG-A-00021',
      'MG-A-00034', 'MG-A-00031', 'MG-A-00032', 'MG-A-00030', 'MG-A-00029',
      'MG-A-00036', 'MG-A-00037', 'MG-A-00038', 'MG-A-00039'
    );
end $$;

-- Produktbilder, siehe
-- supabase/migrations/20260810150000_official_catalog_images.sql (mirrors
-- that migration exactly, same rationale — 8 Bayla- und 2 Beck's-Artikel
-- bewusst ohne Bild gelassen, siehe dortiger Kommentar).
update public.products as p
set image_url = v.image_url
from (values
      ('MG-A-00055', '/products/gerolsteiner-spritzig.jpg'),
      ('MG-A-00056', '/products/gerolsteiner-medium.jpg'),
      ('MG-A-00057', '/products/gerolsteiner-naturell.jpg'),
      ('MG-A-00041', '/products/franken-brunnen-spritzig-07l-glas.jpg'),
      ('MG-A-00042', '/products/franken-brunnen-sanft-07l-glas.jpg'),
      ('MG-A-00043', '/products/franken-brunnen-medium-07l-glas.png'),
      ('MG-A-00044', '/products/franken-brunnen-naturell-07l-glas.jpg'),
      ('MG-A-00045', '/products/franken-brunnen-spritzig-10l-pet.jpg'),
      ('MG-A-00046', '/products/franken-brunnen-sanft-10l-pet.png'),
      ('MG-A-00047', '/products/franken-brunnen-medium-10l-pet.jpg'),
      ('MG-A-00048', '/products/franken-brunnen-naturell-10l-pet.jpg'),
      ('MG-A-00049', '/products/bad-brueckenauer-spritzig-07l-glas.webp'),
      ('MG-A-00050', '/products/bad-brueckenauer-medium-07l-glas.webp'),
      ('MG-A-00051', '/products/bad-brueckenauer-naturell-07l-glas.webp'),
      ('MG-A-00052', '/products/bad-brueckenauer-spritzig-10l-pet.webp'),
      ('MG-A-00053', '/products/bad-brueckenauer-medium-10l-pet.webp'),
      ('MG-A-00054', '/products/bad-brueckenauer-naturell-10l-pet.webp'),
      ('MG-A-00058', '/products/black-forest-spritzig-07l-glas.png'),
      ('MG-A-00059', '/products/black-forest-feinperlig-07l-glas.png'),
      ('MG-A-00060', '/products/black-forest-still-07l-glas.png'),
      ('MG-A-00061', '/products/black-forest-still-05l-pet.png'),
      ('MG-A-00040', '/products/alasia-medium-07l-glas.jpg'),
      ('MG-A-00062', '/products/bayla-sauerkirsch-1l.webp'),
      ('MG-A-00065', '/products/bayla-banane-1l.webp'),
      ('MG-A-00067', '/products/bayla-orange-1l.webp'),
      ('MG-A-00073', '/products/bayla-ananas-1l.webp'),
      ('MG-A-00077', '/products/bayla-traube-rot-02l.webp'),
      ('MG-A-00064', '/products/bayla-maracuja-1l.webp'),
      ('MG-A-00071', '/products/bayla-traube-direktsaft-1l.webp'),
      ('MG-A-00070', '/products/bayla-multivitamin-1l.webp'),
      ('MG-A-00078', '/products/coca-cola-24x033l-glas.png'),
      ('MG-A-00081', '/products/paulaner-cola-24x033l-glas.png'),
      ('MG-A-00083', '/products/paulaner-limo-orange-24x033l-glas.png'),
      ('MG-A-00082', '/products/paulaner-limo-zitrone-24x033l-glas.png'),
      ('MG-A-00080', '/products/paulaner-spezi-24x033l-glas.png'),
      ('MG-A-00084', '/products/augustiner-hell-24x033l-glas.jpg'),
      ('MG-A-00085', '/products/augustiner-dunkel-20x05l-glas.jpg'),
      ('MG-A-00086', '/products/augustiner-alkoholfrei-20x05l-glas.jpg'),
      ('MG-A-00090', '/products/becks-pils-24x033l-glas.jpg'),
      ('MG-A-00087', '/products/becks-pils-20x05l-glas.jpg'),
      ('MG-A-00091', '/products/becks-gold-24x033l-glas.jpg'),
      ('MG-A-00092', '/products/becks-blue-alkoholfrei-24x033l-glas.jpg'),
      ('MG-A-00089', '/products/becks-blue-alkoholfrei-20x05l-glas.jpg'),
      ('MG-A-00094', '/products/becks-green-lemon-24x033l-glas.jpg'),
      ('MG-A-00095', '/products/bitburger-pils-premium-20x05l-glas.jpg'),
      ('MG-A-00096', '/products/bitburger-00-alkoholfrei-20x05l-glas.jpg'),
      ('MG-A-00097', '/products/bitburger-natur-radler-20x05l-glas.webp'),
      ('MG-A-00098', '/products/erdinger-hefe-hell-20x05l-glas.jpg'),
      ('MG-A-00099', '/products/erdinger-urweisse-20x05l-glas.jpg'),
      ('MG-A-00100', '/products/erdinger-alkoholfrei-20x05l-glas.jpg'),
      ('MG-A-00101', '/products/tegernseer-hell-20x05l-glas.png'),
      ('MG-A-00102', '/products/tegernseer-hell-24x033l-glas.png'),
      ('MG-A-00103', '/products/tegernseer-alkoholfrei-20x05l-glas.jpg')
) as v(article_number, image_url)
where p.organization_id = '00000000-0000-0000-0000-000000000001'
  and p.article_number = v.article_number;

-- --- Bootstrap the first admin user -----------------------------------
-- After creating your first user via Supabase Auth, run:
--
-- update public.profiles
-- set organization_id = '00000000-0000-0000-0000-000000000001', role = 'ADMIN'
-- where id = '<the new user''s auth.users.id>';
