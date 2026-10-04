import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { drinks, totalSugarGrams } from "@/lib/data/drinks";
import { drinksByBrand, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Coca-Cola vs. Pepsi: Zucker im Vergleich", "Coca-Cola und Pepsi nach Zucker vergleichen: klassische und zuckerfreie Sorten pro 100 ml, pro Packung und als Zuckerwürfel mit direkten Produktlinks.", "/de/vergleiche/coca-cola-vs-pepsi-zucker");

export default function CokePepsiPage() {
  const coke = topBySugarPer100(drinksByBrand("coca-cola", ["cola"]), 8);
  const pepsi = topBySugarPer100(drinksByBrand("pepsi", ["cola"]), 8);
  const cokeClassic = drinks.find((drink) => drink.id === "coca-cola-classic-500");
  const pepsiClassic = drinks.find((drink) => drink.id === "pepsi-500");
  const answer = cokeClassic && pepsiClassic
    ? `Coca-Cola Classic hat ${formatNumber(cokeClassic.sugarPer100Ml)} g Zucker pro 100 ml, Pepsi ${formatNumber(pepsiClassic.sugarPer100Ml)} g. In 500 ml sind das ${formatNumber(totalSugarGrams(cokeClassic) ?? 0)} g gegenüber ${formatNumber(totalSugarGrams(pepsiClassic) ?? 0)} g.`
    : undefined;

  return (
    <main className="pb-24">
      <PageHero title="Coca-Cola vs. Pepsi: Zucker im Vergleich" text={answer} />
      <section className="mx-auto grid max-w-page gap-8 px-5 pt-14 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-[750] tracking-[-0.03em]">Coca-Cola</h2>
          <SortableDrinkRows drinks={coke} compact />
        </div>
        <div>
          <h2 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-[750] tracking-[-0.03em]">Pepsi</h2>
          <SortableDrinkRows drinks={pepsi} compact />
        </div>
      </section>
    </main>
  );
}
