import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { ProductsClient, type ProductRow } from "./products-client";

export default async function ProductsPage() {
  const user = await requireRole("DISPOSITION", "LAGER", "BUCHHALTUNG");
  const supabase = await createClient();

  const canSeePurchasePrice = user.role === "DISPOSITION" || user.role === "BUCHHALTUNG";
  const canEditPrice = canSeePurchasePrice;

  const [{ data: products }, { data: prices }, { data: suppliers }, { data: depositTypes }] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          "id, article_number, ean, name, brand, category, variant, bottles_per_case, bottle_volume_ml, bottle_material, supplier_id, deposit_type_id, tax_rate_percent, min_stock, target_stock, active",
        )
        .eq("organization_id", user.organizationId!)
        .order("article_number", { ascending: false }),
      supabase
        .from("product_prices")
        .select("product_id, purchase_price_cents, sale_price_cents, valid_from")
        .eq("organization_id", user.organizationId!)
        .order("valid_from", { ascending: false }),
      supabase
        .from("suppliers")
        .select("id, name")
        .eq("organization_id", user.organizationId!)
        .order("name"),
      supabase
        .from("deposit_types")
        .select("id, name, amount_cents")
        .eq("organization_id", user.organizationId!)
        .order("name"),
    ]);

  // Latest price per product — product_prices is append-only, so the
  // first row per product_id in valid_from-descending order is current.
  const latestPriceByProduct = new Map<
    string,
    { purchase_price_cents: number | null; sale_price_cents: number | null }
  >();
  for (const price of prices ?? []) {
    if (!latestPriceByProduct.has(price.product_id)) {
      latestPriceByProduct.set(price.product_id, {
        purchase_price_cents: price.purchase_price_cents,
        sale_price_cents: price.sale_price_cents,
      });
    }
  }

  const rows: ProductRow[] = (products ?? []).map((product) => ({
    ...product,
    purchase_price_cents: latestPriceByProduct.get(product.id)?.purchase_price_cents ?? null,
    sale_price_cents: latestPriceByProduct.get(product.id)?.sale_price_cents ?? null,
  }));

  return (
    <ProductsClient
      products={rows}
      suppliers={suppliers ?? []}
      depositTypes={depositTypes ?? []}
      canSeePurchasePrice={canSeePurchasePrice}
      canEditPrice={canEditPrice}
    />
  );
}
