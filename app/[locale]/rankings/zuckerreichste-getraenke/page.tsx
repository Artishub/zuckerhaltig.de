import type { Metadata } from "next";
import { DrinkRows, PageHero } from "@/components/seo-drink-list";
import { highestSugarDrinks } from "@/lib/seo-drinks";

export const metadata: Metadata = {
  title: "Zuckerreichste Getränke: Ranking nach Packung",
  description: "Ranking der zuckerreichsten Getränke nach Zucker pro Packung mit 100-ml-Wert und Zuckerwürfeln.",
  alternates: { canonical: "/de/rankings/zuckerreichste-getraenke" },
};

export default function HighestSugarRankingPage() {
  const drinks = highestSugarDrinks(50);

  return (
    <main>
      <PageHero kicker="Ranking" title="Zuckerreichste Getränke." text="Sortiert nach Zucker pro Packung. Große Flaschen stehen dadurch oft weiter oben als kleine Dosen." />
      <section className="mx-auto max-w-page px-4 py-10">
        <DrinkRows drinks={drinks} />
      </section>
    </main>
  );
}
