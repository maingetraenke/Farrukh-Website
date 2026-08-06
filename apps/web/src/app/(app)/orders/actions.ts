"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
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
  await requireRole("DISPOSITION", "BUCHHALTUNG");

  const supabase = await createClient();
  const { error } = await supabase
    .from("order_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: "Status konnte nicht geändert werden." };
  }

  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return {};
}
