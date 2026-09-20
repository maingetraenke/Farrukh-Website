import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { WEIN_SEKT_COMING_SOON } from "@/lib/domain/catalog";
import { SortimentContent } from "./sortiment-content";

export const metadata: Metadata = {
  title: "Sortiment — MainGetränke",
  description:
    "Wasser, Bier, Wein & Sekt, Saft & Nektar und Erfrischungsgetränke — kastenweise, aus Kitzingen und Umgebung.",
};

export default async function SortimentPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("public_products")
    .select("*")
    .order("brand");

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
        <SortimentContent
          products={products}
          weinSektComingSoon={WEIN_SEKT_COMING_SOON}
        />
      )}
    </div>
  );
}
