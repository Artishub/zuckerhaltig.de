import Link from "next/link";
import { categoryPageHref } from "@/lib/category-landing-pages";
import { categories } from "@/lib/data/categories";
import { canonicalPackageDrinkId, drinks, totalSugarGrams, uniqueProductRepresentatives } from "@/lib/data/drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Kategorien", "Getränkekategorien von Cola bis Energy Drink: Zucker pro 100 ml, Packungszucker und Zuckerwürfel für Softdrinks, Saft, Eistee und Schorle vergleichen.", "/de/kategorien");

export default function CategoriesPage() {
  const sugarFreeCount = uniqueProductRepresentatives(
    drinks.filter((drink) => drink.sugarPer100Ml <= 0.5),
  ).length;

  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Kategorien</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate">
        Entdecke Zuckerwerte nach Getränketyp: Cola, Energy Drinks, Eistee, Saft, Schorle und weitere Kategorien. Ein Klick öffnet die passende Vergleichsseite.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="flex flex-col rounded-lg border border-[#1f4539] bg-[#1f4539] p-4 text-white">
          <h2 className="font-semibold">Zuckerfreie Getränke</h2>
          <p className="mt-2 text-sm leading-6 text-white/80">
            Zero- und Light-Getränke mit höchstens 0,5 g Zucker pro 100 ml vergleichen.
          </p>
          <div className="mt-auto pt-4">
            <p className="text-sm tabular-nums text-white/80">{sugarFreeCount} Einträge</p>
            <Link href="/de/rankings/zuckerfreie-getraenke" className="focus-ring mt-3 inline-flex rounded-md text-sm underline decoration-white/70 underline-offset-4 hover:decoration-marigold">
              Zuckerfreie Getränke vergleichen
            </Link>
          </div>
        </article>
        {categories.map((category) => {
          const categoryDrinks = drinks.filter((drink) => drink.categoryId === category.id);
          const topDrinks = uniqueProductRepresentatives(categoryDrinks)
            .sort((a, b) => (totalSugarGrams(b) ?? -1) - (totalSugarGrams(a) ?? -1))
            .slice(0, 2);

          return (
          <article key={category.id} className="rounded-lg border border-ash bg-mist p-4">
            <h2 className="font-semibold">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate">{category.description}</p>
            <p className="mt-4 text-sm tabular-nums">{categoryDrinks.length} Einträge</p>
            <Link href={categoryPageHref(category.id) ?? `/de/getraenke?category=${category.id}`} className="focus-ring mt-3 inline-flex rounded-md text-sm underline decoration-ash underline-offset-4 hover:decoration-marigold">
              Kategorie vergleichen
            </Link>
            {!!topDrinks.length && (
              <div className="mt-4 border-t border-ash pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate">Produkte</p>
                <div className="mt-2 flex flex-wrap gap-2">
                {topDrinks.map((drink) => (
                  <Link key={drink.id} href={`/de/getraenke/${canonicalPackageDrinkId(drink)}`} className="focus-ring rounded-md bg-paper px-2.5 py-1.5 text-sm leading-5 hover:bg-cream">
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
