import type { Metadata } from "next";
import Link from "next/link";
import { DrinkRows, LinkCard, PageHero } from "@/components/seo-drink-list";
import { averageSugar, drinksByCategory, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";

export const metadata: Metadata = {
  title: "Energy Drinks Zucker: Red Bull, Monster und mehr",
  description: "Energy Drinks nach Zucker vergleichen: Werte pro 100 ml, pro Dose und als Zuckerwürfel.",
  alternates: { canonical: "/de/energy-drinks-zucker" },
};

export default function EnergySugarPage() {
  const energy = drinksByCategory("energy");
  const top = topBySugarPer100(energy, 12);

  return (
    <main>
      <PageHero kicker="Energy Drinks Zucker" title="Energy Drinks im Zucker-Vergleich." text={`Vergleich von ${energy.length} Energy Drinks. Durchschnitt: ${formatNumber(averageSugar(energy))} g Zucker pro 100 ml.`} />
      <section className="mx-auto grid max-w-page gap-8 px-4 py-10 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Hohe Werte zuerst</h2>
          <p className="mt-3 leading-7 text-slate">Viele Dosen wirken klein. Darum zeigt jede Zeile auch Zucker pro Packung.</p>
          <Link href="/de/wissen/energy-drinks-zucker-vergleichen" className="mt-5 inline-block text-sm font-medium hover:text-marigold">Energy-Artikel lesen</Link>
        </div>
        <DrinkRows drinks={top} />
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto grid max-w-page gap-3 px-4 py-10 sm:grid-cols-3">
          <LinkCard href="/de/vergleiche/red-bull-vs-monster-zucker" title="Red Bull vs. Monster" text="Marken direkt gegenüberstellen." />
          <LinkCard href="/de/rankings/zuckerreichste-getraenke" title="Zuckerreichste Getränke" text="Sortiert nach Zucker pro Packung." />
          <LinkCard href="/de/getraenke?category=energy" title="Alle Energy Drinks" text="Datenbank mit Filter öffnen." />
        </div>
      </section>
    </main>
  );
}
