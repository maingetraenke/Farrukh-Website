import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PaymentsClient, type InvoicePaymentRow } from "./payments-client";

export default async function PaymentsPage() {
  const user = await requireRole("BUCHHALTUNG");
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, customer_name, issued_at, total_cents")
    .eq("organization_id", user.organizationId!)
    .is("cancelled_at", null)
    .order("issued_at", { ascending: false });

  const { data: payments } = await supabase
    .from("payments")
    .select("invoice_id, amount_cents, method, paid_at")
    .eq("organization_id", user.organizationId!)
    .order("paid_at", { ascending: false });

  const paidByInvoice = new Map<string, number>();
  const lastMethodByInvoice = new Map<string, InvoicePaymentRow["last_method"]>();
  for (const payment of payments ?? []) {
    paidByInvoice.set(
      payment.invoice_id,
      (paidByInvoice.get(payment.invoice_id) ?? 0) + payment.amount_cents,
    );
    if (!lastMethodByInvoice.has(payment.invoice_id)) {
      lastMethodByInvoice.set(payment.invoice_id, payment.method);
    }
  }

  const rows: InvoicePaymentRow[] = (invoices ?? []).map((invoice) => ({
    ...invoice,
    paid_cents: paidByInvoice.get(invoice.id) ?? 0,
    last_method: lastMethodByInvoice.get(invoice.id) ?? null,
  }));

  return <PaymentsClient invoices={rows} canRecordPayment />;
}
