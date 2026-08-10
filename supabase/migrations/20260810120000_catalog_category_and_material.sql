-- Official assortment update (2026-08-10): adds the enum values needed for
-- the Bayla juice/nectar line (sold in cartons, not glass/PET bottles) and
-- for a dedicated "Saft & Nektar" category, distinct from the existing
-- SAFT_SCHORLEN (Apfelschorle/spritzer-style demo products).
--
-- Kept in its own migration, separate from the data migration that uses
-- these values: newly added enum values cannot reliably be used in the
-- same transaction/session that added them.

alter type public.bottle_material add value 'KARTON';

comment on type public.bottle_material is 'GLASS/PET for bottled products; KARTON for Tetra-Pak-style cartons (e.g. Bayla juice/nectar, no case deposit).';

alter type public.product_category add value 'SAFT_NEKTAR';

comment on type public.product_category is 'No ENERGY_DRINK value on purpose: energy drinks are out of scope at launch per spec. SAFT_NEKTAR (pure juice/nectar, e.g. Bayla) is distinct from SAFT_SCHORLEN (spritzer-style blends).';
