import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { drinks, totalSugarGrams, uniqueProductRepresentatives } from "@/lib/data/drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Kategorien", "Getränkekategorien von Cola bis Energy Drink: Zucker pro 100 ml, Packungszucker und Zuckerwürfel für Softdrinks, Saft, Eistee und Schorle vergleichen.", "/de/kategorien");

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Kategorien</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate">
        Entdecke Zuckerwerte nach Getränketyp: Cola, Energy Drinks, Eistee, Saft, Schorle und weitere Kategorien. Ein Klick öffnet die passende Filteransicht.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const categoryDrinks = drinks.filter((drink) => drink.categoryId === category.id);
          const topDrinks = uniqueProductRepresentatives(categoryDrinks)
            .sort((a, b) => (totalSugarGrams(b) ?? -1) - (totalSugarGrams(a) ?? -1))
            .slice(0, 2);

          return (
          <article key={category.id} className="rounded-lg border border-ash p-4">
            <h2 className="font-semibold">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate">{category.description}</p>
            <p className="mt-4 text-sm tabular-nums">{categoryDrinks.length} Einträge</p>
            <Link href={`/de/getraenke?category=${category.id}`} className="focus-ring mt-3 inline-flex rounded-md text-sm underline decoration-ash underline-offset-4 hover:decoration-marigold">
              Kategorie filtern
            </Link>
            {!!topDrinks.length && (
              <div className="mt-4 border-t border-ash pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate">Produkte</p>
                <div className="mt-2 flex flex-wrap gap-2">
                {topDrinks.map((drink) => (
                  <Link key={drink.id} href={`/de/getraenke/${drink.id}`} className="focus-ring rounded-md bg-mist px-2.5 py-1.5 text-sm leading-5 hover:bg-cream">
                    {drink.name}
                  </Link>
                ))}
                </div>
              </div>
            )}
          </article>
          );
        })}
      </div>
    </main>
  );
}
