"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BottleMaterial, ProductCategory } from "@/lib/supabase/types";
import type { ProductInput } from "./actions";
import { createProduct, updateProduct } from "./actions";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  WASSER: "Wasser",
  BIER: "Bier",
  WEIN_SEKT: "Wein & Sekt",
  SAFT_SCHORLEN: "Saftschorlen",
  SAFT_NEKTAR: "Saft & Nektar",
  SOFTDRINKS: "Softdrinks",
  SONSTIGES: "Sonstiges",
};

const MATERIAL_LABELS: Record<BottleMaterial, string> = {
  GLASS: "Glas",
  PET: "PET",
  KARTON: "Karton",
};

export interface SupplierOption {
  id: string;
  name: string;
}

export interface DepositTypeOption {
  id: string;
  name: string;
  amount_cents: number | null;
}

export interface ProductDialogSeed extends ProductInput {
  id: string;
  article_number: string;
}

function emptyInput(): ProductInput {
  return {
    ean: null,
    name: "",
    brand: "",
    category: "SONSTIGES",
    variant: null,
    bottles_per_case: 12,
    bottle_volume_ml: 500,
    bottle_material: "GLASS",
    supplier_id: null,
    deposit_type_id: null,
    tax_rate_percent: null,
    min_stock: 0,
    target_stock: null,
  };
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  suppliers,
  depositTypes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDialogSeed | null;
  suppliers: SupplierOption[];
  depositTypes: DepositTypeOption[];
}) {
  const [form, setForm] = useState<ProductInput>(product ?? emptyInput());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleOpenChange(next: boolean) {
    if (next) {
      setForm(product ?? emptyInput());
      setError(null);
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.brand.trim()) {
      setError("Name und Marke sind erforderlich.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, form)
        : await createProduct(form);
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Artikel bearbeiten" : "Neuer Artikel"}</DialogTitle>
          <DialogDescription>
            {product
              ? `Artikelnummer ${product.article_number}`
              : "Die Artikelnummer wird automatisch vergeben."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Marke *</FieldLabel>
              <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
            </Field>
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Variante</FieldLabel>
              <Input
                value={form.variant ?? ""}
                onChange={(e) => set("variant", e.target.value || null)}
              />
            </Field>
            <Field>
              <FieldLabel>EAN</FieldLabel>
              <Input
                value={form.ean ?? ""}
                onChange={(e) => set("ean", e.target.value || null)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Kategorie</FieldLabel>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v as ProductCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field>
              <FieldLabel>Flaschen/Kasten</FieldLabel>
              <Input
                type="number"
                min={1}
                value={form.bottles_per_case}
                onChange={(e) => set("bottles_per_case", Number(e.target.value))}
              />
            </Field>
            <Field>
              <FieldLabel>Volumen (ml)</FieldLabel>
              <Input
                type="number"
                min={1}
                value={form.bottle_volume_ml}
                onChange={(e) => set("bottle_volume_ml", Number(e.target.value))}
              />
            </Field>
            <Field>
              <FieldLabel>Material</FieldLabel>
              <Select
                value={form.bottle_material}
                onValueChange={(v) => set("bottle_material", v as BottleMaterial)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MATERIAL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel>Lieferant</FieldLabel>
            <Select
              value={form.supplier_id ?? "__none"}
              onValueChange={(v) => set("supplier_id", v === "__none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Keine Angabe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">Keine Angabe</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Pfand</FieldLabel>
            <Select
              value={form.deposit_type_id ?? "__none"}
              onValueChange={(v) => set("deposit_type_id", v === "__none" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kein Pfand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">Kein Pfand</SelectItem>
                {depositTypes.map((depositType) => (
                  <SelectItem key={depositType.id} value={depositType.id}>
                    {depositType.name}
                    {depositType.amount_cents == null ? " (Betrag fehlt)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field>
              <FieldLabel>MwSt.-Satz (%)</FieldLabel>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.tax_rate_percent ?? ""}
                onChange={(e) =>
                  set(
                    "tax_rate_percent",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </Field>
            <Field>
              <FieldLabel>Mindestbestand</FieldLabel>
              <Input
                type="number"
                min={0}
                value={form.min_stock}
                onChange={(e) => set("min_stock", Number(e.target.value))}
              />
            </Field>
            <Field>
              <FieldLabel>Zielbestand</FieldLabel>
              <Input
                type="number"
                min={0}
                value={form.target_stock ?? ""}
                onChange={(e) =>
                  set("target_stock", e.target.value === "" ? null : Number(e.target.value))
                }
              />
            </Field>
          </div>

          {error ? <FieldError>{error}</FieldError> : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
