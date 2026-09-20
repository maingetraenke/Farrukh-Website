-- Sortiments-Korrektur, 2026-08-10 (Chat, Teil 2):
--   1. Mezzo Mix bekommt reale Verkaufspreise (inkl. 19% MwSt., vom Kunden
--      genannt, nicht erfunden — siehe CLAUDE.md Regel 5).
--   2. Alte/doppelte Produktvarianten werden deaktiviert (active=false),
--      nicht gelöscht — siehe CLAUDE.md Regel 11 (keine destruktive
--      Migration ohne Rollback-Pfad). Betrifft: Erfrischungsgetränke-
--      Altvarianten (teils exakte Dubletten zur offiziellen Liste vom
--      2026-08-10, z.B. Coca-Cola/Fanta 24×0,33L Glas mit altem
--      variant-Wert statt dem offiziellen null-Wert), nicht mehr gelistete
--      Biere, sowie die Wein-/Saft-Demo-Platzhalter (per Spec noch keine
--      echten Wein-Produkte, siehe CLAUDE.md "Wein ist als zukünftige
--      Kategorie vorgesehen").

do $$
declare
  v_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_row record;
  v_product_id uuid;
begin
  -- 1) Mezzo Mix pricing.
  for v_row in
    select * from (values
      ('MG-A-00024', 1899::integer), -- Mezzo Mix 24×0,33L Glas
      ('MG-A-00023', 1999::integer)  -- Mezzo Mix 12×1,0L PET
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

  -- 2) Deactivate old/duplicate/demo products.
  update public.products
  set active = false
  where organization_id = v_org_id
    and article_number in (
      -- Erfrischungsgetränke: alte Formate bzw. exakte Dubletten der
      -- offiziellen 24×0,33L-Glas-Artikel (unterschiedlicher variant-Wert:
      -- 'Original' statt null bei Coca-Cola, null statt 'Orange' bei Fanta).
      'MG-A-00017', -- Coca-Cola Light 12×1,0L PET
      'MG-A-00014', -- Coca-Cola Original 24×0,33L Glas (Dublette von MG-A-00078)
      'MG-A-00013', -- Coca-Cola Original 12×1,0L PET
      'MG-A-00015', -- Coca-Cola Zero 12×1,0L PET
      'MG-A-00020', -- Fanta 24×0,33L Glas (Dublette von MG-A-00079)
      'MG-A-00019', -- Fanta 12×1,0L PET
      'MG-A-00021', -- Sprite 12×1,0L PET
      -- Bier: nicht mehr gelistete Marken/Varianten.
      'MG-A-00034', -- Distelhäuser Pils
      'MG-A-00031', -- Erdinger Weißbier
      'MG-A-00032', -- Krombacher Pils
      'MG-A-00030', -- Paulaner Hefe-Weißbier
      'MG-A-00029', -- Paulaner Helles
      -- Wein & Sekt / Saft & Schorlen: Demo-Platzhalter, keine echten
      -- Produkte/Preise.
      'MG-A-00036', 'MG-A-00037', -- Winzer Region Kitzingen (Wein-Demo)
      'MG-A-00038', 'MG-A-00039'  -- Regionaler Safthersteller (Saft-Demo)
    );
end $$;
