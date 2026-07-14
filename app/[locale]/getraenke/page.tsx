import Link from "next/link";
import { Suspense } from "react";
import { DrinkExplorer } from "@/components/drink-explorer";
import { categories } from "@/lib/data/categories";
import { canonicalPackageDrinks, drinks } from "@/lib/data/drinks";
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
      <CrawlLinks />
    </main>
  );
}

function CrawlLinks() {
  const canonical = canonicalPackageDrinks(drinks);

  return (
    <section className="mt-12 border-t border-ash pt-8">
      <h2 className="text-2xl font-semibold tracking-tight">Alle Getränke nach Kategorie</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">Öffne eine Kategorie und rufe jedes Getränk direkt auf.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {categories.map((category) => {
          const categoryDrinks = canonical
            .filter((drink) => drink.categoryId === category.id)
            .sort((a, b) => a.name.localeCompare(b.name, "de"));

          if (!categoryDrinks.length) return null;

          return (
            <details key={category.id} className="rounded-lg border border-ash bg-paper px-4 py-3">
              <summary className="focus-ring cursor-pointer rounded-md font-semibold">
                {category.name} <span className="font-normal text-slate">({categoryDrinks.length})</span>
              </summary>
              <ul className="mt-4 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2">
                {categoryDrinks.map((drink) => (
                  <li key={drink.id}>
                    <Link href={`/de/getraenke/${drink.id}`} className="focus-ring inline-flex rounded-md underline decoration-ash underline-offset-4 hover:decoration-marigold">
                      {drink.name}{drink.sizeMl ? `, ${drink.sizeMl} ml` : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </section>
  );
}
