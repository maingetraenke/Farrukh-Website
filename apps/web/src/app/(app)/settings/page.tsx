import { Settings } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Einstellungen"
      description="Firmendaten, Bankdaten, Steuerdaten, Liefergebühr, Nummernkreise."
      phase="Phase 2"
    />
  );
}
