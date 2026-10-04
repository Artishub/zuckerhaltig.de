import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { Section, textLinkClass } from "@/components/ui/section";
import { highestSugarDrinks } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zuckerreichste Getränke: Ranking nach Packung", "Ranking der zuckerreichsten Getränke nach Zucker pro Packung. Vergleiche zusätzlich den 100-ml-Wert, Zuckerwürfel, Packungsgröße und Produktdetails.", "/de/rankings/zuckerreichste-getraenke");

export default function HighestSugarRankingPage() {
  const drinks = highestSugarDrinks(50);

  return (
    <main className="pb-24">
      <PageHero title="Zuckerreichste Getränke pro Packung" text="Sortiert nach Zucker in der ganzen Packung. Große Flaschen stehen dadurch oft vor kleinen Dosen. Ein Klick auf „pro 100 ml“ sortiert nach Rezeptur." />
      <p className="mx-auto max-w-page px-5 text-sm leading-6 text-slate">
        Eigene Füllmenge? <Link href="/de/zuckerrechner" className={textLinkClass}>Zucker pro Flasche berechnen</Link>
      </p>
      <Section id="liste" title={`Die ${drinks.length} zuckerreichsten Packungen`}>
        <SortableDrinkRows drinks={drinks} defaultSort="package" />
      </Section>
    </main>
  );
}
