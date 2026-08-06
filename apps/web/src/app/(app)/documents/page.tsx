import { Folder } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function DocumentsPage() {
  return (
    <PagePlaceholder
      icon={Folder}
      title="Dokumente"
      description="Rechnungen, Lieferscheine und andere generierte PDFs, versioniert."
      phase="Phase 4"
    />
  );
}
