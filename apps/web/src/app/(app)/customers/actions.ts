"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { CustomerType, PaymentMethod } from "@/lib/supabase/types";

export interface CustomerFormState {
  error?: string;
}

export interface CustomerInput {
  customer_type: CustomerType;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  billing_street: string | null;
  billing_postal_code: string | null;
  billing_city: string | null;
  phone: string | null;
  email: string | null;
  preferred_payment_method: PaymentMethod | null;
  payment_terms_days: number | null;
  vat_id: string | null;
  delivery_notes: string | null;
  notes: string | null;
}

function validate(input: CustomerInput): string | null {
  if (input.customer_type === "COMPANY" && !input.company_name?.trim()) {
    return "Firmenname ist bei Firmenkunden erforderlich.";
  }
  if (input.customer_type === "PRIVATE" && !input.last_name?.trim()) {
    return "Nachname ist bei Privatkunden erforderlich.";
  }
  return null;
}

// Mirrors customers_rw RLS (DISPOSITION/LAGER/BUCHHALTUNG, ADMIN always
// passes) — requireRole is defense-in-depth, the database enforces it
// either way.
export async function createCustomer(
  input: CustomerInput,
): Promise<CustomerFormState> {
  const user = await requireRole("DISPOSITION", "LAGER", "BUCHHALTUNG");
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("customers").insert({
    organization_id: user.organizationId!,
    ...input,
  });

  if (error) {
    return { error: "Kunde konnte nicht angelegt werden." };
  }

  revalidatePath("/customers");
  return {};
}

export async function updateCustomer(
  id: string,
  input: CustomerInput,
): Promise<CustomerFormState> {
  await requireRole("DISPOSITION", "LAGER", "BUCHHALTUNG");
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("customers").update(input).eq("id", id);

  if (error) {
    return { error: "Kunde konnte nicht gespeichert werden." };
  }

  revalidatePath("/customers");
  return {};
}

export async function setCustomerActive(
  id: string,
  active: boolean,
): Promise<CustomerFormState> {
  await requireRole("DISPOSITION", "LAGER", "BUCHHALTUNG");

  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ active, archived_at: active ? null : new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: "Status konnte nicht geändert werden." };
  }

  revalidatePath("/customers");
  return {};
}
