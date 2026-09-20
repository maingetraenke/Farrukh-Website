"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { sendInvoiceEmail } from "@/lib/email/send-invoice-email";

export interface ResendInvoiceEmailState {
  error?: string;
}

// Re-sends the existing invoice PDF — never generates a new invoice
// number, matching the "erneuter Versand möglich, ohne doppelte
// Rechnungsnummer" requirement. sendInvoiceEmail always updates
// email_status itself (SENT or FAILED with a reason), so this only needs
// to surface a hard failure to find the invoice at all.
export async function resendInvoiceEmail(
  invoiceId: string,
): Promise<ResendInvoiceEmailState> {
  const user = await requireRole("BUCHHALTUNG");
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .eq("organization_id", user.organizationId!)
    .maybeSingle();

  if (!invoice) {
    return { error: "Rechnung nicht gefunden." };
  }

  await sendInvoiceEmail(supabase, invoice);
  revalidatePath("/invoices");
  return {};
}
