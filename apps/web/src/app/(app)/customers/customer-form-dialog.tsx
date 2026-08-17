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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerType, PaymentMethod } from "@/lib/supabase/types";
import type { CustomerInput } from "./actions";
import { createCustomer, updateCustomer } from "./actions";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Bar",
  CARD: "Karte",
  APPLE_PAY: "Apple Pay",
  GOOGLE_PAY: "Google Pay",
  BANK_TRANSFER: "Überweisung",
  INVOICE: "Rechnung",
};

function emptyInput(): CustomerInput {
  return {
    customer_type: "PRIVATE",
    company_name: null,
    first_name: null,
    last_name: null,
    billing_street: null,
    billing_postal_code: null,
    billing_city: null,
    phone: null,
    email: null,
    preferred_payment_method: null,
    payment_terms_days: null,
    vat_id: null,
    delivery_notes: null,
    notes: null,
  };
}

export interface CustomerDialogSeed extends CustomerInput {
  id: string;
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerDialogSeed | null;
}) {
  const [form, setForm] = useState<CustomerInput>(customer ?? emptyInput());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof CustomerInput>(key: K, value: CustomerInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleOpenChange(next: boolean) {
    if (next) {
      setForm(customer ?? emptyInput());
      setError(null);
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = customer
        ? await updateCustomer(customer.id, form)
        : await createCustomer(form);
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{customer ? "Kunde bearbeiten" : "Neuer Kunde"}</DialogTitle>
          <DialogDescription>
            {customer
              ? `Kundennummer wird beibehalten.`
              : "Die Kundennummer wird automatisch vergeben."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Kundentyp</FieldLabel>
            <Select
              value={form.customer_type}
              onValueChange={(v) => set("customer_type", v as CustomerType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE">Privatkunde</SelectItem>
                <SelectItem value="COMPANY">Firmenkunde</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {form.customer_type === "COMPANY" ? (
            <Field>
              <FieldLabel>Firmenname</FieldLabel>
              <Input
                value={form.company_name ?? ""}
                onChange={(e) => set("company_name", e.target.value || null)}
              />
            </Field>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Vorname</FieldLabel>
              <Input
                value={form.first_name ?? ""}
                onChange={(e) => set("first_name", e.target.value || null)}
              />
            </Field>
            <Field>
              <FieldLabel>
                Nachname{form.customer_type === "PRIVATE" ? " *" : ""}
              </FieldLabel>
              <Input
                value={form.last_name ?? ""}
                onChange={(e) => set("last_name", e.target.value || null)}
              />
            </Field>
          </div>

          {form.customer_type === "COMPANY" ? (
            <Field>
              <FieldLabel>USt-IdNr.</FieldLabel>
              <Input
                value={form.vat_id ?? ""}
                onChange={(e) => set("vat_id", e.target.value || null)}
              />
            </Field>
          ) : null}

          <Field>
            <FieldLabel>Straße + Hausnummer</FieldLabel>
            <Input
              value={form.billing_street ?? ""}
              onChange={(e) => set("billing_street", e.target.value || null)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>PLZ</FieldLabel>
              <Input
                value={form.billing_postal_code ?? ""}
                onChange={(e) => set("billing_postal_code", e.target.value || null)}
              />
            </Field>
            <Field>
              <FieldLabel>Ort</FieldLabel>
              <Input
                value={form.billing_city ?? ""}
                onChange={(e) => set("billing_city", e.target.value || null)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Telefon</FieldLabel>
              <Input
                value={form.phone ?? ""}
                onChange={(e) => set("phone", e.target.value || null)}
              />
            </Field>
            <Field>
              <FieldLabel>E-Mail</FieldLabel>
              <Input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => set("email", e.target.value || null)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Bevorzugte Zahlungsart</FieldLabel>
            <Select
              value={form.preferred_payment_method ?? "__none"}
              onValueChange={(v) =>
                set(
                  "preferred_payment_method",
                  v === "__none" ? null : (v as PaymentMethod),
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Keine Angabe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">Keine Angabe</SelectItem>
                {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {form.preferred_payment_method === "INVOICE" ? (
            <Field>
              <FieldLabel>Zahlungsziel (Tage)</FieldLabel>
              <Input
                type="number"
                min={0}
                value={form.payment_terms_days ?? ""}
                onChange={(e) =>
                  set(
                    "payment_terms_days",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </Field>
          ) : null}

          <Field>
            <FieldLabel>Lieferhinweise</FieldLabel>
            <Textarea
              rows={2}
              value={form.delivery_notes ?? ""}
              onChange={(e) => set("delivery_notes", e.target.value || null)}
            />
          </Field>
          <Field>
            <FieldLabel>Interne Notizen</FieldLabel>
            <Textarea
              rows={2}
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value || null)}
            />
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
