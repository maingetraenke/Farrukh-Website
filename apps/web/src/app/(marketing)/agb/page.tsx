import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "AGB — MainGetränke" };

// TODO(legal): AGB need legal review before go-live — see CLAUDE.md rule 8.
export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <p>
        Unsere Allgemeinen Geschäftsbedingungen werden derzeit
        finalisiert und folgen in Kürze an dieser Stelle.
      </p>
      <p>
        Bei Fragen erreichst du uns unter{" "}
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
