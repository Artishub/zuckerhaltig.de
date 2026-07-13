import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Info, Scale } from "lucide-react";
import { brandById } from "@/lib/data/brands";
import { canonicalDrinkId, drinks, packageEnergyKcal, sugarCubes, totalSugarGrams, type Drink } from "@/lib/data/drinks";
import styles from "./drink-test.module.css";

const drink = findDrink("coca-cola-classic-500");

const totalSugar = totalSugarGrams(drink);
const cubes = sugarCubes(drink);
const energy = packageEnergyKcal(drink);
const brand = brandById[drink.brandId]?.name ?? "Coca-Cola";

export const metadata: Metadata = {
  title: "Coca-Cola Classic Zucker | Test",
  description: "Coca-Cola Classic: Zucker pro 100 ml, pro 500-ml-Flasche und als Zuckerwürfel.",
  robots: { index: false, follow: false },
};

export default function CocaColaTestPage() {
  const related = ["fanta-orange-500", "sprite-500", "pepsi-500"]
    .map((id) => drinks.find((item) => item.id === id))
    .filter((item): item is Drink => Boolean(item));

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Link href="/de/test" className={styles.back}><ArrowLeft size={16} /> Zur Test-Startseite</Link>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.category}>Cola · 500 ml Flasche</p>
            <h1>{drink.name}</h1>
            <p className={styles.summary}>Eine 500-ml-Flasche enthält rechnerisch <strong>{format(totalSugar)} g Zucker</strong>. Das sind etwa {format(cubes)} Zuckerwürfel.</p>
            <div className={styles.sourceLine}><Info size={15} /> Quelle: {drink.source}</div>
          </div>
          <div className={styles.photoWrap}>
            <Image src="/images/test/generic-cola-sugar-still-life.png" alt="Markenfreie Cola-Flasche neben Zuckerwürfeln" fill priority sizes="(max-width: 767px) 100vw, 48vw" className={styles.photo} />
            <div className={styles.photoTag}><strong>{format(totalSugar)} g</strong><span>Zucker pro Flasche</span></div>
          </div>
        </div>
      </section>

      <section className={styles.facts} aria-label="Zuckerwerte von Coca-Cola Classic">
        <Fact value={`${format(drink.sugarPer100Ml)} g`} label="Zucker pro 100 ml" />
        <Fact value={`${format(totalSugar)} g`} label="Zucker pro 500 ml" accent />
        <Fact value={format(cubes)} label="Zuckerwürfel" />
        <Fact value={energy ? `${format(energy)} kcal` : "/"} label="Energie pro Flasche" />
      </section>

      <section className={styles.reading}>
        <div className={styles.readingIntro}>
          <p className={styles.category}>Was die Zahl bedeutet</p>
          <h2>53 g stehen nicht nur auf dem Etikett.</h2>
          <p>Der Wert pro 100 ml macht Getränke vergleichbar. Der Gesamtwert zeigt die Menge in der Flasche, die du tatsächlich trinkst.</p>
        </div>
        <div className={styles.cubeBoard} aria-label={`${format(cubes)} Zuckerwürfel für eine Flasche`}>
          <div className={styles.cubeCount}><strong>{format(cubes)}</strong><span>Würfel</span></div>
          <div className={styles.cubes} aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <i key={index} />)}</div>
          <p>Ein Würfel entspricht 3 g Zucker.</p>
        </div>
      </section>

      <section className={styles.details}>
        <div className={styles.nutrition}>
          <p className={styles.category}>Nährwerttabelle</p>
          <h2>Pro 100 ml</h2>
          <dl>
            <div><dt>Energie</dt><dd>{drink.nutritionPer100Ml ? `${format(drink.nutritionPer100Ml.energyKcal)} kcal / ${format(drink.nutritionPer100Ml.energyKj)} kJ` : "/"}</dd></div>
            <div><dt>Kohlenhydrate</dt><dd>{drink.nutritionPer100Ml ? `${format(drink.nutritionPer100Ml.carbohydrates)} g` : "/"}</dd></div>
            <div><dt>davon Zucker</dt><dd>{format(drink.sugarPer100Ml)} g</dd></div>
            <div><dt>Fett</dt><dd>{drink.nutritionPer100Ml ? `${format(drink.nutritionPer100Ml.fat)} g` : "/"}</dd></div>
            <div><dt>Eiweiß</dt><dd>{drink.nutritionPer100Ml ? `${format(drink.nutritionPer100Ml.protein)} g` : "/"}</dd></div>
            <div><dt>Salz</dt><dd>{drink.nutritionPer100Ml ? `${format(drink.nutritionPer100Ml.salt)} g` : "/"}</dd></div>
          </dl>
        </div>
        <aside className={styles.sourceCard}>
          <p className={styles.category}>Datenquelle</p>
          <h2>Nachprüfbar.</h2>
          <p>{drink.note}</p>
          {drink.lastCheckedAt && <p className={styles.checked}>Zuletzt geprüft: {new Intl.DateTimeFormat("de-DE").format(new Date(drink.lastCheckedAt))}</p>}
          {drink.sourceUrl && <a href={drink.sourceUrl} target="_blank" rel="noreferrer">Quelle öffnen <ExternalLink size={16} /></a>}
        </aside>
      </section>

      <section className={styles.compare}>
        <div><Scale size={22} aria-hidden="true" /><h2>Mit anderer Cola vergleichen.</h2></div>
        <div className={styles.related}>
          {related.map((item) => <Link href={`/de/getraenke/${canonicalDrinkId(item)}`} key={item.id}><span>{brandById[item.brandId]?.name}</span><strong>{item.name.replace(`${brandById[item.brandId]?.name} `, "")}</strong><b>{format(item.sugarPer100Ml)} g / 100 ml</b><ArrowRight size={16} /></Link>)}
        </div>
      </section>
    </main>
  );
}

function Fact({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return <article className={accent ? styles.accentFact : ""}><strong>{value}</strong><span>{label}</span></article>;
}

function format(value: number | null) {
  return value === null ? "/" : new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function findDrink(id: string): Drink {
  const item = drinks.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Getränk ${id} fehlt.`);
  return item;
}
