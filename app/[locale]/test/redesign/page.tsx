import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { drinks } from "@/lib/data/drinks";
import { lowSugarMaxPer100Ml, sugarFreeMaxPer100Ml, sugarLevel } from "@/lib/sugar-context";
import { categoryStats, formatDate, formatNumber, latestCheckedAt, productSummaries, scaleMax, summarize } from "./data";
import { LevelBadge } from "./level-badge";
import { RedesignSearch } from "./redesign-search";
import { SugarStripPlot } from "./sugar-strip-plot";
import styles from "./redesign.module.css";

export const metadata: Metadata = {
  title: "Redesign-Entwurf: Startseite | Test",
  robots: { index: false, follow: false },
};

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
        <p className={styles.eyebrow}>{products.length} Getränke · jede Zahl mit Quelle</p>
        <h1>Wie viel Zucker steckt in deinem Getränk?</h1>
        <RedesignSearch items={products} />
        <p className={styles.heroMeta}>Zuletzt geprüft am {formatDate(latestCheckedAt())} · Werte pro 100 ml und pro Packung</p>
      </section>

      <section className={styles.section} aria-labelledby="popular-title">
        <div className={styles.sectionHead}>
          <h2 id="popular-title">Meistgesucht</h2>
          <Link href="/de/getraenke">Alle Getränke <ArrowRight size={15} /></Link>
        </div>
        <ol className={styles.rankList}>
          {popular.map((item) => (
            <li key={item.id}>
              <Link href={item.href}>
                <span className={styles.rankName}>
                  <strong>{item.name}</strong>
                  <small>{item.brand} · {item.sizeMl} ml</small>
                </span>
                <span className={styles.rankBar} aria-hidden="true">
                  <i style={{ width: `${((item.total ?? 0) / popularMax) * 100}%` }} />
                </span>
                <span className={styles.rankValue}>
                  <strong>{item.total === null ? "/" : `${formatNumber(item.total)} g`}</strong>
                  <small>{formatNumber(item.per100)} g / 100 ml</small>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="scale-title">
        <div className={styles.sectionHead}>
          <h2 id="scale-title">Alle Getränke auf einer Skala</h2>
        </div>
        <p className={styles.sectionLead}>Jeder Punkt ist ein Getränk, sortiert nach Kategorie. Antippen öffnet die Werte.</p>
        <SugarStripPlot rows={rows} max={max} freeMax={sugarFreeMaxPer100Ml} lowMax={lowSugarMaxPer100Ml} />
      </section>

      <section className={styles.section} aria-labelledby="categories-title">
        <div className={styles.sectionHead}>
          <h2 id="categories-title">Kategorien im Vergleich</h2>
          <Link href="/de/kategorien">Alle Kategorien <ArrowRight size={15} /></Link>
        </div>
        <div className={styles.tableWrap}>
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
                  <th scope="row">{category.name}</th>
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

      <section className={styles.method} aria-labelledby="method-title">
        <h2 id="method-title">So rechnen wir</h2>
        <ol>
          <li><strong>Etikett lesen.</strong> Zucker pro 100 ml aus Hersteller- oder Händlerangabe, mit Link und Prüfdatum.</li>
          <li><strong>Packung rechnen.</strong> 100-ml-Wert × Füllmenge. Ein Zuckerwürfel entspricht 3 g.</li>
          <li><strong>Einordnen.</strong> Vergleich mit der Kategorie und der WHO-Empfehlung von höchstens 50 g freiem Zucker am Tag.</li>
        </ol>
        <Link href="/de/ueber">Methodik und Kontakt <ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}
