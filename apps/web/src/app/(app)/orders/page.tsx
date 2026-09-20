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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Bestellungen
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bestellanfragen aus dem öffentlichen Warenkorb. Preise und Pfand
          sind der Stand zum Zeitpunkt der Anfrage (Preis-Snapshot) — spätere
          Preisänderungen im Sortiment wirken sich nicht rückwirkend auf
          bereits eingegangene Anfragen aus.
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
            // Snapshot values captured at the time the inquiry was
            // submitted (see CartItemSnapshot) — never re-derived from the
            // current catalog, per the price-snapshot rule (old inquiries
            // must not change if a price is edited later).
            const goodsTotal = inquiry.items.reduce(
              (sum, item) =>
                item.sale_price_cents != null
                  ? sum + item.sale_price_cents * item.quantity
                  : sum,
              0,
            );
            const depositTotal = inquiry.items.reduce(
              (sum, item) =>
                item.deposit_amount_cents != null
                  ? sum + item.deposit_amount_cents * item.quantity
                  : sum,
              0,
            );
            const hasUnpricedItem = inquiry.items.some(
              (item) => item.sale_price_cents == null,
            );
            const hasUnresolvedDeposit = inquiry.items.some(
              (item) => item.deposit_name != null && item.deposit_amount_cents == null,
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
                        {inquiry.items.map((item) => (
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
                              {item.deposit_name ? (
                                <span className="text-muted-foreground block text-xs">
                                  {item.deposit_name}
                                  {item.deposit_amount_cents != null
                                    ? `: ${formatCents(item.deposit_amount_cents)} × ${item.quantity} = ${formatCents(item.deposit_amount_cents * item.quantity)}`
                                    : ": Betrag noch nicht hinterlegt"}
                                </span>
                              ) : null}
                            </td>
                            <td className="text-muted-foreground py-1.5 pr-2 text-right whitespace-nowrap">
                              {item.quantity}×
                            </td>
                            <td className="py-1.5 text-right whitespace-nowrap">
                              {item.sale_price_cents != null ? (
                                formatCents(item.sale_price_cents * item.quantity)
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  kein Preis
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex flex-col gap-1 border-t border-border pt-2 text-sm">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Warenwert{hasUnpricedItem ? " (unvollständig)" : ""}</span>
                        <span>{formatCents(goodsTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Pfand{hasUnresolvedDeposit ? " (unvollständig)" : ""}</span>
                        <span>{formatCents(depositTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between font-medium text-foreground">
                        <span>Zwischensumme</span>
                        <span>{formatCents(goodsTotal + depositTotal)}</span>
                      </div>
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
