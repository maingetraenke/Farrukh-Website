import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Beer, CupSoda, GlassWater, Grape, PackageSearch, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/components/marketing/add-to-cart-button";
import { createClient } from "@/lib/supabase/server";
import {
  WEIN_SEKT_COMING_SOON,
  categoryLabels,
  formatGebinde,
  formatPriceCents,
  formatUnitPricePerLiter,
} from "@/lib/domain/catalog";
import type { ProductCategory } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Sortiment — MainGetränke",
  description:
    "Wasser, Bier, Wein & Sekt, Saft & Nektar und Erfrischungsgetränke — kastenweise, aus Kitzingen und Umgebung.",
};

const categoryIcons: Record<ProductCategory, typeof GlassWater> = {
  WASSER: GlassWater,
  BIER: Beer,
  WEIN_SEKT: Wine,
  SAFT_SCHORLEN: CupSoda,
  SAFT_NEKTAR: Grape,
  SOFTDRINKS: CupSoda,
  SONSTIGES: PackageSearch,
};

const categoryOrder: ProductCategory[] = [
  "WASSER",
  "SAFT_NEKTAR",
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
          Alles kastenweise, Preise inkl. 19&nbsp;% MwSt. Pfand (sofern
          zutreffend) und Liefergebühr (2,50&nbsp;€ pro Bestellung) kommen
          separat dazu.
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
            const isEmpty = !items || items.length === 0;
            // Wein & Sekt has no products yet — see WEIN_SEKT_COMING_SOON
            // in lib/domain/catalog.ts for the toggle between showing a
            // placeholder here vs. hiding the category entirely.
            const showComingSoon =
              isEmpty && category === "WEIN_SEKT" && WEIN_SEKT_COMING_SOON;
            if (isEmpty && !showComingSoon) return null;
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
                {showComingSoon ? (
                  <Card className="border-dashed shadow-none">
                    <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                        <Icon className="size-6" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Sortiment folgt in Kürze
                      </p>
                      <p className="text-muted-foreground max-w-sm text-sm">
                        Wein &amp; Sekt nehmen wir bald in unser Sortiment auf.
                        Du hast einen konkreten Wunsch? Sprich uns gerne an.
                      </p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href="/#kontakt">Kontakt aufnehmen</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(items ?? []).map((product) => (
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
                        <div className="flex flex-col">
                          {product.sale_price_cents != null ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold text-foreground">
                                {formatPriceCents(product.sale_price_cents)}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                (
                                {formatUnitPricePerLiter({
                                  sale_price_cents: product.sale_price_cents,
                                  bottles_per_case: product.bottles_per_case,
                                  bottle_volume_ml: product.bottle_volume_ml,
                                })}
                                )
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Preis auf Anfrage
                            </span>
                          )}
                          {product.deposit_name ? (
                            <span className="text-muted-foreground text-xs">
                              zzgl. Pfand
                              {product.deposit_amount_cents != null
                                ? ` (${formatPriceCents(product.deposit_amount_cents)})`
                                : ""}
                            </span>
                          ) : null}
                        </div>
                        <AddToCartButton
                          productId={product.id}
                          name={`${product.brand}${product.variant ? ` ${product.variant}` : ""}`}
                          brand={product.brand}
                          gebinde={formatGebinde(product)}
                          salePriceCents={product.sale_price_cents}
                          depositName={product.deposit_name}
                          depositAmountCents={product.deposit_amount_cents}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
