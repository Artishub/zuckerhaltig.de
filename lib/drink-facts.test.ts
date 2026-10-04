import { describe, expect, it } from "vitest";
import { drinks } from "@/lib/data/drinks";
import { drinkFacts } from "@/lib/drink-facts";

const byId = (id: string) => {
  const drink = drinks.find((item) => item.id === id);
  if (!drink) throw new Error(`missing drink ${id}`);
  return drink;
};
const ids = (id: string) => drinkFacts(byId(id)).map((fact) => fact.id);

describe("drinkFacts", () => {
  it("builds rank, brand, alternative, sizes and WHO facts for a sugared drink", () => {
    expect(ids("coca-cola-classic-500")).toEqual(["category-rank", "brand-rank", "alternative", "sizes", "who"]);
  });

  it("compares zero drinks with their sugared original instead of an alternative", () => {
    const facts = drinkFacts(byId("coca-cola-zero-sugar-500"));
    expect(facts.map((fact) => fact.id)).not.toContain("alternative");
    expect(facts.map((fact) => fact.id)).not.toContain("who");
    expect(facts.find((fact) => fact.id === "original")?.text).toContain("Coca-Cola Classic");
  });

  it("skips the WHO fact for milk drinks", () => {
    const milk = drinks.find((drink) => drink.categoryId === "milk-drink" && drink.sizeMl && drink.sugarPer100Ml > 0.5);
    expect(milk).toBeDefined();
    expect(drinkFacts(milk!).map((fact) => fact.id)).not.toContain("who");
  });

  it("never renders placeholders or broken numbers", () => {
    for (const drink of drinks) {
      for (const fact of drinkFacts(drink)) {
        expect(fact.text, `${drink.id}: ${fact.id}`).not.toMatch(/undefined|NaN|null|Infinity/);
      }
    }
  });

  it("produces different text for different drinks", () => {
    const texts = drinks.map((drink) => drinkFacts(drink).map((fact) => fact.text).join(" ")).filter(Boolean);
    const duplicates = texts.length - new Set(texts).size;
    // Only identical size variants of the same recipe may share every sentence.
    expect(duplicates / texts.length).toBeLessThan(0.35);
  });
});
