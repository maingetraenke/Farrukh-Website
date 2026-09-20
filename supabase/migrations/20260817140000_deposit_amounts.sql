-- Sets real Pfand (deposit) amounts, researched per the business owner's
-- explicit instruction (2026-08-17 chat: "Die Pfandbeträge sind in DE
-- einheitlich: Bitte Googlen") rather than invented — see CLAUDE.md rule 5,
-- which normally forbids guessing these but not researching them when
-- asked to. Sourced conventions (not legally fixed for Mehrweg — bottlers
-- set their own rate, but these are the standard/typical market values):
--   - Einweg (single-use): 0,25 EUR/bottle flat, no separate crate deposit
--     (DPG system has no reusable pool crate for Einweg).
--   - Mehrweg glass <=0,5L (crown cap, e.g. beer/soft drink bottles):
--     0,08 EUR/bottle.
--   - Mehrweg glass >0,5L and Mehrweg PET (any size): 0,15 EUR/bottle.
--   - Kasten (crate) deposit: 1,50 EUR per case, ADDITIONAL to the
--     per-bottle deposit (confirmed by a worked example matching one of
--     our own case sizes exactly: 20x0,5L beer case = 1,50 + 20x0,08 =
--     3,10 EUR).
-- If MainGetränke's actual supplier agreements (e.g. Volpert) specify
-- different amounts, these should be corrected — this is a sourced
-- industry-standard default, not a verified contractual value.

-- "Pfand Kasten PET Mehrweg" was shared by two different case sizes
-- (16 products at 12x1,0L, one product — Black Forest Still — at
-- 20x0,5L). A single flat amount can't be correct for both, since the
-- total depends on bottle count. Split into a dedicated deposit_type for
-- the 20x0,5L case instead of guessing which amount "wins".
insert into public.deposit_types (organization_id, name, amount_cents)
values (
  '00000000-0000-0000-0000-000000000001',
  'Pfand Kasten PET Mehrweg 0,5L',
  450 -- 1,50 (Kasten) + 20 x 0,15 (Mehrweg PET, jede Größe)
);

update public.products
set deposit_type_id = (
  select id from public.deposit_types
  where organization_id = '00000000-0000-0000-0000-000000000001'
    and name = 'Pfand Kasten PET Mehrweg 0,5L'
)
where organization_id = '00000000-0000-0000-0000-000000000001'
  and article_number = 'MG-A-00061'; -- Black Forest Still 20x0,5L PET

update public.deposit_types
set amount_cents = case name
  when 'Pfand Kasten Glas 0,33L' then 342  -- 1,50 + 24 x 0,08
  when 'Pfand Kasten Glas 0,5L'  then 310  -- 1,50 + 20 x 0,08
  when 'Pfand Kasten Glas 0,7L'  then 330  -- 1,50 + 12 x 0,15
  when 'Pfand Kasten Glas 0,75L' then 330  -- 1,50 + 12 x 0,15
  when 'Pfand Kasten PET Einweg' then 300  -- 12 x 0,25, kein Kastenpfand
  when 'Pfand Kasten PET Mehrweg' then 330 -- 1,50 + 12 x 0,15 (alle verbleibenden Produkte sind 12x1,0L)
  else amount_cents
end
where organization_id = '00000000-0000-0000-0000-000000000001'
  and name in (
    'Pfand Kasten Glas 0,33L',
    'Pfand Kasten Glas 0,5L',
    'Pfand Kasten Glas 0,7L',
    'Pfand Kasten Glas 0,75L',
    'Pfand Kasten PET Einweg',
    'Pfand Kasten PET Mehrweg'
  );

-- "Pfand Kasten Glas 1,0L" stays null — no active product currently uses
-- it, so there's no real case size to anchor a total against. Set this
-- once a 1,0L glass product actually exists.
