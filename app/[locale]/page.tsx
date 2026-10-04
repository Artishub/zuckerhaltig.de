import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articleBySlug, homepageArticleSlugs, type Article } from "@/lib/content/articles";
import { drinks, sugarCubes, type Drink } from "@/lib/data/drinks";
import { categoryStats, formatDate, formatNumber, latestCheckedAt, productSummaries, scaleMax, summarize } from "@/lib/drink-summary";
import { categoryPageHref } from "@/lib/category-landing-pages";
import { lowSugarMaxPer100Ml, sugarFreeMaxPer100Ml } from "@/lib/sugar-context";
import { pageMetadata, siteUrl } from "@/lib/site";
import { HomeSearch } from "@/components/ui/home-search";
import { LevelBadge } from "@/components/ui/level-badge";
import { SugarStripPlot } from "@/components/ui/sugar-strip-plot";
import styles from "@/components/ui/ui.module.css";

// Rebuild hourly so "Heute im Blick" switches to the next drink each day.
export const revalidate = 3600;

export const metadata = pageMetadata("Zucker in Getränken: Cola, Eistee, Energy Drinks", "Wie viel Zucker hat dein Getränk? Vergleiche Cola, Energy Drinks, Eistee, Saft und Limo pro 100 ml, pro Packung und als Zuckerwürfel.", "/de");

const popularIds = [
  "coca-cola-classic-500",
  "paulaner-spezi-500",
  "fanta-orange-500",
  "mezzo-mix-original-500",
  "monster-mango-loco-500",
  "red-bull-energy-drink-250",
  "sprite-500",
  "coca-cola-zero-sugar-500",
];

// "Heute im Blick" rotates daily through drinks people search for (Search Console demand).
const featuredRotation = [
  "coca-cola-classic-500",
  "paulaner-spezi-500",
  "fanta-orange-500",
  "mezzo-mix-original-500",
  "monster-mango-loco-500",
  "red-bull-energy-drink-250",
  "sprite-500",
  "lipton-ice-tea-zitrone-500",
  "club-mate-500",
  "almdudler-original-500",
];

function findDrink(id: string) {
  return drinks.find((drink) => drink.id === id);
}

function featuredOfTheDay(date = new Date()) {
  const berlinDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(date);
  const dayNumber = Math.floor(Date.parse(berlinDay) / 86_400_000);
  return findDrink(featuredRotation[dayNumber % featuredRotation.length]);
}

export default function HomePage() {
  const products = productSummaries();
  const stats = categoryStats();
  const popular = popularIds.map(findDrink).filter((drink): drink is Drink => drink !== undefined).map(summarize);
  const popularMax = Math.max(...popular.map((item) => item.total ?? 0));
  const featuredDrink = featuredOfTheDay();
  const featured = featuredDrink ? summarize(featuredDrink) : null;
  const featuredCubes = featuredDrink ? sugarCubes(featuredDrink) : null;
  const max = scaleMax();
  const rows = stats.map((category) => ({
    id: category.id,
    name: category.name,
    average: category.average,
    items: products.filter((item) => item.categoryId === category.id),
  }));
  const articles = homepageArticleSlugs.map((slug) => articleBySlug[slug]).filter((article): article is Article => Boolean(article));

  return (
    <main className={styles.page}>
      <section className={styles.homeHero}>
        <div>
          <h1>Wie viel Zucker steckt in deinem Getränk?</h1>
          <p className={styles.lead}>Werte pro 100 ml und pro Packung, umgerechnet in Zuckerwürfel und eingeordnet.</p>
          <HomeSearch items={products} />
          <p className={styles.heroMeta}>{products.length} Getränke · jede Zahl mit Quelle · zuletzt geprüft am {formatDate(latestCheckedAt())}</p>
        </div>
        {featured && (
          <Link href={featured.href} className={styles.showcase}>
            <span className={styles.showcaseTop}><span>Heute im Blick</span><span>{featured.sizeMl} ml</span></span>
            <span className={styles.showcaseBrand}>{featured.category}</span>
            <span className={styles.showcaseName}>{featured.name}</span>
            <span className={styles.showcaseValue}>{featured.total === null ? "/" : formatNumber(featured.total)}<small>g Zucker</small></span>
            <span className={styles.cubes} aria-hidden="true">
              {Array.from({ length: Math.min(Math.round(featuredCubes ?? 0), 30) }).map((_, index) => <i key={index} />)}
            </span>
            <span className={styles.showcaseFoot}>
              <span>{featuredCubes === null ? "" : `${formatNumber(featuredCubes)} Zuckerwürfel`}</span>
              <span>Details <ArrowRight size={16} aria-hidden="true" /></span>
            </span>
          </Link>
        )}
      </section>

      <section className={styles.section} aria-labelledby="popular-title">
        <div className={styles.sectionHead}>
          <h2 id="popular-title">Die Klassiker im Vergleich</h2>
          <Link href="/de/getraenke">Alle Getränke <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <ul className={styles.popularGrid}>
          {popular.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className={styles.popularCard}>
                <span className={styles.popularMeta}><span>{item.category}</span>{item.level !== "sugared" && <LevelBadge level={item.level} />}</span>
                <strong className={styles.popularName}>{item.name}</strong>
                <span className={styles.popularValue}>{item.total === null ? "/" : formatNumber(item.total)}<small>g / {item.sizeMl} ml</small></span>
                <span className={styles.popularBar} aria-hidden="true"><i style={{ width: `${((item.total ?? 0) / popularMax) * 100}%` }} /></span>
                <span className={styles.popularFoot}>{formatNumber(item.per100)} g pro 100 ml</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.stage} aria-labelledby="scale-title">
        <div className={styles.stageInner}>
          <div className={styles.sectionHead}>
            <h2 id="scale-title">Alle Getränke auf einen Blick</h2>
          </div>
          <p className={styles.sectionLead}>Jeder Punkt ist ein Getränk, jede Zeile eine Kategorie.</p>
          <SugarStripPlot rows={rows} max={max} freeMax={sugarFreeMaxPer100Ml} lowMax={lowSugarMaxPer100Ml} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="categories-title">
        <div className={styles.sectionHead}>
          <h2 id="categories-title">Zucker nach Kategorie</h2>
          <Link href="/de/kategorien">Alle Kategorien <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className={`${styles.card} ${styles.tableWrap}`}>
          <table className={styles.table}>
            <caption className="sr-only">Durchschnittlicher Zucker pro 100 ml je Kategorie</caption>
            <thead>
              <tr>
                <th scope="col">Kategorie</th>
                <th scope="col" className={styles.num}>Getränke</th>
                <th scope="col" className={styles.num}>Ø pro 100 ml</th>
                <th scope="col" className={styles.num}>Spanne</th>
                <th scope="col" className={styles.barCol}><span className="sr-only">Balken</span></th>
              </tr>
            </thead>
            <tbody>
              {stats.map((category) => {
                const href = categoryPageHref(category.id);
                return (
                  <tr key={category.id}>
                    <th scope="row">{href ? <Link href={href} className={styles.tableLink}>{category.name}</Link> : category.name}</th>
                    <td className={styles.num}>{category.count}</td>
                    <td className={styles.num}>{category.average === null ? "/" : `${formatNumber(category.average)} g`}</td>
                    <td className={styles.num}>{category.min === null || category.max === null ? "/" : `${formatNumber(category.min)}–${formatNumber(category.max)} g`}</td>
                    <td className={styles.barCol} aria-hidden="true">
                      {category.min !== null && category.max !== null && (
                        <span className={styles.rangeBar}><i style={{ left: `${(category.min / max) * 100}%`, width: `${Math.max(((category.max - category.min) / max) * 100, 1)}%` }} /></span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {articles.length > 0 && (
        <section className={styles.section} aria-labelledby="knowledge-title">
          <div className={styles.sectionHead}>
            <h2 id="knowledge-title">Werte richtig lesen</h2>
            <Link href="/de/wissen">Alle Artikel <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <ul className={styles.articleGrid}>
            {articles.map((article) => (
              <li key={article.slug}>
                <Link href={`/de/wissen/${article.slug}`} className={styles.articleCard}>
                  {article.image && (
                    <Image src={article.image.src} alt="" width={article.image.width} height={article.image.height} sizes="(max-width: 767px) 100vw, 360px" />
                  )}
                  <span className={styles.articleBody}>
                    <small>{article.minutes} Min. Lesezeit</small>
                    <strong>{article.title}</strong>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section} aria-labelledby="method-title">
        <div className={styles.sectionHead}>
          <h2 id="method-title">So rechnen wir</h2>
          <Link href="/de/ueber">Methodik <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        {featured && featuredDrink?.sizeMl && featured.total !== null && (
          <div className={`${styles.card} ${styles.formula}`}>
            <p className={styles.formulaRow} aria-label={`Rechenbeispiel ${featured.name}`}>
              <span><b>{formatNumber(featured.per100)} g</b><small>Zucker pro 100 ml</small></span>
              <i aria-hidden="true">×</i>
              <span><b>{featuredDrink.sizeMl} ml</b><small>Füllmenge ÷ 100</small></span>
              <i aria-hidden="true">=</i>
              <span><b>{formatNumber(featured.total)} g</b><small>Zucker pro Packung</small></span>
              <i aria-hidden="true">÷</i>
              <span><b>3 g</b><small>pro Zuckerwürfel</small></span>
              <i aria-hidden="true">=</i>
              <span className={styles.formulaResult}><b>{formatNumber(featuredCubes ?? 0)}</b><small>Würfel</small></span>
            </p>
            <p className={styles.formulaNote}>Beispiel {featured.name}. Der Wert pro 100 ml stammt vom Etikett, aus Hersteller- oder Händlerangaben, mit Link und Prüfdatum auf jeder Produktseite. Zum Einordnen dient die WHO-Empfehlung von höchstens 50 g freiem Zucker am Tag.</p>
          </div>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Zuckerhaltig.de",
            alternateName: "Zuckerhaltig",
            url: siteUrl,
          }),
        }}
      />
    </main>
  );
}
