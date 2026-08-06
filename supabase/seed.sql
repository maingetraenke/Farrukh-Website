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
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 0,7L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 0,5L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 0,33L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten Glas 1,0L'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten PET Einweg'),
  ('00000000-0000-0000-0000-000000000001', 'Pfand Kasten PET Mehrweg');

-- Wasser: Gerolsteiner, Franken Brunnen, Alasia/Alasia PUR, Bad Brückenauer
insert into public.products (organization_id, name, brand, category, variant, bottles_per_case, bottle_volume_ml, bottle_material, deposit_type_id)
select '00000000-0000-0000-0000-000000000001', v.name, v.brand, 'WASSER', v.variant, v.bottles, v.ml, v.material::public.bottle_material,
  (select id from public.deposit_types where organization_id = '00000000-0000-0000-0000-000000000001' and name = v.deposit)
from (values
  ('Gerolsteiner Medium', 'Gerolsteiner', 'Medium', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L'),
  ('Gerolsteiner Naturell', 'Gerolsteiner', 'Naturell', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L'),
  ('Franken Brunnen Classic', 'Franken Brunnen', 'Classic', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L'),
  ('Alasia Naturale', 'Alasia', 'Naturale', 12, 1000, 'GLASS', 'Pfand Kasten Glas 1,0L'),
  ('Alasia PUR', 'Alasia PUR', null, 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg'),
  ('Bad Brückenauer Sinnberg', 'Bad Brückenauer', 'Sinnberg', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L')
) as v(name, brand, variant, bottles, ml, material, deposit)
;

-- Softdrinks: nur 1,0-l-Gebinde und 24x0,33-l Glas (keine 1,5L, keine Energy Drinks)
insert into public.products (organization_id, name, brand, category, variant, bottles_per_case, bottle_volume_ml, bottle_material, deposit_type_id)
select '00000000-0000-0000-0000-000000000001', v.name, v.brand, 'SOFTDRINKS', v.variant, v.bottles, v.ml, v.material::public.bottle_material,
  (select id from public.deposit_types where organization_id = '00000000-0000-0000-0000-000000000001' and name = v.deposit)
from (values
  ('Coca-Cola Original 1,0L', 'Coca-Cola', 'Original', 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Coca-Cola Original 24x0,33L Glas', 'Coca-Cola', 'Original', 24, 330, 'GLASS', 'Pfand Kasten Glas 0,33L'),
  ('Coca-Cola Light 1,0L', 'Coca-Cola', 'Light', 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Coca-Cola Zero 1,0L', 'Coca-Cola', 'Zero', 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Fanta 1,0L', 'Fanta', null, 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Sprite 1,0L', 'Sprite', null, 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Mezzo Mix 1,0L', 'Mezzo Mix', null, 12, 1000, 'PET', 'Pfand Kasten PET Einweg'),
  ('Paulaner Spezi 1,0L', 'Paulaner Spezi', null, 12, 1000, 'PET', 'Pfand Kasten PET Einweg')
) as v(name, brand, variant, bottles, ml, material, deposit)
;

-- Bier: konfigurierbares Sortiment (besprochene Marken als Startpunkt)
insert into public.products (organization_id, name, brand, category, variant, bottles_per_case, bottle_volume_ml, bottle_material, deposit_type_id)
select '00000000-0000-0000-0000-000000000001', v.name, v.brand, 'BIER', v.variant, v.bottles, v.ml, v.material::public.bottle_material,
  (select id from public.deposit_types where organization_id = '00000000-0000-0000-0000-000000000001' and name = v.deposit)
from (values
  ('Augustiner Lagerbier Hell', 'Augustiner', 'Hell', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Paulaner Original München', 'Paulaner', 'Hell', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Erdinger Weißbier', 'Erdinger', 'Hefeweizen', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Krombacher Pils', 'Krombacher', 'Pils', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Bitburger Premium Pils', 'Bitburger', 'Pils', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Distelhäuser Pilsner', 'Distelhäuser', 'Pils', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L'),
  ('Würzburger Hofbräu Pilsner', 'Würzburger Hofbräu', 'Pils', 20, 500, 'GLASS', 'Pfand Kasten Glas 0,5L')
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

-- --- Bootstrap the first admin user -----------------------------------
-- After creating your first user via Supabase Auth, run:
--
-- update public.profiles
-- set organization_id = '00000000-0000-0000-0000-000000000001', role = 'ADMIN'
-- where id = '<the new user''s auth.users.id>';
