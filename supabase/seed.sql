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

-- --- Bootstrap the first admin user -----------------------------------
-- After creating your first user via Supabase Auth, run:
--
-- update public.profiles
-- set organization_id = '00000000-0000-0000-0000-000000000001', role = 'ADMIN'
-- where id = '<the new user''s auth.users.id>';
