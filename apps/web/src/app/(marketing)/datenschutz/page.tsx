import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Datenschutz — MainGetränke" };

// Reflects the actual technical setup as of 2026-08-16 (verified against
// the codebase, not assumed) — see CLAUDE.md rule 8. Full legal review
// (retention periods, DSGVO wording, AVV status with processors) is a
// separate pending compliance audit, not done here; that's flagged at the
// bottom rather than guessed at.
export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutz">
      <h2 className="font-semibold text-foreground">Verantwortlicher</h2>
      <p>
        Farrukh Butt, MainGetränke (Einzelunternehmen)
        <br />
        Hindenburgring West 11, 97318 Kitzingen
        <br />
        E-Mail: info@maingetraenke.de, Telefon: 0177 8085911
      </p>

      <h2 className="font-semibold text-foreground">Hosting</h2>
      <p>
        Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Website
        verarbeitet Vercel technisch notwendige Server-Log-Daten (u. a.
        IP-Adresse, Datum/Uhrzeit, aufgerufene Seite), um die Website
        auszuliefern und den Betrieb sicherzustellen.
      </p>

      <h2 className="font-semibold text-foreground">
        Kontakt- und Bestellanfrage-Formular
      </h2>
      <p>
        Wenn du das Kontaktformular oder die Bestellanfrage im Warenkorb
        nutzt, verarbeiten wir die von dir eingegebenen Daten (Name, E-Mail,
        optional Telefon, bei einer Bestellanfrage zusätzlich Lieferadresse,
        Wunschtermin und die ausgewählten Artikel) ausschließlich, um deine
        Anfrage zu bearbeiten und dich zu kontaktieren. Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahme bzw.
        Vertragsanbahnung). Eine Bestellanfrage ist keine automatisch
        verbindliche Bestellung — wir melden uns zur Bestätigung zurück.
      </p>
      <p>
        Die Daten werden bei unserem Datenbank-Dienstleister Supabase
        (Supabase Inc.) gespeichert.
      </p>

      <h2 className="font-semibold text-foreground">Warenkorb</h2>
      <p>
        Die Artikel in deinem Warenkorb werden ausschließlich lokal in
        deinem Browser gespeichert (Local Storage), nicht auf unseren
        Servern — solange, bis du die Bestellanfrage absendest, den
        Warenkorb leerst oder den Browser-Speicher löschst.
      </p>

      <h2 className="font-semibold text-foreground">Cookies</h2>
      <p>
        Für den öffentlichen Bereich der Website setzen wir keine
        Tracking- oder Analyse-Cookies. Im internen Mitarbeiterbereich
        (Login) werden technisch notwendige Session-Cookies unseres
        Datenbank-/Auth-Dienstleisters Supabase gesetzt, um eine Anmeldung
        aufrechtzuerhalten — diese sind für Website-Besucher ohne Login
        nicht relevant.
      </p>

      <h2 className="font-semibold text-foreground">
        Kein Tracking, kein Newsletter, kein Kundenkonto
      </h2>
      <p>
        Wir setzen keine Analyse- oder Tracking-Tools (z. B. Google
        Analytics) ein, versenden aktuell keinen Newsletter und bieten
        aktuell kein Kundenkonto an.
      </p>

      <h2 className="font-semibold text-foreground">Zahlungsarten</h2>
      <p>
        Aktuell sind Barzahlung bei Lieferung und Kartenzahlung bei
        Lieferung vorgesehen — dabei werden keine Zahlungsdaten über die
        Website an einen Online-Zahlungsdienstleister übertragen.
      </p>

      <h2 className="font-semibold text-foreground">Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung,
        Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch
        bezüglich deiner bei uns gespeicherten Daten. Wende dich dazu an
        info@maingetraenke.de. Außerdem hast du ein Beschwerderecht bei
        einer Datenschutz-Aufsichtsbehörde.
      </p>

      <p className="text-muted-foreground text-xs italic">
        Speicherdauer und weitere rechtliche Prüfung (u. a. AVV mit
        Supabase/Vercel, gesetzliche Aufbewahrungsfristen) stehen im Rahmen
        eines separaten Compliance-Checks noch aus.
      </p>
    </LegalPage>
  );
}
