import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Impressum — MainGetränke" };

// Company data confirmed by the business owner 2026-08-16 — do not change
// without an explicit updated instruction (see CLAUDE.md rule 8: never
// guess business/legal data). Deliberately omitted: Steuernummer (internal
// use only, e.g. on invoices — never published here), USt-IdNr. and
// Wirtschafts-Id. (owner confirmed neither exists), Handelsregister (not
// applicable — Einzelunternehmen, not registered as e.K.).
export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <p>Angaben gemäß § 5 TMG</p>
      <p>
        MainGetränke
        <br />
        Inhaber: Farrukh Butt
        <br />
        Einzelunternehmen
        <br />
        Hindenburgring West 11
        <br />
        97318 Kitzingen
      </p>
      <p>
        Kontakt:
        <br />
        E-Mail: info@maingetraenke.de
        <br />
        Telefon: 0177 8085911
      </p>
      <p>
        Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
        <br />
        Farrukh Butt (Anschrift wie oben)
      </p>
      <p className="text-muted-foreground text-xs italic">
        Rechtlicher Compliance-Check (u. a. Fernabsatz-Informationspflichten,
        Widerrufsrecht, Verpackungsgesetz, Preisangaben) steht noch aus und
        folgt gesondert.
      </p>
    </LegalPage>
  );
}
