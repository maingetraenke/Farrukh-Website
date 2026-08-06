import { ShoppingCart } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function SuppliersPage() {
  return (
    <PagePlaceholder
      icon={ShoppingCart}
      title="Einkauf/Lieferanten"
      description="Lieferantenstammdaten und Einkaufsbestellungen mit Wareneingang."
      phase="Phase 2"
    />
  );
}
