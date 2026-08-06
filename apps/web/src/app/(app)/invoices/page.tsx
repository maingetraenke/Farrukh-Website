import { FileText } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function InvoicesPage() {
  return (
    <PagePlaceholder
      icon={FileText}
      title="Rechnungen"
      description="MG-R-YYYY-###### · A4-PDF · unveränderlich nach Finalisierung."
      phase="Phase 4"
    />
  );
}
