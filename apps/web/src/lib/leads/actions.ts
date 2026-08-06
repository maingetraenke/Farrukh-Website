"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { CartItemSnapshot } from "@/lib/supabase/types";

function getDefaultOrgId(): string {
  const id = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID;
  if (!id) {
    throw new Error(
      "NEXT_PUBLIC_DEFAULT_ORG_ID is not set — the public site needs this to know which organization a lead belongs to.",
    );
  }
  return id;
}

export interface ContactFormState {
  error?: string;
  success?: boolean;
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Bitte Namen angeben."),
  email: z.email("Bitte eine gültige E-Mail-Adresse angeben."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(5, "Bitte eine Nachricht mit mindestens 5 Zeichen angeben."),
  // Honeypot: real users never fill this hidden field in.
  website: z.string().max(0).optional(),
});

export async function submitContactMessage(
  _prevState: ContactFormState | undefined,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    organization_id: getDefaultOrgId(),
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    return { error: "Nachricht konnte nicht gesendet werden. Bitte später erneut versuchen." };
  }

  return { success: true };
}

export interface OrderInquiryState {
  error?: string;
  success?: boolean;
}

const orderInquirySchema = z.object({
  customerName: z.string().trim().min(1, "Bitte Namen angeben."),
  email: z.email("Bitte eine gültige E-Mail-Adresse angeben."),
  phone: z.string().trim().optional(),
  deliveryStreet: z.string().trim().optional(),
  deliveryPostalCode: z.string().trim().optional(),
  deliveryCity: z.string().trim().optional(),
  requestedDate: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  website: z.string().max(0).optional(),
});

export async function submitOrderInquiry(
  items: CartItemSnapshot[],
  _prevState: OrderInquiryState | undefined,
  formData: FormData,
): Promise<OrderInquiryState> {
  if (!items || items.length === 0) {
    return { error: "Dein Warenkorb ist leer." };
  }

  const parsed = orderInquirySchema.safeParse({
    customerName: formData.get("customerName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    deliveryStreet: formData.get("deliveryStreet") || undefined,
    deliveryPostalCode: formData.get("deliveryPostalCode") || undefined,
    deliveryCity: formData.get("deliveryCity") || undefined,
    requestedDate: formData.get("requestedDate") || undefined,
    notes: formData.get("notes") || undefined,
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("order_inquiries").insert({
    organization_id: getDefaultOrgId(),
    customer_name: parsed.data.customerName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    delivery_street: parsed.data.deliveryStreet || null,
    delivery_postal_code: parsed.data.deliveryPostalCode || null,
    delivery_city: parsed.data.deliveryCity || null,
    requested_date: parsed.data.requestedDate || null,
    notes: parsed.data.notes || null,
    items,
  });

  if (error) {
    return { error: "Bestellanfrage konnte nicht gesendet werden. Bitte später erneut versuchen." };
  }

  return { success: true };
}
