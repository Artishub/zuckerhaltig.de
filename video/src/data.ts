import { categoryPeers, drinks, lowerSugarAlternative, packageEnergyKcal, sugarCubes, totalSugarGrams, type Drink } from "./site-data";

export type ContainerKind = "can" | "bottle" | "pouch";

export type DrinkRef = { id: string; label: string; kind?: ContainerKind };

// Values come from the site data, never typed in by hand. Rendering fails if a drink is missing.
export function loadDrink({ id, label, kind }: DrinkRef) {
  const drink = drinks.find((item) => item.id === id);
  if (!drink) throw new Error(`Drink ${id} fehlt in lib/data/drinks.ts`);
  const total = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  if (total === null || cubes === null || !drink.sizeMl) throw new Error(`Drink ${id} hat keine Packungswerte`);
  return {
    drink,
    label,
    kind: kind ?? (drink.sizeMl <= 355 ? "can" : "bottle"),
    per100: drink.sugarPer100Ml,
    total,
    cubes,
    sizeMl: drink.sizeMl,
    kcal: packageEnergyKcal(drink),
  };
}

export type VideoDrink = ReturnType<typeof loadDrink>;

export function alternativeFor(drink: Drink) {
  return lowerSugarAlternative(drink, categoryPeers(drink));
}

export const dailySugarGrams = 50;

export function latestCheck(items: Drink[]) {
  const latest = items.map((item) => item.lastCheckedAt ?? "").sort().at(-1) ?? "";
  return latest ? new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(latest)) : "";
}

export function format(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

export function sizeLabel(ml: number) {
  return ml >= 1000 ? `${format(ml / 1000)} l` : `${ml} ml`;
}

// "Flasche", "Dose" or "Packung" with the right article, used in hooks and reveals.
export function packageWord(kind: ContainerKind) {
  return kind === "can" ? "Dose" : kind === "pouch" ? "Packung" : "Flasche";
}
