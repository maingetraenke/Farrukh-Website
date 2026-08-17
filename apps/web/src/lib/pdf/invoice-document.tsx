import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { COMPANY } from "@/lib/domain/company";
import { formatCents } from "@/lib/domain/money";
import type { Database } from "@/lib/supabase/types";

type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
type OrgSettings = Database["public"]["Tables"]["organization_settings"]["Row"];

let cachedLogoDataUri: string | null | undefined;

// Embedded as a base64 data URI rather than a file path — avoids any
// ambiguity about cwd between `next dev`, a production build, and
// whatever process eventually calls this (Route Handler today, maybe a
// background job later).
function getLogoDataUri(): string | null {
  if (cachedLogoDataUri !== undefined) return cachedLogoDataUri;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const bytes = fs.readFileSync(logoPath);
    cachedLogoDataUri = `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    cachedLogoDataUri = null;
  }
  return cachedLogoDataUri;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#0f172a" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  logo: { width: 56, height: 56, objectFit: "contain" },
  companyBlock: { fontSize: 8, color: "#64748b", textAlign: "right" },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  metaLabel: { color: "#64748b" },
  addressBlock: { marginBottom: 20 },
  table: { marginTop: 8 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#0f172a",
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 4,
  },
  colName: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.3, textAlign: "right" },
  colSum: { flex: 1.3, textAlign: "right" },
  totalsBlock: { marginTop: 16, alignSelf: "flex-end", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totalsRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
    fontWeight: 700,
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    fontSize: 7.5,
    color: "#64748b",
  },
});

export function InvoiceDocument({
  invoice,
  orgSettings,
}: {
  invoice: Invoice;
  orgSettings: OrgSettings;
}) {
  const logo = getLogoDataUri();
  const issuedDate = new Intl.DateTimeFormat("de-DE").format(new Date(invoice.issued_at));
  const dueDate = new Intl.DateTimeFormat("de-DE").format(new Date(invoice.due_date));
  const hasBankDetails = orgSettings.bank_name && orgSettings.iban;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- this is @react-pdf/renderer's Image (PDF rendering primitive), not an HTML img; it has no alt prop */}
            {logo ? <Image src={logo} style={styles.logo} /> : null}
            <Text style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
              {COMPANY.name}
            </Text>
          </View>
          <View style={styles.companyBlock}>
            <Text>{COMPANY.name}</Text>
            <Text>{COMPANY.owner}</Text>
            <Text>{COMPANY.street}</Text>
            <Text>
              {COMPANY.postalCode} {COMPANY.city}
            </Text>
            <Text>{COMPANY.email}</Text>
            <Text>{COMPANY.phone}</Text>
            {orgSettings.tax_id ? <Text>Steuernummer: {orgSettings.tax_id}</Text> : null}
            {orgSettings.vat_id ? <Text>USt-IdNr.: {orgSettings.vat_id}</Text> : null}
          </View>
        </View>

        <View style={styles.addressBlock}>
          <Text>{invoice.customer_name}</Text>
          {invoice.delivery_street ? <Text>{invoice.delivery_street}</Text> : null}
          {invoice.delivery_postal_code || invoice.delivery_city ? (
            <Text>
              {invoice.delivery_postal_code} {invoice.delivery_city}
            </Text>
          ) : null}
        </View>

        <Text style={styles.title}>Rechnung {invoice.invoice_number}</Text>
        <View style={styles.metaRow}>
          <View>
            <Text>
              <Text style={styles.metaLabel}>Rechnungsdatum: </Text>
              {issuedDate}
            </Text>
            <Text>
              <Text style={styles.metaLabel}>Zahlungsziel: </Text>
              {invoice.payment_terms_days} Tage
            </Text>
            <Text>
              <Text style={styles.metaLabel}>Fällig am: </Text>
              {dueDate}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colName}>Artikel</Text>
            <Text style={styles.colQty}>Menge</Text>
            <Text style={styles.colPrice}>Einzelpreis</Text>
            <Text style={styles.colSum}>Summe</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View key={`${item.product_id}-${index}`} style={styles.tableRow}>
              <View style={styles.colName}>
                <Text>
                  {item.brand} — {item.name} ({item.gebinde})
                </Text>
                {item.deposit_name && item.deposit_amount_cents != null ? (
                  <Text style={{ fontSize: 8, color: "#64748b" }}>
                    zzgl. {item.deposit_name}: {formatCents(item.deposit_amount_cents)}/Kasten
                  </Text>
                ) : null}
              </View>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>
                {item.sale_price_cents != null ? formatCents(item.sale_price_cents) : "—"}
              </Text>
              <Text style={styles.colSum}>
                {item.sale_price_cents != null
                  ? formatCents(item.sale_price_cents * item.quantity)
                  : "—"}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text>Warenwert (netto)</Text>
            <Text>{formatCents(invoice.goods_total_cents - invoice.tax_total_cents)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text>zzgl. MwSt.</Text>
            <Text>{formatCents(invoice.tax_total_cents)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text>Pfand</Text>
            <Text>{formatCents(invoice.deposit_total_cents)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text>Liefergebühr</Text>
            <Text>{formatCents(invoice.delivery_fee_cents)}</Text>
          </View>
          <View style={styles.totalsRowFinal}>
            <Text>Gesamtbetrag</Text>
            <Text>{formatCents(invoice.total_cents)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            {COMPANY.name} · {COMPANY.owner} · {COMPANY.street}, {COMPANY.postalCode}{" "}
            {COMPANY.city} · {COMPANY.email} · {COMPANY.phone}
            {orgSettings.tax_id ? ` · Steuernummer: ${orgSettings.tax_id}` : ""}
          </Text>
          {hasBankDetails ? (
            <Text>
              Bankverbindung: {orgSettings.bank_name} · IBAN: {orgSettings.iban}
              {orgSettings.bic ? ` · BIC: ${orgSettings.bic}` : ""}
            </Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
