import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { drinks } from "@/lib/data/drinks";

export const metadata: Metadata = {
  title: "Kategorien",
  description: "Getränkekategorien von Softdrinks bis Sportdrinks.",
};

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Kategorien</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate">
        Entdecke Zuckerwerte nach Getränketyp: Cola, Energy Drinks, Eistee, Saft, Schorle und weitere Kategorien. Ein Klick öffnet die passende Filteransicht.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/de/getraenke?category=${category.id}`} className="rounded-lg border border-ash p-4 hover:border-marigold">
            <span className="block h-2 w-2 rounded-full" style={{ background: category.color }} />
            <h2 className="mt-4 font-semibold">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate">{category.description}</p>
            <p className="mt-4 text-sm tabular-nums">{drinks.filter((drink) => drink.categoryId === category.id).length} Einträge</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
