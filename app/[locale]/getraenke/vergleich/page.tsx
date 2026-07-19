import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { DrinkComparisonTool } from "@/components/drink-comparison-tool";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Getränke vergleichen",
  "Vergleiche bis zu vier Getränke nach Zucker, Kalorien, Füllmenge und weiteren Nährwerten.",
  "/de/getraenke/vergleich",
);

export default function DrinkComparisonPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-10 md:py-14">
      <Link href="/de/getraenke" className="focus-ring inline-flex items-center gap-2 rounded-md text-sm text-slate hover:text-ink">
        <ArrowLeft size={17} strokeWidth={1.75} aria-hidden="true" />
        Zur Getränkedatenbank
      </Link>
      <header className="mb-10 mt-8 max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate">Vergleichstool</p>
        <h1 className="mt-3 text-5xl font-semibold leading-[.94] tracking-[-0.035em] md:text-6xl">Getränke im direkten Vergleich.</h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate">Wähle bis zu vier Getränke. Zucker, Energie und weitere Nährwerte stehen pro 100 ml und pro Packung nebeneinander.</p>
      </header>
      <Suspense fallback={<div className="border-y border-ash py-10 text-sm text-slate">Vergleich wird geladen...</div>}>
        <DrinkComparisonTool />
      </Suspense>
    </main>
  );
}
