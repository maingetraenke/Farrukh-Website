import { Route } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function RoutesPage() {
  return (
    <PagePlaceholder
      icon={Route}
      title="Touren"
      description="Disposition, Stopps, Reihenfolge, Karte und Routing."
      phase="Phase 3"
    />
  );
}
