"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { generateInvoiceForInquiry } from "@/lib/invoices/generate-invoice";
import { sendInvoiceEmail } from "@/lib/email/send-invoice-email";
import type { LeadStatus } from "@/lib/supabase/types";

export interface UpdateInquiryStatusState {
  error?: string;
}

// Mirrors the order_inquiries_update_staff RLS policy (DISPOSITION/
// BUCHHALTUNG, ADMIN always passes) — requireRole is a defense-in-depth
// check, not the only one; the database enforces it either way.
export async function updateInquiryStatus(
  id: string,
  status: LeadStatus,
): Promise<UpdateInquiryStatusState> {
  const user = await requireRole("DISPOSITION", "BUCHHALTUNG");

  const supabase = await createClient();
  const { error } = await supabase
    .from("order_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: "Status konnte nicht geändert werden." };
  }

  // CONVERTED = the inquiry has been confirmed as a real order (see the
  // AGB draft: Bestellanfrage is unverbindlich until this point) — that's
  // the trigger for invoicing. Runs best-effort: the status change above
  // has already succeeded regardless of what happens here; any invoice/
  // email failure is visible on the /invoices page's status column
  // instead of blocking this action. Only BUCHHALTUNG/ADMIN can reach
  // this branch (requireRole above), matching the invoices RLS policy.
  if (status === "CONVERTED" && user.organizationId) {
    const { invoice, alreadyExisted } = await generateInvoiceForInquiry(
      supabase,
      user.organizationId,
      id,
      user.id,
    );
    if (invoice && !alreadyExisted) {
      await sendInvoiceEmail(supabase, invoice);
    }
    revalidatePath("/invoices");
  }

  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return {};
}
