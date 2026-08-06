import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function ReportsPage() {
  return (
    <PagePlaceholder
      icon={BarChart3}
      title="Auswertungen"
      description="Umsatz, Rohertrag, Top-Produkte/Kunden, Forderungen, Lagerwert."
      phase="Phase 4"
    />
  );
}
