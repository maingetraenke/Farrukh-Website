import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { COMPANY } from "@/lib/domain/company";
import { InvoiceDocument } from "@/lib/pdf/invoice-document";
import type { Database } from "@/lib/supabase/types";

type TypedClient = SupabaseClient<Database>;
type Invoice = Database["public"]["Tables"]["invoices"]["Row"];

export interface SendInvoiceEmailResult {
  status: "SENT" | "FAILED";
  error: string | null;
}

// Degrades gracefully rather than throwing: if RESEND_API_KEY isn't
// configured (not set up yet — see release report), this records exactly
// why on the invoice (email_status='FAILED', email_error) instead of
// crashing the status-change/invoice-creation flow that triggered it.
export async function sendInvoiceEmail(
  supabase: TypedClient,
  invoice: Invoice,
): Promise<SendInvoiceEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM;

  if (!apiKey || !fromAddress) {
    const error = "RESEND_API_KEY / EMAIL_FROM nicht konfiguriert.";
    await supabase
      .from("invoices")
      .update({ email_status: "FAILED", email_error: error })
      .eq("id", invoice.id);
    return { status: "FAILED", error };
  }

  const { data: settings } = await supabase
    .from("organization_settings")
    .select("*")
    .eq("organization_id", invoice.organization_id)
    .single();

  if (!settings) {
    const error = "Organisationseinstellungen nicht gefunden.";
    await supabase
      .from("invoices")
      .update({ email_status: "FAILED", email_error: error })
      .eq("id", invoice.id);
    return { status: "FAILED", error };
  }

  try {
    const pdfBuffer = await renderToBuffer(
      InvoiceDocument({ invoice, orgSettings: settings }),
    );

    const resend = new Resend(apiKey);
    const { error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: invoice.customer_email,
      subject: `Rechnung ${invoice.invoice_number} — ${COMPANY.name}`,
      text: `Hallo ${invoice.customer_name},\n\nanbei die Rechnung ${invoice.invoice_number} zu deiner Bestellung.\n\nViele Grüße\n${COMPANY.name}`,
      attachments: [
        {
          filename: `${invoice.invoice_number}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (sendError) {
      const error = sendError.message || "E-Mail-Versand fehlgeschlagen.";
      await supabase
        .from("invoices")
        .update({ email_status: "FAILED", email_error: error })
        .eq("id", invoice.id);
      return { status: "FAILED", error };
    }

    await supabase
      .from("invoices")
      .update({
        email_status: "SENT",
        email_sent_at: new Date().toISOString(),
        email_error: null,
      })
      .eq("id", invoice.id);
    return { status: "SENT", error: null };
  } catch (caught) {
    const error = caught instanceof Error ? caught.message : "Unbekannter Fehler beim Versand.";
    await supabase
      .from("invoices")
      .update({ email_status: "FAILED", email_error: error })
      .eq("id", invoice.id);
    return { status: "FAILED", error };
  }
}
