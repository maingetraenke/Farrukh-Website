import { describe, expect, it } from "vitest";
import {
  DEFAULT_DELIVERY_FEE_CENTS,
  formatCents,
  lineTotalCents,
  orderTotalCents,
  splitGrossCents,
  sumCents,
} from "@/lib/domain/money";

describe("money", () => {
  it("formats cents as EUR", () => {
    expect(formatCents(250)).toBe("2,50 €");
    expect(formatCents(0)).toBe("0,00 €");
  });

  it("sums cent values without floating point drift", () => {
    expect(sumCents(10, 20, 30)).toBe(60);
    // Classic float trap: 0.1 + 0.2 !== 0.3 in cents-as-float. In integer
    // cents there is nothing to drift.
    expect(sumCents(10, 20)).toBe(30);
  });

  it("computes a line total including deposit", () => {
    expect(
      lineTotalCents({
        quantityCases: 3,
        salePriceCentsPerCase: 1200,
        depositCentsPerCase: 300,
      }),
    ).toBe(3 * (1200 + 300));
  });

  it("rejects a non-positive quantity", () => {
    expect(() =>
      lineTotalCents({
        quantityCases: 0,
        salePriceCentsPerCase: 1200,
        depositCentsPerCase: 300,
      }),
    ).toThrow();
  });

  it("defaults the delivery fee to 2,50 EUR", () => {
    expect(DEFAULT_DELIVERY_FEE_CENTS).toBe(250);
  });

  it("adds the delivery fee once for the whole order", () => {
    const total = orderTotalCents([
      { quantityCases: 2, salePriceCentsPerCase: 1000, depositCentsPerCase: 150 },
      { quantityCases: 1, salePriceCentsPerCase: 500, depositCentsPerCase: 0 },
    ]);
    expect(total).toBe(2 * (1000 + 150) + 1 * 500 + DEFAULT_DELIVERY_FEE_CENTS);
  });

  it("allows overriding the delivery fee (e.g. org-level setting)", () => {
    const total = orderTotalCents(
      [{ quantityCases: 1, salePriceCentsPerCase: 100, depositCentsPerCase: 0 }],
      0,
    );
    expect(total).toBe(100);
  });

  it("splits a gross amount into net + tax on a clean 19% case", () => {
    expect(splitGrossCents(119, 19)).toEqual({ netCents: 100, taxCents: 19 });
  });

  it("splits a gross amount into net + tax where net rounds down", () => {
    const { netCents, taxCents } = splitGrossCents(699, 19);
    expect(netCents + taxCents).toBe(699);
    expect(netCents).toBe(587);
    expect(taxCents).toBe(112);
  });
});
