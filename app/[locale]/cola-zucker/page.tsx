import type { Metadata } from "next";
import Link from "next/link";
import { DrinkRows, LinkCard, PageHero } from "@/components/seo-drink-list";
import { averageSugar, drinksByCategory, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";

export const metadata: Metadata = {
  title: "Cola Zucker: Werte pro 100 ml und Flasche",
  description: "Cola nach Zucker vergleichen: klassische Cola, Zero-Varianten und Packungsgrößen pro 100 ml und pro Flasche.",
  alternates: { canonical: "/de/cola-zucker" },
};

export default function ColaSugarPage() {
  const cola = [...drinksByCategory("cola"), ...drinksByCategory("cola-mix")];
  const top = topBySugarPer100(cola, 12);

  return (
    <main>
      <PageHero kicker="Cola Zucker" title="Wie viel Zucker hat Cola?" text={`Vergleich von ${cola.length} Cola-Produkten. Durchschnitt: ${formatNumber(averageSugar(cola))} g Zucker pro 100 ml.`} />
      <section className="mx-auto grid max-w-page gap-8 px-4 py-10 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Top-Werte</h2>
          <p className="mt-3 leading-7 text-slate">Sortiert nach Zucker pro 100 ml. Die Packung entscheidet zusätzlich, wie viel Zucker du insgesamt trinkst.</p>
          <Link href="/de/wissen/cola-zucker-pro-100ml" className="mt-5 inline-block text-sm font-medium hover:text-marigold">Cola-Artikel lesen</Link>
        </div>
        <DrinkRows drinks={top} />
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto grid max-w-page gap-3 px-4 py-10 sm:grid-cols-3">
          <LinkCard href="/de/vergleiche/coca-cola-vs-pepsi-zucker" title="Coca-Cola vs. Pepsi" text="Zuckerwerte der Cola-Klassiker vergleichen." />
          <LinkCard href="/de/wissen/cola-zero-light-und-klassisch" title="Cola Zero und Light" text="Warum Zero-Varianten fast keinen Zucker haben." />
          <LinkCard href="/de/rankings/zuckerfreie-getraenke" title="Zuckerfreie Getränke" text="Getränke mit maximal 0,5 g Zucker pro 100 ml." />
        </div>
      </section>
    </main>
  );
}
