import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Impressum — MainGetränke" };

// TODO(legal): fill in the fields German law requires (§ 5 TMG) once
// confirmed — legal form, Handelsregister, Geschäftsführer, USt-IdNr.
// Do not guess these; see CLAUDE.md rule 8.
export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <p>Angaben gemäß § 5 TMG</p>
      <p>
        MainGetränke
        <br />
        Kitzingen &amp; Umgebung
      </p>
      <p>
        Kontakt:
        <br />
        E-Mail: info@maingetraenke.de
        <br />
        Telefon: 0177 8085911
      </p>
      <p className="text-muted-foreground italic">
        Weitere Pflichtangaben (Rechtsform, vollständige Anschrift,
        Handelsregister, ggf. Umsatzsteuer-Identifikationsnummer,
        verantwortliche Person nach § 18 Abs. 2 MStV) werden ergänzt,
        sobald sie final feststehen.
      </p>
    </LegalPage>
  );
}
