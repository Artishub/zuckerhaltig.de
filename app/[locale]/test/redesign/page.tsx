import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { drinks, sugarCubes } from "@/lib/data/drinks";
import { lowSugarMaxPer100Ml, sugarFreeMaxPer100Ml, sugarLevel } from "@/lib/sugar-context";
import { categoryStats, formatDate, formatNumber, latestCheckedAt, productSummaries, redesignBase, scaleMax, summarize } from "./data";
import { LevelBadge } from "./level-badge";
import { RedesignSearch } from "./redesign-search";
import { SugarStripPlot } from "./sugar-strip-plot";
import styles from "./redesign.module.css";

export const metadata: Metadata = {
  title: "Redesign-Entwurf: Startseite | Test",
  robots: { index: false, follow: false },
};

const featuredId = "coca-cola-classic-500";

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

export default function RedesignHomePage() {
  const products = productSummaries();
  const stats = categoryStats();
  const popular = popularIds
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink) => drink !== undefined)
    .map(summarize);
  const featuredDrink = drinks.find((drink) => drink.id === featuredId);
  const featured = featuredDrink ? summarize(featuredDrink) : null;
  const featuredCubes = featuredDrink ? sugarCubes(featuredDrink) : null;
  const max = scaleMax();
  const rows = stats.map((category) => ({
    id: category.id,
    name: category.name,
    average: category.average,
    items: products.filter((item) => item.categoryId === category.id),
  }));
  const popularMax = Math.max(...popular.map((item) => item.total ?? 0));

  return (
    <main className={styles.page}>
      <p className={styles.draft}>Entwurf · nicht indexiert · <Link href="/de/test/redesign/coca-cola-classic-500">Detailseite ansehen</Link></p>

      <section className={styles.homeHero}>
        <div>
          <p className={styles.eyebrow}>{products.length} Getränke · jede Zahl mit Quelle</p>
          <h1>Wie viel Zucker steckt in deinem Getränk?</h1>
          <p className={styles.lead}>Werte pro 100 ml und pro Packung, umgerechnet in Zuckerwürfel und eingeordnet.</p>
          <RedesignSearch items={products} />
          <p className={styles.heroMeta}>Zuletzt geprüft am {formatDate(latestCheckedAt())}</p>
        </div>
        {featured && (
          <Link href={featured.href} className={styles.showcase}>
            <span className={styles.showcaseTop}><span>Heute im Blick</span><span>{featured.sizeMl} ml</span></span>
            <span className={styles.showcaseBrand}>{featured.brand}</span>
            <span className={styles.showcaseName}>{featured.name}</span>
            <span className={styles.showcaseValue}>{featured.total === null ? "/" : formatNumber(featured.total)}<small>g Zucker</small></span>
            <span className={styles.cubes} aria-hidden="true">
              {Array.from({ length: Math.min(Math.round(featuredCubes ?? 0), 30) }).map((_, index) => <i key={index} />)}
            </span>
            <span className={styles.showcaseFoot}>
              <span>{featuredCubes === null ? "" : `${formatNumber(featuredCubes)} Zuckerwürfel`}</span>
              <span>Details <ArrowRight size={16} /></span>
            </span>
          </Link>
        )}
      </section>

      <section className={styles.section} aria-labelledby="popular-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Meistgesucht</p>
            <h2 id="popular-title">Die Klassiker im Vergleich</h2>
          </div>
          <Link href="/de/getraenke">Alle Getränke <ArrowRight size={15} /></Link>
        </div>
        <ul className={styles.popularGrid}>
          {popular.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className={styles.popularCard}>
                <span className={styles.popularMeta}><span>{item.brand}</span><LevelBadge level={item.level} /></span>
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
            <div>
              <p className={styles.eyebrow}>Die Zuckerskala</p>
              <h2 id="scale-title">Alle Getränke auf einen Blick</h2>
            </div>
          </div>
          <p className={styles.sectionLead}>Jeder Punkt ist ein Getränk, jede Zeile eine Kategorie. Antippen öffnet die Werte.</p>
          <SugarStripPlot rows={rows} max={max} freeMax={sugarFreeMaxPer100Ml} lowMax={lowSugarMaxPer100Ml} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="categories-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Kategorien</p>
            <h2 id="categories-title">Wo steckt am meisten Zucker?</h2>
          </div>
        </div>
        <div className={`${styles.card} ${styles.tableWrap}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Kategorie</th>
                <th scope="col" className={styles.num}>Getränke</th>
                <th scope="col" className={styles.num}>Ø pro 100 ml</th>
                <th scope="col" className={styles.num}>Spanne</th>
                <th scope="col">Einordnung</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((category) => (
                <tr key={category.id}>
                  <th scope="row"><Link href={`${redesignBase}/kategorie/${category.id}`} className={styles.tableLink}>{category.name}</Link></th>
                  <td className={styles.num}>{category.count}</td>
                  <td className={styles.num}>{category.average === null ? "/" : `${formatNumber(category.average)} g`}</td>
                  <td className={styles.num}>{category.min === null || category.max === null ? "/" : `${formatNumber(category.min)}–${formatNumber(category.max)} g`}</td>
                  <td>{category.average !== null && <LevelBadge level={sugarLevel(category.average)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="method-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Methodik</p>
            <h2 id="method-title">So rechnen wir</h2>
          </div>
          <Link href="/de/ueber">Mehr zur Methodik <ArrowRight size={15} /></Link>
        </div>
        <ol className={styles.steps}>
          <li><strong>Etikett lesen</strong><span>Zucker pro 100 ml aus Hersteller- oder Händlerangabe, mit Link und Prüfdatum.</span></li>
          <li><strong>Packung rechnen</strong><span>100-ml-Wert × Füllmenge. Ein Zuckerwürfel entspricht 3 g.</span></li>
          <li><strong>Einordnen</strong><span>Vergleich mit der Kategorie und der WHO-Empfehlung von höchstens 50 g freiem Zucker am Tag.</span></li>
        </ol>
      </section>
    </main>
  );
}
