import type { Metadata } from "next";
import { WarenkorbContent } from "./warenkorb-content";

export const metadata: Metadata = {
  title: "Warenkorb — MainGetränke",
  description: "Warenkorb ansehen und Bestellanfrage absenden.",
};

export default function WarenkorbPage() {
  return <WarenkorbContent />;
}
