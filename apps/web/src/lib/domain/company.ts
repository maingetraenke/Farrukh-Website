// Confirmed business data (owner, 2026-08-16 chat) — used on invoice PDFs.
// Same facts as apps/web/src/app/(marketing)/impressum/page.tsx, kept as a
// separate literal here rather than importing from that page: it's part
// of the parallel content/legal-text work and explicitly off-limits for
// this pass. Do not diverge from it — see CLAUDE.md rule 8, never invent
// business data.
export const COMPANY = {
  name: "MainGetränke",
  owner: "Farrukh Butt",
  legalForm: "Einzelunternehmen",
  street: "Hindenburgring West 11",
  postalCode: "97318",
  city: "Kitzingen",
  email: "info@maingetraenke.de",
  phone: "0177 8085911",
} as const;
