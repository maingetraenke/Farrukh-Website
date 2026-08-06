import { Recycle } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function DepositsPage() {
  return (
    <PagePlaceholder
      icon={Recycle}
      title="Leergut/Pfand"
      description="Pfand-Ledger, Ausgabe und Gutschrift, Saldo pro Kunde."
      phase="Phase 3"
    />
  );
}
