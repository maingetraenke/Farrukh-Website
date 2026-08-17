"use client";

import { useState } from "react";
import { PackageSearch, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCents } from "@/lib/domain/money";
import type { BottleMaterial, ProductCategory } from "@/lib/supabase/types";
import { setProductActive } from "./actions";
import {
  ProductFormDialog,
  type DepositTypeOption,
  type ProductDialogSeed,
  type SupplierOption,
} from "./product-form-dialog";
import { ProductPriceDialog } from "./product-price-dialog";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  WASSER: "Wasser",
  BIER: "Bier",
  WEIN_SEKT: "Wein & Sekt",
  SAFT_SCHORLEN: "Saftschorlen",
  SAFT_NEKTAR: "Saft & Nektar",
  SOFTDRINKS: "Softdrinks",
  SONSTIGES: "Sonstiges",
};

export interface ProductRow {
  id: string;
  article_number: string;
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
  active: boolean;
  purchase_price_cents: number | null;
  sale_price_cents: number | null;
}

function toSeed(product: ProductRow): ProductDialogSeed {
  return {
    id: product.id,
    article_number: product.article_number,
    ean: product.ean,
    name: product.name,
    brand: product.brand,
    category: product.category,
    variant: product.variant,
    bottles_per_case: product.bottles_per_case,
    bottle_volume_ml: product.bottle_volume_ml,
    bottle_material: product.bottle_material,
    supplier_id: product.supplier_id,
    deposit_type_id: product.deposit_type_id,
    tax_rate_percent: product.tax_rate_percent,
    min_stock: product.min_stock,
    target_stock: product.target_stock,
  };
}

export function ProductsClient({
  products,
  suppliers,
  depositTypes,
  canSeePurchasePrice,
  canEditPrice,
}: {
  products: ProductRow[];
  suppliers: SupplierOption[];
  depositTypes: DepositTypeOption[];
  canSeePurchasePrice: boolean;
  canEditPrice: boolean;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDialogSeed | null>(null);
  const [priceProduct, setPriceProduct] = useState<ProductRow | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: ProductRow) {
    setEditing(toSeed(product));
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Produkte</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Artikelstammdaten, Gebinde, Pfand, Preisverlauf.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus /> Neuer Artikel
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <PackageSearch className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">Noch keine Artikel</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artikel-Nr.</TableHead>
                  <TableHead>Marke / Name</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Gebinde</TableHead>
                  {canSeePurchasePrice ? <TableHead>EK</TableHead> : null}
                  <TableHead>VK</TableHead>
                  <TableHead>MwSt.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() => openEdit(product)}
                  >
                    <TableCell className="font-mono text-xs">
                      {product.article_number}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {product.brand} — {product.name}
                      </div>
                      {product.variant ? (
                        <div className="text-muted-foreground text-xs">{product.variant}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {CATEGORY_LABELS[product.category]}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {product.bottles_per_case}×{product.bottle_volume_ml}ml
                    </TableCell>
                    {canSeePurchasePrice ? (
                      <TableCell className="text-sm">
                        {product.purchase_price_cents != null
                          ? formatCents(product.purchase_price_cents)
                          : "—"}
                      </TableCell>
                    ) : null}
                    <TableCell className="text-sm">
                      {product.sale_price_cents != null
                        ? formatCents(product.sale_price_cents)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {product.tax_rate_percent != null ? `${product.tax_rate_percent}%` : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.active ? "secondary" : "outline"}>
                        {product.active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className="flex justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {canEditPrice ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setPriceProduct(product)}
                          >
                            Preis
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void setProductActive(product.id, !product.active)}
                        >
                          {product.active ? "Deaktivieren" : "Aktivieren"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        suppliers={suppliers}
        depositTypes={depositTypes}
      />

      {priceProduct ? (
        <ProductPriceDialog
          open={priceProduct != null}
          onOpenChange={(open) => {
            if (!open) setPriceProduct(null);
          }}
          productId={priceProduct.id}
          productName={`${priceProduct.brand} — ${priceProduct.name}`}
          currentPurchaseCents={priceProduct.purchase_price_cents}
          currentSaleCents={priceProduct.sale_price_cents}
          canSeePurchasePrice={canSeePurchasePrice}
        />
      ) : null}
    </div>
  );
}
