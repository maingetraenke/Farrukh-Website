"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";

export function AddToCartButton({
  productId,
  name,
  brand,
  gebinde,
  salePriceCents,
  depositName,
  depositAmountCents,
}: {
  productId: string;
  name: string;
  brand: string;
  gebinde: string;
  salePriceCents: number | null;
  depositName: string | null;
  depositAmountCents: number | null;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg border border-border">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Menge verringern"
        >
          <Minus />
        </Button>
        <span className="w-5 text-center text-sm font-medium">{quantity}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setQuantity((q) => q + 1)}
          aria-label="Menge erhöhen"
        >
          <Plus />
        </Button>
      </div>
      <Button
        type="button"
        size="sm"
        className="flex-1"
        onClick={() => {
          addItem(
            { productId, name, brand, gebinde, salePriceCents, depositName, depositAmountCents },
            quantity,
          );
          setQuantity(1);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
      >
        {added ? (
          <>
            <Check /> Hinzugefügt
          </>
        ) : (
          "In den Warenkorb"
        )}
      </Button>
    </div>
  );
}
