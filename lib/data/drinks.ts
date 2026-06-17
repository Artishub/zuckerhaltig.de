import seed from "./drinks.seed.json";

export type VerificationStatus =
  | "manufacturer_verified"
  | "retailer_verified"
  | "manufacturer_or_retailer_verified"
  | "manufacturer_verified_needs_field_check"
  | "needs_label_check";

export type DrinkFaq = {
  question: string;
  answer: string;
};

export type Drink = {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  sizeMl: number;
  sugarPer100Ml: number;
  source: string;
  note: string;
  sourceUrl?: string;
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

export type DrinkDisplayItem =
  | { type: "drink"; id: string; drink: Drink }
  | { type: "group"; id: string; brandId: string; categoryId: string; drinks: Drink[]; representative: Drink };

export function totalSugarGrams(drink: Drink) {
  return Math.round(drink.sugarPer100Ml * (drink.sizeMl / 100) * 10) / 10;
}

export function sugarCubes(drink: Drink) {
  return Math.round((totalSugarGrams(drink) / 3) * 10) / 10;
}

export function packageEnergyKcal(drink: Drink) {
  return drink.nutritionPer100Ml ? Math.round(drink.nutritionPer100Ml.energyKcal * (drink.sizeMl / 100) * 10) / 10 : null;
}

export function productKey(drink: Drink) {
  return `${drink.brandId}:${drink.name.trim().toLowerCase()}`;
}

export function uniqueProductRepresentatives(items: Drink[]) {
  const byProduct = new Map<string, Drink>();

  for (const drink of items) {
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
  return Math.abs(drink.sizeMl - 500);
}
