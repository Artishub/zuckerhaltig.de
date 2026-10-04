import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { drinks, totalSugarGrams } from "@/lib/data/drinks";
import { drinksByBrand, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Red Bull vs. Monster: Zucker im Vergleich", "Red Bull und Monster Energy Drinks nach Zucker vergleichen: Sorten pro 100 ml, pro Dose und als Zuckerwürfel mit Packungswerten und Produktdetails.", "/de/vergleiche/red-bull-vs-monster-zucker");

export default function RedBullMonsterPage() {
  const redBull = topBySugarPer100(drinksByBrand("red-bull", ["energy"]), 8);
  const monster = topBySugarPer100(drinksByBrand("monster", ["energy"]), 8);
  const redBullClassic = drinks.find((drink) => drink.id === "red-bull-energy-drink-250");
  const monsterClassic = drinks.find((drink) => drink.id === "monster-energy-original-500");
  const answer = redBullClassic && monsterClassic
    ? `Red Bull hat ${formatNumber(redBullClassic.sugarPer100Ml)} g Zucker pro 100 ml, Monster Energy ${formatNumber(monsterClassic.sugarPer100Ml)} g. In der 500-ml-Dose Monster stecken ${formatNumber(totalSugarGrams(monsterClassic) ?? 0)} g, in der 250-ml-Dose Red Bull ${formatNumber(totalSugarGrams(redBullClassic) ?? 0)} g.`
    : undefined;

  return (
    <main className="pb-24">
      <PageHero title="Red Bull vs. Monster: Zucker im Vergleich" text={answer} />
      <section className="mx-auto grid max-w-page gap-8 px-5 pt-14 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-[750] tracking-[-0.03em]">Red Bull</h2>
          <SortableDrinkRows drinks={redBull} compact />
        </div>
        <div>
          <h2 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-[750] tracking-[-0.03em]">Monster</h2>
          <SortableDrinkRows drinks={monster} compact />
        </div>
      </section>
    </main>
  );
}
