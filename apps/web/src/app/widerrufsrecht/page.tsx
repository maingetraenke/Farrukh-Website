import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Widerrufsrecht — MainGetränke" };

// TODO(legal): needs legal review before go-live — see CLAUDE.md rule 8.
export default function WiderrufsrechtPage() {
  return (
    <LegalPage title="Widerrufsrecht">
      <p>
        Die Widerrufsbelehrung wird derzeit finalisiert und folgt in
        Kürze an dieser Stelle.
      </p>
      <p>
        Bei Fragen zu einer laufenden Bestellung erreichst du uns unter{" "}
        <a
          href="mailto:info@maingetraenke.de"
          className="text-primary underline"
        >
          info@maingetraenke.de
        </a>{" "}
        oder telefonisch unter 0177 8085911.
      </p>
    </LegalPage>
  );
}
