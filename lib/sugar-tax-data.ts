import { brandById } from "@/lib/data/brands";
import { categories } from "@/lib/data/categories";
import { drinks, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";
import { drinkPageHref } from "@/lib/page-routing";
import { searchIndexableDrinkIds } from "@/lib/seo-index";
import { sugarTax, sugarTaxCaveat, sugarTaxCentsPerLiter, sugarTaxPerPackageCents, sugarTaxTier } from "@/lib/sugar-tax";

// Server-side tables for the sugar tax page. Kept apart from lib/sugar-tax.ts so the client calculator does not bundle the drink data.

export type TaxRow = {
  id: string;
  href: string;
  name: string;
  brand: string;
  sizeMl: number;
  per100: number;
  centsPerLiter: number;
  perPackage: number;
};

function toRow(drink: Drink & { sizeMl: number }): TaxRow {
  return {
    id: drink.id,
    href: drinkPageHref(drink),
    name: drink.name,
    brand: brandById[drink.brandId]?.name ?? "",
    sizeMl: drink.sizeMl,
    per100: drink.sugarPer100Ml,
    centsPerLiter: sugarTaxCentsPerLiter(drink.sugarPer100Ml),
    perPackage: sugarTaxPerPackageCents(drink.sugarPer100Ml, drink.sizeMl),
  };
}

const hasSize = (drink: Drink): drink is Drink & { sizeMl: number } => Boolean(drink.sizeMl);

// One entry per recipe; juice and milk drinks are counted apart because our sugar value alone does not decide.
function products() {
  return uniqueProductRepresentatives(drinks);
}

export function calculatorItems() {
  return products()
    .map((drink) => ({
      id: drink.id,
      href: drinkPageHref(drink),
      name: drink.name,
      brand: brandById[drink.brandId]?.name ?? "",
      sizeMl: drink.sizeMl,
      per100: drink.sugarPer100Ml,
      caveat: sugarTaxCaveat(drink),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

// The drinks people search for most: the indexed product pages.
export function popularTaxRows() {
  return searchIndexableDrinkIds
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink): drink is Drink => Boolean(drink))
    .filter((drink) => !sugarTaxCaveat(drink))
    .filter(hasSize)
    .map(toRow)
    .sort((a, b) => b.perPackage - a.perPackage || b.per100 - a.per100);
}

export function tierCounts() {
  const items = products().filter((drink) => !sugarTaxCaveat(drink));
  const count = (tier: ReturnType<typeof sugarTaxTier>) => items.filter((drink) => sugarTaxTier(drink.sugarPer100Ml) === tier).length;
  return { total: items.length, none: count("none"), low: count("low"), high: count("high") };
}

// Drinks just under a threshold: 0.5 g less per 100 ml than the line or closer.
export function nearThreshold(limit = 8) {
  const items = products().filter((drink) => !sugarTaxCaveat(drink)).filter(hasSize);
  return sugarTax.tiers.map((tier) => ({
    threshold: tier.minPer100Ml,
    rows: items
      .filter((drink) => drink.sugarPer100Ml < tier.minPer100Ml && drink.sugarPer100Ml >= tier.minPer100Ml - 0.5)
      .sort((a, b) => b.sugarPer100Ml - a.sugarPer100Ml || a.name.localeCompare(b.name, "de"))
      .slice(0, limit)
      .map(toRow),
  }));
}

export function categoryTaxShares() {
  return categories
    .filter((category) => !sugarTaxCaveat({ categoryId: category.id }))
    .map((category) => {
      const items = products().filter((drink) => drink.categoryId === category.id);
      const taxed = items.filter((drink) => sugarTaxCentsPerLiter(drink.sugarPer100Ml) > 0).length;
      return { id: category.id, name: category.name, count: items.length, taxed, share: items.length ? taxed / items.length : 0 };
    })
    .filter((category) => category.count >= 5)
    .sort((a, b) => b.share - a.share);
}
