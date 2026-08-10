-- Ergänzende Verkaufspreise für 9 Wasser-Artikel, die nicht Teil der
-- offiziellen Sortimentsliste vom 2026-08-10 waren (20260810120200) und
-- deshalb absichtlich ohne Preis blieben. Preise per Chat vom Kunden
-- nachgereicht (Endkunden-Verkaufspreise inkl. 19% MwSt.) — nicht
-- erfunden, siehe CLAUDE.md Regel 5.

do $$
declare
  v_org_id uuid := '00000000-0000-0000-0000-000000000001';
  v_row record;
  v_product_id uuid;
begin
  for v_row in
    select * from (values
      ('MG-A-00006', 749::integer), -- Alasia Medium 12×0,75L Glas
      ('MG-A-00004', 699::integer), -- Alasia PUR 12×0,7L Glas
      ('MG-A-00003', 849::integer), -- Alasia PUR 12×1,0L PET
      ('MG-A-00012', 799::integer), -- Bad Brückenauer 12×0,75L Glas
      ('MG-A-00011', 899::integer), -- Bad Brückenauer 12×1,0L PET
      ('MG-A-00010', 749::integer), -- Franken Brunnen 12×0,75L Glas
      ('MG-A-00009', 849::integer), -- Franken Brunnen 12×1,0L PET
      ('MG-A-00002', 999::integer), -- Gerolsteiner 12×0,75L Glas
      ('MG-A-00001', 1049::integer) -- Gerolsteiner 12×1,0L PET
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
