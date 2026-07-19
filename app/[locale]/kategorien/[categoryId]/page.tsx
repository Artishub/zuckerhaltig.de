import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { categoryLandingPageById, categoryLandingPages } from "@/lib/category-landing-pages";
import { categoryById } from "@/lib/data/categories";
import { canonicalPackageDrinkId } from "@/lib/data/drinks";
import { averageSugar, drinksByCategory, formatNumber } from "@/lib/seo-drinks";
import { pageMetadata, siteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ categoryId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryLandingPages.map((page) => ({ categoryId: page.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = categoryById[categoryId];
  const page = categoryLandingPageById[categoryId];
  if (!category || !page) return {};

  const categoryDrinks = drinksByCategory(categoryId);
  return pageMetadata(
    `${category.name}: Zucker pro 100 ml vergleichen`,
    `${categoryDrinks.length} ${category.name}-Produkte nach Zucker pro 100 ml und pro Packung vergleichen. Mit Packungsgrößen, Zuckerwürfeln und Quellen.`,
    `/de/kategorien/${categoryId}`,
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = categoryById[categoryId];
  const page = categoryLandingPageById[categoryId];
  if (!category || !page) notFound();

  const categoryDrinks = drinksByCategory(categoryId);
  const values = categoryDrinks.map((drink) => drink.sugarPer100Ml);
  const minSugar = Math.min(...values);
  const maxSugar = Math.max(...values);
  const itemList = categoryDrinks.map((drink, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: drink.name,
    url: `${siteUrl}/de/getraenke/${canonicalPackageDrinkId(drink)}`,
  }));

  return (
    <main>
      <section className="border-b border-ash bg-mist">
        <div className="mx-auto max-w-page px-4 py-12 md:py-16">
          <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 text-sm text-slate">
            <Link href="/de">Startseite</Link><span aria-hidden="true">/</span>
            <Link href="/de/kategorien">Kategorien</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{category.name}</span>
          </nav>
          <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
            {category.name}: Zucker pro 100 ml vergleichen
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">{page.intro}</p>
          <p className="mt-5 max-w-2xl leading-7">
            Der niedrigste hinterlegte Wert liegt bei <strong>{formatNumber(minSugar)} g</strong>, der höchste bei <strong>{formatNumber(maxSugar)} g Zucker pro 100 ml</strong>. Der Durchschnitt beträgt {formatNumber(averageSugar(categoryDrinks))} g.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-page px-4 py-10 md:py-14">
        <div className="mb-7 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">{categoryDrinks.length} Produkte im Vergleich</h2>
          <p className="mt-3 leading-7 text-slate">Sortiere nach Zucker pro 100 ml, Packungszucker, Marke oder Produktname. Die Detailseiten zeigen Nährwerte und Quellen.</p>
        </div>
        <SortableDrinkRows drinks={categoryDrinks} />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${category.name}: Zucker pro 100 ml vergleichen`,
              url: `${siteUrl}/de/kategorien/${categoryId}`,
              mainEntity: { "@type": "ItemList", numberOfItems: categoryDrinks.length, itemListElement: itemList },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Startseite", item: `${siteUrl}/de` },
                { "@type": "ListItem", position: 2, name: "Kategorien", item: `${siteUrl}/de/kategorien` },
                { "@type": "ListItem", position: 3, name: category.name, item: `${siteUrl}/de/kategorien/${categoryId}` },
              ],
            },
          ]),
        }}
      />
    </main>
  );
}
