import searchConsolePages from "@/lib/data/search-console-pages.json";
import { canonicalPackageDrinkId, drinks, productFamilyDrinks, type Drink } from "@/lib/data/drinks";
import { searchIndexableDrinkIds } from "@/lib/seo-index";

// One page per recipe. A size or flavor page only keeps its own URL when it is the recipe page,
// is allowlisted for indexing, or had Google impressions in the Search Console export.
// Everything else 301-redirects (Next answers 308) to the page that lists it.

const impressionsByPath = searchConsolePages.impressionsByPath as Record<string, number>;
const indexableIds = new Set<string>(searchIndexableDrinkIds);

export function drinkPath(drinkId: string) {
  return `/de/getraenke/${drinkId}`;
}

export function searchImpressions(path: string) {
  return impressionsByPath[path] ?? 0;
}

export function sizeAnchor(drink: Drink) {
  return drink.sizeMl ? `groesse-${drink.sizeMl}-ml` : "groesse-offen";
}

// Flavor variants with identical values that are listed on one shared page instead of their own.
export type FlavorLine = {
  id: string;
  brandId: string;
  label: string;
  page: string;
  matches: (drink: Drink) => boolean;
};

export const flavorLines: FlavorLine[] = [
  {
    id: "red-bull-editions",
    brandId: "red-bull",
    label: "Red Bull Editionen",
    page: "/de/marken/red-bull",
    matches: (drink) => drink.brandId === "red-bull" && /edition/i.test(drink.name),
  },
];

export function flavorLineFor(drink: Drink) {
  return flavorLines.find((line) => line.matches(drink)) ?? null;
}

export function flavorLineDrinks(line: FlavorLine) {
  return drinks
    .filter((drink) => canonicalPackageDrinkId(drink) === drink.id && line.matches(drink))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

function keepsOwnPage(drink: Drink) {
  return indexableIds.has(drink.id) || searchImpressions(drinkPath(drink.id)) > 0;
}

// The size that carries the recipe page: allowlisted first, then most impressions, then 500 ml, then the largest.
export function recipePageDrink(drink: Drink) {
  const family = productFamilyDrinks(drink);
  return [...family].sort((a, b) => (
    Number(indexableIds.has(b.id)) - Number(indexableIds.has(a.id))
      || searchImpressions(drinkPath(b.id)) - searchImpressions(drinkPath(a.id))
      || Number(b.sizeMl === 500) - Number(a.sizeMl === 500)
      || (b.sizeMl ?? 0) - (a.sizeMl ?? 0)
  ))[0] ?? drink;
}

// Where a drink URL should redirect to, or null if the page stays. Expects a canonical package id.
export function drinkRedirectTarget(drink: Drink): string | null {
  if (keepsOwnPage(drink)) return null;

  const line = flavorLineFor(drink);
  if (line) return `${line.page}#${drink.id}`;

  const recipe = recipePageDrink(drink);
  if (recipe.id === drink.id) return null;
  return `${drinkPath(recipe.id)}#${sizeAnchor(drink)}`;
}

// The href internal links should use, so they never point at a redirect.
export function drinkPageHref(drink: Drink) {
  const canonical = drinks.find((item) => item.id === canonicalPackageDrinkId(drink)) ?? drink;
  return drinkRedirectTarget(canonical) ?? drinkPath(canonical.id);
}

// Removed drink URLs that still had impressions: send them to the closest live page.
export const removedDrinkRedirects: Record<string, string> = {
  "sunkist-grape-330": "/de/kategorien/softdrink",
  "fanta-apple-330": "/de/marken/fanta",
  "fanta-mango-330": "/de/marken/fanta",
  "a-w-cream-soda-355": "/de/kategorien/softdrink",
  "club-mate-cola-zero-330": "/de/wissen/cola-zucker-pro-100ml",
  "pfanner-eistee-himbeere-500": "/de/wissen/eistee-zucker-im-alltag",
  "coca-cola-raspberry-330": "/de/marken/coca-cola",
};
