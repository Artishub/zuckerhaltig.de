import { brandById } from "@/lib/data/brands";
import { drinks, productFamilyDrinks, totalSugarGrams, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";
import { drinkPageHref } from "@/lib/page-routing";
import { averageSugarPer100Ml, categoryPeers, lowerSugarAlternative, sugarFreeMaxPer100Ml, sugarRank, whoDailyLimitGrams } from "@/lib/sugar-context";

// Sentences built only from this drink's data. Each fact appears only when its inputs are complete,
// so no page carries a filler sentence that reads the same everywhere.

export type DrinkFact = { id: string; label: string; text: string; href?: string; linkLabel?: string };

const categoryPlural: Record<string, string> = {
  softdrink: "Softdrinks",
  cola: "Colas",
  "cola-mix": "Cola-Mix-Getränken",
  "orange-limo": "Orangenlimonaden",
  "lemon-lime": "Zitronen- und Limettenlimonaden",
  "iced-tea": "Eistees",
  "bio-limo": "Bio-Limonaden",
  schorle: "Schorlen",
  energy: "Energy Drinks",
  mate: "Mate-Getränken",
  fassbrause: "Fassbrausen",
  juice: "Säften",
  "juice-drink": "Fruchtsaftgetränken",
  "milk-drink": "Milchgetränken",
};

const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const format = (value: number) => numberFormat.format(value);
const sizeText = (sizeMl: number) => (sizeMl >= 1000 ? `${format(sizeMl / 1000)} l` : `${sizeMl} ml`);

function ordinalRank(rank: number, total: number) {
  if (rank === 1) return "den höchsten";
  if (rank === 2) return "den zweithöchsten";
  if (rank === 3) return "den dritthöchsten";
  if (rank === total) return "den niedrigsten";
  return `Platz ${rank} von ${total} beim`;
}

export function drinkFacts(drink: Drink): DrinkFact[] {
  const facts: DrinkFact[] = [];
  const brandName = brandById[drink.brandId]?.name ?? "";
  const plural = categoryPlural[drink.categoryId];
  const isSugarFree = drink.sugarPer100Ml <= sugarFreeMaxPer100Ml;
  const peers = categoryPeers(drink);
  const average = averageSugarPer100Ml(peers);

  if (plural && peers.length >= 3 && average !== null) {
    if (isSugarFree) {
      const sugarFreeCount = peers.filter((item) => item.sugarPer100Ml <= sugarFreeMaxPer100Ml).length;
      facts.push({
        id: "category-rank",
        label: "In der Kategorie",
        text: `${sugarFreeCount} von ${peers.length} ${plural} sind zuckerfrei, ${drink.name} gehört dazu. Der Durchschnitt der Kategorie liegt bei ${format(average)} g pro 100 ml.`,
      });
    } else {
      const rank = sugarRank(drink, peers);
      const difference = drink.sugarPer100Ml - average;
      const relation = Math.abs(difference) < 0.5
        ? `etwa im Durchschnitt von ${format(average)} g`
        : `${format(Math.abs(difference))} g ${difference > 0 ? "über" : "unter"} dem Durchschnitt von ${format(average)} g`;
      facts.push({
        id: "category-rank",
        label: "In der Kategorie",
        text: `Platz ${rank} von ${peers.length} ${plural}, sortiert von viel nach wenig Zucker pro 100 ml. Damit liegt das Getränk ${relation}.`,
      });
    }
  }

  const brandProducts = uniqueProductRepresentatives(drinks.filter((item) => item.brandId === drink.brandId && item.categoryId === drink.categoryId));
  if (brandName && brandProducts.length >= 3 && !isSugarFree) {
    const sorted = [...brandProducts].sort((a, b) => b.sugarPer100Ml - a.sugarPer100Ml);
    const rank = sorted.findIndex((item) => item.name === drink.name) + 1;
    if (rank > 0) {
      facts.push({
        id: "brand-rank",
        label: `Bei ${brandName}`,
        text: `Unter ${brandProducts.length} Sorten von ${brandName} in dieser Kategorie hat ${drink.name} ${ordinalRank(rank, brandProducts.length)} Zuckerwert.`,
      });
    }
  }

  const alternative = isSugarFree ? null : lowerSugarAlternative(drink, peers);
  if (alternative && drink.sizeMl) {
    const saved = ((drink.sugarPer100Ml - alternative.sugarPer100Ml) * drink.sizeMl) / 100;
    facts.push({
      id: "alternative",
      label: "Weniger Zucker",
      text: `${alternative.name} hat ${format(alternative.sugarPer100Ml)} g pro 100 ml. Bei ${sizeText(drink.sizeMl)} sind das ${format(saved)} g Zucker weniger, rund ${format(saved / 3)} Würfel.`,
      href: drinkPageHref(alternative),
      linkLabel: `${alternative.name} ansehen`,
    });
  }

  const family = productFamilyDrinks(drink).filter((item) => item.sizeMl);
  if (family.length > 1 && !isSugarFree) {
    const smallest = family[0];
    const largest = family[family.length - 1];
    const smallSugar = totalSugarGrams(smallest);
    const largeSugar = totalSugarGrams(largest);
    if (smallest.sizeMl && largest.sizeMl && smallSugar !== null && largeSugar !== null) {
      facts.push({
        id: "sizes",
        label: "Packungsgrößen",
        text: `Erfasst in ${family.length} Größen von ${sizeText(smallest.sizeMl)} bis ${sizeText(largest.sizeMl)}: ${format(smallSugar)} g bis ${format(largeSugar)} g Zucker.`,
      });
    }
  }

  const total = totalSugarGrams(drink);
  if (total !== null && drink.sizeMl && !isSugarFree && drink.categoryId !== "milk-drink") {
    facts.push({
      id: "who",
      label: "Tagesorientierung",
      text: `Eine Packung entspricht ${Math.round((total / whoDailyLimitGrams) * 100)} % von ${whoDailyLimitGrams} g, der WHO-Orientierung für freien Zucker bei 2.000 kcal am Tag.`,
    });
  }

  const original = isSugarFree ? sugaredOriginal(drink) : null;
  const originalTotal = original && drink.sizeMl ? (original.sugarPer100Ml * drink.sizeMl) / 100 : null;
  if (original && originalTotal !== null && drink.sizeMl) {
    facts.push({
      id: "original",
      label: "Gegenüber dem Original",
      text: `${original.name} hat ${format(original.sugarPer100Ml)} g Zucker pro 100 ml. Bei ${sizeText(drink.sizeMl)} spart ${drink.name} damit ${format(originalTotal)} g Zucker, rund ${format(originalTotal / 3)} Würfel.`,
      href: drinkPageHref(original),
      linkLabel: `${original.name} ansehen`,
    });
  }

  return facts;
}

const variantWords = /\b(zero|sugar ?free|sugarfree|sugar|light|ohne zucker|zuckerfrei|zucker|lite)\b/g;

// The sugared product a zero variant replaces: same brand and category, name without the zero wording.
function sugaredOriginal(drink: Drink) {
  const base = drink.name.toLowerCase().replace(variantWords, "").replace(/\s+/g, " ").trim();
  if (!base) return null;
  const candidates = uniqueProductRepresentatives(drinks.filter((item) => (
    item.brandId === drink.brandId
      && item.categoryId === drink.categoryId
      && item.sugarPer100Ml > sugarFreeMaxPer100Ml
      && item.name.toLowerCase().startsWith(base)
  )));
  const score = (item: Drink) => {
    const name = item.name.toLowerCase();
    if (name === base) return 0;
    if (/\b(classic|original)\b/.test(name)) return 1;
    return 2;
  };
  return candidates.sort((a, b) => score(a) - score(b) || a.name.length - b.name.length)[0] ?? null;
}
