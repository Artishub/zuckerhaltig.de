import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { categoryById } from "@/lib/data/categories";
import { sugarLevel } from "@/lib/sugar-context";
import { categoryStats, formatNumber, productSummaries, redesignBase, scaleMax } from "../../data";
import { CategoryTable } from "../../category-table";
import { LevelBadge } from "../../level-badge";
import styles from "../../redesign.module.css";

type PageProps = { params: Promise<{ categoryId: string }> };

export const metadata: Metadata = {
  title: "Redesign-Entwurf: Kategorie | Test",
  robots: { index: false, follow: false },
};

export default async function RedesignCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = categoryById[categoryId];
  const stats = categoryStats().find((item) => item.id === categoryId);
  if (!category || !stats || stats.average === null) notFound();

  const items = productSummaries().filter((item) => item.categoryId === categoryId);
  const highest = [...items].sort((a, b) => b.per100 - a.per100)[0];
  const lowest = [...items].sort((a, b) => a.per100 - b.per100)[0];
  const counts = {
    free: items.filter((item) => item.level === "free").length,
    low: items.filter((item) => item.level === "low").length,
    sugared: items.filter((item) => item.level === "sugared").length,
  };
  const otherCategories = categoryStats().filter((item) => item.id !== categoryId);

  return (
    <main className={styles.page}>
      <p className={styles.draft}>Entwurf · nicht indexiert · <Link href={redesignBase}>Zur Entwurfs-Startseite</Link></p>

      <nav aria-label="Brotkrumen" className={styles.crumbs}>
        <Link href={redesignBase}>Start</Link> / <span>Kategorien</span> / <span>{category.name}</span>
      </nav>

      <section className={styles.categoryHero}>
        <div>
          <p className={styles.eyebrow}>Kategorie · {items.length} Getränke</p>
          <h1>{category.name}: Zucker im Vergleich</h1>
          <p className={styles.lead}>
            Im Schnitt {formatNumber(stats.average)} g Zucker pro 100 ml. Die Spanne reicht von {formatNumber(stats.min ?? 0)} g bis {formatNumber(stats.max ?? 0)} g.
          </p>
        </div>
        <dl className={styles.statGrid}>
          <div className={styles.statCard}><dt>Durchschnitt</dt><dd>{formatNumber(stats.average)}<small>g / 100 ml</small></dd><LevelBadge level={sugarLevel(stats.average)} /></div>
          {highest && <div className={styles.statCard}><dt>Am meisten</dt><dd>{formatNumber(highest.per100)}<small>g / 100 ml</small></dd><Link href={highest.href}>{highest.name}</Link></div>}
          {lowest && <div className={styles.statCard}><dt>Am wenigsten</dt><dd>{formatNumber(lowest.per100)}<small>g / 100 ml</small></dd><Link href={lowest.href}>{lowest.name}</Link></div>}
          <div className={styles.statCard}>
            <dt>Verteilung</dt>
            <dd className={styles.statSplit}>
              <span><b>{counts.free}</b> zuckerfrei</span>
              <span><b>{counts.low}</b> zuckerarm</span>
              <span><b>{counts.sugared}</b> mit Zucker</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="list-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Alle Getränke</p>
            <h2 id="list-title">{items.length} Getränke nach Zucker sortiert</h2>
          </div>
        </div>
        <p className={styles.sectionLead}>Spaltenköpfe antippen, um zu sortieren. Der Balken zeigt Zucker pro 100 ml im Vergleich zum zuckerreichsten Getränk der Datenbank.</p>
        <CategoryTable items={items} max={scaleMax()} />
      </section>

      <section className={styles.section} aria-labelledby="other-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Weitere Kategorien</p>
            <h2 id="other-title">Andere Getränke vergleichen</h2>
          </div>
        </div>
        <ul className={styles.chipList}>
          {otherCategories.map((item) => (
            <li key={item.id}>
              <Link href={`${redesignBase}/kategorie/${item.id}`}>
                {item.name}
                <span>{item.average === null ? "" : `Ø ${formatNumber(item.average)} g`}</span>
                <ArrowRight size={14} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
