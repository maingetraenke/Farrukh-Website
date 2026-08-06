import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PagePlaceholder({
  icon: Icon,
  title,
  description,
  phase,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      <Card className="border-dashed shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Icon className="size-6" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Noch nicht implementiert
          </p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Dieser Bereich folgt in {phase} gemäß Implementierungsplan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
