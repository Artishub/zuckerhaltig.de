import { Suspense } from "react";
import Link from "next/link";
import { DrinkRows } from "@/components/seo-drink-list";
import { DrinkExplorer } from "@/components/drink-explorer";
import { featuredIndexableDrinks } from "@/lib/seo-drinks";
import { pageMetadata, siteUrl } from "@/lib/site";

export const metadata = pageMetadata("Getränke-Datenbank", "Suche Getränke nach Marke, Kategorie, Gebindegröße und Zuckerwerten. Vergleiche Zucker pro 100 ml, Packung, Kalorien, Zuckerwürfel und Quellen.", "/de/getraenke");

export default function DrinksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Zuckerhaltig.de Getränkedatenbank",
    description: "Getränkedatenbank mit Zucker- und Nährwertangaben, Packungsgrößen, Berechnungen und Quellen.",
    url: `${siteUrl}/de/getraenke`,
    inLanguage: "de",
    creator: { "@type": "Organization", name: "Zuckerhaltig.de", url: siteUrl },
    publisher: { "@type": "Organization", name: "Zuckerhaltig.de", url: siteUrl },
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
        <Link href="/de/ueber" className="mt-5 inline-flex text-sm font-semibold underline decoration-ash underline-offset-4 hover:decoration-marigold">
          Quellen und Prüfweise ansehen
        </Link>
      </div>
      <Suspense fallback={<div className="border-t border-ash py-6 text-sm text-slate">Getränke werden geladen...</div>}>
        <DrinkExplorer />
      </Suspense>
      <section className="mx-auto mt-14 max-w-page border-t border-ash px-4 pt-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">Ausgewählte Produktseiten</h2>
          <p className="mt-3 leading-7 text-slate">
            Einige häufig verglichene Getränke führen direkt zu ihren Detailseiten mit Quellen und Packungswerten.
          </p>
        </div>
        <div className="mt-6">
          <DrinkRows drinks={featuredIndexableDrinks()} />
        </div>
      </section>
    </main>
  );
}
