import type { Metadata } from "next";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { averageSugar, drinksByBrand, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";

export const metadata: Metadata = {
  title: "Fanta vs. Sprite: Zucker im Vergleich",
  description: "Fanta und Sprite nach Zucker vergleichen: pro 100 ml, pro Flasche und als Zuckerwürfel.",
  alternates: { canonical: "/de/vergleiche/fanta-vs-sprite-zucker" },
};

export default function FantaSpritePage() {
  const fanta = topBySugarPer100(drinksByBrand("fanta", ["orange-limo", "softdrink"]), 8);
  const sprite = topBySugarPer100(drinksByBrand("sprite", ["lemon-lime", "softdrink"]), 8);

  return (
    <main>
      <PageHero kicker="Vergleich" title="Fanta vs. Sprite: Zucker." text={`Fanta Ø ${formatNumber(averageSugar(fanta))} g/100 ml, Sprite Ø ${formatNumber(averageSugar(sprite))} g/100 ml.`} />
      <section className="mx-auto grid max-w-page gap-6 px-4 py-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Fanta</h2>
          <SortableDrinkRows drinks={fanta} />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Sprite</h2>
          <SortableDrinkRows drinks={sprite} />
        </div>
      </section>
    </main>
  );
}
