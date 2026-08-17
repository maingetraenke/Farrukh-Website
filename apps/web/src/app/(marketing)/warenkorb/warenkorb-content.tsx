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
import { formatPriceCents } from "@/lib/domain/catalog";
import { EARLIEST_DELIVERY_DATE } from "@/lib/domain/delivery";
import { submitOrderInquiry, type OrderInquiryState } from "@/lib/leads/actions";

const initialState: OrderInquiryState = {};

// Matches organization_settings.default_delivery_fee_cents (see
// CLAUDE.md). The public site is anonymous and has no session to read the
// live setting from, so this mirrors the documented default — an admin
// changing it in settings would need this constant updated too.
const DELIVERY_FEE_CENTS = 250;

export function WarenkorbContent() {
  const { items, totalCases, subtotalCents, updateQuantity, removeItem, clear } = useCart();
  const action = submitOrderInquiry.bind(
    null,
    items.map((item) => ({
      product_id: item.productId,
      name: item.name,
      brand: item.brand,
      gebinde: item.gebinde,
      quantity: item.quantity,
      sale_price_cents: item.salePriceCents,
      deposit_name: item.depositName,
      deposit_amount_cents: item.depositAmountCents,
    })),
  );
  const [state, formAction, pending] = useActionState(action, initialState);

  let depositCents = 0;
  let unresolvedDepositCount = 0;
  for (const item of items) {
    if (item.depositName == null) continue;
    if (item.depositAmountCents == null) {
      unresolvedDepositCount += 1;
      continue;
    }
    depositCents += item.depositAmountCents * item.quantity;
  }
  const totalCents = subtotalCents + depositCents + DELIVERY_FEE_CENTS;

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
        Die angezeigten Preise sind unsere aktuellen Verkaufspreise inkl.
        19&nbsp;% MwSt. Wir bestätigen deine Anfrage inkl. Liefertermin.
      </p>
      <p className="border-border bg-accent text-foreground mt-4 rounded-lg border px-4 py-3 text-sm">
        Bestellungen für den Folgetag und spätere Liefertage müssen bis
        16:00&nbsp;Uhr am Vortag eingegangen sein. Eine Lieferung am selben
        Tag ist nicht möglich. Liefertage Montag–Freitag, 09:00–17:00&nbsp;Uhr.
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
                  {item.salePriceCents != null ? (
                    <span className="text-muted-foreground text-xs">
                      {formatPriceCents(item.salePriceCents)} × {item.quantity} ={" "}
                      {formatPriceCents(item.salePriceCents * item.quantity)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      Preis auf Anfrage
                    </span>
                  )}
                  {item.depositName != null ? (
                    item.depositAmountCents != null ? (
                      <span className="text-muted-foreground text-xs">
                        + Pfand {formatPriceCents(item.depositAmountCents)} ×{" "}
                        {item.quantity} ={" "}
                        {formatPriceCents(item.depositAmountCents * item.quantity)}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700">
                        + Pfand: Betrag noch nicht hinterlegt
                      </span>
                    )
                  ) : null}
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
          <div className="flex flex-col gap-1 px-1 text-sm text-foreground">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Kästen gesamt</span>
              <span className="font-medium">{totalCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Zwischensumme</span>
              <span className="font-medium">{formatPriceCents(subtotalCents)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pfand gesamt</span>
              <span className="font-medium">
                {depositCents > 0 ? formatPriceCents(depositCents) : "—"}
              </span>
            </div>
            {unresolvedDepositCount > 0 ? (
              <p className="text-xs text-amber-700">
                Für {unresolvedDepositCount}{" "}
                {unresolvedDepositCount === 1 ? "Position ist" : "Positionen sind"}{" "}
                der Pfandbetrag noch nicht hinterlegt — siehe Hinweis oben bei
                den betroffenen Artikeln. Dieser Betrag ist in der Summe unten
                noch nicht enthalten.
              </p>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Liefergebühr</span>
              <span className="font-medium">{formatPriceCents(DELIVERY_FEE_CENTS)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-base font-bold">
              <span>Gesamt{unresolvedDepositCount > 0 ? " (vorläufig)" : ""}</span>
              <span>{formatPriceCents(totalCents)}</span>
            </div>
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
            <Input
              id="requestedDate"
              name="requestedDate"
              type="date"
              min={EARLIEST_DELIVERY_DATE}
            />
            <p className="text-muted-foreground text-xs">
              Frühester Liefertermin: 14.09.2026.
            </p>
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
