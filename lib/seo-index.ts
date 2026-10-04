import { canonicalPackageDrinkId, isIndexableDrink, type Drink } from "@/lib/data/drinks";

export const searchIndexableDrinkIds = [
  "coca-cola-classic-500",
  "fanta-orange-500",
  "paulaner-spezi-500",
  "sprite-500",
  "red-bull-energy-drink-250",
  // Wave 1 (2026-10-04): recipe pages with the most Search Console impressions (export 2026-10-02).
  "coca-cola-zero-sugar-330",
  "mezzo-mix-original-500",
  "monster-mango-loco-500",
  "coca-cola-light-500",
  "sprite-zero-sugar-mint-chill-330",
  "spezi-original-500",
  "almdudler-original-500",
  "fuze-tea-pfirsich-hibiskus-1250",
  "pepsi-1500",
  "lipton-ice-tea-zitrone-500",
  "capri-sun-kirsche-200",
  "orangina-original-250",
  "lift-apfelschorle-1250",
  "vita-cola-mix-1000",
  "fuze-tea-zitrone-1250",
] as const;

export const searchIndexableBrandIds = [
  "coca-cola",
  "fanta",
  "sprite",
  "red-bull",
  "monster",
  "pepsi",
  "spezi",
  "fuze-tea",
] as const;

const searchIndexableDrinkIdSet = new Set<string>(searchIndexableDrinkIds);
const searchIndexableBrandIdSet = new Set<string>(searchIndexableBrandIds);

export function isSearchIndexableDrink(drink: Drink) {
  return Boolean(
    canonicalPackageDrinkId(drink) === drink.id
      && searchIndexableDrinkIdSet.has(drink.id)
      && isIndexableDrink(drink),
  );
}

export function isSearchIndexableBrand(brandId: string) {
  return searchIndexableBrandIdSet.has(brandId);
}
