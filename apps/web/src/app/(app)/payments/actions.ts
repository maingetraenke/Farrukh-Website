"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/supabase/types";

export interface PaymentFormState {
  error?: string;
}

// Mirrors payments_rw RLS (BUCHHALTUNG, ADMIN always passes) —
// requireRole is defense-in-depth, the database enforces it either way.
export async function recordPayment(
  invoiceId: string,
  method: PaymentMethod,
  amountCents: number,
  notes: string | null,
): Promise<PaymentFormState> {
  const user = await requireRole("BUCHHALTUNG");

  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return { error: "Bitte einen gültigen Betrag angeben." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    organization_id: user.organizationId!,
    invoice_id: invoiceId,
    method,
    amount_cents: amountCents,
    notes,
    recorded_by: user.id,
  });

  if (error) {
    return { error: "Zahlung konnte nicht erfasst werden." };
  }

  revalidatePath("/payments");
  return {};
}
