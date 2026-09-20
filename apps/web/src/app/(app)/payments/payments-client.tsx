"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCents } from "@/lib/domain/money";
import type { PaymentMethod } from "@/lib/supabase/types";
import { PaymentDialog } from "./payment-dialog";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Bar",
  CARD: "Karte",
  APPLE_PAY: "Apple Pay",
  GOOGLE_PAY: "Google Pay",
  BANK_TRANSFER: "Überweisung",
  INVOICE: "Rechnung",
};

export interface InvoicePaymentRow {
  id: string;
  invoice_number: string;
  customer_name: string;
  issued_at: string;
  total_cents: number;
  paid_cents: number;
  last_method: PaymentMethod | null;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(iso));
}

export function PaymentsClient({
  invoices,
  canRecordPayment,
}: {
  invoices: InvoicePaymentRow[];
  canRecordPayment: boolean;
}) {
  const [target, setTarget] = useState<InvoicePaymentRow | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Zahlungen</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bar, Karte, Apple Pay, Google Pay bei Übergabe — je Rechnung erfasst, inkl.
          Teilzahlungen.
        </p>
      </div>

      {invoices.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <CreditCard className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">Noch keine Rechnungen</p>
            <p className="text-muted-foreground max-w-sm text-sm">
              Zahlungen werden pro Rechnung erfasst — sobald eine Bestellanfrage bestätigt
              wird, erscheint sie hier.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rechnung</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Bezahlt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const remaining = invoice.total_cents - invoice.paid_cents;
                  const status =
                    remaining <= 0 ? "PAID" : invoice.paid_cents > 0 ? "PARTIAL" : "OPEN";
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-xs">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>{invoice.customer_name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(invoice.issued_at)}
                      </TableCell>
                      <TableCell className="text-sm">{formatCents(invoice.total_cents)}</TableCell>
                      <TableCell className="text-sm">
                        {formatCents(invoice.paid_cents)}
                        {invoice.last_method ? (
                          <span className="text-muted-foreground">
                            {" "}
                            ({PAYMENT_METHOD_LABELS[invoice.last_method]})
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === "PAID"
                              ? "secondary"
                              : status === "PARTIAL"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {status === "PAID"
                            ? "Bezahlt"
                            : status === "PARTIAL"
                              ? "Teilweise"
                              : "Offen"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {canRecordPayment && remaining > 0 ? (
                          <Button type="button" size="sm" variant="outline" onClick={() => setTarget(invoice)}>
                            Zahlung erfassen
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {target ? (
        <PaymentDialog
          open={target != null}
          onOpenChange={(open) => {
            if (!open) setTarget(null);
          }}
          invoiceId={target.id}
          invoiceNumber={target.invoice_number}
          remainingCents={target.total_cents - target.paid_cents}
        />
      ) : null}
    </div>
  );
}
