import { Users } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function CustomersPage() {
  return (
    <PagePlaceholder
      icon={Users}
      title="Kunden"
      description="Privat- und Firmenkunden, Rechnungs-/Lieferadressen, Zahlungsziel, Pfandkonto."
      phase="Phase 2"
    />
  );
}
