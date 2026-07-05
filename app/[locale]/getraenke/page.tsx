import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DrinkExplorer } from "@/components/drink-explorer";
import { drinks, type Drink } from "@/lib/data/drinks";

export const metadata: Metadata = {
  title: "Getränke-Datenbank",
  description: "Suche Getränke nach Marke, Kategorie, Gebindegröße und Zuckerwerten. Vergleiche Zucker pro 100 ml, Packung, Kalorien, Zuckerwürfel und Quellen.",
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
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Zuckerwerte vergleichen.</h1>
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

const drinkLinkGroups = [
  {
    title: "Cola und Zero",
    ids: [
      "coca-cola-zero-sugar-500",
      "coca-cola-light-500",
      "coca-cola-zero-sugar-zero-koffein-330",
      "pepsi-zero-330",
      "dr-pepper-cream-swirl-330",
      "7up-original-330",
    ],
  },
  {
    title: "Energy Drinks",
    ids: [
      "red-bull-yellow-edition-tropical-250",
      "red-bull-blue-edition-heidelbeere-250",
      "red-bull-red-edition-wassermelone-250",
      "red-bull-white-edition-kokos-blaubeere-250",
      "red-bull-summer-edition-curuba-holunderbluete-250",
      "effect-energy-drink-250",
    ],
  },
  {
    title: "Eistee und Limo",
    ids: [
      "durstloescher-eistee-pfirsich-500",
      "fuze-tea-pfirsich-holunderbluete-400",
      "orangina-original-250",
      "bionade-zitrone-bergamotte-330",
      "bionade-schwarze-johannisbeere-rosmarin-330",
      "mio-mio-mate-zero-500",
    ],
  },
  {
    title: "Zuckerfrei",
    ids: [
      "capri-sun-zero-orange-200",
      "fanta-lemon-ohne-zucker-500",
      "fanta-mango-ohne-zucker-1250",
      "sprite-zero-330",
      "coca-cola-zero-sugar-cherry-1250",
      "coca-cola-zero-sugar-vanilla-1250",
    ],
  },
];

function CrawlLinks() {
  return (
    <section className="mt-12 border-t border-ash pt-8">
      <h2 className="text-2xl font-semibold tracking-tight">Direkt vergleichen</h2>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {drinkLinkGroups.map((group) => {
          const groupDrinks = group.ids.map(findDrink).filter((drink): drink is Drink => Boolean(drink));
          return (
            <div key={group.title}>
              <h3 className="font-semibold">{group.title}</h3>
              <ul className="mt-3 grid gap-2 text-sm">
                {groupDrinks.map((drink) => (
                  <li key={drink.id}>
                    <Link href={`/de/getraenke/${drink.id}`} className="focus-ring inline-flex rounded-md underline decoration-ash underline-offset-4 hover:decoration-marigold">
                      {drink.name} {sizeLabel(drink)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function findDrink(id: string) {
  return drinks.find((drink) => drink.id === id);
}

function sizeLabel(drink: Drink) {
  return drink.sizeMl ? `${drink.sizeMl} ml` : "";
}
