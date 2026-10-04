import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryTable } from "@/components/ui/category-table";
import { LevelBadge } from "@/components/ui/level-badge";
import ui from "@/components/ui/ui.module.css";
import { categoryLandingPageById, categoryLandingPages, categoryPageHref } from "@/lib/category-landing-pages";
import { categoryStats, scaleMax, summarize } from "@/lib/drink-summary";
import { sugarLevel } from "@/lib/sugar-context";
import { categoryById } from "@/lib/data/categories";
import { averageSugar, drinksByCategory, formatNumber } from "@/lib/seo-drinks";
import { pageMetadata, siteUrl } from "@/lib/site";
import { drinkPageHref } from "@/lib/page-routing";

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

  return pageMetadata(
    `${category.name}: ${page.editorial.title}`,
    `${page.intro} ${page.editorial.title} Mit Packungsgrößen, Zuckerwürfeln und Quellen.`,
    `/de/kategorien/${categoryId}`,
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = categoryById[categoryId];
  const page = categoryLandingPageById[categoryId];
  if (!category || !page) notFound();

  const categoryDrinks = drinksByCategory(categoryId);
  const items = categoryDrinks.map(summarize);
  const average = averageSugar(categoryDrinks);
  const highest = [...items].sort((a, b) => b.per100 - a.per100)[0];
  const lowest = [...items].sort((a, b) => a.per100 - b.per100)[0];
  const counts = {
    free: items.filter((item) => item.level === "free").length,
    low: items.filter((item) => item.level === "low").length,
    sugared: items.filter((item) => item.level === "sugared").length,
  };
  const otherCategories = categoryStats().filter((item) => item.id !== categoryId && categoryPageHref(item.id));
  const itemList = categoryDrinks.map((drink, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: drink.name,
    url: `${siteUrl}${drinkPageHref(drink)}`,
  }));

  return (
    <main className={ui.page}>
      <nav aria-label="Brotkrumen" className={ui.crumbs}>
        <Link href="/de">Startseite</Link><span aria-hidden="true">/</span>
        <Link href="/de/kategorien">Kategorien</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{category.name}</span>
      </nav>

      <section className={ui.categoryHero}>
        <div>
          <h1>{category.name}: Zucker pro 100 ml vergleichen</h1>
          <p className={ui.lead}>{page.intro}</p>
        </div>
        <dl className={ui.statGrid}>
          <div className={ui.statCard}><dt>Durchschnitt</dt><dd>{formatNumber(average)}<small>g / 100 ml</small></dd><LevelBadge level={sugarLevel(average)} /></div>
          {highest && <div className={ui.statCard}><dt>Am meisten</dt><dd>{formatNumber(highest.per100)}<small>g / 100 ml</small></dd><Link href={highest.href}>{highest.name}</Link></div>}
          {lowest && <div className={ui.statCard}><dt>Am wenigsten</dt><dd>{formatNumber(lowest.per100)}<small>g / 100 ml</small></dd><Link href={lowest.href}>{lowest.name}</Link></div>}
          <div className={ui.statCard}>
            <dt>Verteilung</dt>
            <dd className={ui.statSplit}>
              <span><b>{counts.free}</b> zuckerfrei</span>
              <span><b>{counts.low}</b> zuckerarm</span>
              <span><b>{counts.sugared}</b> mit Zucker</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className={ui.section} aria-labelledby="list-title">
        <div className={ui.sectionHead}><h2 id="list-title">{items.length} Produkte im Vergleich</h2></div>
        <p className={ui.sectionLead}>Spaltenköpfe antippen, um zu sortieren. Der Balken zeigt Zucker pro 100 ml im Verhältnis zum zuckerreichsten Getränk der Datenbank.</p>
        <CategoryTable items={items} max={scaleMax()} />
      </section>

      <section className={ui.section} aria-labelledby="editorial-title">
        <div className={ui.sectionHead}><h2 id="editorial-title">{page.editorial.title}</h2></div>
        <div className={ui.prose}>
          {page.editorial.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      {otherCategories.length > 0 && (
        <nav className={ui.section} aria-labelledby="other-title">
          <div className={ui.sectionHead}><h2 id="other-title">Andere Kategorien</h2></div>
          <ul className={ui.chipList}>
            {otherCategories.map((item) => (
              <li key={item.id}>
                <Link href={categoryPageHref(item.id)!}>
                  {item.name}
                  <span>{item.average === null ? "" : `Ø ${formatNumber(item.average)} g`}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${category.name}: Zucker pro 100 ml vergleichen`,
              description: page.intro,
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
