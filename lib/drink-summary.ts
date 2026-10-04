import { brandById } from "@/lib/data/brands";
import { categories, categoryById } from "@/lib/data/categories";
import { canonicalPackageDrinkId, drinks, totalSugarGrams, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";
import { drinkPageHref } from "@/lib/page-routing";
import { averageSugarPer100Ml, sugarLevel, type SugarLevel } from "@/lib/sugar-context";

// Compact drink view model for the shared UI components (search, tables, strip plot).

export type DrinkSummary = {
  id: string;
  href: string;
  name: string;
  brand: string;
  category: string;
  categoryId: string;
  sizeMl: number | null;
  per100: number;
  total: number | null;
  level: SugarLevel;
};

export function brandLabel(drink: Drink) {
  return brandById[drink.brandId]?.name ?? "";
}

export function summarize(drink: Drink): DrinkSummary {
  const id = canonicalPackageDrinkId(drink);
  return {
    id,
    href: drinkPageHref(drink),
    name: drink.name,
    brand: brandLabel(drink),
    category: categoryById[drink.categoryId]?.name ?? "Getränk",
    categoryId: drink.categoryId,
    sizeMl: drink.sizeMl,
    per100: drink.sugarPer100Ml,
    total: totalSugarGrams(drink),
    level: sugarLevel(drink.sugarPer100Ml),
  };
}

export function productSummaries() {
  return uniqueProductRepresentatives(drinks)
    .map(summarize)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

export function categoryStats() {
  return categories
    .map((category) => {
      const items = uniqueProductRepresentatives(drinks.filter((drink) => drink.categoryId === category.id));
      const values = items.map((drink) => drink.sugarPer100Ml);
      return {
        id: category.id,
        name: category.name,
        count: items.length,
        average: averageSugarPer100Ml(items),
        min: values.length ? Math.min(...values) : null,
        max: values.length ? Math.max(...values) : null,
      };
    })
    .filter((category) => category.count > 0)
    .sort((a, b) => (b.average ?? 0) - (a.average ?? 0));
}

// Axis maximum: next even number above the highest value, so the top drink never sits on the edge.
export function scaleMax() {
  const highest = Math.max(...uniqueProductRepresentatives(drinks).map((drink) => drink.sugarPer100Ml));
  return Math.ceil((highest + 0.5) / 2) * 2;
}

export function latestCheckedAt() {
  return drinks.reduce((latest, drink) => (drink.lastCheckedAt && drink.lastCheckedAt > latest ? drink.lastCheckedAt : latest), "");
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}
