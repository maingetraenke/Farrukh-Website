-- Product images for the 93-Produkte import (20260901090000_...).
--
-- All new files are genuine freestanding packshot photos (white/plain
-- background, single bottle, no lifestyle context), sourced and visually
-- verified per the policy in docs/product-images-overview.md:
--   - Rhön: official manufacturer photos, rhoensprudel.de
--   - Bad Brückenauer / Schatzquelle: official manufacturer photos,
--     badbrueckenauer.de/downloads/flaschen/ and /downloads/schatzquelle/
--   - Adelholzener: official manufacturer photos, adelholzener.de
--     (transparent PNGs, flattened onto white during processing)
-- Files were resized to a max edge of 900px and compressed to <200KB, same
-- convention as the existing apps/web/public/products/ assets.
--
-- One photo is reused across all Gebinde-Größen (case sizes) of the same
-- brand+flavor, matching the convention already used for the rest of the
-- catalog (see docs/product-images-overview.md). Material (Glas/PET) is
-- only used as a match filter where the flavor genuinely has two different
-- bottle photos (Adelholzener Apfelschorle); everywhere else the same photo
-- applies regardless of bottle size/material.
--
-- Two Bad Brückenauer positions from the source PDF ("INDI Zitro-Limette",
-- "INDI Orangen-Limette") could not be matched to any current product in
-- the manufacturer's own catalog — no image is assigned, image_url stays
-- NULL, and this should be checked against the real product range (closest
-- current equivalents appear to be "Limette Minze" and "Orange Ingwer").
--
-- For the three Bad Brückenauer PET variants (Spritzig/Medium/Naturell),
-- this reuses the *existing* image already set on the 12×1,0L PET SKUs
-- (from 20260810150000_official_catalog_images.sql) so the newly added
-- 20×0,5L PET SKUs of the same flavor get a picture too — no new file.
--
-- Idempotent: plain UPDATEs, safe to re-run.

do $$
declare
  v_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_row record;
begin
  for v_row in
    select * from (values
      ('Rhön', 'Original', null, '/products/rhoen-original.jpg'),
      ('Rhön', 'Sanft', null, '/products/rhoen-sanft.jpg'),
      ('Rhön', 'Medium', null, '/products/rhoen-medium.jpg'),
      ('Rhön', 'Naturell', null, '/products/rhoen-naturell.jpg'),
      ('Rhön', 'Sprudel', null, '/products/rhoen-original.jpg'),
      ('Rhön', 'Sprudel Sanft', null, '/products/rhoen-sanft.jpg'),
      ('Rhön', 'INDI Spritzig', null, '/products/rhoen-original.jpg'),
      ('Rhön', 'INDI Sanft', null, '/products/rhoen-sanft.jpg'),
      ('Rhön', 'INDI Medium', null, '/products/rhoen-medium.jpg'),
      ('Rhön', 'INDI Naturell', null, '/products/rhoen-naturell.jpg'),
      ('Rhön', 'INDI Appleplus', null, '/products/rhoen-appleplus.jpg'),
      ('Rhön', 'INDI Miwa+Zitro', null, '/products/rhoen-miwa-zitro.jpg'),
      ('Rhön', 'INDI Miwa+Lime', null, '/products/rhoen-miwa-lime.jpg'),
      ('Rhön', 'INDI Miwa+P.Grape', null, '/products/rhoen-miwa-pink-grape.jpg'),
      ('Rhön', 'Appleplus', null, '/products/rhoen-appleplus.jpg'),
      ('Rhön', 'Apfel-Limette', null, '/products/rhoen-apfel-limette.jpg'),
      ('Rhön', 'Miwa+Zitrone', null, '/products/rhoen-miwa-zitro.jpg'),
      ('Rhön', 'A.Ki.-Granatapfel', null, '/products/rhoen-apfel-kirsche-granatapfel.jpg'),
      ('Rhön', 'Cherry Plus', null, '/products/rhoen-cherry-plus.jpg'),
      ('Rhön', 'Apfel-Birne', null, '/products/rhoen-apfel-birne.jpg'),
      ('Rhön', 'Vita Mehrfrucht', null, '/products/rhoen-vita-mehrfrucht.jpg'),
      ('Rhön', 'A.Tr.-', null, '/products/rhoen-apfel-traube.jpg'),
      ('Rhön', 'Cassisplus', null, '/products/rhoen-cassisplus.jpg'),
      ('Rhön', 'Apfel-Traube', null, '/products/rhoen-apfel-traube.jpg'),

      ('Bad Brückenauer', 'Spritzig Gourmet', null, '/products/bad-brueckenauer-spritzig-gourmet-025l-glas.jpg'),
      ('Bad Brückenauer', 'Medium Gourmet', null, '/products/bad-brueckenauer-medium-gourmet-025l-glas.jpg'),
      ('Bad Brückenauer', 'Lemon', null, '/products/bad-brueckenauer-lemon-07l-glas.jpg'),
      ('Bad Brückenauer', 'INDI Spritzig', null, '/products/bad-brueckenauer-indi-spritzig-075l-glas.jpg'),
      ('Bad Brückenauer', 'INDI Medium', null, '/products/bad-brueckenauer-indi-medium-075l-glas.jpg'),
      ('Bad Brückenauer', 'INDI Naturell', null, '/products/bad-brueckenauer-indi-naturell-075l-glas.jpg'),
      ('Bad Brückenauer', 'INDI Orange-Maracuja', null, '/products/bad-brueckenauer-orange-maracuja-075l-glas.jpg'),
      ('Bad Brückenauer', 'INDI Cola-Mix', null, '/products/bad-brueckenauer-cola-mix-075l-glas.jpg'),
      ('Bad Brückenauer', 'INDI Lemon', null, '/products/bad-brueckenauer-indi-lemon-075l-glas.jpg'),
      ('Bad Brückenauer', 'INDI Grapefruit', null, '/products/bad-brueckenauer-grapefruit-075l-glas.jpg'),
      ('Bad Brückenauer', 'INDI Johannisbeere', null, '/products/bad-brueckenauer-johannisbeere-075l-glas.jpg'),
      ('Bad Brückenauer', 'Spritzig', 'PET', '/products/bad-brueckenauer-spritzig-10l-pet.webp'),
      ('Bad Brückenauer', 'Medium', 'PET', '/products/bad-brueckenauer-medium-10l-pet.webp'),
      ('Bad Brückenauer', 'Naturell', 'PET', '/products/bad-brueckenauer-naturell-10l-pet.webp'),
      ('Bad Brückenauer', 'Apfelschorle', null, '/products/bad-brueckenauer-apfelschorle-05l-pet.jpg'),
      ('Bad Brückenauer', 'Orange', null, '/products/bad-brueckenauer-orange-05l-pet.jpg'),
      ('Bad Brückenauer', 'Cola-Mix kalorienarm', null, '/products/bad-brueckenauer-cola-mix-05l-pet.jpg'),
      ('Bad Brückenauer', 'Johannisbeerschorle', null, '/products/bad-brueckenauer-johannisbeere-05l-pet.jpg'),

      ('Schatzquelle', 'Spritzig', null, '/products/schatzquelle-spritzig-10l-pet.jpg'),
      ('Schatzquelle', 'Medium', null, '/products/schatzquelle-medium-10l-pet.jpg'),
      ('Schatzquelle', 'Naturell', null, '/products/schatzquelle-naturell-10l-pet.jpg'),

      ('Adelholzener', 'BIF Sunny Orange', null, '/products/adelholzener-bif-sunny-orange.jpg'),
      ('Adelholzener', 'BIF Grapefruit', null, '/products/adelholzener-bif-grapefruit.jpg'),
      ('Adelholzener', 'Classic', null, '/products/adelholzener-classic.jpg'),
      ('Adelholzener', 'Sanft', null, '/products/adelholzener-sanft.jpg'),
      ('Adelholzener', 'Naturell', null, '/products/adelholzener-naturell.jpg'),
      ('Adelholzener', 'Apfelschorle', 'GLASS', '/products/adelholzener-apfelschorle-glas.jpg'),
      ('Adelholzener', 'Apfelschorle', 'PET', '/products/adelholzener-apfelschorle-pet.jpg'),
      ('Adelholzener', 'Johannisbeerschorle', null, '/products/adelholzener-johannisbeerschorle-glas.jpg'),
      ('Adelholzener', 'Eistee Waldbeere', null, '/products/adelholzener-eistee-waldbeere.jpg'),
      ('Adelholzener', 'Eistee Pfirsich', null, '/products/adelholzener-eistee-pfirsich.jpg'),
      ('Adelholzener', 'Lemon Sport', null, '/products/adelholzener-lemon-sport.jpg'),
      ('Adelholzener', 'Cola-Mix', null, '/products/adelholzener-cola-mix.jpg'),
      ('Adelholzener', 'Limette', null, '/products/adelholzener-limette.jpg'),
      ('Adelholzener', 'Multivitamin', null, '/products/adelholzener-multivitamin.jpg'),
      ('Adelholzener', 'Mandarine', null, '/products/adelholzener-mandarine.jpg'),
      ('Adelholzener', 'Sport-Schorle', null, '/products/adelholzener-sport-schorle.jpg'),
      ('Adelholzener', 'Pink Grapefruit Sport', null, '/products/adelholzener-pink-grapefruit-sport.jpg'),
      ('Adelholzener', 'Brombeer-Holunder', null, '/products/adelholzener-brombeer-holunder.jpg'),
      ('Adelholzener', 'Sport Kirsche', null, '/products/adelholzener-sport-kirsche.jpg'),
      ('Adelholzener', 'Mango', null, '/products/adelholzener-mango.jpg'),
      ('Adelholzener', 'Johannisbeer-Kräuter', null, '/products/adelholzener-johannisbeer-kraeuter.jpg'),
      ('Adelholzener', 'Multivitamin Rot', null, '/products/adelholzener-multivitamin-rot.jpg'),
      ('Adelholzener', 'Johannisbeere', null, '/products/adelholzener-johannisbeere.jpg'),
      ('Adelholzener', 'INDI Sanft', null, '/products/adelholzener-sanft.jpg'),
      ('Adelholzener', 'INDI Naturell', null, '/products/adelholzener-naturell.jpg'),
      ('Adelholzener', 'INDI Miwa+Lemon', null, '/products/adelholzener-lemon.jpg')
    ) as v(brand, variant, material, image_path)
  loop
    update public.products p
    set image_url = v_row.image_path
    where p.organization_id = v_org_id
      and p.brand = v_row.brand
      and p.variant is not distinct from v_row.variant
      and p.category = 'WASSER'
      and (v_row.material is null or p.bottle_material = v_row.material::public.bottle_material);
  end loop;
end $$;
