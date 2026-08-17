"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
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
import type { CustomerType, PaymentMethod } from "@/lib/supabase/types";
import { setCustomerActive } from "./actions";
import { CustomerFormDialog, type CustomerDialogSeed } from "./customer-form-dialog";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Bar",
  CARD: "Karte",
  APPLE_PAY: "Apple Pay",
  GOOGLE_PAY: "Google Pay",
  BANK_TRANSFER: "Überweisung",
  INVOICE: "Rechnung",
};

export interface CustomerRow {
  id: string;
  customer_number: string;
  customer_type: CustomerType;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  billing_postal_code: string | null;
  billing_city: string | null;
  phone: string | null;
  email: string | null;
  preferred_payment_method: PaymentMethod | null;
  payment_terms_days: number | null;
  vat_id: string | null;
  billing_street: string | null;
  delivery_notes: string | null;
  notes: string | null;
  active: boolean;
}

function displayName(customer: CustomerRow): string {
  if (customer.customer_type === "COMPANY") {
    return customer.company_name ?? "—";
  }
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "—";
}

function toSeed(customer: CustomerRow): CustomerDialogSeed {
  return {
    id: customer.id,
    customer_type: customer.customer_type,
    company_name: customer.company_name,
    first_name: customer.first_name,
    last_name: customer.last_name,
    billing_street: customer.billing_street,
    billing_postal_code: customer.billing_postal_code,
    billing_city: customer.billing_city,
    phone: customer.phone,
    email: customer.email,
    preferred_payment_method: customer.preferred_payment_method,
    payment_terms_days: customer.payment_terms_days,
    vat_id: customer.vat_id,
    delivery_notes: customer.delivery_notes,
    notes: customer.notes,
  };
}

export function CustomersClient({ customers }: { customers: CustomerRow[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerDialogSeed | null>(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(customer: CustomerRow) {
    setEditing(toSeed(customer));
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Kunden</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Privat- und Firmenkunden, Rechnungsadressen, Zahlungsart.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus /> Neuer Kunde
        </Button>
      </div>

      {customers.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Users className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">Noch keine Kunden</p>
            <p className="text-muted-foreground max-w-sm text-sm">
              Lege den ersten Kunden an, um ihn Bestellungen zuordnen zu können.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nummer</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Ort</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Zahlungsart</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer"
                    onClick={() => openEdit(customer)}
                  >
                    <TableCell className="font-mono text-xs">
                      {customer.customer_number}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {displayName(customer)}
                      </div>
                      {customer.customer_type === "COMPANY" ? (
                        <div className="text-muted-foreground text-xs">Firmenkunde</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {[customer.billing_postal_code, customer.billing_city]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {customer.phone || customer.email || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {customer.preferred_payment_method
                        ? PAYMENT_METHOD_LABELS[customer.preferred_payment_method]
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.active ? "secondary" : "outline"}>
                        {customer.active ? "Aktiv" : "Archiviert"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          void setCustomerActive(customer.id, !customer.active);
                        }}
                      >
                        {customer.active ? "Archivieren" : "Reaktivieren"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <CustomerFormDialog open={dialogOpen} onOpenChange={setDialogOpen} customer={editing} />
    </div>
  );
}
