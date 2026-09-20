"use client";

import { useState, useTransition } from "react";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resendInvoiceEmail } from "./actions";

export function ResendEmailButton({ invoiceId }: { invoiceId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await resendInvoiceEmail(invoiceId);
            if (result.error) setError(result.error);
          });
        }}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <RotateCw />}
        Erneut senden
      </Button>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
