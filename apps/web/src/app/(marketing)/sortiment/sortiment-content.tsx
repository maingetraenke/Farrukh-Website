"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Beer, CupSoda, GlassWater, Grape, PackageSearch, Search, Wine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddToCartButton } from "@/components/marketing/add-to-cart-button";
import { RequestPriceButton } from "@/components/marketing/request-price-button";
import {
  categoryLabels,
  formatGebinde,
  formatPriceCents,
  formatUnitPricePerLiter,
} from "@/lib/domain/catalog";
import type { Database, ProductCategory } from "@/lib/supabase/types";

type PublicProduct = Database["public"]["Views"]["public_products"]["Row"];

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

// Quick-jump chips — only the four categories that actually have stock.
// Wein & Sekt (coming soon) and Sonstiges are still reachable by
// scrolling, just not worth a dedicated chip.
const jumpCategories: ProductCategory[] = ["WASSER", "SAFT_NEKTAR", "SOFTDRINKS", "BIER"];

export function SortimentContent({
  products,
  weinSektComingSoon,
}: {
  products: PublicProduct[];
  weinSektComingSoon: boolean;
}) {
  const [search, setSearch] = useState("");

  const byCategory = useMemo(() => {
    const map = new Map<ProductCategory, PublicProduct[]>();
    for (const category of categoryOrder) map.set(category, []);
    const query = search.trim().toLowerCase();
    for (const product of products) {
      // Wein & Sekt has no real products — its section is a fixed
      // "coming soon" notice, not something a text search should hide.
      if (product.category === "WEIN_SEKT") continue;
      const haystack = `${product.brand} ${product.variant ?? ""} ${product.name}`.toLowerCase();
      if (query && !haystack.includes(query)) continue;
      map.get(product.category)?.push(product);
    }
    return map;
  }, [products, search]);

  const hasAnyResults = categoryOrder.some(
    (category) => (byCategory.get(category)?.length ?? 0) > 0,
  );

  return (
    <>
      <div className="mx-auto mt-8 max-w-md">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Produkt suchen …"
            aria-label="Produkt suchen"
            className="pl-9"
          />
        </div>
      </div>

      <div className="sticky top-[148px] z-20 -mx-4 mt-6 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:mx-0 md:px-0">
        {jumpCategories.map((category) => (
          <a
            key={category}
            href={`#category-${category}`}
            className="shrink-0 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {categoryLabels[category]}
          </a>
        ))}
      </div>

      {!hasAnyResults && !weinSektComingSoon ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">
          Keine Produkte gefunden{search ? ` für „${search}“` : ""}.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-16">
          {!hasAnyResults && search ? (
            <p className="text-muted-foreground text-center text-sm">
              Keine Produkte gefunden für „{search}“.
            </p>
          ) : null}
          {categoryOrder.map((category) => {
            const items = byCategory.get(category);
            const isEmpty = !items || items.length === 0;
            const showComingSoon =
              isEmpty && category === "WEIN_SEKT" && weinSektComingSoon;
            if (isEmpty && !showComingSoon) return null;
            const Icon = categoryIcons[category];
            return (
              <section
                key={category}
                id={`category-${category}`}
                className="scroll-mt-[210px]"
              >
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
                      <Link
                        href="/#kontakt"
                        className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Kontakt aufnehmen
                      </Link>
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
                          {product.sale_price_cents != null ? (
                            <AddToCartButton
                              productId={product.id}
                              name={`${product.brand}${product.variant ? ` ${product.variant}` : ""}`}
                              brand={product.brand}
                              gebinde={formatGebinde(product)}
                              salePriceCents={product.sale_price_cents}
                              depositName={product.deposit_name}
                              depositAmountCents={product.deposit_amount_cents}
                            />
                          ) : (
                            <RequestPriceButton
                              name={`${product.brand}${product.variant ? ` ${product.variant}` : ""}`}
                              gebinde={formatGebinde(product)}
                            />
                          )}
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
    </>
  );
}
