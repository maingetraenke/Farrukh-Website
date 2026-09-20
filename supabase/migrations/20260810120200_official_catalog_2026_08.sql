-- Official assortment & pricing update, 2026-08-10.
--
-- Source: gross end-customer sale prices (inkl. 19% MwSt.) supplied
-- directly by the organization. Not invented — see CLAUDE.md rule 5.
-- Deposit (Pfand) amounts were NOT supplied this round, so deposit_type_id
-- is linked where a matching container type already exists in
-- deposit_types, but amount_cents stays null until a real value is given
-- — do not infer a Pfand amount from this migration.
--
-- Idempotent and non-destructive by design:
--   - A row is UPDATEd in place only when brand + variant + gebinde
--     (bottles/ml/material) + category exactly match an existing product
--     — i.e. it's genuinely the same SKU getting its first real price.
--   - Everything else in the current catalog that this migration doesn't
--     mention (e.g. Mezzo Mix, Alasia PUR, Krombacher, the Wein/Saft demo
--     placeholders, ...) is left completely untouched, per explicit
--     instruction — no deactivation, no deletion.
--   - Re-running this migration is safe: exact-match rows get updated
--     again (no-op), and a product only gets a product_prices row if it
--     doesn't already have one.
--
-- One explicit exception: "Würzburger Hofbräu Pils" already exists as an
-- active, orderable demo product, but the supplied price list explicitly
-- states no price is set yet and it must NOT be an orderable product. It
-- is deactivated at the end of this migration (data preserved, not
-- deleted — see CLAUDE.md rule 11).

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

-- See migration header: explicitly excluded from the orderable catalog by
-- the supplied price list ("NICHT ALS BESTELLBARES PRODUKT ANLEGEN").
update public.products
set active = false
where organization_id = '00000000-0000-0000-0000-000000000001'
  and brand = 'Würzburger Hofbräu'
  and variant = 'Pils';
