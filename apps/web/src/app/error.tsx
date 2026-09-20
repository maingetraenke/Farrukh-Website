"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <AlertTriangle className="size-6" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Etwas ist schiefgelaufen
        </h1>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Bitte versuche es erneut. Besteht das Problem weiter, wende dich
          an die Administration.
        </p>
      </div>
      <Button onClick={reset}>Erneut versuchen</Button>
    </div>
  );
}
