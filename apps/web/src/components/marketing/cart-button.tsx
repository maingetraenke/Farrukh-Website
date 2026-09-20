"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart/cart-context";

export function CartButton() {
  const [open, setOpen] = useState(false);
  const { items, totalCases, updateQuantity, removeItem } = useCart();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
        aria-label="Warenkorb öffnen"
      >
        <ShoppingCart />
        {totalCases > 0 ? (
          <Badge className="absolute -top-2 -right-2 h-5 min-w-5 justify-center rounded-full px-1 text-[11px]">
            {totalCases}
          </Badge>
        ) : null}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Warenkorb</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
              <ShoppingCart className="text-muted-foreground size-8" />
              <p className="text-muted-foreground text-sm">
                Dein Warenkorb ist leer.
              </p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.gebinde}
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
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
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Menge erhöhen"
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(item.productId)}
                    aria-label="Entfernen"
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <SheetFooter>
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-muted-foreground">Kästen gesamt</span>
              <span>{totalCases}</span>
            </div>
            <Button
              asChild
              disabled={items.length === 0}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <Link href="/warenkorb">Zur Bestellanfrage</Link>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
