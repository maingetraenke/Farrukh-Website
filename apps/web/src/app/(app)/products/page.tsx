import { PackageSearch } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function ProductsPage() {
  return (
    <PagePlaceholder
      icon={PackageSearch}
      title="Produkte"
      description="Artikelstammdaten, Gebinde, Pfand, Preisverlauf, Marge/Rohertrag."
      phase="Phase 2"
    />
  );
}
