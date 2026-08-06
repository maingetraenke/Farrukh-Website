"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart/cart-context";
import { submitOrderInquiry, type OrderInquiryState } from "@/lib/leads/actions";

const initialState: OrderInquiryState = {};

export function WarenkorbContent() {
  const { items, totalCases, updateQuantity, removeItem, clear } = useCart();
  const action = submitOrderInquiry.bind(
    null,
    items.map((item) => ({
      product_id: item.productId,
      name: item.name,
      brand: item.brand,
      gebinde: item.gebinde,
      quantity: item.quantity,
    })),
  );
  const [state, formAction, pending] = useActionState(action, initialState);

  // Clear the cart once the inquiry is safely stored server-side, not
  // before — items are still shown/editable while pending or on error.
  useEffect(() => {
    if (state?.success) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  if (state?.success) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center md:px-6">
        <CheckCircle2 className="size-12 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          Danke für deine Bestellanfrage!
        </h1>
        <p className="text-muted-foreground">
          Wir melden uns zeitnah bei dir, um die Bestellung zu bestätigen —
          inklusive Preisen, Pfand und Liefertermin.
        </p>
        <Button asChild className="mt-2">
          <Link href="/sortiment">Weiter einkaufen</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center md:px-6">
        <ShoppingCart className="text-muted-foreground size-12" />
        <h1 className="text-2xl font-bold text-foreground">
          Dein Warenkorb ist leer
        </h1>
        <p className="text-muted-foreground">
          Schau dich in unserem Sortiment um und leg los.
        </p>
        <Button asChild className="mt-2">
          <Link href="/sortiment">Zum Sortiment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Warenkorb &amp; Bestellanfrage
      </h1>
      <p className="text-muted-foreground mt-2">
        Kein verbindlicher Preis an dieser Stelle — wir melden uns mit
        Preisen, Pfand und einem Liefertermin zurück.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.productId} className="shadow-sm">
              <CardContent className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {item.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {item.gebinde}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-lg border border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      aria-label="Menge verringern"
                    >
                      <Minus />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      aria-label="Menge erhöhen"
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(item.productId)}
                    aria-label="Entfernen"
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center justify-between px-1 text-sm font-medium text-foreground">
            <span>Kästen gesamt</span>
            <span>{totalCases}</span>
          </div>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="customerName">Name</Label>
            <Input id="customerName" name="customerName" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Telefon (optional)</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-2">
              <Label htmlFor="deliveryStreet">Lieferadresse — Straße, Nr.</Label>
              <Input id="deliveryStreet" name="deliveryStreet" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deliveryPostalCode">PLZ</Label>
              <Input id="deliveryPostalCode" name="deliveryPostalCode" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deliveryCity">Ort</Label>
              <Input id="deliveryCity" name="deliveryCity" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="requestedDate">Wunschtermin (optional)</Label>
            <Input id="requestedDate" name="requestedDate" type="date" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Anmerkungen (optional)</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>
          {state?.error ? (
            <p className="text-destructive text-sm" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending} size="lg" className="h-11">
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Bestellanfrage absenden
          </Button>
        </form>
      </div>
    </div>
  );
}
