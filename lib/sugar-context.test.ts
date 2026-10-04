import { describe, expect, it } from "vitest";
import { drinks } from "@/lib/data/drinks";
import { dailySugarShare, swapAlternatives } from "@/lib/sugar-context";

const byId = (id: string) => {
  const drink = drinks.find((item) => item.id === id);
  if (!drink) throw new Error(`missing drink ${id}`);
  return drink;
};

describe("swapAlternatives", () => {
  it("offers at most three swaps from the same category with at least 2 g less sugar", () => {
    const drink = byId("coca-cola-classic-500");
    const swaps = swapAlternatives(drink);
    expect(swaps.length).toBeGreaterThan(0);
    expect(swaps.length).toBeLessThanOrEqual(3);
    for (const swap of swaps) {
      expect(swap.categoryId).toBe(drink.categoryId);
      expect(swap.sugarPer100Ml).toBeLessThanOrEqual(drink.sugarPer100Ml - 2);
    }
  });

  it("puts the same brand first", () => {
    expect(swapAlternatives(byId("coca-cola-classic-500"))[0].brandId).toBe("coca-cola");
    expect(swapAlternatives(byId("fanta-orange-500"))[0].brandId).toBe("fanta");
  });

  it("has nothing to offer for sugar-free drinks", () => {
    expect(swapAlternatives(byId("coca-cola-zero-sugar-500"))).toEqual([]);
  });
});

describe("dailySugarShare", () => {
  it("expresses package sugar as a share of 50 g", () => {
    expect(dailySugarShare(53)).toBe(106);
    expect(dailySugarShare(25)).toBe(50);
  });
});
