import { describe, expect, it } from "vitest";
import { sugarTaxCaveat, sugarTaxCentsPerLiter, sugarTaxPerPackageCents, sugarTaxTier } from "./sugar-tax";

describe("sugar tax", () => {
  it("applies no tax below 5 g per 100 ml", () => {
    expect(sugarTaxCentsPerLiter(0)).toBe(0);
    expect(sugarTaxCentsPerLiter(4.9)).toBe(0);
    expect(sugarTaxTier(4.9)).toBe("none");
  });

  it("uses 26 ct from 5 g and 32 ct from 8 g", () => {
    expect(sugarTaxCentsPerLiter(5)).toBe(26);
    expect(sugarTaxCentsPerLiter(7.9)).toBe(26);
    expect(sugarTaxTier(7.9)).toBe("low");
    expect(sugarTaxCentsPerLiter(8)).toBe(32);
    expect(sugarTaxTier(10.6)).toBe("high");
  });

  it("calculates tax per package", () => {
    expect(sugarTaxPerPackageCents(10.6, 500)).toBe(16);
    expect(sugarTaxPerPackageCents(6, 330)).toBe(8.6);
    expect(sugarTaxPerPackageCents(11, 250)).toBe(8);
    expect(sugarTaxPerPackageCents(4, 1000)).toBe(0);
  });

  it("flags juice and milk drinks as open cases", () => {
    expect(sugarTaxCaveat({ categoryId: "juice" })).toBe("juice");
    expect(sugarTaxCaveat({ categoryId: "milk-drink" })).toBe("milk");
    expect(sugarTaxCaveat({ categoryId: "cola" })).toBeNull();
  });
});
