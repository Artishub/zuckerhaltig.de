import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { BrandProductGrid } from "@/components/brand-product-grid";
import { brandById } from "@/lib/data/brands";
import { canonicalPackageDrinkId, drinks, sugarCubes, totalSugarGrams, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";
import { featuredBrandPageById, featuredBrandPages, type FeaturedBrandPage } from "@/lib/featured-brand-pages";
import { formatNumber } from "@/lib/seo-drinks";
import { isSearchIndexableBrand } from "@/lib/seo-index";
import { pageMetadata, siteUrl } from "@/lib/site";

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
      `${page.intro} Werte pro 100 ml, pro Packung und als Zuckerwürfel. ${page.editorial?.intro ?? page.comparison?.intro ?? "Mit Produktseiten, Packungsgrößen und Quellen."}`,
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
    url: `${siteUrl}/de/getraenke/${canonicalPackageDrinkId(drink)}`,
  }));

  return (
    <main>
      <section className="border-b border-ash bg-mist">
        <div className="mx-auto grid max-w-page gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:py-16">
          <div>
            <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 text-sm text-slate">
              <Link href="/de">Startseite</Link><span aria-hidden="true">/</span>
              <Link href="/de/marken">Marken</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{brand.name}</span>
            </nav>
            <Link href="/de/marken" className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate hover:text-ink">
              <ArrowLeft size={16} aria-hidden="true" /> Alle Marken
            </Link>
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[.94] tracking-[-0.06em] md:text-6xl">
              {brand.name}: Zucker vergleichen
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate">{page.intro}</p>
            <p className="mt-4 max-w-xl leading-7">Die hinterlegten Produkte liegen zwischen <strong>{formatNumber(minSugar)} und {formatNumber(maxSugar)} g Zucker pro 100 ml</strong>.</p>
          </div>
          <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-ash bg-paper">
            <BrandStat label="Produkte" value={String(products.length)} />
            <BrandStat label="Packungsgrößen" value={String(packageSizes.size)} />
            <BrandStat label="Niedrigster Wert" value={`${formatNumber(minSugar)} g`} />
            <BrandStat label="Höchster Wert" value={`${formatNumber(maxSugar)} g`} />
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-page px-4 py-12 md:py-16">
        {!!productsWithSugar.length && (
          <section>
            <h2 className="text-3xl font-semibold tracking-tight">Produkte mit mehr als 0,5 g Zucker</h2>
            <p className="mb-6 mt-3 max-w-2xl leading-7 text-slate">Verglichen werden Zucker pro 100 ml und der rechnerische Wert für die hinterlegte Packung.</p>
            <BrandProductGrid drinks={productsWithSugar} />
          </section>
        )}

        {!!lowSugarProducts.length && (
          <section className="mt-14">
            <h2 className="text-3xl font-semibold tracking-tight">Produkte bis 0,5 g Zucker pro 100 ml</h2>
            <p className="mb-6 mt-3 max-w-2xl leading-7 text-slate">Die genaue Variante steht im Produktnamen. Packungsgrößen und Quellen findest du auf der jeweiligen Detailseite.</p>
            <BrandProductGrid drinks={lowSugarProducts} />
          </section>
        )}
      </div>

      {page.editorial && (
        <section className="border-y border-ash bg-paper">
          <div className="mx-auto max-w-page px-4 py-12 md:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Einordnung</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{page.editorial.title}</h2>
              <p className="mt-4 leading-7 text-slate">{page.editorial.intro}</p>
            </div>
            <div className="mt-9 grid gap-8 md:grid-cols-2">
              {page.editorial.points.map((point) => (
                <article key={point.title} className="border-t border-ash pt-4">
                  <h3 className="text-lg font-semibold tracking-tight">{point.title}</h3>
                  <p className="mt-2 max-w-xl leading-7 text-slate">{point.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.comparison && <BrandComparison comparison={page.comparison} />}

      <section className="border-y border-ash bg-mist">
        <div className="mx-auto grid max-w-page gap-6 px-4 py-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Packungszucker selbst berechnen</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate">Trage Zucker pro 100 ml und die Füllmenge ein. Der Rechner liefert Gesamtzucker und Zuckerwürfel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/de/zuckerrechner" className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper hover:opacity-85 active:translate-y-px">
              <Calculator size={17} aria-hidden="true" /> Zuckerrechner
            </Link>
            <Link href={page.knowledgeHref} className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink px-4 py-3 text-sm font-semibold hover:bg-paper active:translate-y-px">
              {page.knowledgeLabel} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

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
    <section className="border-y border-ash bg-paper">
      <div className="mx-auto max-w-page px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Ausgewählte Reihe</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{comparison.title}</h2>
          <p className="mt-4 leading-7 text-slate">{comparison.intro}</p>
        </div>
        <ul className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((drink) => {
            const totalSugar = totalSugarGrams(drink);
            const cubes = sugarCubes(drink);
            return (
              <li key={drink.id}>
                <Link href={`/de/getraenke/${canonicalPackageDrinkId(drink)}`} className="focus-ring group grid h-full gap-5 rounded-lg border border-ash bg-mist p-5 transition hover:border-marigold active:translate-y-px">
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate">{drink.sizeMl ? `${drink.sizeMl} ml` : "Packung offen"}</p>
                      <h3 className="mt-2 font-semibold leading-tight tracking-tight">{drink.name}</h3>
                    </div>
                    <ArrowRight size={17} className="mt-0.5 text-slate transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm tabular-nums">
                    <div><dt className="text-slate">Pro 100 ml</dt><dd className="mt-1 font-semibold">{formatNumber(drink.sugarPer100Ml)} g</dd></div>
                    <div><dt className="text-slate">Pro Packung</dt><dd className="mt-1 font-semibold">{totalSugar === null ? "/" : `${formatNumber(totalSugar)} g`}</dd></div>
                  </dl>
                  <p className="border-t border-ash pt-3 text-xs leading-5 text-slate">{cubes === null ? "Keine Packungsrechnung hinterlegt." : `${formatNumber(cubes)} Zuckerwürfel · ${drink.source}`}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        {comparison.note && <p className="mt-5 text-sm leading-6 text-slate">{comparison.note}</p>}
      </div>
    </section>
  );
}

function BrandStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-28 border-b border-r border-ash p-4 even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
      <dt className="text-sm text-slate">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</dd>
    </div>
  );
}
