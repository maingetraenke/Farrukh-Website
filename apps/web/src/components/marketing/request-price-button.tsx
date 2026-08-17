import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

// Reusable pattern for products without a set sale price: instead of an
// "In den Warenkorb" button that implies an immediate, priced purchase,
// show a clearly distinct "Preis anfragen" action — so a missing price
// reads as an intentional state, not a display bug. Any future product
// left without a sale_price_cents value gets this automatically.
export function RequestPriceButton({
  name,
  gebinde,
}: {
  name: string;
  gebinde: string;
}) {
  const subject = encodeURIComponent(`Preisanfrage: ${name} (${gebinde})`);
  const body = encodeURIComponent(
    `Hallo MainGetränke-Team,\n\nkönnt ihr mir bitte den aktuellen Preis für "${name}" (${gebinde}) nennen?\n\nDanke und viele Grüße`,
  );

  return (
    <Button asChild type="button" variant="outline" size="sm" className="w-full">
      <a href={`mailto:info@maingetraenke.de?subject=${subject}&body=${body}`}>
        <Mail /> Preis anfragen
      </a>
    </Button>
  );
}
