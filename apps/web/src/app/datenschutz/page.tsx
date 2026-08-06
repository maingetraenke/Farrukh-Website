import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Datenschutz — MainGetränke" };

// TODO(legal): full DSGVO-compliant privacy policy needs legal review
// before go-live — see CLAUDE.md rule 8. This is a placeholder only.
export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutz">
      <p>
        Wir nehmen den Schutz deiner persönlichen Daten ernst. Eine
        vollständige, rechtlich geprüfte Datenschutzerklärung gemäß DSGVO
        folgt in Kürze.
      </p>
      <p>
        Bei Fragen zum Datenschutz erreichst du uns unter{" "}
        <a
          href="mailto:info@maingetraenke.de"
          className="text-primary underline"
        >
          info@maingetraenke.de
        </a>
        .
      </p>
    </LegalPage>
  );
}
