import { Warehouse } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function InventoryPage() {
  return (
    <PagePlaceholder
      icon={Warehouse}
      title="Lager"
      description="Bestand, reserviert, verfügbar, Wareneingang und Lagerbewegungen."
      phase="Phase 2"
    />
  );
}
