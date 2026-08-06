import type { BottleMaterial } from "@/lib/supabase/types";

// 1000 -> "1,0", 750 -> "0,75", 700 -> "0,7", 500 -> "0,5", 330 -> "0,33".
function formatLiters(ml: number): string {
  let s = (ml / 1000).toString();
  if (!s.includes(".")) s += ".0";
  return s.replace(".", ",");
}

export function formatGebinde(product: {
  bottles_per_case: number;
  bottle_volume_ml: number;
  bottle_material: BottleMaterial;
}): string {
  const material = product.bottle_material === "GLASS" ? "Glas" : "PET";
  return `${product.bottles_per_case}×${formatLiters(product.bottle_volume_ml)}L ${material}`;
}

export const categoryLabels: Record<string, string> = {
  WASSER: "Wasser",
  BIER: "Bier",
  WEIN_SEKT: "Wein & Sekt",
  SAFT_SCHORLEN: "Saft & Schorlen",
  SOFTDRINKS: "Softgetränke",
  SONSTIGES: "Sonstiges",
};
