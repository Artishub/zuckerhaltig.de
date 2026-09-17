import seed from "./drinks.seed.json";

export type VerificationStatus =
  | "manufacturer_verified"
  | "retailer_verified"
  | "manufacturer_or_retailer_verified"
  | "manufacturer_verified_needs_field_check"
  | "needs_label_check"
  | "open_database_import";

export type DrinkFaq = {
  question: string;
  answer: string;
};

export type Drink = {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  sizeMl: number | null;
  sugarPer100Ml: number;
  source: string;
  note: string;
  sourceUrl: string;
  verificationStatus?: VerificationStatus;
  lastCheckedAt?: string;
  nutritionPer100Ml?: {
    energyKj: number;
    energyKcal: number;
    carbohydrates: number;
    sugar: number;
    fat: number;
    protein: number;
    salt: number;
  };
  computed?: {
    sugarPerPackage: number;
    sugarCubesPerPackage: number;
    energyKcalPerPackage: number;
    formula: string;
  };
  faq?: DrinkFaq[];
};

const importOnlyDrinkIds = new Set([
  "a-w-cream-soda-355",
  "a-w-root-beer-355",
  "a-w-root-beer-zero-sugar-355",
  "dr-pepper-cream-swirl-330",
  "dr-pepper-blackberry-355",
  "dr-pepper-vanilla-330",
  "dr-pepper-strawberries-cream-355",
  "dr-pepper-cherry-vanilla-330",
  "welch-s-grape-soda-355",
  "fanta-fruit-twist-330",
  "fanta-fruit-twist-zero-330",
  "fanta-shokata-330",
  "fanta-berry-330",
  "fanta-grape-330",
  "fanta-peach-330",
  "fanta-raspberry-330",
  "fanta-watermelon-330",
  "fanta-apple-330",
  "fanta-green-apple-330",
  "fanta-mango-330",
  "fanta-pineapple-330",
  "fanta-grapefruit-330",
  "fanta-grape-japan-330",
  "sprite-cherry-330",
  "sprite-ginger-330",
  "7up-mojito-330",
  "7up-cocktail-exotique-330",
  "7up-tropical-330",
  "sunkist-orange-330",
  "sunkist-grape-330",
  "mountain-dew-original-330",
  "mountain-dew-voltage-330",
  "mountain-dew-code-red-330",
  "mountain-dew-pitch-black-330",
  "mountain-dew-baja-blast-330",
  "coca-cola-cinnamon-330",
  "coca-cola-raspberry-330",
  "mirinda-orange-330",
  "mirinda-strawberry-330",
  "mirinda-lemon-330",
  "sarsi-root-beer-330",
  "poms-apple-330",
  "kinnie-330",
  "tahiti-drink-330",
]);

export const drinks = (seed.drinks as Drink[]).filter((drink) => !importOnlyDrinkIds.has(drink.id));

const canonicalPackageDrinkIds = new Map<string, string>();
const drinksByPackageKey = new Map<string, Drink[]>();
const drinksByProductFamily = new Map<string, Drink[]>();

for (const drink of drinks) {
  const packageKey = productPackageKey(drink);
  drinksByPackageKey.set(packageKey, [...(drinksByPackageKey.get(packageKey) ?? []), drink]);

  const key = productFamilyKey(drink);
  drinksByProductFamily.set(key, [...(drinksByProductFamily.get(key) ?? []), drink]);
}

for (const packageDuplicates of drinksByPackageKey.values()) {
  const representative = preferredPackageDrink(packageDuplicates);
  for (const drink of packageDuplicates) canonicalPackageDrinkIds.set(drink.id, representative.id);
}

export type DrinkDisplayItem =
  | { type: "drink"; id: string; drink: Drink }
  | { type: "group"; id: string; brandId: string; categoryId: string; drinks: Drink[]; representative: Drink };

export function calculatePackageSugar(sugarPer100Ml: number, sizeMl: number) {
  return Math.round(sugarPer100Ml * (sizeMl / 100) * 10) / 10;
}

export function calculateSugarCubes(totalSugar: number) {
  return Math.round((totalSugar / 3) * 10) / 10;
}

export function totalSugarGrams(drink: Drink) {
  if (!drink.sizeMl) return null;
  return calculatePackageSugar(drink.sugarPer100Ml, drink.sizeMl);
}

export function sugarCubes(drink: Drink) {
  const total = totalSugarGrams(drink);
  return total === null ? null : calculateSugarCubes(total);
}

export function packageEnergyKcal(drink: Drink) {
  return drink.nutritionPer100Ml && drink.sizeMl ? Math.round(drink.nutritionPer100Ml.energyKcal * (drink.sizeMl / 100) * 10) / 10 : null;
}

export function productKey(drink: Drink) {
  return `${drink.brandId}:${drink.name.trim().toLowerCase()}`;
}

export function canonicalPackageDrinkId(drink: Drink) {
  return canonicalPackageDrinkIds.get(drink.id) ?? drink.id;
}

export function canonicalPackageDrinks(items: Drink[]) {
  return items.filter((drink) => canonicalPackageDrinkId(drink) === drink.id);
}

export function isIndexableDrink(drink: Drink) {
  return Boolean(
    drink.sizeMl
      && drink.sourceUrl
      && drink.nutritionPer100Ml
      && ["manufacturer_verified", "retailer_verified", "manufacturer_or_retailer_verified"].includes(
        drink.verificationStatus ?? "",
      ),
  );
}

export function productFamilyDrinks(drink: Drink) {
  const bySize = new Map<number | null, Drink>();

  for (const item of drinksByProductFamily.get(productFamilyKey(drink)) ?? [drink]) {
    if (canonicalPackageDrinkId(item) === item.id && !bySize.has(item.sizeMl)) {
      bySize.set(item.sizeMl, item);
    }
  }

  return Array.from(bySize.values()).sort((a, b) => (a.sizeMl ?? Number.MAX_SAFE_INTEGER) - (b.sizeMl ?? Number.MAX_SAFE_INTEGER));
}

export function uniqueProductRepresentatives(items: Drink[]) {
  const byProduct = new Map<string, Drink>();

  for (const drink of canonicalPackageDrinks(items)) {
    const current = byProduct.get(productKey(drink));
    if (!current || representativeScore(drink) < representativeScore(current)) {
      byProduct.set(productKey(drink), drink);
    }
  }

  return Array.from(byProduct.values());
}

export function groupedDrinkFamilies(items: Drink[]): DrinkDisplayItem[] {
  const grouped = new Map<string, Drink[]>();

  for (const drink of uniqueProductRepresentatives(items)) {
    const key = `${drink.brandId}:${drink.categoryId}`;
    grouped.set(key, [...(grouped.get(key) ?? []), drink]);
  }

  return Array.from(grouped.entries()).flatMap<DrinkDisplayItem>(([id, groupDrinks]) => {
    if (groupDrinks.length === 1) {
      const drink = groupDrinks[0];
      return [{ type: "drink", id: drink.id, drink }];
    }

    return [
      {
        type: "group",
        id: `group:${id}`,
        brandId: groupDrinks[0].brandId,
        categoryId: groupDrinks[0].categoryId,
        drinks: groupDrinks,
        representative: groupDrinks[0],
      },
    ];
  });
}

function representativeScore(drink: Drink) {
  if (!drink.sizeMl) return 999;
  return Math.abs(drink.sizeMl - 500);
}

function productFamilyKey(drink: Drink) {
  return [
    drink.brandId,
    drink.name.trim().toLowerCase(),
    drink.sugarPer100Ml,
  ].join(":");
}

function productPackageKey(drink: Drink) {
  return [
    productFamilyKey(drink),
    drink.sizeMl,
  ].join(":");
}

function preferredPackageDrink(items: Drink[]) {
  const correctedBionade = items.find((drink) => drink.id === "bionade-naturtruebe-orange-330");
  if (correctedBionade) return correctedBionade;

  return items.find((drink) => (
    drink.sizeMl !== null && drink.id.endsWith(`-${drink.sizeMl}`)
  )) ?? items[0];
}
