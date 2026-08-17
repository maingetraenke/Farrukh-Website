import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { InvoiceDocument } from "@/lib/pdf/invoice-document";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireRole("DISPOSITION", "BUCHHALTUNG");
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("organization_id", user.organizationId!)
    .maybeSingle();

  if (!invoice) {
    return NextResponse.json({ error: "Rechnung nicht gefunden." }, { status: 404 });
  }

  const { data: settings } = await supabase
    .from("organization_settings")
    .select("*")
    .eq("organization_id", user.organizationId!)
    .single();

  if (!settings) {
    return NextResponse.json(
      { error: "Organisationseinstellungen nicht gefunden." },
      { status: 500 },
    );
  }

  const pdfBuffer = await renderToBuffer(
    InvoiceDocument({ invoice, orgSettings: settings }),
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoice_number}.pdf"`,
    },
  });
}
