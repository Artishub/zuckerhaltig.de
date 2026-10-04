import { Suspense } from "react";
import { DrinkComparisonTool } from "@/components/drink-comparison-tool";
import { PageHero } from "@/components/seo-drink-list";
import { pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata(
    "Getränke vergleichen",
    "Vergleiche bis zu vier Getränke nach Zucker, Kalorien, Füllmenge und weiteren Nährwerten.",
    "/de/getraenke/vergleich",
  ),
  robots: { index: false, follow: true },
};

export default function DrinkComparisonPage() {
  return (
    <main className="pb-24">
      <PageHero title="Getränke vergleichen" text="Bis zu vier Getränke nebeneinander: Zucker, Energie und Nährwerte pro 100 ml und pro Packung." />
      <div className="mx-auto max-w-page px-5">
        <Suspense fallback={<div className="border-y border-hair py-10 text-sm text-slate">Vergleich wird geladen …</div>}>
          <DrinkComparisonTool />
        </Suspense>
      </div>
    </main>
  );
}
