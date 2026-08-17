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
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatCents } from "@/lib/domain/money";
import { setProductPrice } from "./actions";

export function ProductPriceDialog({
  open,
  onOpenChange,
  productId,
  productName,
  currentPurchaseCents,
  currentSaleCents,
  canSeePurchasePrice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  currentPurchaseCents: number | null;
  currentSaleCents: number | null;
  canSeePurchasePrice: boolean;
}) {
  const [purchase, setPurchase] = useState("");
  const [sale, setSale] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (next) {
      setPurchase("");
      setSale("");
      setError(null);
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    const purchaseCents =
      canSeePurchasePrice && purchase.trim() !== ""
        ? Math.round(Number(purchase.replace(",", ".")) * 100)
        : null;
    const saleCents = sale.trim() !== "" ? Math.round(Number(sale.replace(",", ".")) * 100) : null;

    if (
      (purchaseCents != null && !Number.isFinite(purchaseCents)) ||
      (saleCents != null && !Number.isFinite(saleCents))
    ) {
      setError("Bitte gültige Beträge eingeben.");
      return;
    }
    if (purchaseCents == null && saleCents == null) {
      setError("Bitte mindestens einen Preis angeben.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await setProductPrice(productId, purchaseCents, saleCents);
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Neuer Preis</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {canSeePurchasePrice ? (
            <Field>
              <FieldLabel>Einkaufspreis (€ je Kasten)</FieldLabel>
              <Input
                inputMode="decimal"
                placeholder={
                  currentPurchaseCents != null
                    ? `aktuell: ${formatCents(currentPurchaseCents)}`
                    : "noch kein Preis hinterlegt"
                }
                value={purchase}
                onChange={(e) => setPurchase(e.target.value)}
              />
            </Field>
          ) : null}
          <Field>
            <FieldLabel>Verkaufspreis (€ je Kasten, brutto)</FieldLabel>
            <Input
              inputMode="decimal"
              placeholder={
                currentSaleCents != null
                  ? `aktuell: ${formatCents(currentSaleCents)}`
                  : "noch kein Preis hinterlegt"
              }
              value={sale}
              onChange={(e) => setSale(e.target.value)}
            />
            <FieldDescription>
              Leer lassen, um diesen Preis unverändert zu lassen. Ein neuer Preis gilt ab
              sofort — der bisherige Preis bleibt als Historie erhalten.
            </FieldDescription>
          </Field>

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
