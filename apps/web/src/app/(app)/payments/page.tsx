import { CreditCard } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function PaymentsPage() {
  return (
    <PagePlaceholder
      icon={CreditCard}
      title="Zahlungen"
      description="Bar, Karte, Apple Pay, Google Pay, Überweisung/Rechnung — inkl. Teilzahlungen."
      phase="Phase 3"
    />
  );
}
