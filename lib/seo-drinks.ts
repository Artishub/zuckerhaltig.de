import { brandById } from "@/lib/data/brands";
import { categoryById } from "@/lib/data/categories";
import { canonicalDrinkId, drinks, sugarCubes, totalSugarGrams, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";

export function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

export function sizeLabel(drink: Drink) {
  return drink.sizeMl ? `${drink.sizeMl} ml` : "/";
}

export function brandName(drink: Drink) {
  return brandById[drink.brandId]?.name ?? "Marke";
}

export function categoryName(drink: Drink) {
  return categoryById[drink.categoryId]?.name ?? "Getränk";
}

export function drinkHref(drink: Drink) {
  return `/de/getraenke/${canonicalDrinkId(drink)}`;
}

export function drinkSummary(drink: Drink) {
  const total = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  const totalText = total === null ? "Packung offen" : `${formatNumber(total)} g pro Packung`;
  const cubesText = cubes === null ? "" : `, ca. ${formatNumber(cubes)} Zuckerwürfel`;
  return `${brandName(drink)} · ${sizeLabel(drink)} · ${formatNumber(drink.sugarPer100Ml)} g/100 ml · ${totalText}${cubesText}`;
}

export function drinksByCategory(categoryId: string) {
  return uniqueProductRepresentatives(drinks.filter((drink) => drink.categoryId === categoryId));
}

export function drinksByBrand(brandId: string, categoryIds?: string[]) {
  return uniqueProductRepresentatives(drinks.filter((drink) => {
    if (drink.brandId !== brandId) return false;
    return categoryIds ? categoryIds.includes(drink.categoryId) : true;
  }));
}

export function highestSugarDrinks(limit: number) {
  return uniqueProductRepresentatives(drinks)
    .filter((drink) => totalSugarGrams(drink) !== null)
    .sort((a, b) => (totalSugarGrams(b) ?? 0) - (totalSugarGrams(a) ?? 0))
    .slice(0, limit);
}

export function sugarFreeDrinks(limit: number) {
  return uniqueProductRepresentatives(drinks)
    .filter((drink) => drink.sugarPer100Ml <= 0.5)
    .sort((a, b) => brandName(a).localeCompare(brandName(b), "de") || a.name.localeCompare(b.name, "de"))
    .slice(0, limit);
}

export function topBySugarPer100(items: Drink[], limit = 12) {
  return [...items].sort((a, b) => b.sugarPer100Ml - a.sugarPer100Ml).slice(0, limit);
}

export function averageSugar(items: Drink[]) {
  if (!items.length) return 0;
  return Math.round((items.reduce((sum, drink) => sum + drink.sugarPer100Ml, 0) / items.length) * 10) / 10;
}
