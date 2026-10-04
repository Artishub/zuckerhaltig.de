import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { HeadToHead } from "@/components/ui/head-to-head";
import ui from "@/components/ui/ui.module.css";
import { brandById } from "@/lib/data/brands";
import { canonicalPackageDrinkId, drinks, sugarCubes, totalSugarGrams, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";
import { featuredBrandPageById, featuredBrandPages, type FeaturedBrandPage } from "@/lib/featured-brand-pages";
import { formatNumber } from "@/lib/seo-drinks";
import { isSearchIndexableBrand } from "@/lib/seo-index";
import { pageMetadata, siteUrl } from "@/lib/site";
import { drinkPageHref, drinkPath, drinkRedirectTarget, flavorLineDrinks, flavorLines, type FlavorLine } from "@/lib/page-routing";

type PageProps = {
  params: Promise<{ brandId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return featuredBrandPages.map((page) => ({ brandId: page.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandId } = await params;
  const brand = brandById[brandId];
  const page = featuredBrandPageById[brandId];
  if (!brand || !page) return {};

  return {
    ...pageMetadata(
      `${brand.name}: Zucker und Produkte vergleichen`,
      `${page.intro} Werte pro 100 ml, pro Packung und als Zuckerwürfel. ${page.metaDescription ?? "Mit Produktseiten, Packungsgrößen und Quellen."}`,
      `/de/marken/${brandId}`,
    ),
    ...(!isSearchIndexableBrand(brandId) && {
      robots: {
        index: false,
        follow: true,
      },
    }),
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { brandId } = await params;
  const brand = brandById[brandId];
  const page = featuredBrandPageById[brandId];
  if (!brand || !page) notFound();

  const brandDrinks = drinks.filter((drink) => drink.brandId === brandId);
  const products = uniqueProductRepresentatives(brandDrinks)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
  const productsWithSugar = products.filter((drink) => drink.sugarPer100Ml > 0.5);
  const lowSugarProducts = products.filter((drink) => drink.sugarPer100Ml <= 0.5);
  const sugarValues = products.map((drink) => drink.sugarPer100Ml);
  const minSugar = Math.min(...sugarValues);
  const maxSugar = Math.max(...sugarValues);
  const packageSizes = new Set(brandDrinks.map((drink) => drink.sizeMl).filter((size) => size !== null));

  const itemList = products.map((drink, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: drink.name,
    url: `${siteUrl}${drinkPageHref(drink)}`,
  }));

  return (
    <main className={ui.page}>
      <nav aria-label="Brotkrumen" className={ui.crumbs}>
        <Link href="/de">Startseite</Link><span aria-hidden="true">/</span>
        <Link href="/de/marken">Marken</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{brand.name}</span>
      </nav>

      <section className={ui.categoryHero}>
        <div>
          <h1>{brand.name}: Zucker vergleichen</h1>
          <p className={ui.lead}>{page.intro}</p>
        </div>
        <dl className={ui.statGrid}>
          <div className={ui.statCard}><dt>Produkte</dt><dd>{products.length}</dd></div>
          <div className={ui.statCard}><dt>Packungsgrößen</dt><dd>{packageSizes.size}</dd></div>
          <div className={ui.statCard}><dt>Niedrigster Wert</dt><dd>{formatNumber(minSugar)}<small>g / 100 ml</small></dd></div>
          <div className={ui.statCard}><dt>Höchster Wert</dt><dd>{formatNumber(maxSugar)}<small>g / 100 ml</small></dd></div>
        </dl>
      </section>

      {!!productsWithSugar.length && (
        <section className={ui.section} aria-labelledby="sugared-title">
          <div className={ui.sectionHead}><h2 id="sugared-title">{brand.name} mit Zucker</h2></div>
          <SortableDrinkRows drinks={productsWithSugar} />
        </section>
      )}

      {!!lowSugarProducts.length && (
        <section className={ui.section} aria-labelledby="free-title">
          <div className={ui.sectionHead}><h2 id="free-title">Bis 0,5 g Zucker pro 100 ml</h2></div>
          <SortableDrinkRows drinks={lowSugarProducts} defaultSort="name" />
        </section>
      )}

      {flavorLines.filter((line) => line.brandId === brandId).map((line) => (
        <FlavorLineTable key={line.id} line={line} />
      ))}

      {page.comparison && <BrandComparison comparison={page.comparison} />}

      <nav aria-label="Weiterlesen" className={ui.section}>
        <ul className={ui.chipList}>
          <li><Link href={page.knowledgeHref}>{page.knowledgeLabel} <ArrowRight size={14} aria-hidden="true" /></Link></li>
          <li><Link href="/de/zuckerrechner">Zuckerrechner <ArrowRight size={14} aria-hidden="true" /></Link></li>
          <li><Link href="/de/marken">Alle Marken <ArrowRight size={14} aria-hidden="true" /></Link></li>
        </ul>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${brand.name}: Zucker vergleichen`,
              url: `${siteUrl}/de/marken/${brandId}`,
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: products.length,
                itemListElement: itemList,
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Startseite", item: `${siteUrl}/de` },
                { "@type": "ListItem", position: 2, name: "Marken", item: `${siteUrl}/de/marken` },
                { "@type": "ListItem", position: 3, name: brand.name, item: `${siteUrl}/de/marken/${brandId}` },
              ],
            },
          ]),
        }}
      />
    </main>
  );
}

function BrandComparison({ comparison }: { comparison: NonNullable<FeaturedBrandPage["comparison"]> }) {
  const products = comparison.drinkIds
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink): drink is Drink => Boolean(drink))
    .filter((drink, index, all) => all.findIndex((item) => canonicalPackageDrinkId(item) === canonicalPackageDrinkId(drink)) === index);

  if (!products.length) return null;

  return (
    <section className={ui.section} aria-labelledby="comparison-title">
      <div className={ui.sectionHead}><h2 id="comparison-title">{comparison.title}</h2></div>
      <HeadToHead drinks={products} />
    </section>
  );
}

function FlavorLineTable({ line }: { line: FlavorLine }) {
  const items = flavorLineDrinks(line);
  if (items.length < 2) return null;
  const values = new Set(items.map((drink) => drink.sugarPer100Ml));
  const sameValue = values.size === 1 ? items[0].sugarPer100Ml : null;

  return (
    <section className={ui.section} aria-labelledby={`${line.id}-title`}>
      <div className={ui.sectionHead}><h2 id={`${line.id}-title`}>{line.label}: {items.length} Sorten im Vergleich</h2></div>
      <p className={ui.sectionLead}>
        {sameValue !== null
          ? `Alle Sorten haben laut Quelle ${formatNumber(sameValue)} g Zucker pro 100 ml. Sie unterscheiden sich nur im Geschmack und in der Packungsgröße.`
          : "Die Sorten unterscheiden sich im Zuckerwert pro 100 ml."}
      </p>
      <div className={`${ui.card} ${ui.tableWrap}`}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th scope="col">Sorte</th>
              <th scope="col" className={ui.num}>Packung</th>
              <th scope="col" className={ui.num}>pro 100 ml</th>
              <th scope="col" className={ui.num}>pro Packung</th>
              <th scope="col" className={ui.num}>Würfel</th>
            </tr>
          </thead>
          <tbody>
            {items.map((drink) => {
              const hasOwnPage = drinkRedirectTarget(drink) === null;
              return (
                <tr key={drink.id} id={drink.id} className={ui.anchorRow}>
                  <th scope="row">{hasOwnPage ? <Link href={drinkPath(drink.id)} className={ui.tableLink}>{drink.name}</Link> : drink.name}</th>
                  <td className={ui.num}>{drink.sizeMl ? `${drink.sizeMl} ml` : "/"}</td>
                  <td className={ui.num}>{formatNumber(drink.sugarPer100Ml)} g</td>
                  <td className={ui.num}>{totalSugarGrams(drink) === null ? "/" : `${formatNumber(totalSugarGrams(drink) ?? 0)} g`}</td>
                  <td className={ui.num}>{sugarCubes(drink) === null ? "/" : formatNumber(sugarCubes(drink) ?? 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
