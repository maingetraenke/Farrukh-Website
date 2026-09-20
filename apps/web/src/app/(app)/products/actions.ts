"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { BottleMaterial, ProductCategory } from "@/lib/supabase/types";

export interface ProductFormState {
  error?: string;
}

export interface ProductInput {
  ean: string | null;
  name: string;
  brand: string;
  category: ProductCategory;
  variant: string | null;
  bottles_per_case: number;
  bottle_volume_ml: number;
  bottle_material: BottleMaterial;
  supplier_id: string | null;
  deposit_type_id: string | null;
  tax_rate_percent: number | null;
  min_stock: number;
  target_stock: number | null;
}

// Mirrors products_write RLS (DISPOSITION/LAGER, ADMIN always passes) —
// requireRole is defense-in-depth, the database enforces it either way.
export async function createProduct(input: ProductInput): Promise<ProductFormState> {
  const user = await requireRole("DISPOSITION", "LAGER");

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    organization_id: user.organizationId!,
    ...input,
  });

  if (error) {
    return { error: "Artikel konnte nicht angelegt werden." };
  }

  revalidatePath("/products");
  return {};
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ProductFormState> {
  await requireRole("DISPOSITION", "LAGER");

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(input).eq("id", id);

  if (error) {
    return { error: "Artikel konnte nicht gespeichert werden." };
  }

  revalidatePath("/products");
  return {};
}

export async function setProductActive(
  id: string,
  active: boolean,
): Promise<ProductFormState> {
  await requireRole("DISPOSITION", "LAGER");

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ active }).eq("id", id);

  if (error) {
    return { error: "Status konnte nicht geändert werden." };
  }

  revalidatePath("/products");
  return {};
}

// Append-only price history (mirrors product_prices RLS: DISPOSITION/
// BUCHHALTUNG only — LAGER must not see/set EK). Never updates a past
// row — always inserts a new one with a later valid_from.
export async function setProductPrice(
  productId: string,
  purchasePriceCents: number | null,
  salePriceCents: number | null,
): Promise<ProductFormState> {
  const user = await requireRole("DISPOSITION", "BUCHHALTUNG");

  if (purchasePriceCents == null && salePriceCents == null) {
    return { error: "Bitte mindestens einen Preis angeben." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("product_prices").insert({
    organization_id: user.organizationId!,
    product_id: productId,
    purchase_price_cents: purchasePriceCents,
    sale_price_cents: salePriceCents,
    created_by: user.id,
  });

  if (error) {
    return { error: "Preis konnte nicht gespeichert werden." };
  }

  revalidatePath("/products");
  return {};
}
