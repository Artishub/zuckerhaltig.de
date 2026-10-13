import type { Drink } from "@/lib/data/drinks";

// Planned German sugar tax on drinks. Every rule lives here; the page, the calculator and the tables read from it.
// Update `status`, `statusDate` and `sources` whenever the legislative process moves on.
export const sugarTax = {
  statusDate: "2026-10-13",
  status: "Union und SPD haben sich geeinigt. Das Kabinett soll den Entwurf am 14. Oktober beschließen, danach entscheiden Bundestag und Bundesrat. Ein Gesetz gibt es noch nicht.",
  startDate: "2027-07-01",
  // Ordered from the highest threshold down.
  tiers: [
    { minPer100Ml: 8, centsPerLiter: 32 },
    { minPer100Ml: 5, centsPerLiter: 26 },
  ],
  smallProducerMaxLiters: 1_000_000,
  revenueEuro: [
    { year: 2027, amount: 690_000_000 },
    { year: 2028, amount: 925_000_000 },
  ],
  exemptions: [
    "Getränke mit Süßungsmitteln statt Zucker, zum Beispiel Zero und Light",
    "reine Frucht- und Obstsäfte",
    "alkoholfreies Bier, alkoholfreie Biermischgetränke, alkoholfreier Wein und Sekt",
    "Drinks auf Basis von Soja, Nüssen, Samen oder Getreide",
    "Hersteller mit weniger als 1 Million Litern zuckerhaltiger Getränke im Jahr",
  ],
  sources: [
    { label: "ZDFheute: Bundesregierung einigt sich", url: "https://www.zdfheute.de/politik/deutschland/zuckersteuer-einigung-bundesregierung-100.html" },
    { label: "Handelsblatt: Koalition legt Streit um Zuckersteuer bei", url: "https://www.handelsblatt.com/politik/deutschland/bundespolitik-koalition-legt-streit-um-zuckersteuer-bei/100137034.html" },
    { label: "dpa-AFX via onvista: Koalition legt Streit über Zuckersteuer bei", url: "https://www.onvista.de/news/2026/10-13-roundup-koalition-legt-streit-ueber-zuckersteuer-bei-0-10-26563718" },
  ],
} as const;

export type SugarTaxTier = "none" | "low" | "high";

export function sugarTaxCentsPerLiter(sugarPer100Ml: number) {
  return sugarTax.tiers.find((tier) => sugarPer100Ml >= tier.minPer100Ml)?.centsPerLiter ?? 0;
}

export function sugarTaxTier(sugarPer100Ml: number): SugarTaxTier {
  const rate = sugarTaxCentsPerLiter(sugarPer100Ml);
  return rate === 0 ? "none" : rate === sugarTax.tiers[0].centsPerLiter ? "high" : "low";
}

// Tax on one package in cents, rounded to a tenth of a cent.
export function sugarTaxPerPackageCents(sugarPer100Ml: number, sizeMl: number) {
  return Math.round(sugarTaxCentsPerLiter(sugarPer100Ml) * sizeMl / 100) / 10;
}

// Categories where our sugar value alone does not decide: pure juice is exempt, milk drinks are not named in the reports.
export type SugarTaxCaveat = "juice" | "milk" | null;

export function sugarTaxCaveat(drink: Pick<Drink, "categoryId">): SugarTaxCaveat {
  if (drink.categoryId === "juice") return "juice";
  if (drink.categoryId === "milk-drink") return "milk";
  return null;
}

export const sugarTaxCaveatText: Record<Exclude<SugarTaxCaveat, null>, string> = {
  juice: "Reiner Saft ist ausgenommen, Nektar und Fruchtsaftgetränke nicht. Für reinen Saft fiele also keine Steuer an.",
  milk: "Ob Milchgetränke betroffen sind, nennen die Berichte bisher nicht.",
};

export function formatCents(cents: number) {
  return `${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(cents)} ct`;
}
