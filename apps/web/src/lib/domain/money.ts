// Money is always an integer number of cents. Never a float — see
// CLAUDE.md rule 9.

export const DEFAULT_DELIVERY_FEE_CENTS = 250;

export function formatCents(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function sumCents(...values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export interface OrderLine {
  quantityCases: number;
  salePriceCentsPerCase: number;
  depositCentsPerCase: number;
}

export function lineTotalCents(line: OrderLine): number {
  if (line.quantityCases <= 0) {
    throw new Error("quantityCases must be greater than 0");
  }
  return (
    line.quantityCases *
    (line.salePriceCentsPerCase + line.depositCentsPerCase)
  );
}

export function orderTotalCents(
  lines: OrderLine[],
  deliveryFeeCents: number = DEFAULT_DELIVERY_FEE_CENTS,
): number {
  return sumCents(...lines.map(lineTotalCents), deliveryFeeCents);
}
