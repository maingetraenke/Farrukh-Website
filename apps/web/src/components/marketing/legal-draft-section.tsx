import { AlertTriangle } from "lucide-react";

// Shared "this section is structure only, not legal advice" block for
// /agb and /widerrufsrecht. Deliberately loud (amber, warning icon) so it
// can't be mistaken for finished copy before a lawyer/IT-Recht template
// fills it in — see CLAUDE.md rule 8 (never invent legal/business text).
export function LegalDraftSection({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <p className="mt-1 mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-amber-700 uppercase">
        <AlertTriangle className="size-3.5" />
        Entwurf — von Anwalt/IT-Recht-Vorlage zu prüfen
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
