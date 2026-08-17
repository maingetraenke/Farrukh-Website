import type { BottleMaterial } from "@/lib/supabase/types";

// 1000 -> "1,0", 750 -> "0,75", 700 -> "0,7", 500 -> "0,5", 330 -> "0,33".
function formatLiters(ml: number): string {
  let s = (ml / 1000).toString();
  if (!s.includes(".")) s += ".0";
  return s.replace(".", ",");
}

const materialLabels: Record<BottleMaterial, string> = {
  GLASS: "Glas",
  PET: "PET",
  KARTON: "Karton",
};

export function formatGebinde(product: {
  bottles_per_case: number;
  bottle_volume_ml: number;
  bottle_material: BottleMaterial;
}): string {
  const material = materialLabels[product.bottle_material];
  return `${product.bottles_per_case}×${formatLiters(product.bottle_volume_ml)}L ${material}`;
}

export const categoryLabels: Record<string, string> = {
  WASSER: "Wasser",
  BIER: "Bier",
  WEIN_SEKT: "Wein & Sekt",
  SAFT_SCHORLEN: "Saft & Schorlen",
  SAFT_NEKTAR: "Saft & Nektar",
  SOFTDRINKS: "Erfrischungsgetränke",
  SONSTIGES: "Sonstiges",
};

// 2199 -> "21,99 €". Sale prices are stored as exact gross (inkl. MwSt.)
// integer cents, never float — see CLAUDE.md rule 9.
export function formatPriceCents(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

// PAngV Grundpreis (price per liter), derived from the case price and the
// already-structured bottles_per_case/bottle_volume_ml columns — no
// string parsing needed, these are real numeric fields, not text baked
// into a title. Rounds to the nearest cent, same as the case price.
export function formatUnitPricePerLiter(product: {
  sale_price_cents: number;
  bottles_per_case: number;
  bottle_volume_ml: number;
}): string {
  const totalLiters =
    (product.bottles_per_case * product.bottle_volume_ml) / 1000;
  const centsPerLiter = product.sale_price_cents / totalLiters;
  return `${formatPriceCents(Math.round(centsPerLiter))}/L`;
}
