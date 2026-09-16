import { canonicalPackageDrinkId, isIndexableDrink, type Drink } from "@/lib/data/drinks";

export const searchIndexableDrinkIds = [
  "coca-cola-classic-500",
  "fanta-orange-500",
  "paulaner-spezi-500",
  "sprite-500",
  "red-bull-energy-drink-250",
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
