import { brandById } from "@/lib/data/brands";
import { drinks, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";

// WHO guideline on sugars intake for adults and children (2015): free sugars below 10 % of energy,
// ideally below 5 %; at 2,000 kcal that is about 50 g and 25 g per day.
export const whoGuidelineUrl = "https://www.who.int/publications/i/item/9789241549028";
export const whoDailyLimitGrams = 50;
export const whoIdealLimitGrams = 25;

// DGE, DAG and DDG consensus paper (2018) adopts the WHO value: free sugars below 10 % of energy,
// at 2,000 kcal at most 50 g per day.
export const dgeSugarConsensusUrl = "https://www.dge.de/fileadmin/dok/wissenschaft/stellungnahmen/EU02_2019_WuF_Zucker_Eng_72.pdf";
export const dailySugarOrientationGrams = whoDailyLimitGrams;

export function dailySugarShare(totalSugarGrams: number) {
  return Math.round((totalSugarGrams / dailySugarOrientationGrams) * 100);
}

// EU Regulation 1924/2006 nutrition claims for drinks: "zuckerfrei" <= 0.5 g/100 ml, "zuckerarm" <= 2.5 g/100 ml.
export const sugarFreeMaxPer100Ml = 0.5;
export const lowSugarMaxPer100Ml = 2.5;

export type SugarLevel = "free" | "low" | "sugared";

export function sugarLevel(sugarPer100Ml: number): SugarLevel {
  if (sugarPer100Ml <= sugarFreeMaxPer100Ml) return "free";
  if (sugarPer100Ml <= lowSugarMaxPer100Ml) return "low";
  return "sugared";
}

export const sugarLevelLabel: Record<SugarLevel, string> = {
  free: "zuckerfrei",
  low: "zuckerarm",
  sugared: "mit Zucker",
};

export function categoryPeers(drink: Drink) {
  return uniqueProductRepresentatives(drinks.filter((item) => item.categoryId === drink.categoryId));
}

export function averageSugarPer100Ml(items: Drink[]) {
  return items.length ? items.reduce((sum, item) => sum + item.sugarPer100Ml, 0) / items.length : null;
}

export function sugarRank(drink: Drink, peers: Drink[]) {
  return peers.filter((item) => item.name !== drink.name && item.sugarPer100Ml > drink.sugarPer100Ml).length + 1;
}

export function lowerSugarAlternative(drink: Drink, peers: Drink[]) {
  const candidates = peers
    .filter((item) => item.name !== drink.name && item.sugarPer100Ml <= drink.sugarPer100Ml - 2)
    .sort((a, b) => (
      Number(b.brandId === drink.brandId) - Number(a.brandId === drink.brandId)
        || a.sugarPer100Ml - b.sugarPer100Ml
        || a.name.localeCompare(b.name, "de")
    ));
  return candidates[0] ?? null;
}

const tasteStopWords = /\b(zero|sugar ?free|sugarfree|sugar|light|ohne|zucker|zuckerfrei|lite|original|classic|the|edition|energy|drink|ice|tea)\b/g;

function tasteWords(drink: Drink) {
  const brandWords = new Set((brandById[drink.brandId]?.name ?? "").toLowerCase().split(/[^a-zäöüß]+/));
  return drink.name.toLowerCase().replace(tasteStopWords, " ").split(/[^a-zäöüß]+/).filter((word) => word.length > 3 && !brandWords.has(word));
}

// Up to three swaps with clearly less sugar in the same category. Same brand first (often the zero variant),
// then drinks that share a flavor word (Orange, Zitrone, Pfirsich ...), then the lowest sugar value.
export function swapAlternatives(drink: Drink, limit = 3) {
  const flavors = new Set(tasteWords(drink));
  const score = (item: Drink) => (item.brandId === drink.brandId ? 2 : 0) + (tasteWords(item).some((word) => flavors.has(word)) ? 1 : 0);
  return categoryPeers(drink)
    .filter((item) => item.name !== drink.name && item.sugarPer100Ml <= drink.sugarPer100Ml - 2)
    .sort((a, b) => score(b) - score(a) || a.sugarPer100Ml - b.sugarPer100Ml || a.name.localeCompare(b.name, "de"))
    .slice(0, limit);
}
