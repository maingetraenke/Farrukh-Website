import { UserCog } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function UsersPage() {
  return (
    <PagePlaceholder
      icon={UserCog}
      title="Benutzer"
      description="Rollenverwaltung: ADMIN, DISPOSITION, LAGER, FAHRER, BUCHHALTUNG."
      phase="Phase 2"
    />
  );
}
