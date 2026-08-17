import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { splitGrossCents } from "@/lib/domain/money";
import type { Database } from "@/lib/supabase/types";

type TypedClient = SupabaseClient<Database>;
type Invoice = Database["public"]["Tables"]["invoices"]["Row"];

export interface GenerateInvoiceResult {
  invoice: Invoice | null;
  error: string | null;
  /** True if an invoice already existed and was returned instead of creating a new one. */
  alreadyExisted: boolean;
}

// Idempotent: if an invoice already exists for this inquiry, returns it
// instead of creating a duplicate (never a second invoice number for the
// same order — see the master spec's "ohne doppelte Rechnungsnummer").
export async function generateInvoiceForInquiry(
  supabase: TypedClient,
  organizationId: string,
  inquiryId: string,
  createdByProfileId: string | null,
): Promise<GenerateInvoiceResult> {
  const { data: existing } = await supabase
    .from("invoices")
    .select("*")
    .eq("order_inquiry_id", inquiryId)
    .maybeSingle();

  if (existing) {
    return { invoice: existing, error: null, alreadyExisted: true };
  }

  const { data: inquiry, error: inquiryError } = await supabase
    .from("order_inquiries")
    .select("*")
    .eq("id", inquiryId)
    .single();

  if (inquiryError || !inquiry) {
    return { invoice: null, error: "Bestellanfrage nicht gefunden.", alreadyExisted: false };
  }

  const { data: settings, error: settingsError } = await supabase
    .from("organization_settings")
    .select("*")
    .eq("organization_id", organizationId)
    .single();

  if (settingsError || !settings) {
    return {
      invoice: null,
      error: "Organisationseinstellungen nicht gefunden.",
      alreadyExisted: false,
    };
  }

  // Tax rate isn't part of the order-time snapshot (CartItemSnapshot has
  // no tax_rate_percent field yet) — looked up from the current product
  // master data instead. Reasonable for now: 85 of 86 active products
  // share the same 19% rate; flagged in the release report as a follow-up
  // (extending the snapshot) rather than silently assumed.
  const productIds = Array.from(new Set(inquiry.items.map((item) => item.product_id)));
  const taxRateByProduct = new Map<string, number>();
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, tax_rate_percent")
      .in("id", productIds);
    for (const product of products ?? []) {
      if (product.tax_rate_percent != null) {
        taxRateByProduct.set(product.id, product.tax_rate_percent);
      }
    }
  }

  let goodsTotalCents = 0;
  let taxTotalCents = 0;
  let depositTotalCents = 0;
  const missingTaxRateProducts: string[] = [];

  for (const item of inquiry.items) {
    if (item.sale_price_cents != null) {
      const lineGross = item.sale_price_cents * item.quantity;
      goodsTotalCents += lineGross;
      const taxRate = taxRateByProduct.get(item.product_id);
      if (taxRate != null) {
        taxTotalCents += splitGrossCents(lineGross, taxRate).taxCents;
      } else {
        missingTaxRateProducts.push(item.name);
      }
    }
    if (item.deposit_amount_cents != null) {
      depositTotalCents += item.deposit_amount_cents * item.quantity;
    }
  }

  if (missingTaxRateProducts.length > 0) {
    return {
      invoice: null,
      error: `Kein Steuersatz hinterlegt für: ${missingTaxRateProducts.join(", ")}. Rechnung kann nicht erstellt werden, ohne einen MwSt.-Satz zu erfinden.`,
      alreadyExisted: false,
    };
  }

  const deliveryFeeCents = settings.default_delivery_fee_cents;
  const totalCents = goodsTotalCents + depositTotalCents + deliveryFeeCents;
  const paymentTermsDays = settings.default_payment_terms_days;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + paymentTermsDays);

  const { data: created, error: insertError } = await supabase
    .from("invoices")
    .insert({
      organization_id: organizationId,
      order_inquiry_id: inquiry.id,
      customer_name: inquiry.customer_name,
      customer_email: inquiry.email,
      delivery_street: inquiry.delivery_street,
      delivery_postal_code: inquiry.delivery_postal_code,
      delivery_city: inquiry.delivery_city,
      items: inquiry.items,
      goods_total_cents: goodsTotalCents,
      deposit_total_cents: depositTotalCents,
      delivery_fee_cents: deliveryFeeCents,
      tax_total_cents: taxTotalCents,
      total_cents: totalCents,
      payment_terms_days: paymentTermsDays,
      due_date: dueDate.toISOString().slice(0, 10),
      created_by: createdByProfileId,
    })
    .select()
    .single();

  if (insertError || !created) {
    return { invoice: null, error: "Rechnung konnte nicht angelegt werden.", alreadyExisted: false };
  }

  return { invoice: created, error: null, alreadyExisted: false };
}
