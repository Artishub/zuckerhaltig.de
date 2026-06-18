import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { drinks, totalSugarGrams } from "@/lib/data/drinks";

export const metadata: Metadata = {
  title: "Kategorien",
  description: "Getränkekategorien von Softdrinks bis Sportdrinks.",
  alternates: {
    canonical: "/de/kategorien",
  },
};

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
          const topDrinks = categoryDrinks
            .sort((a, b) => totalSugarGrams(b) - totalSugarGrams(a))
            .slice(0, 2);

          return (
          <article key={category.id} className="rounded-lg border border-ash p-4">
            <span className="block h-2 w-2 rounded-full" style={{ background: category.color }} />
            <h2 className="mt-4 font-semibold">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate">{category.description}</p>
            <p className="mt-4 text-sm tabular-nums">{categoryDrinks.length} Einträge</p>
            <Link href={`/de/getraenke?category=${category.id}`} className="focus-ring mt-3 inline-flex rounded-md text-sm underline decoration-ash underline-offset-4 hover:decoration-marigold">
              Kategorie filtern
            </Link>
            {!!topDrinks.length && (
              <div className="mt-4 space-y-2 border-t border-ash pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate">Top Produkte</p>
                {topDrinks.map((drink) => (
                  <Link key={drink.id} href={`/de/getraenke/${drink.id}`} className="focus-ring block rounded-md text-sm leading-5 hover:text-marigold">
                    {drink.name}
                  </Link>
                ))}
              </div>
            )}
          </article>
          );
        })}
      </div>
    </main>
  );
}
