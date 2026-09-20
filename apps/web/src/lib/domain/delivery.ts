// Earliest possible delivery date for the business's first-customer phase.
// Business rule, not a technical default — see CLAUDE.md and
// docs/implementation-plan.md. Never move this without an explicit
// instruction; it is not something to infer or round from other dates.
export const EARLIEST_DELIVERY_DATE = "2026-09-14";

export const EARLIEST_DELIVERY_DATE_ERROR =
  "Das früheste mögliche Lieferdatum ist der 14.09.2026.";

// Compares as plain YYYY-MM-DD strings (both the HTML date input and
// Postgres `date` columns sort correctly this way) — avoids timezone
// drift from constructing Date objects for a date-only value.
export function isValidRequestedDeliveryDate(dateStr: string): boolean {
  return dateStr >= EARLIEST_DELIVERY_DATE;
}
