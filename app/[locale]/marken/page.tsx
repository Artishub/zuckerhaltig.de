import { BrandSearchGrid } from "@/components/brand-search-grid";
import { brands } from "@/lib/data/brands";
import { categories } from "@/lib/data/categories";
import { canonicalDrinkId, drinks, totalSugarGrams, uniqueProductRepresentatives } from "@/lib/data/drinks";
import { featuredBrandPages } from "@/lib/featured-brand-pages";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Marken", "Markenübersicht der Getränkedatenbank: Coca-Cola, Fanta, Red Bull, Monster, Eistee, Saft und weitere Getränke nach Zuckerwerten vergleichen.", "/de/marken");

export default function BrandsPage() {
  const uniqueByBrand = Object.fromEntries(
    brands.map((brand) => [brand.id, uniqueProductRepresentatives(drinks.filter((drink) => drink.brandId === brand.id))]),
  );
  const counts = Object.fromEntries(
    brands.map((brand) => [brand.id, uniqueByBrand[brand.id].length]),
  );
  const topDrinks = Object.fromEntries(
    brands.map((brand) => [
      brand.id,
      uniqueByBrand[brand.id]
        .sort((a, b) => (totalSugarGrams(b) ?? -1) - (totalSugarGrams(a) ?? -1))
        .slice(0, 3)
        .map((drink) => ({ id: canonicalDrinkId(drink), name: drink.name, sugar: totalSugarGrams(drink) })),
    ]),
  );
  const brandSearchData = Object.fromEntries(
    brands.map((brand) => {
      const brandDrinks = uniqueByBrand[brand.id];
      return [
        brand.id,
        {
          categories: Array.from(new Set(brandDrinks.map((drink) => drink.categoryId))),
          text: brandDrinks.map((drink) => drink.name).join(" "),
        },
      ];
    }),
  );

  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Marken</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate">
        Vergleiche Getränkemarken nach Zuckerwerten, Produktvarianten und Packungsgrößen. Jede Marke führt direkt zur gefilterten Getränkesuche.
      </p>
      <BrandSearchGrid
        brands={brands}
        counts={counts}
        topDrinks={topDrinks}
        searchData={brandSearchData}
        categories={categories}
        detailBrandIds={featuredBrandPages.map((page) => page.id)}
      />
    </main>
  );
}
