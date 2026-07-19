import Link from "next/link";
import { LinkCard, PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { averageSugar, drinksByCategory, formatNumber } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Energy Drinks: Zucker pro 100 ml und pro Dose", "Energy Drinks nach Zucker vergleichen: Red Bull, Monster und weitere Marken pro 100 ml, pro Dose und als Zuckerwürfel. Mit Packungswerten und Quellen.", "/de/energy-drinks-zucker");

export default function EnergySugarPage() {
  const energy = drinksByCategory("energy");
  return (
    <main>
      <PageHero kicker="Energy Drinks Zucker" title="Energy Drinks: Zucker pro 100 ml und pro Dose" text={`Vergleich von ${energy.length} Energy Drinks. Durchschnitt: ${formatNumber(averageSugar(energy))} g Zucker pro 100 ml.`} />
      <section className="mx-auto grid max-w-page gap-8 px-4 py-10 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Hohe Werte zuerst</h2>
          <p className="mt-3 leading-7 text-slate">Viele Dosen wirken klein. Darum zeigt jede Zeile auch Zucker pro Packung.</p>
          <Link href="/de/wissen/energy-drinks-zucker-vergleichen" className="mt-5 inline-block text-sm font-medium hover:text-marigold">Energy-Artikel lesen</Link>
        </div>
        <SortableDrinkRows drinks={energy} />
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto grid max-w-page gap-3 px-4 py-10 sm:grid-cols-3">
          <LinkCard href="/de/vergleiche/red-bull-vs-monster-zucker" title="Red Bull vs. Monster" text="Marken direkt gegenüberstellen." />
          <LinkCard href="/de/rankings/zuckerreichste-getraenke" title="Zuckerreichste Getränke" text="Sortiert nach Zucker pro Packung." />
          <LinkCard href="/de/marken/red-bull" title="Red Bull vergleichen" text="Sorten und Packungsgrößen der Marke ansehen." />
        </div>
      </section>
    </main>
  );
}
