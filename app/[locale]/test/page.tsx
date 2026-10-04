import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Search,
} from "lucide-react";
import { articleBySlug, homepageArticleSlugs, type Article } from "@/lib/content/articles";
import { brandById } from "@/lib/data/brands";
import { categoryById } from "@/lib/data/categories";
import { drinks, sugarCubes, totalSugarGrams, type Drink } from "@/lib/data/drinks";
import styles from "./test-home.module.css";
import { drinkPageHref } from "@/lib/page-routing";

export const metadata: Metadata = {
  title: "Zucker in Getränken: der schnelle Überblick | Test",
  description: "Zucker in Cola, Energy Drinks und Limo vergleichen: pro 100 ml, pro Packung und als Zuckerwürfel.",
  robots: { index: false, follow: false },
};

const drinkIds = [
  "coca-cola-classic-500",
  "monster-mango-loco-500",
  "fanta-orange-500",
  "red-bull-energy-drink-250",
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

function featuredOfTheDay(date = new Date()) {
  const berlinDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(date);
  const dayNumber = Math.floor(Date.parse(berlinDay) / 86_400_000);
  return findDrink(featuredRotation[dayNumber % featuredRotation.length]);
}

export default function TestHomePage() {
  const selected = drinkIds.map(findDrink);
  const [cola, monster, fanta, redBull] = selected;
  const featured = featuredOfTheDay();
  const featuredBrand = brandById[featured.brandId]?.name ?? "";
  const featuredCubes = sugarCubes(featured);
  const [sweetenerArticle, sugarArticle, labelArticle] = homepageArticleSlugs.map(findArticle);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Zucker-Check für den Alltag</p>
            <h1>Wie viel Zucker steckt in unseren Getränken?</h1>
            <p className={styles.lede}>Zucker in Getränken, lesbar gemacht. Vergleiche Werte pro 100 ml, pro Packung und als Würfel.</p>
            <div className={styles.heroActions}>
              <Link href="/de/getraenke" className={styles.primaryButton}>Getränk finden <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
              <a href="#zuckerkarte" className={styles.textButton}>So liest du die Werte <ChevronRight size={17} strokeWidth={1.75} aria-hidden="true" /></a>
            </div>
          </div>

          <article className={styles.heroCard} aria-label={`${featured.name}: Zucker pro Packung`}>
            <div className={styles.cardTopline}>
              <span>Heute im Blick</span>
              <span>{formatMl(featured.sizeMl)}</span>
            </div>
            <div className={styles.heroCardContent}>
              <p className={styles.brand}>{featuredBrand}</p>
              <h2>{featured.name.startsWith(`${featuredBrand} `) ? featured.name.slice(featuredBrand.length + 1) : featured.name}</h2>
              <div className={styles.sugarNumber}>
                <strong>{formatNumber(totalSugarGrams(featured))}</strong><span>g Zucker</span>
              </div>
              <p className={styles.cardHint}>pro {formatMl(featured.sizeMl)} · {formatNumber(featuredCubes)} Zuckerwürfel</p>
              <div className={styles.cubeField} aria-hidden="true">
                {Array.from({ length: Math.min(Math.round(featuredCubes ?? 0), 30) }).map((_, index) => <i key={index} />)}
              </div>
            </div>
            <Link href={drinkPageHref(featured)} className={styles.cardLink}>Detail ansehen <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
          </article>
        </div>
      </section>

      <section className={styles.quickNav} aria-label="Schnelleinstieg">
        <Link href="/de/wissen/cola-zucker-pro-100ml"><span>Cola</span><ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
        <Link href="/de/wissen/energy-drinks-zucker-vergleichen"><span>Energy Drinks</span><ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
        <Link href="/de/wissen/eistee-zucker-im-alltag"><span>Eistee</span><ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
        <Link href="/de/rankings/zuckerreichste-getraenke"><span>Ranking</span><ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
      </section>

      <section className={styles.snapshot} id="zuckerkarte">
        <div className={styles.sectionIntro}>
          <h2>Vier beliebte Getränke.<br />Ein direkter Vergleich.</h2>
          <p>Die Flaschengröße verändert den Blick auf den Zuckerwert.<br />Deshalb stehen beide Angaben nebeneinander.</p>
        </div>
        <div className={styles.drinkGrid}>
          {[monster, cola, fanta, redBull].map((drink) => <DrinkCard drink={drink} key={drink.id} />)}
        </div>
      </section>

      <section className={styles.knowledge} aria-labelledby="knowledge-title">
        <div className={styles.knowledgeHeader}>
          <div>
            <h2 id="knowledge-title">Zuckerwerte besser einordnen.</h2>
          </div>
          <Link href="/de/wissen" className={styles.textButton}>
            Alle Artikel <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.knowledgeGrid}>
          <KnowledgeTeaser article={sweetenerArticle} />
          <div className={styles.knowledgeStack}>
            {[sugarArticle, labelArticle].map((article) => <KnowledgeTeaser key={article.slug} article={article} />)}
          </div>
        </div>
      </section>

      <section className={styles.explorer}>
        <div>
          <p className={styles.explorerLabel}><Search size={14} strokeWidth={1.75} aria-hidden="true" /> Durchsuche unsere Getränkedatenbank</p>
          <h2>Eine Zahl pro Packung.<br />Mit Quelle und Rechenweg.</h2>
        </div>
        <div className={styles.explorerPanel}>
          <p>Finde Getränke nach Marke, Kategorie oder Zuckerwert. Jede Detailseite zeigt Quelle und Prüfdatum.</p>
          <Link href="/de/getraenke" className={styles.lightButton}>Alle Getränke <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className={styles.method}>
        <div className={styles.methodTitle}>
          <h2>So rechnet zuckerhaltig.</h2>
        </div>
        <div className={styles.methodSteps}>
          <article><h3>Nährwert lesen</h3><p>Wir übernehmen den Zuckerwert pro 100 ml aus der Quelle.</p></article>
          <article><h3>Packung rechnen</h3><p>Der 100-ml-Wert wird mit der tatsächlichen Füllmenge verrechnet.</p></article>
          <article><h3>Einordnen</h3><p>Ein Zuckerwürfel steht für 3 g. So werden Mengen greifbar.</p></article>
        </div>
      </section>

      <section className={styles.closing}>
        <div>
          <h2>Dein Getränk im Check.</h2>
          <p>Werte vergleichen, Quelle prüfen, weniger schätzen.</p>
        </div>
        <Link href="/de/getraenke" className={styles.primaryButton}>Jetzt vergleichen <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}

function KnowledgeTeaser({ article }: { article: Article }) {
  return (
    <Link href={`/de/wissen/${article.slug}`} className={styles.knowledgeTeaser}>
      {article.image && (
        <div className={styles.knowledgeTeaserImage}>
          <Image
            src={article.image.src}
            alt=""
            width={article.image.width}
            height={article.image.height}
            sizes="(max-width: 767px) calc(100vw - 2.5rem), 280px"
          />
        </div>
      )}
      <div className={styles.knowledgeTeaserBody}>
        <p className={styles.knowledgeMeta}>{article.minutes} Min. Lesezeit</p>
        <h3>{article.title}</h3>
        <p className={styles.knowledgeDescription}>{article.description}</p>
        <span>Lesen <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></span>
      </div>
    </Link>
  );
}

function DrinkCard({ drink }: { drink: Drink }) {
  const packageSugar = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);

  return (
    <Link href={drinkPageHref(drink)} className={styles.drinkCard}>
      <div className={styles.drinkCardTop}><span>{brandById[drink.brandId]?.name}</span><span>{categoryById[drink.categoryId]?.name}</span></div>
      <div>
        <h3>{drink.name.replace(`${brandById[drink.brandId]?.name} `, "")}</h3>
      </div>
      <div className={styles.measure}><strong>{formatNumber(packageSugar)} g</strong><span>pro {formatMl(drink.sizeMl)}</span></div>
      <div className={styles.cardFoot}><span>{formatNumber(drink.sugarPer100Ml)} g / 100 ml</span><span>{formatNumber(cubes)} Würfel</span></div>
    </Link>
  );
}

function findDrink(id: string) {
  const drink = drinks.find((item) => item.id === id);
  if (!drink) throw new Error(`Drink ${id} fehlt.`);
  return drink;
}

function findArticle(slug: string) {
  const article = articleBySlug[slug];
  if (!article) throw new Error(`Article ${slug} fehlt.`);
  return article;
}

function formatNumber(value: number | null) {
  return value === null ? "/" : new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function formatMl(value: number | null) {
  return value ? `${value} ml` : "Packung";
}
