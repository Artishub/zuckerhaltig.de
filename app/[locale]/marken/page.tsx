import type { Metadata } from "next";
import { BrandSearchGrid } from "@/components/brand-search-grid";
import { brands } from "@/lib/data/brands";
import { drinks, totalSugarGrams } from "@/lib/data/drinks";

export const metadata: Metadata = {
  title: "Marken",
  description: "Markenübersicht der Getränkedatenbank.",
  alternates: {
    canonical: "/de/marken",
  },
};

export default function BrandsPage() {
  const counts = Object.fromEntries(
    brands.map((brand) => [brand.id, drinks.filter((drink) => drink.brandId === brand.id).length]),
  );
  const topDrinks = Object.fromEntries(
    brands.map((brand) => [
      brand.id,
      drinks
        .filter((drink) => drink.brandId === brand.id)
        .sort((a, b) => totalSugarGrams(b) - totalSugarGrams(a))
        .slice(0, 3)
        .map((drink) => ({ id: drink.id, name: drink.name, sugar: totalSugarGrams(drink) })),
    ]),
  );

  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Marken</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate">
        Vergleiche Getränkemarken nach Zuckerwerten, Produktvarianten und Packungsgrößen. Jede Marke führt direkt zur gefilterten Getränkesuche.
      </p>
      <BrandSearchGrid brands={brands} counts={counts} topDrinks={topDrinks} />
    </main>
  );
}
