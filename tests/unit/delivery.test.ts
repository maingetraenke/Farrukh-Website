import { describe, expect, it } from "vitest";
import { isValidRequestedDeliveryDate } from "@/lib/domain/delivery";

describe("isValidRequestedDeliveryDate", () => {
  it("rejects the day before the earliest delivery date", () => {
    expect(isValidRequestedDeliveryDate("2026-09-13")).toBe(false);
  });

  it("accepts the earliest delivery date itself", () => {
    expect(isValidRequestedDeliveryDate("2026-09-14")).toBe(true);
  });

  it("accepts a date after the earliest delivery date", () => {
    expect(isValidRequestedDeliveryDate("2026-09-15")).toBe(true);
  });

  it("rejects a date far in the past", () => {
    expect(isValidRequestedDeliveryDate("2020-01-01")).toBe(false);
  });
});
