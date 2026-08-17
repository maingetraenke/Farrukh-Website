// The field structure/wording below is the statutory Muster-
// Widerrufsformular (Anlage 2 zu Art. 246a § 1 Abs. 2 S. 1 Nr. 1 und Abs.
// 2 EGBGB) — a prescribed legal template, not text we're authoring. Only
// the company contact block (already-confirmed business data, see
// CLAUDE.md) is filled in. Whether/how this applies to this business's
// specific goods (see the exceptions note on the Widerrufsrecht page)
// still needs legal sign-off before go-live.
export function SampleWithdrawalForm() {
  return (
    <section className="rounded-lg border border-border bg-white p-4">
      <h2 className="font-semibold text-foreground">
        Muster-Widerrufsformular
      </h2>
      <p className="text-muted-foreground mt-1 text-xs italic">
        (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte
        dieses Formular aus und senden Sie es zurück.)
      </p>
      <div className="mt-3 flex flex-col gap-2 text-sm text-foreground/80">
        <p>
          An:
          <br />
          MainGetränke, Farrukh Butt
          <br />
          Hindenburgring West 11
          <br />
          97318 Kitzingen
          <br />
          E-Mail: info@maingetraenke.de
        </p>
        <p>
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
          abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)
        </p>
        <p>Bestellt am (*) / erhalten am (*):</p>
        <p>Name des/der Verbraucher(s):</p>
        <p>Anschrift des/der Verbraucher(s):</p>
        <p>
          Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf
          Papier):
        </p>
        <p>Datum:</p>
        <p className="text-muted-foreground text-xs">
          (*) Unzutreffendes streichen.
        </p>
      </div>
    </section>
  );
}
