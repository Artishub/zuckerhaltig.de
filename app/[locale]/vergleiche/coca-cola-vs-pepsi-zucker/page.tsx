import type { Metadata } from "next";
import { DrinkRows, PageHero } from "@/components/seo-drink-list";
import { averageSugar, drinksByBrand, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";

export const metadata: Metadata = {
  title: "Coca-Cola vs. Pepsi: Zucker im Vergleich",
  description: "Coca-Cola und Pepsi nach Zucker vergleichen: pro 100 ml, pro Packung und als Zuckerwürfel.",
  alternates: { canonical: "/de/vergleiche/coca-cola-vs-pepsi-zucker" },
};

export default function CokePepsiPage() {
  const coke = topBySugarPer100(drinksByBrand("coca-cola", ["cola"]), 8);
  const pepsi = topBySugarPer100(drinksByBrand("pepsi", ["cola"]), 8);

  return (
    <main>
      <PageHero kicker="Vergleich" title="Coca-Cola vs. Pepsi: Zucker." text={`Coca-Cola Ø ${formatNumber(averageSugar(coke))} g/100 ml, Pepsi Ø ${formatNumber(averageSugar(pepsi))} g/100 ml.`} />
      <section className="mx-auto grid max-w-page gap-6 px-4 py-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Coca-Cola</h2>
          <DrinkRows drinks={coke} />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Pepsi</h2>
          <DrinkRows drinks={pepsi} />
        </div>
      </section>
    </main>
  );
}
