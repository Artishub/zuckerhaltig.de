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

export const drinks = seed.drinks as Drink[];

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
