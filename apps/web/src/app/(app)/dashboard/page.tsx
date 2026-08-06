import Link from "next/link";
import {
  AlertTriangle,
  ClipboardList,
  CreditCard,
  Euro,
  PackageSearch,
  Recycle,
  Route,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS } from "@/app/(app)/orders/inquiry-status-select";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const canSeeOrders =
    user.role === "ADMIN" ||
    user.role === "DISPOSITION" ||
    user.role === "BUCHHALTUNG";

  const [
    customers,
    products,
    suppliers,
    unpricedProducts,
    unsetDeposits,
    ordersToday,
    recentOrders,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("suppliers")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .is("tax_rate_percent", null),
    supabase
      .from("deposit_types")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .is("amount_cents", null),
    canSeeOrders
      ? supabase
          .from("order_inquiries")
          .select("id", { count: "exact", head: true })
          .gte("created_at", todayStart.toISOString())
      : Promise.resolve({ count: null }),
    canSeeOrders
      ? supabase
          .from("order_inquiries")
          .select("id, inquiry_number, customer_name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: null }),
  ]);

  const warnings: string[] = [];
  if ((unpricedProducts.count ?? 0) > 0) {
    warnings.push(
      `${unpricedProducts.count} Produkt(e) ohne hinterlegten Steuersatz.`,
    );
  }
  if ((unsetDeposits.count ?? 0) > 0) {
    warnings.push(
      `${unsetDeposits.count} Pfandtyp(en) ohne hinterlegten Betrag.`,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Willkommen, {user.fullName.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {user.organizationName ?? "MainGetränke"} — Überblick
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={ClipboardList}
          label="Bestellanfragen heute"
          value={canSeeOrders ? String(ordersToday.count ?? 0) : "–"}
          hint={canSeeOrders ? undefined : "Keine Berechtigung"}
        />
        <KpiCard
          icon={Route}
          label="Stopps heute"
          value="–"
          hint="Verfügbar ab Phase 3"
        />
        <KpiCard
          icon={Euro}
          label="Tagesumsatz"
          value="–"
          hint="Verfügbar ab Phase 4"
        />
        <KpiCard
          icon={CreditCard}
          label="Offene Forderungen"
          value="–"
          hint="Verfügbar ab Phase 4"
        />
        <KpiCard
          icon={Users}
          label="Kunden aktiv"
          value={String(customers.count ?? 0)}
        />
        <KpiCard
          icon={PackageSearch}
          label="Produkte im Sortiment"
          value={String(products.count ?? 0)}
        />
        <KpiCard
          icon={ShoppingCart}
          label="Lieferanten"
          value={String(suppliers.count ?? 0)}
        />
        <KpiCard
          icon={Recycle}
          label="Pfandsaldo"
          value="–"
          hint="Verfügbar ab Phase 3"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Heutige Touren</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Touren-Disposition folgt in Phase 3.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Letzte Bestellungen</CardTitle>
          </CardHeader>
          <CardContent>
            {!canSeeOrders ? (
              <p className="text-muted-foreground text-sm">Keine Berechtigung.</p>
            ) : !recentOrders.data || recentOrders.data.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Noch keine Bestellanfragen.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {recentOrders.data.map((order) => (
                  <li key={order.id}>
                    <Link
                      href="/orders"
                      className="flex items-center justify-between gap-3 text-sm hover:text-primary"
                    >
                      <span className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {order.customer_name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {order.inquiry_number}
                        </span>
                      </span>
                      <Badge variant="outline" className="shrink-0">
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top-Produkte</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Auswertungen folgen in Phase 4.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="text-secondary size-4" />
              Warnungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {warnings.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Keine offenen Stammdaten-Warnungen.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {warnings.map((warning) => (
                  <li key={warning} className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-secondary text-secondary shrink-0"
                    >
                      Stammdaten
                    </Badge>
                    <span className="text-sm">{warning}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
