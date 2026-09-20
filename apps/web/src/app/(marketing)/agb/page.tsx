import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { LegalDraftSection } from "@/components/marketing/legal-draft-section";

export const metadata: Metadata = { title: "AGB — MainGetränke" };

// TODO(legal): every section below is structure + bullet points only —
// no legal text has been authored or copied. Needs a real, anwaltlich
// geprüft text (or an IT-Recht Kanzlei / Trusted Shops template) before
// go-live. See CLAUDE.md rule 8: never invent business/legal text.
export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <p className="text-muted-foreground text-sm">
        Diese Seite zeigt die geplante Abschnittsstruktur unserer AGB. Die
        Inhalte sind noch nicht final und werden vor dem Start am
        14.09.2026 durch einen geprüften Rechtstext ersetzt.
      </p>

      <LegalDraftSection
        title="1. Geltungsbereich"
        points={[
          "Gilt für alle Bestellungen über maingetraenke.de zwischen MainGetränke (Farrukh Butt, Einzelunternehmen) und dem Kunden",
          "Verhältnis zu ggf. abweichenden Bedingungen des Kunden klären (Einbeziehung nur bei ausdrücklicher Zustimmung)",
          "Verbraucher vs. Unternehmer als Kunde unterscheiden, falls relevant",
        ]}
      />

      <LegalDraftSection
        title="2. Vertragsschluss — Bestellanfrage vs. verbindliche Bestellung"
        points={[
          'Klarstellen: Absenden der "Bestellanfrage" im Warenkorb ist unverbindlich, kein Vertragsschluss',
          "Vertrag kommt erst durch Bestätigung von MainGetränke zustande (z. B. Rückmeldung per Telefon/E-Mail)",
          "MainGetränke kann eine Anfrage ablehnen (z. B. außerhalb des Liefergebiets, Artikel nicht verfügbar)",
          "Zeitpunkt/Form der verbindlichen Bestellbestätigung festlegen",
        ]}
      />

      <LegalDraftSection
        title="3. Preise & Zahlung"
        points={[
          "Angegebene Preise sind Endpreise inkl. der jeweils gültigen gesetzlichen MwSt. (aktuell 19 %)",
          "Grundpreisangabe (€/Liter) nach PAngV — bereits auf der Sortimentsseite umgesetzt, rechtlich noch zu prüfen",
          "Zahlungsarten: Barzahlung bei Lieferung oder Kartenzahlung bei Lieferung — kein Vorkasse-/Online-Zahlungsprozess",
          "Pfand wird gesondert ausgewiesen, nicht Teil des Warenpreises",
        ]}
      />

      <LegalDraftSection
        title="4. Lieferung & Liefergebiet"
        points={[
          "Liefergebiet: ca. 20 km Umkreis um Kitzingen — Verhalten bei Anfragen außerhalb des Gebiets festlegen",
          "Liefergebühr: 2,50 € pro Bestellung",
          "Frühestmögliches Lieferdatum: 14.09.2026 (Erste-Kunden-Phase), serverseitig bereits erzwungen",
          "Liefertage/-zeitfenster, sobald final festgelegt, hier ergänzen — nicht erfinden",
          "Vorgehen bei Nichtantreffen des Kunden",
        ]}
      />

      <LegalDraftSection
        title="5. Pfand"
        points={[
          "Pfandpflichtige Artikel und Pfandbeträge werden auf der Produktseite gesondert ausgewiesen",
          "Regelung zur Rückgabe/Erstattung von Leergut festlegen",
          "Verhalten bei fehlendem/beschädigtem Leergut klären",
        ]}
      />

      <LegalDraftSection
        title="6. Eigentumsvorbehalt"
        points={[
          "Standardformulierung: Ware bleibt bis zur vollständigen Bezahlung Eigentum von MainGetränke",
        ]}
      />

      <LegalDraftSection
        title="7. Gewährleistung"
        points={[
          "Gesetzliche Sachmängelhaftung, keine eigenmächtige Verkürzung ohne rechtliche Prüfung",
          "Hinweis auf Mindesthaltbarkeit/Frische bei Getränken ergänzen, falls relevant",
        ]}
      />

      <LegalDraftSection
        title="8. Haftung"
        points={[
          "Haftungsbeschränkung nur im gesetzlich zulässigen Rahmen formulieren",
          "Vorsatz/grobe Fahrlässigkeit, Verletzung von Leben/Körper/Gesundheit: keine Haftungsbeschränkung möglich",
        ]}
      />

      <LegalDraftSection
        title="9. Schlussbestimmungen"
        points={[
          "Anwendbares Recht, Gerichtsstand (soweit gegenüber Verbrauchern zulässig)",
          "Salvatorische Klausel",
          "Änderungsvorbehalt bezüglich der AGB",
        ]}
      />

      <p className="text-sm">
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
