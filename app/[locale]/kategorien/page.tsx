import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryPageHref } from "@/lib/category-landing-pages";
import { categoryById } from "@/lib/data/categories";
import { drinks, uniqueProductRepresentatives } from "@/lib/data/drinks";
import { categoryStats, formatNumber, scaleMax } from "@/lib/drink-summary";
import { pageMetadata } from "@/lib/site";
import { sugarFreeMaxPer100Ml } from "@/lib/sugar-context";
import ui from "@/components/ui/ui.module.css";

export const metadata = pageMetadata("Kategorien", "Getränkekategorien von Cola bis Energy Drink: Zucker pro 100 ml, Packungszucker und Zuckerwürfel für Softdrinks, Saft, Eistee und Schorle vergleichen.", "/de/kategorien");

export default function CategoriesPage() {
  const stats = categoryStats();
  const max = scaleMax();
  const sugarFreeCount = uniqueProductRepresentatives(drinks.filter((drink) => drink.sugarPer100Ml <= sugarFreeMaxPer100Ml)).length;

  return (
    <main className={ui.page}>
      <section className={ui.pageHero}>
        <h1>Zucker nach Getränkekategorie</h1>
        <p className={ui.lead}>Durchschnitt und Spanne pro 100 ml für {stats.length} Kategorien, von Cola bis Schorle.</p>
      </section>

      <ul className={ui.tileGrid}>
        {stats.map((category) => {
          const href = categoryPageHref(category.id) ?? `/de/getraenke?category=${category.id}`;
          return (
            <li key={category.id}>
              <Link href={href} className={ui.tile}>
                <span className={ui.tileHead}><strong>{category.name}</strong></span>
                <span className={ui.tileText}>{categoryById[category.id]?.description}</span>
                <span className={ui.tileValue}>{category.average === null ? "/" : formatNumber(category.average)}<small>g Ø pro 100 ml</small></span>
                {category.min !== null && category.max !== null && (
                  <span className={ui.rangeBar} aria-hidden="true">
                    <i style={{ left: `${(category.min / max) * 100}%`, width: `${Math.max(((category.max - category.min) / max) * 100, 1)}%` }} />
                  </span>
                )}
                <span className={ui.tileFoot}>
                  <span>{category.count} Getränke · {category.min === null || category.max === null ? "" : `${formatNumber(category.min)}–${formatNumber(category.max)} g`}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
        <li>
          <Link href="/de/rankings/zuckerfreie-getraenke" className={`${ui.tile} ${ui.tileDark}`}>
            <span className={ui.tileHead}><strong>Zuckerfreie Getränke</strong></span>
            <span className={ui.tileText}>Zero- und Light-Getränke mit höchstens 0,5 g Zucker pro 100 ml.</span>
            <span className={ui.tileValue}>{sugarFreeCount}<small>Getränke</small></span>
            <span className={ui.tileFoot}><span>Zur Liste</span><ArrowRight size={15} aria-hidden="true" /></span>
          </Link>
        </li>
      </ul>
    </main>
  );
}
