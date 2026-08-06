import { Truck } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function FleetPage() {
  return (
    <PagePlaceholder
      icon={Truck}
      title="Fahrer/Fahrzeuge"
      description="Fahrzeugkapazität, aktive Fahrer und mobile Fahreransicht."
      phase="Phase 3"
    />
  );
}
