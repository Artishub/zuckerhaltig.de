import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { highestSugarDrinks } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zuckerreichste Getränke: Ranking nach Packung", "Ranking der zuckerreichsten Getränke nach Zucker pro Packung. Vergleiche zusätzlich den 100-ml-Wert, Zuckerwürfel, Packungsgröße und Produktdetails.", "/de/rankings/zuckerreichste-getraenke");

export default function HighestSugarRankingPage() {
  const drinks = highestSugarDrinks(50);

  return (
    <main>
      <PageHero kicker="Ranking" title="Zuckerreichste Getränke." text="Sortiert nach Zucker pro Packung. Große Flaschen stehen dadurch oft weiter oben als kleine Dosen." />
      <section className="mx-auto max-w-page px-4 py-10">
        <SortableDrinkRows drinks={drinks} defaultSort="package" />
      </section>
    </main>
  );
}
