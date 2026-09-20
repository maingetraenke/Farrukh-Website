-- Import "Kundenpreisliste – 93 neue Produkte" (Rhön, Bad Brückenauer /
-- Schatzquelle, Adelholzener), supplied 2026-09-01.
--
-- Source: gross end-customer sale prices (Endpreis brutto) from the
-- organization-supplied PDF price list. Not invented — see CLAUDE.md rule 5.
-- The source file itself states no Pfand values are included for these
-- positions ("Pfand ist nicht enthalten, da ... kein Pfandwert hinterlegt
-- ist"). deposit_type_id is therefore only linked where an existing
-- deposit_types row already matches the container's material+size exactly
-- (same convention as 20260810120200_official_catalog_2026_08.sql); where no
-- matching container type exists (the 0,25L "Gourmet" glass bottles),
-- deposit_type_id stays NULL — no Pfand amount or container type is
-- invented. tax_rate_percent is set to 19.00, the standard German VAT rate
-- for bottled water, matching the treatment of every other real-priced
-- water/softdrink/beer product already in the catalog.
--
-- Brand-assortment note: CLAUDE.md currently documents the approved Wasser
-- assortment as "Gerolsteiner, Franken Brunnen, Alasia/Alasia PUR, Bad
-- Brückenauer, Black Forest" — Rhön, Schatzquelle and Adelholzener are not
-- on that list. Importing them anyway was an explicit decision made in
-- chat when this migration was requested; CLAUDE.md was intentionally left
-- unchanged. Flag this to the organization before relying on it
-- operationally — the documented policy and the live catalog now disagree.
--
-- Data-quality notes carried over from the source PDF (see inline comments
-- on the affected rows below for details):
--   - 6 rows have no Füllmenge in the source table (rendered as "—"). Each
--     was inferred from an exact price match to a sibling row in the same
--     Kasten/brand group — a physical-container inference, not a fabricated
--     price or Pfand value — and flagged inline for verification.
--   - "ZZZRhön APF-TRAUBE" duplicates "Rhön A.Tr.-" (identical Gebinde and
--     price); imported but left INACTIVE as a likely legacy/duplicate
--     source row rather than silently dropped or silently trusted.
--   - "Adel. BIF Sunny Orange/Grapefruit" have no Glas/PET marker in the
--     source; assumed PET (Adelholzener BIF is commonly sold as a PET sport
--     bottle) and flagged inline for verification.
--
-- Idempotent, but NOT purely additive like the 2026-08-10 catalog import:
--   - A row is matched to an existing product on brand + variant + gebinde
--     (bottles/ml/material) + category, exactly as before.
--   - Six Bad Brückenauer SKUs (Spritzig/Medium/Naturell × 12×0,7L Glas /
--     12×1,0L PET) already exist with an earlier price. This price list is
--     a newer, dated Kundenpreisliste that supersedes those figures, so —
--     unlike the additive-only 2026-08-10 migration — a NEW product_prices
--     row is inserted whenever the supplied price differs from the
--     product's current latest price, preserving the old price as history
--     (append-only, per docs/database.md) rather than skipping the update.
--   - Re-running this migration is safe: matching rows with an unchanged
--     latest price are left alone (no duplicate price rows).
--   - Nothing in the current catalog that this migration doesn't mention is
--     touched — no deactivation, no deletion, per CLAUDE.md rule 11.

do $$
declare
  v_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_row record;
  v_product_id uuid;
  v_latest_price integer;
begin
  for v_row in
    select * from (values
      ('Rhön Original 6×1,0L Glas', 'Rhön', 'Original', 'WASSER', 6, 1000, 'GLASS', 'Pfand Kasten Glas 1,0L', 710::integer, true),
      ('Rhön Sanft 6×1,0L Glas', 'Rhön', 'Sanft', 'WASSER', 6, 1000, 'GLASS', 'Pfand Kasten Glas 1,0L', 710::integer, true),
      ('Rhön Medium 6×1,0L Glas', 'Rhön', 'Medium', 'WASSER', 6, 1000, 'GLASS', 'Pfand Kasten Glas 1,0L', 710::integer, true),
      ('Rhön Naturell 6×1,0L Glas', 'Rhön', 'Naturell', 'WASSER', 6, 1000, 'GLASS', 'Pfand Kasten Glas 1,0L', 710::integer, true),
      ('Rhön Sprudel 12×0,7L Glas', 'Rhön', 'Sprudel', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 820::integer, true),
      ('Rhön Sprudel Sanft 12×0,7L Glas', 'Rhön', 'Sprudel Sanft', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 820::integer, true),
      ('Rhön Medium 12×0,75L Glas', 'Rhön', 'Medium', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 820::integer, true),
      ('Rhön Naturell 12×0,7L Glas', 'Rhön', 'Naturell', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 820::integer, true),
      ('Rhön INDI Spritzig 12×0,75L Glas', 'Rhön', 'INDI Spritzig', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 870::integer, true),
      ('Rhön INDI Sanft 12×0,75L Glas', 'Rhön', 'INDI Sanft', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 870::integer, true),
      ('Rhön INDI Medium 12×0,75L Glas', 'Rhön', 'INDI Medium', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 870::integer, true),
      ('Rhön INDI Naturell 12×0,75L Glas', 'Rhön', 'INDI Naturell', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 870::integer, true),
      ('Rhön INDI Appleplus 12×0,75L Glas', 'Rhön', 'INDI Appleplus', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 1200::integer, true),
      ('Rhön INDI Miwa+Zitro 12×0,75L Glas', 'Rhön', 'INDI Miwa+Zitro', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 930::integer, true),
      ('Rhön INDI Miwa+Lime 12×0,75L Glas', 'Rhön', 'INDI Miwa+Lime', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 930::integer, true),
      ('Rhön INDI Miwa+P.Grape 12×0,75L Glas', 'Rhön', 'INDI Miwa+P.Grape', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 930::integer, true),  -- Füllmenge in Quelle nicht angegeben (—); aus Preisgleichheit mit INDI Miwa+Zitro/Lime (750ml, 9,30€) abgeleitet
      ('Rhön Sprudel Original 12×1,0L PET', 'Rhön', 'Sprudel Original', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 890::integer, true),
      ('Rhön Medium 12×1,0L PET', 'Rhön', 'Medium', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 890::integer, true),
      ('Rhön Naturell 12×1,0L PET', 'Rhön', 'Naturell', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 890::integer, true),
      ('Rhön Sprudel 12×0,5L PET', 'Rhön', 'Sprudel', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 800::integer, true),
      ('Rhön Medium 12×0,5L PET', 'Rhön', 'Medium', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 800::integer, true),
      ('Rhön Naturell 12×0,5L PET', 'Rhön', 'Naturell', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 800::integer, true),
      ('Rhön Appleplus 12×0,75L PET', 'Rhön', 'Appleplus', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1190::integer, true),
      ('Rhön Apfel-Limette 12×0,75L PET', 'Rhön', 'Apfel-Limette', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1190::integer, true),
      ('Rhön Miwa+Zitrone 12×1,0L PET', 'Rhön', 'Miwa+Zitrone', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 890::integer, true),  -- Füllmenge/Material in Quelle nicht angegeben (—); aus Preisgleichheit mit Sprudel Original/Medium/Naturell 12x1,0L PET (8,90€) abgeleitet
      ('Rhön A.Ki.-Granatapfel 12×0,75L PET', 'Rhön', 'A.Ki.-Granatapfel', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1190::integer, true),  -- Füllmenge in Quelle nicht angegeben (—); aus Preisgleichheit mit der 0,75L-PET-Fruchtgruppe (11,90€) abgeleitet
      ('Rhön Cherry Plus 12×0,75L PET', 'Rhön', 'Cherry Plus', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1190::integer, true),
      ('Rhön Apfel-Birne 12×0,75L PET', 'Rhön', 'Apfel-Birne', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1190::integer, true),
      ('Rhön Vita Mehrfrucht 12×0,75L PET', 'Rhön', 'Vita Mehrfrucht', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1220::integer, true),
      ('Rhön A.Tr.- 12×0,75L PET', 'Rhön', 'A.Tr.-', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1190::integer, true),  -- Füllmenge in Quelle nicht angegeben (—); aus Preisgleichheit mit der 0,75L-PET-Fruchtgruppe (11,90€) abgeleitet
      ('Rhön Cassisplus 12×0,75L PET', 'Rhön', 'Cassisplus', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1190::integer, true),
      ('Rhön Apfel-Traube (ZZZ, vermutl. Dublette) 12×0,75L PET', 'Rhön', 'Apfel-Traube', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1190::integer, false),  -- Quelle: 'ZZZRhön APF-TRAUBE', identisches Gebinde/Preis wie 'Rhön A.Tr.-' -> vermutliche Dublette/Altartikel (ZZZ-Präfix), daher inaktiv angelegt statt gelöscht; bitte mit Rhön-Preisliste abgleichen
      ('Bad Brückenauer Spritzig Gourmet 20×0,25L Glas', 'Bad Brückenauer', 'Spritzig Gourmet', 'WASSER', 20, 250, 'GLASS', null, 1070::integer, true),  -- Kein Pfandtyp für 0,25L Glas in deposit_types hinterlegt -> deposit_type_id bleibt NULL, nicht erfunden
      ('Bad Brückenauer Spritzig 12×0,7L Glas', 'Bad Brückenauer', 'Spritzig', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 830::integer, true),
      ('Bad Brückenauer Medium 12×0,7L Glas', 'Bad Brückenauer', 'Medium', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 830::integer, true),
      ('Bad Brückenauer Naturell 12×0,7L Glas', 'Bad Brückenauer', 'Naturell', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 830::integer, true),
      ('Bad Brückenauer Lemon 12×0,7L Glas', 'Bad Brückenauer', 'Lemon', 'WASSER', 12, 700, 'GLASS', 'Pfand Kasten Glas 0,7L', 870::integer, true),
      ('Bad Brückenauer INDI Spritzig 12×0,75L Glas', 'Bad Brückenauer', 'INDI Spritzig', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 880::integer, true),
      ('Bad Brückenauer INDI Medium 12×0,75L Glas', 'Bad Brückenauer', 'INDI Medium', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 880::integer, true),
      ('Bad Brückenauer INDI Naturell 12×0,75L Glas', 'Bad Brückenauer', 'INDI Naturell', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 880::integer, true),
      ('Bad Brückenauer INDI Zitro-Limette 12×0,75L Glas', 'Bad Brückenauer', 'INDI Zitro-Limette', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 980::integer, true),
      ('Bad Brückenauer INDI Orangen-Limette 12×0,75L Glas', 'Bad Brückenauer', 'INDI Orangen-Limette', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 980::integer, true),
      ('Bad Brückenauer INDI Orange-Maracuja 12×0,75L Glas', 'Bad Brückenauer', 'INDI Orange-Maracuja', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 1020::integer, true),
      ('Bad Brückenauer INDI Cola-Mix 12×0,75L Glas', 'Bad Brückenauer', 'INDI Cola-Mix', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 1040::integer, true),
      ('Bad Brückenauer INDI Lemon 12×0,75L Glas', 'Bad Brückenauer', 'INDI Lemon', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 920::integer, true),
      ('Bad Brückenauer INDI Grapefruit 12×0,75L Glas', 'Bad Brückenauer', 'INDI Grapefruit', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 1020::integer, true),
      ('Bad Brückenauer INDI Johannisbeere 12×0,75L Glas', 'Bad Brückenauer', 'INDI Johannisbeere', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 1460::integer, true),
      ('Bad Brückenauer Spritzig 12×1,0L PET', 'Bad Brückenauer', 'Spritzig', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 950::integer, true),
      ('Bad Brückenauer Medium 12×1,0L PET', 'Bad Brückenauer', 'Medium', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 950::integer, true),
      ('Bad Brückenauer Naturell 12×1,0L PET', 'Bad Brückenauer', 'Naturell', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 950::integer, true),
      ('Schatzquelle Spritzig 12×1,0L PET', 'Schatzquelle', 'Spritzig', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 730::integer, true),
      ('Schatzquelle Medium 12×1,0L PET', 'Schatzquelle', 'Medium', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 730::integer, true),
      ('Schatzquelle Naturell 12×1,0L PET', 'Schatzquelle', 'Naturell', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 730::integer, true),
      ('Bad Brückenauer Spritzig 20×0,5L PET', 'Bad Brückenauer', 'Spritzig', 'WASSER', 20, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1070::integer, true),
      ('Bad Brückenauer Medium 20×0,5L PET', 'Bad Brückenauer', 'Medium', 'WASSER', 20, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1070::integer, true),
      ('Bad Brückenauer Naturell 20×0,5L PET', 'Bad Brückenauer', 'Naturell', 'WASSER', 20, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1070::integer, true),
      ('Bad Brückenauer Apfelschorle 20×0,5L PET', 'Bad Brückenauer', 'Apfelschorle', 'WASSER', 20, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1570::integer, true),
      ('Bad Brückenauer Orange 20×0,5L PET', 'Bad Brückenauer', 'Orange', 'WASSER', 20, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1270::integer, true),
      ('Bad Brückenauer Cola-Mix kalorienarm 20×0,5L PET', 'Bad Brückenauer', 'Cola-Mix kalorienarm', 'WASSER', 20, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1270::integer, true),
      ('Bad Brückenauer Johannisbeerschorle 20×0,5L PET', 'Bad Brückenauer', 'Johannisbeerschorle', 'WASSER', 20, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1690::integer, true),
      ('Bad Brückenauer Medium Gourmet 20×0,25L Glas', 'Bad Brückenauer', 'Medium Gourmet', 'WASSER', 20, 250, 'GLASS', null, 1070::integer, true),  -- Kein Pfandtyp für 0,25L Glas in deposit_types hinterlegt -> deposit_type_id bleibt NULL, nicht erfunden
      ('Adelholzener BIF Sunny Orange 12×0,75L PET', 'Adelholzener', 'BIF Sunny Orange', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),  -- Material in Quelle nicht markiert (kein GLAS-Vermerk) -> als PET angenommen (Adelholzener BIF wird handelsüblich als PET-Sportflasche geführt); bitte verifizieren
      ('Adelholzener BIF Grapefruit 12×0,75L PET', 'Adelholzener', 'BIF Grapefruit', 'WASSER', 12, 750, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),  -- Material in Quelle nicht markiert -> als PET angenommen, bitte verifizieren
      ('Adelholzener Classic 12×1,0L PET', 'Adelholzener', 'Classic', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 1020::integer, true),
      ('Adelholzener Sanft 12×1,0L PET', 'Adelholzener', 'Sanft', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 1020::integer, true),
      ('Adelholzener Naturell 12×1,0L PET', 'Adelholzener', 'Naturell', 'WASSER', 12, 1000, 'PET', 'Pfand Kasten PET Mehrweg', 1020::integer, true),
      ('Adelholzener Classic 12×0,5L Glas', 'Adelholzener', 'Classic', 'WASSER', 12, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 840::integer, true),
      ('Adelholzener Sanft 12×0,5L Glas', 'Adelholzener', 'Sanft', 'WASSER', 12, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 840::integer, true),
      ('Adelholzener Naturell 12×0,5L Glas', 'Adelholzener', 'Naturell', 'WASSER', 12, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 840::integer, true),
      ('Adelholzener Apfelschorle 12×0,5L Glas', 'Adelholzener', 'Apfelschorle', 'WASSER', 12, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1060::integer, true),
      ('Adelholzener Johannisbeerschorle 12×0,5L Glas', 'Adelholzener', 'Johannisbeerschorle', 'WASSER', 12, 500, 'GLASS', 'Pfand Kasten Glas 0,5L', 1060::integer, true),
      ('Adelholzener Classic 12×0,5L PET', 'Adelholzener', 'Classic', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 820::integer, true),
      ('Adelholzener Sanft 12×0,5L PET', 'Adelholzener', 'Sanft', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 820::integer, true),
      ('Adelholzener Naturell 12×0,5L PET', 'Adelholzener', 'Naturell', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 820::integer, true),
      ('Adelholzener Eistee Waldbeere 12×0,5L PET', 'Adelholzener', 'Eistee Waldbeere', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Eistee Pfirsich 12×0,5L PET', 'Adelholzener', 'Eistee Pfirsich', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Apfelschorle 12×0,5L PET', 'Adelholzener', 'Apfelschorle', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Lemon Sport 12×0,5L PET', 'Adelholzener', 'Lemon Sport', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Cola-Mix 12×0,5L PET', 'Adelholzener', 'Cola-Mix', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Limette 12×0,5L PET', 'Adelholzener', 'Limette', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Multivitamin 12×0,5L PET', 'Adelholzener', 'Multivitamin', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Mandarine 12×0,5L PET', 'Adelholzener', 'Mandarine', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Sport-Schorle 12×0,5L PET', 'Adelholzener', 'Sport-Schorle', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),  -- Füllmenge in Quelle nicht angegeben (—); aus Preisgleichheit mit der 0,5L-PET-Sportgruppe (10,30€) abgeleitet
      ('Adelholzener Pink Grapefruit Sport 12×0,5L PET', 'Adelholzener', 'Pink Grapefruit Sport', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Brombeer-Holunder 12×0,5L PET', 'Adelholzener', 'Brombeer-Holunder', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Sport Kirsche 12×0,5L PET', 'Adelholzener', 'Sport Kirsche', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Mango 12×0,5L PET', 'Adelholzener', 'Mango', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Johannisbeer-Kräuter 12×0,5L PET', 'Adelholzener', 'Johannisbeer-Kräuter', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Multivitamin Rot 12×0,5L PET', 'Adelholzener', 'Multivitamin Rot', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener Johannisbeere 12×0,5L PET', 'Adelholzener', 'Johannisbeere', 'WASSER', 12, 500, 'PET', 'Pfand Kasten PET Mehrweg', 1030::integer, true),
      ('Adelholzener INDI Sanft 12×0,75L Glas', 'Adelholzener', 'INDI Sanft', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 890::integer, true),
      ('Adelholzener INDI Naturell 12×0,75L Glas', 'Adelholzener', 'INDI Naturell', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 890::integer, true),
      ('Adelholzener INDI Miwa+Lemon 12×0,75L Glas', 'Adelholzener', 'INDI Miwa+Lemon', 'WASSER', 12, 750, 'GLASS', 'Pfand Kasten Glas 0,75L', 930::integer, true)
    ) as v(name, brand, variant, category, bottles, ml, material, deposit_name, price_cents, is_active)
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
        19.00, v_row.is_active
      )
      returning id into v_product_id;

      insert into public.product_prices (organization_id, product_id, sale_price_cents, valid_from)
      values (v_org_id, v_product_id, v_row.price_cents, now());
    else
      update public.products
      set tax_rate_percent = 19.00, active = v_row.is_active
      where id = v_product_id;

      select pp.sale_price_cents into v_latest_price
      from public.product_prices pp
      where pp.product_id = v_product_id
      order by pp.valid_from desc
      limit 1;

      if v_latest_price is null or v_latest_price is distinct from v_row.price_cents then
        insert into public.product_prices (organization_id, product_id, sale_price_cents, valid_from)
        values (v_org_id, v_product_id, v_row.price_cents, now());
      end if;
    end if;
  end loop;
end $$;
