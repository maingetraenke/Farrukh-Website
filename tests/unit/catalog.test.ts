import { describe, expect, it } from "vitest";
import { formatGebinde, formatPriceCents } from "@/lib/domain/catalog";

describe("formatGebinde", () => {
  it("formats a 1,0L PET case", () => {
    expect(
      formatGebinde({ bottles_per_case: 12, bottle_volume_ml: 1000, bottle_material: "PET" }),
    ).toBe("12×1,0L PET");
  });

  it("formats a 0,75L glass case", () => {
    expect(
      formatGebinde({ bottles_per_case: 12, bottle_volume_ml: 750, bottle_material: "GLASS" }),
    ).toBe("12×0,75L Glas");
  });

  it("formats a 0,33L glass case", () => {
    expect(
      formatGebinde({ bottles_per_case: 24, bottle_volume_ml: 330, bottle_material: "GLASS" }),
    ).toBe("24×0,33L Glas");
  });

  it("formats a 0,5L glass case", () => {
    expect(
      formatGebinde({ bottles_per_case: 20, bottle_volume_ml: 500, bottle_material: "GLASS" }),
    ).toBe("20×0,5L Glas");
  });

  it("formats a 0,2L carton case", () => {
    expect(
      formatGebinde({ bottles_per_case: 12, bottle_volume_ml: 200, bottle_material: "KARTON" }),
    ).toBe("12×0,2L Karton");
  });
});

describe("formatPriceCents", () => {
  // Intl inserts a non-breaking space (U+00A0) before the currency symbol.
  it("formats whole euros", () => {
    expect(formatPriceCents(2199)).toBe("21,99 €");
  });

  it("formats amounts under one euro", () => {
    expect(formatPriceCents(99)).toBe("0,99 €");
  });
});
