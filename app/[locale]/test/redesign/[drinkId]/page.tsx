import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { categoryById } from "@/lib/data/categories";
import { canonicalPackageDrinkId, drinks, packageEnergyKcal, productFamilyDrinks, sugarCubes, totalSugarGrams, type Drink } from "@/lib/data/drinks";
import {
  averageSugarPer100Ml,
  categoryPeers,
  lowerSugarAlternative,
  lowSugarMaxPer100Ml,
  sugarFreeMaxPer100Ml,
  sugarLevel,
  sugarRank,
  whoDailyLimitGrams,
  whoGuidelineUrl,
} from "@/lib/sugar-context";
import { brandLabel, formatDate, formatNumber, redesignBase, scaleMax, summarize } from "../data";
import { LevelBadge } from "../level-badge";
import { SugarScale } from "../sugar-scale";
import styles from "../redesign.module.css";
import { correctionMailto } from "@/lib/site";

type PageProps = { params: Promise<{ drinkId: string }> };

export const metadata: Metadata = {
  title: "Redesign-Entwurf: Getränkeseite | Test",
  robots: { index: false, follow: false },
};

export default async function RedesignDrinkPage({ params }: PageProps) {
  const { drinkId } = await params;
  const drink = drinks.find((item) => item.id === drinkId);
  if (!drink) notFound();
  const canonicalId = canonicalPackageDrinkId(drink);
  if (canonicalId !== drink.id) permanentRedirect(`${redesignBase}/${canonicalId}`);

  const brand = brandLabel(drink);
  const categoryName = categoryById[drink.categoryId]?.name ?? "Getränk";
  const categoryHref = `${redesignBase}/kategorie/${drink.categoryId}`;
  const total = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  const energy = packageEnergyKcal(drink);
  const family = productFamilyDrinks(drink);
  const peers = categoryPeers(drink);
  const average = averageSugarPer100Ml(peers);
  const rank = sugarRank(drink, peers);
  const alternative = lowerSugarAlternative(drink, peers);
  const level = sugarLevel(drink.sugarPer100Ml);
  const max = scaleMax();
  const similar = peers
    .filter((item) => item.name !== drink.name)
    .sort((a, b) => Math.abs(a.sugarPer100Ml - drink.sugarPer100Ml) - Math.abs(b.sugarPer100Ml - drink.sugarPer100Ml))
    .slice(0, 5)
    .map(summarize);
  const nutrition = drink.nutritionPer100Ml;

  return (
    <main className={styles.page}>
      <p className={styles.draft}>Entwurf · nicht indexiert · <Link href={redesignBase}>Zur Entwurfs-Startseite</Link> · <Link href={`/de/getraenke/${drink.id}`}>Live-Version</Link></p>

      <nav aria-label="Brotkrumen" className={styles.crumbs}>
        <Link href={redesignBase}>Start</Link> / <Link href={categoryHref}>{categoryName}</Link> / <span>{drink.name}</span>
      </nav>

      <section className={styles.factHero}>
        <div className={styles.factIntro}>
          <p className={styles.eyebrow}>{brand} · {categoryName}</p>
          <h1>{drink.name}</h1>
          <p className={styles.answer}>
            <strong>{formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml.</strong>
            {total !== null && drink.sizeMl ? ` Eine ${drink.sizeMl}-ml-Packung enthält ${formatNumber(total)} g Zucker, etwa ${formatNumber(cubes ?? 0)} Zuckerwürfel.` : ""}
          </p>
          <p className={styles.heroSource}><LevelBadge level={level} /><span>Quelle: {drink.source}</span></p>
        </div>
        <div className={styles.factCard}>
          <p>{drink.sizeMl ? `${drink.sizeMl} ml` : "Packung"}</p>
          <strong>{total === null ? "/" : formatNumber(total)}<span>g Zucker</span></strong>
          <div className={styles.cubes} aria-hidden="true">
            {Array.from({ length: Math.min(Math.round(cubes ?? 0), 30) }).map((_, index) => <i key={index} />)}
          </div>
          <dl>
            <div><dt>Würfel</dt><dd>{cubes === null ? "/" : formatNumber(cubes)}</dd></div>
            <div><dt>kcal</dt><dd>{energy === null ? "/" : formatNumber(Math.round(energy))}</dd></div>
            <div><dt>von 50 g WHO</dt><dd>{total === null ? "/" : `${Math.round((total / whoDailyLimitGrams) * 100)} %`}</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="scale-title">
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Einordnung</p><h2 id="scale-title">Ist das viel?</h2></div></div>
        <div className={styles.card}>
        <SugarScale value={drink.sugarPer100Ml} average={average} categoryName={categoryName} max={max} freeMax={sugarFreeMaxPer100Ml} lowMax={lowSugarMaxPer100Ml} />
        </div>
        <ul className={styles.contextList}>
          {average !== null && (
            <li>
              <strong>{drink.sugarPer100Ml > sugarFreeMaxPer100Ml ? `Platz ${rank} von ${peers.length}` : "Zuckerfrei"}</strong>
              <span>in der Kategorie {categoryName}, Durchschnitt {formatNumber(average)} g pro 100 ml.</span>
            </li>
          )}
          {alternative && (
            <li>
              <strong>{formatNumber(alternative.sugarPer100Ml)} g bei {alternative.name}</strong>
              <span>
                {drink.sizeMl ? `${formatNumber(((drink.sugarPer100Ml - alternative.sugarPer100Ml) * drink.sizeMl) / 100)} g weniger Zucker bei ${drink.sizeMl} ml. ` : ""}
                <Link href={`${redesignBase}/${canonicalPackageDrinkId(alternative)}`}>Ansehen</Link>
                {" · "}
                <Link href={`/de/getraenke/vergleich?drinks=${drink.id},${canonicalPackageDrinkId(alternative)}`}>Vergleichen</Link>
              </span>
            </li>
          )}
        </ul>
      </section>

      {family.length > 0 && (
        <section className={styles.section} aria-labelledby="sizes-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Packungsgrößen</p><h2 id="sizes-title">Zucker je Packungsgröße</h2></div></div>
          <div className={`${styles.card} ${styles.tableWrap}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Packung</th>
                  <th scope="col" className={styles.num}>Zucker</th>
                  <th scope="col" className={styles.num}>Würfel</th>
                  <th scope="col" className={styles.num}>kcal</th>
                  <th scope="col" className={styles.num}>Anteil an 50 g</th>
                </tr>
              </thead>
              <tbody>
                {family.map((item) => {
                  const itemTotal = totalSugarGrams(item);
                  const itemEnergy = packageEnergyKcal(item);
                  const isCurrent = item.id === drink.id;
                  return (
                    <tr key={item.id} className={isCurrent ? styles.currentRow : undefined}>
                      <th scope="row">{isCurrent ? `${item.sizeMl} ml` : <Link href={`${redesignBase}/${item.id}`}>{item.sizeMl} ml</Link>}</th>
                      <td className={styles.num}>{itemTotal === null ? "/" : `${formatNumber(itemTotal)} g`}</td>
                      <td className={styles.num}>{sugarCubes(item) === null ? "/" : formatNumber(sugarCubes(item) ?? 0)}</td>
                      <td className={styles.num}>{itemEnergy === null ? "/" : formatNumber(Math.round(itemEnergy))}</td>
                      <td className={styles.num}>{itemTotal === null ? "/" : `${Math.round((itemTotal / whoDailyLimitGrams) * 100)} %`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className={`${styles.section} ${styles.split}`}>
        {nutrition && (
          <div className={styles.label} aria-labelledby="label-title">
            <h2 id="label-title">Nährwerte</h2>
            <p className={styles.labelSub}>pro 100 ml</p>
            <table>
              <tbody>
                <tr><th scope="row">Energie</th><td>{formatNumber(nutrition.energyKj)} kJ / {formatNumber(nutrition.energyKcal)} kcal</td></tr>
                <tr><th scope="row">Fett</th><td>{formatNumber(nutrition.fat)} g</td></tr>
                <tr><th scope="row">Kohlenhydrate</th><td>{formatNumber(nutrition.carbohydrates)} g</td></tr>
                <tr className={styles.labelStrong}><th scope="row">davon Zucker</th><td>{formatNumber(drink.sugarPer100Ml)} g</td></tr>
                <tr><th scope="row">Eiweiß</th><td>{formatNumber(nutrition.protein)} g</td></tr>
                <tr><th scope="row">Salz</th><td>{formatNumber(nutrition.salt)} g</td></tr>
              </tbody>
            </table>
          </div>
        )}
        <aside className={`${styles.card} ${styles.source}`}>
          <h2>Quelle</h2>
          <p>{drink.source}</p>
          <dl>
            <div><dt>Status</dt><dd>{verificationLabel(drink.verificationStatus)}</dd></div>
            {drink.lastCheckedAt && <div><dt>Geprüft</dt><dd>{formatDate(drink.lastCheckedAt)}</dd></div>}
            {total !== null && drink.sizeMl && <div><dt>Rechnung</dt><dd>{formatNumber(drink.sugarPer100Ml)} g × {drink.sizeMl} ml / 100 = {formatNumber(total)} g</dd></div>}
          </dl>
          <a href={drink.sourceUrl} target="_blank" rel="noreferrer">Quelle öffnen <ExternalLink size={14} /></a>
          <a href={correctionMailto(`Wert prüfen: ${drink.name} ${drink.sizeMl ?? ""} ml`)}>Wert falsch? Hinweis senden</a>
          <a href={whoGuidelineUrl} target="_blank" rel="noreferrer">WHO-Empfehlung zu Zucker <ExternalLink size={14} /></a>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className={styles.section} aria-labelledby="similar-title">
          <div className={styles.sectionHead}>
            <div><p className={styles.eyebrow}>Weiter vergleichen</p><h2 id="similar-title">Ähnlich viel Zucker</h2></div>
            <Link href={categoryHref}>{categoryName} vergleichen <ArrowRight size={15} /></Link>
          </div>
          <ul className={`${styles.card} ${styles.compactList}`}>
            {similar.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>
                  <span><strong>{item.name}</strong><small>{item.brand} · {item.sizeMl} ml</small></span>
                  <span className={styles.num}>{formatNumber(item.per100)} g / 100 ml</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function verificationLabel(status: Drink["verificationStatus"]) {
  if (status === "manufacturer_verified") return "Herstellerangabe geprüft";
  if (status === "retailer_verified") return "Händlerangabe geprüft";
  if (status === "manufacturer_or_retailer_verified") return "Hersteller- oder Händlerangabe geprüft";
  if (status === "manufacturer_verified_needs_field_check") return "Herstellerquelle, einzelne Felder offen";
  if (status === "needs_label_check") return "Quelle vorhanden, Etikett noch prüfen";
  return "Importquelle, noch nicht verifiziert";
}
