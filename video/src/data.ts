import { drinks, packageEnergyKcal, sugarCubes, totalSugarGrams, type Drink } from "../../lib/data/drinks";

// Values come from the site data, never typed in by hand. The render fails if a drink is missing.
function load(id: string) {
  const drink = drinks.find((item) => item.id === id);
  if (!drink) throw new Error(`Drink ${id} fehlt in lib/data/drinks.ts`);
  const total = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  if (total === null || cubes === null || !drink.sizeMl) throw new Error(`Drink ${id} hat keine Packungswerte`);
  return { drink, per100: drink.sugarPer100Ml, total, cubes, sizeMl: drink.sizeMl, kcal: packageEnergyKcal(drink) };
}

export type VideoDrink = ReturnType<typeof load> & { label: string; kind: "can" | "bottle" };

export const redBull: VideoDrink = { ...load("red-bull-energy-drink-250"), label: "Red Bull", kind: "can" };
export const cola: VideoDrink = { ...load("coca-cola-classic-500"), label: "Coca-Cola", kind: "bottle" };

export const dailySugarGrams = 50;

export function latestCheck(items: Drink[]) {
  const latest = items.map((item) => item.lastCheckedAt ?? "").sort().at(-1) ?? "";
  return latest ? new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(latest)) : "";
}

export function format(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}
