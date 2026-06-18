import type { Metadata } from "next";
import { Suspense } from "react";
import { DrinkExplorer } from "@/components/drink-explorer";

export const metadata: Metadata = {
  title: "Getränke-Datenbank",
  description: "Suche und filtere Getränke nach Marke, Kategorie, Gebindegröße und Zuckerwerten.",
  alternates: {
    canonical: "/de/getraenke",
  },
};

export default function DrinksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Zuckerhaltig.de Getränkedatenbank",
    description: "Lokale MVP-Datenbank zu Zuckerwerten in Getränken in Deutschland.",
    inLanguage: "de",
  };

  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-slate">Getränke erkunden</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Zuckerwerte vergleichen.</h1>
        <p className="mt-4 leading-7 text-slate">Filtere nach Marke, Kategorie, Gebinde und Zucker. Alle Berechnungen passieren lokal im Browser.</p>
      </div>
      <Suspense fallback={<div className="border-t border-ash py-6 text-sm text-slate">Getränke werden geladen...</div>}>
        <DrinkExplorer />
      </Suspense>
    </main>
  );
}
