import { ClipboardList, Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatCents } from "@/lib/domain/money";
import { InquiryStatusSelect, STATUS_LABELS } from "./inquiry-status-select";

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function OrdersPage() {
  const user = await requireRole("DISPOSITION", "BUCHHALTUNG");
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from("order_inquiries")
    .select("*")
    .eq("organization_id", user.organizationId!)
    .order("created_at", { ascending: false });

  const productIds = Array.from(
    new Set(
      (inquiries ?? []).flatMap((inquiry) =>
        inquiry.items.map((item) => item.product_id),
      ),
    ),
  );

  // Current sale price per product, following the "latest row with
  // valid_from <= now()" read pattern from docs/database.md — never a
  // materialized/cached price column.
  const currentPriceByProduct = new Map<string, number>();
  if (productIds.length > 0) {
    const { data: prices } = await supabase
      .from("product_prices")
      .select("product_id, sale_price_cents, valid_from")
      .in("product_id", productIds)
      .lte("valid_from", new Date().toISOString())
      .order("valid_from", { ascending: false });

    for (const price of prices ?? []) {
      if (
        !currentPriceByProduct.has(price.product_id) &&
        price.sale_price_cents !== null
      ) {
        currentPriceByProduct.set(price.product_id, price.sale_price_cents);
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Bestellungen
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bestellanfragen aus dem öffentlichen Warenkorb. Noch keine
          verbindlichen Preise, solange keine Verkaufspreise hinterlegt sind
          — siehe Produkte.
        </p>
      </div>

      {!inquiries || inquiries.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <ClipboardList className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Noch keine Bestellanfragen
            </p>
            <p className="text-muted-foreground max-w-sm text-sm">
              Neue Anfragen aus dem Warenkorb der Website erscheinen hier
              automatisch.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {inquiries.map((inquiry) => {
            const total = inquiry.items.reduce((sum, item) => {
              const price = currentPriceByProduct.get(item.product_id);
              return price != null ? sum + price * item.quantity : sum;
            }, 0);
            const hasUnpricedItem = inquiry.items.some(
              (item) => !currentPriceByProduct.has(item.product_id),
            );

            return (
              <Card key={inquiry.id} className="shadow-sm">
                <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle className="text-base">
                      {inquiry.inquiry_number}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatDateTime(inquiry.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        inquiry.status === "DECLINED"
                          ? "destructive"
                          : inquiry.status === "CONVERTED"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {STATUS_LABELS[inquiry.status]}
                    </Badge>
                    <InquiryStatusSelect id={inquiry.id} status={inquiry.status} />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
                  <div className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-foreground">
                      {inquiry.customer_name}
                    </span>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Mail className="size-3.5 shrink-0" />
                      {inquiry.email}
                    </div>
                    {inquiry.phone ? (
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Phone className="size-3.5 shrink-0" />
                        {inquiry.phone}
                      </div>
                    ) : null}
                    {inquiry.delivery_street ? (
                      <div className="text-muted-foreground flex items-start gap-2">
                        <MapPin className="mt-0.5 size-3.5 shrink-0" />
                        <span>
                          {inquiry.delivery_street}
                          <br />
                          {inquiry.delivery_postal_code} {inquiry.delivery_city}
                        </span>
                      </div>
                    ) : null}
                    {inquiry.requested_date ? (
                      <p className="text-muted-foreground text-xs">
                        Wunschtermin:{" "}
                        {new Intl.DateTimeFormat("de-DE").format(
                          new Date(inquiry.requested_date),
                        )}
                      </p>
                    ) : null}
                    {inquiry.notes ? (
                      <p className="text-muted-foreground border-border mt-1 border-t pt-2 text-xs">
                        {inquiry.notes}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <table className="w-full text-sm">
                      <tbody>
                        {inquiry.items.map((item) => {
                          const price = currentPriceByProduct.get(
                            item.product_id,
                          );
                          return (
                            <tr
                              key={item.product_id}
                              className="border-border border-b last:border-0"
                            >
                              <td className="py-1.5 pr-2">
                                <span className="text-foreground">
                                  {item.name}
                                </span>
                                <span className="text-muted-foreground ml-1.5 text-xs">
                                  {item.gebinde}
                                </span>
                              </td>
                              <td className="text-muted-foreground py-1.5 pr-2 text-right whitespace-nowrap">
                                {item.quantity}×
                              </td>
                              <td className="py-1.5 text-right whitespace-nowrap">
                                {price != null ? (
                                  formatCents(price * item.quantity)
                                ) : (
                                  <span className="text-muted-foreground text-xs">
                                    kein Preis
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-medium text-foreground">
                      <span>Zwischensumme{hasUnpricedItem ? " (unvollständig)" : ""}</span>
                      <span>{formatCents(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
