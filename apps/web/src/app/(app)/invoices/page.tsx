import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatCents } from "@/lib/domain/money";
import { ResendEmailButton } from "./resend-email-button";

const EMAIL_STATUS_LABELS = {
  PENDING: "Ausstehend",
  SENT: "Gesendet",
  FAILED: "Fehlgeschlagen",
} as const;

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function InvoicesPage() {
  const user = await requireRole("BUCHHALTUNG");
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("organization_id", user.organizationId!)
    .order("issued_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Rechnungen
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Wird automatisch erzeugt, sobald eine Bestellanfrage unter
          &bdquo;Bestellungen&ldquo; auf den Status &bdquo;Bestätigt&ldquo; gesetzt wird.
        </p>
      </div>

      {!invoices || invoices.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <FileText className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Noch keine Rechnungen
            </p>
            <p className="text-muted-foreground max-w-sm text-sm">
              Setze eine Bestellanfrage auf &bdquo;Bestätigt&ldquo;, um
              automatisch eine Rechnung zu erzeugen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="shadow-sm">
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-base">
                    {invoice.invoice_number}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {formatDateTime(invoice.issued_at)} · {invoice.customer_name}
                  </p>
                </div>
                <Badge
                  variant={
                    invoice.email_status === "FAILED"
                      ? "destructive"
                      : invoice.email_status === "SENT"
                        ? "secondary"
                        : "outline"
                  }
                >
                  E-Mail: {EMAIL_STATUS_LABELS[invoice.email_status]}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    {formatCents(invoice.total_cents)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Fällig am{" "}
                    {new Intl.DateTimeFormat("de-DE").format(
                      new Date(invoice.due_date),
                    )}
                  </p>
                  {invoice.email_status === "FAILED" && invoice.email_error ? (
                    <p className="text-destructive mt-1 text-xs">
                      {invoice.email_error}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/invoices/${invoice.id}/pdf`}
                    target="_blank"
                    className="text-primary text-sm font-medium underline underline-offset-2"
                  >
                    PDF ansehen
                  </Link>
                  <ResendEmailButton invoiceId={invoice.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
