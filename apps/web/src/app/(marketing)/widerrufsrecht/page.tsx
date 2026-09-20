import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { LegalPage } from "@/components/marketing/legal-page";
import { LegalDraftSection } from "@/components/marketing/legal-draft-section";
import { SampleWithdrawalForm } from "@/components/marketing/sample-withdrawal-form";

export const metadata: Metadata = { title: "Widerrufsrecht — MainGetränke" };

// TODO(legal): sections below are structure + bullet points only, no
// legal text authored/copied — see CLAUDE.md rule 8. The Muster-
// Widerrufsformular's field structure is the statutory template
// (Anlage 2 EGBGB), not our own text; see sample-withdrawal-form.tsx.
export default function WiderrufsrechtPage() {
  return (
    <LegalPage title="Widerrufsrecht">
      <p className="text-muted-foreground text-sm">
        Diese Seite zeigt die geplante Struktur unserer Widerrufsbelehrung.
        Die Inhalte sind noch nicht final und werden vor dem Start am
        14.09.2026 durch einen geprüften Rechtstext ersetzt.
      </p>

      <section className="rounded-lg border border-red-300 bg-red-50 p-4">
        <h2 className="inline-flex items-center gap-1.5 font-semibold text-red-800">
          <AlertTriangle className="size-4" />
          Wichtiger Hinweis — vor allem anderen zu klären
        </h2>
        <p className="mt-2 text-sm text-red-900">
          Getränke sind kein Standardfall: Bier/alkoholhaltige Getränke und
          schnell verderbliche Waren (z. B. Säfte) können unter die
          gesetzlichen Ausnahmen vom Widerrufsrecht fallen (§ 312g Abs. 2
          BGB — u. a. versiegelte Waren, die aus Gründen des
          Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet
          sind, bzw. Waren, die schnell verderben können). Ob und für
          welche Produkte das hier zutrifft, ist{" "}
          <strong>nicht 1:1 wie bei normaler Ware</strong> und muss
          anwaltlich geprüft werden, bevor diese Seite live geht — das ist
          keine Standard-Widerrufsbelehrung &bdquo;von der Stange&ldquo;.
        </p>
      </section>

      <LegalDraftSection
        title="Widerrufsrecht"
        points={[
          "Bestehen eines Widerrufsrechts für Verbraucher grundsätzlich festhalten",
          "Klarstellen, für welche der verkauften Warengruppen es gilt bzw. wo Ausnahmen greifen (siehe Hinweis oben)",
        ]}
      />

      <LegalDraftSection
        title="Widerrufsfrist"
        points={[
          "Gesetzliche Regelfrist (grundsätzlich 14 Tage) und Beginn der Frist (i. d. R. Erhalt der Ware) korrekt formulieren",
          "Besonderheiten bei Teillieferungen/mehreren Artikeln prüfen, falls relevant",
        ]}
      />

      <LegalDraftSection
        title="Ausübung des Widerrufs"
        points={[
          "Form der Widerrufserklärung (formlos oder Muster-Widerrufsformular), Kontaktweg (E-Mail/Post) festlegen",
          "Fristwahrung — rechtzeitige Absendung genügt",
        ]}
      />

      <LegalDraftSection
        title="Folgen des Widerrufs"
        points={[
          "Rückerstattung: Frist, Zahlungsweg festlegen",
          "Rücksendekosten: wer trägt sie — abhängig von der Klärung oben (Ausnahmetatbestände/Hygiene bei Getränken)",
          "Wertersatz bei Zustands-/Wertminderung der Ware regeln",
        ]}
      />

      <SampleWithdrawalForm />

      <p className="text-sm">
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
