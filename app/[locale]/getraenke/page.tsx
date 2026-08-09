import { Suspense } from "react";
import { DrinkExplorer } from "@/components/drink-explorer";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Getränke-Datenbank", "Suche Getränke nach Marke, Kategorie, Gebindegröße und Zuckerwerten. Vergleiche Zucker pro 100 ml, Packung, Kalorien, Zuckerwürfel und Quellen.", "/de/getraenke");

export default function DrinksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Zuckerhaltig.de Getränkedatenbank",
    description: "Lokale MVP-Datenbank zu Zuckerwerten in Getränken in Deutschland.",
    inLanguage: "de",
  };

  return (
    <main className="mx-auto max-w-page px-4 py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Getränkedatenbank</p>
        <h1 className="mt-3 text-5xl font-semibold leading-[.94] tracking-[-0.06em] md:text-6xl">Zuckerwerte vergleichen.</h1>
        <p className="mt-4 leading-7 text-slate">
          <span className="block">Filtere nach Marke, Kategorie, Gebinde und Zucker.</span>
          <span className="block">Alle Berechnungen passieren lokal im Browser.</span>
        </p>
      </div>
      <Suspense fallback={<div className="border-t border-ash py-6 text-sm text-slate">Getränke werden geladen...</div>}>
        <DrinkExplorer />
      </Suspense>
    </main>
  );
}
