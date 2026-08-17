"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCents } from "@/lib/domain/money";
import type { PaymentMethod } from "@/lib/supabase/types";
import { recordPayment } from "./actions";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Bar",
  CARD: "Karte",
  APPLE_PAY: "Apple Pay",
  GOOGLE_PAY: "Google Pay",
  BANK_TRANSFER: "Überweisung",
  INVOICE: "Rechnung",
};

export function PaymentDialog({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  remainingCents,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber: string;
  remainingCents: number;
}) {
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [amount, setAmount] = useState(() => (remainingCents / 100).toFixed(2));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (next) {
      setMethod("CASH");
      setAmount((remainingCents / 100).toFixed(2));
      setNotes("");
      setError(null);
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    const amountCents = Math.round(Number(amount.replace(",", ".")) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setError("Bitte einen gültigen Betrag angeben.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await recordPayment(invoiceId, method, amountCents, notes || null);
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Zahlung erfassen</DialogTitle>
          <DialogDescription>
            {invoiceNumber} · offen: {formatCents(remainingCents)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Zahlungsart</FieldLabel>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Betrag (€)</FieldLabel>
            <Input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Notiz</FieldLabel>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>

          {error ? <FieldError>{error}</FieldError> : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
