import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { CustomersClient } from "./customers-client";

export default async function CustomersPage() {
  const user = await requireRole("DISPOSITION", "LAGER", "BUCHHALTUNG");
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customers")
    .select(
      "id, customer_number, customer_type, company_name, first_name, last_name, billing_street, billing_postal_code, billing_city, phone, email, preferred_payment_method, payment_terms_days, vat_id, delivery_notes, notes, active",
    )
    .eq("organization_id", user.organizationId!)
    .order("customer_number", { ascending: false });

  return <CustomersClient customers={customers ?? []} />;
}
