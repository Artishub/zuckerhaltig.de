import { BrandSearchGrid } from "@/components/brand-search-grid";
import { PageHero } from "@/components/seo-drink-list";
import { brands } from "@/lib/data/brands";
import { categories } from "@/lib/data/categories";
import { canonicalPackageDrinkId, drinks, totalSugarGrams, uniqueProductRepresentatives } from "@/lib/data/drinks";
import { featuredBrandPages } from "@/lib/featured-brand-pages";
import { pageMetadata } from "@/lib/site";
import { drinkPageHref } from "@/lib/page-routing";

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
        .map((drink) => ({ id: canonicalPackageDrinkId(drink), href: drinkPageHref(drink), name: drink.name, sugar: totalSugarGrams(drink) })),
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
    <main className="pb-24">
      <PageHero title="Getränkemarken" text={`${brands.length} Marken mit ihren Sorten und Packungsgrößen. Suche nach Marke oder Produkt.`} />
      <div className="mx-auto max-w-page px-5">
      <BrandSearchGrid
        brands={brands}
        counts={counts}
        topDrinks={topDrinks}
        searchData={brandSearchData}
        categories={categories}
        detailBrandIds={featuredBrandPages.map((page) => page.id)}
      />
      </div>
    </main>
  );
}
