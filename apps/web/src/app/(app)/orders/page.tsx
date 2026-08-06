import { ClipboardList } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function OrdersPage() {
  return (
    <PagePlaceholder
      icon={ClipboardList}
      title="Bestellungen"
      description="DRAFT → CONFIRMED → PICKING → READY → ASSIGNED → OUT_FOR_DELIVERY → DELIVERED"
      phase="Phase 2"
    />
  );
}
