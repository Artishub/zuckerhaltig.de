import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { highestSugarDrinks } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zuckerreichste Getränke: Ranking nach Packung", "Ranking der zuckerreichsten Getränke nach Zucker pro Packung. Vergleiche zusätzlich den 100-ml-Wert, Zuckerwürfel, Packungsgröße und Produktdetails.", "/de/rankings/zuckerreichste-getraenke");

export default function HighestSugarRankingPage() {
  const drinks = highestSugarDrinks(50);

  return (
    <main>
      <PageHero kicker="Ranking" title="Zuckerreichste Getränke pro Packung." text="Sortiert nach Zucker in der ganzen Packung. Große Flaschen stehen dadurch oft weiter oben als kleine Dosen." />
      <section className="mx-auto max-w-page px-4 py-10">
        <aside className="mb-8 rounded-lg border border-ash bg-mist p-5">
          <h2 className="text-xl font-semibold tracking-tight">Die Packungsgröße entscheidet mit.</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate">Dieses Ranking rechnet Zucker pro 100 ml auf Dose oder Flasche hoch. Der 100-ml-Wert zeigt die Rezeptur, der Packungswert die Gesamtmenge.</p>
          <Link href="/de/zuckerrechner" className="mt-3 inline-flex text-sm font-medium underline decoration-ash underline-offset-4 hover:decoration-marigold">
            Zucker pro Flasche selbst berechnen
          </Link>
        </aside>
        <SortableDrinkRows drinks={drinks} defaultSort="package" />
      </section>
    </main>
  );
}
