import type { Metadata } from "next";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { sugarFreeDrinks } from "@/lib/seo-drinks";

export const metadata: Metadata = {
  title: "Zuckerfreie Getränke: Ranking und Liste",
  description: "Getränke mit maximal 0,5 g Zucker pro 100 ml vergleichen: Cola Zero, Light, Energy und weitere Varianten.",
  alternates: { canonical: "/de/rankings/zuckerfreie-getraenke" },
};

export default function SugarFreeRankingPage() {
  const drinks = sugarFreeDrinks(50);

  return (
    <main>
      <PageHero kicker="Ranking" title="Zuckerfreie Getränke." text="Liste mit Getränken bis 0,5 g Zucker pro 100 ml. Die Angaben kommen aus den vorhandenen Nährwertdaten." />
      <section className="mx-auto max-w-page px-4 py-10">
        <SortableDrinkRows drinks={drinks} defaultSort="brand" />
      </section>
    </main>
  );
}
