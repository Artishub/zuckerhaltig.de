import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { averageSugar, drinksByBrand, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Red Bull vs. Monster: Zucker im Vergleich", "Red Bull und Monster Energy Drinks nach Zucker vergleichen: Sorten pro 100 ml, pro Dose und als Zuckerwürfel mit Packungswerten und Produktdetails.", "/de/vergleiche/red-bull-vs-monster-zucker");

export default function RedBullMonsterPage() {
  const redBull = topBySugarPer100(drinksByBrand("red-bull", ["energy"]), 8);
  const monster = topBySugarPer100(drinksByBrand("monster", ["energy"]), 8);

  return (
    <main>
      <PageHero kicker="Vergleich" title="Red Bull vs. Monster: Zucker." text={`Red Bull Ø ${formatNumber(averageSugar(redBull))} g/100 ml, Monster Ø ${formatNumber(averageSugar(monster))} g/100 ml.`} />
      <section className="mx-auto grid max-w-page gap-6 px-4 py-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Red Bull</h2>
          <SortableDrinkRows drinks={redBull} />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Monster</h2>
          <SortableDrinkRows drinks={monster} />
        </div>
      </section>
    </main>
  );
}
