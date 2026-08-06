import type { Metadata } from "next";
import Image from "next/image";
import { Beer, CupSoda, GlassWater, PackageSearch, Wine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/components/marketing/add-to-cart-button";
import { createClient } from "@/lib/supabase/server";
import { categoryLabels, formatGebinde } from "@/lib/domain/catalog";
import type { ProductCategory } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Sortiment — MainGetränke",
  description:
    "Wasser, Bier, Wein & Sekt, Saft & Schorlen und Softgetränke — kastenweise, aus Kitzingen und Umgebung.",
};

const categoryIcons: Record<ProductCategory, typeof GlassWater> = {
  WASSER: GlassWater,
  BIER: Beer,
  WEIN_SEKT: Wine,
  SAFT_SCHORLEN: CupSoda,
  SOFTDRINKS: CupSoda,
  SONSTIGES: PackageSearch,
};

const categoryOrder: ProductCategory[] = [
  "WASSER",
  "SOFTDRINKS",
  "BIER",
  "WEIN_SEKT",
  "SAFT_SCHORLEN",
  "SONSTIGES",
];

export default async function SortimentPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("public_products")
    .select("*")
    .order("brand");

  const byCategory = new Map<ProductCategory, typeof products>();
  for (const category of categoryOrder) byCategory.set(category, []);
  for (const product of products ?? []) {
    byCategory.get(product.category)?.push(product);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unser Sortiment
        </h1>
        <p className="mt-2 text-muted-foreground">
          Alles kastenweise. Preise erfahrt ihr bei der Bestellanfrage —
          Pfand und Liefergebühr (2,50&nbsp;€) kommen dazu.
        </p>
      </div>

      {!products || products.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">
          Aktuell sind keine Produkte hinterlegt.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-16">
          {categoryOrder.map((category) => {
            const items = byCategory.get(category);
            if (!items || items.length === 0) return null;
            const Icon = categoryIcons[category];
            return (
              <section key={category}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {categoryLabels[category]}
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((product) => (
                    <Card
                      key={product.id}
                      className="shadow-sm transition-shadow hover:shadow-md"
                    >
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.brand}
                          width={400}
                          height={160}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="h-40 w-full bg-white object-contain p-4"
                        />
                      ) : (
                        <div className="flex h-40 w-full shrink-0 items-center justify-center bg-accent">
                          <Icon className="text-primary size-12" />
                        </div>
                      )}
                      <CardContent className="flex flex-col gap-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {product.brand}
                            {product.variant ? ` ${product.variant}` : ""}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {formatGebinde(product)}
                          </span>
                        </div>
                        <AddToCartButton
                          productId={product.id}
                          name={`${product.brand}${product.variant ? ` ${product.variant}` : ""}`}
                          brand={product.brand}
                          gebinde={formatGebinde(product)}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
