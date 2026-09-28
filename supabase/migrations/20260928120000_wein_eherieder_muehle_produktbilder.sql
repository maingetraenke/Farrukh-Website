-- Product images for the Wein & Sekt range from Weingut Eherieder Mühle
-- (MG-A-00197 … MG-A-00208), which were created in the ERP UI and so
-- have no image yet.
--
-- All files are the winery's own freestanding bottle packshots from its
-- online shop (weingut-hassold.de, "Flaschenbild"), transparent PNGs
-- flattened onto white and saved as JPG, same convention as the rest of
-- apps/web/public/products/ (see docs/product-images-overview.md).
-- Each photo was visually checked against the label (variety + bottle
-- size 0,75 L vs. 1,0 L).
--
-- Two products have no matching photo in the winery's shop and keep
-- image_url = NULL (the Sortiment page falls back to the category icon):
--   - MG-A-00207 Rivaner feinfruchtig 0,75 L
--   - MG-A-00208 Kerner Spontanvergoren 0,75 L (differs from the plain
--     Kerner label, so the Kerner photo is deliberately not reused)
--
-- Only sets image_url where it is still NULL, so an image uploaded
-- manually in the ERP is never overwritten. Idempotent, safe to re-run.
-- Rollback: set image_url back to NULL for these article numbers.

do $$
declare
  v_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_row record;
begin
  for v_row in
    select * from (values
      ('MG-A-00197', '/products/eherieder-muehle-sweet-m-075l.jpg'),
      ('MG-A-00198', '/products/eherieder-muehle-kerner-075l.jpg'),
      ('MG-A-00199', '/products/eherieder-muehle-bacchus-meisterstueck-075l.jpg'),
      ('MG-A-00200', '/products/eherieder-muehle-mueller-thurgau-10l.jpg'),
      ('MG-A-00201', '/products/eherieder-muehle-silvaner-10l.jpg'),
      ('MG-A-00202', '/products/eherieder-muehle-domina-10l.jpg'),
      ('MG-A-00203', '/products/eherieder-muehle-rotling-10l.jpg'),
      ('MG-A-00204', '/products/eherieder-muehle-secco-weiss.jpg'),
      ('MG-A-00205', '/products/eherieder-muehle-secco-rotling.jpg'),
      ('MG-A-00206', '/products/eherieder-muehle-blanc-de-blanc-075l.jpg')
    ) as v(article_number, image_path)
  loop
    update public.products p
    set image_url = v_row.image_path
    where p.organization_id = v_org_id
      and p.article_number = v_row.article_number
      and p.category = 'WEIN_SEKT'
      and p.image_url is null;
  end loop;
end $$;
