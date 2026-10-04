import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { Section, cardClass, textLinkClass } from "@/components/ui/section";
import ui from "@/components/ui/ui.module.css";
import { drinks, packageEnergyKcal, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";
import { drinkPageHref } from "@/lib/page-routing";
import { brandName, categoryName, formatNumber } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Kalorien in Getränken: Cola, Red Bull, Fanta im Vergleich",
  "Kalorien von Cola, Energy Drinks, Limonaden und Eistee pro 100 ml und pro Packung. Mit Anteil der Kalorien aus Zucker und Quellen auf jeder Produktseite.",
  "/de/rankings/kalorien-getraenke",
);

const highlightIds = [
  "coca-cola-classic-500",
  "red-bull-energy-drink-250",
  "fanta-orange-500",
  "sprite-500",
  "paulaner-spezi-500",
  "monster-mango-loco-500",
  "lipton-ice-tea-zitrone-500",
  "coca-cola-zero-sugar-330",
];

// Carbohydrates and sugar count 4 kcal per gram (EU Regulation 1169/2011, Annex XIV).
function sugarEnergyShare(drink: Drink) {
  const kcal = drink.nutritionPer100Ml?.energyKcal;
  if (!kcal || kcal <= 0) return null;
  return Math.min(100, Math.round(((drink.sugarPer100Ml * 4) / kcal) * 100));
}

function kcalPer100(drink: Drink) {
  return drink.nutritionPer100Ml?.energyKcal ?? null;
}

export default function CalorieRankingPage() {
  const withEnergy = uniqueProductRepresentatives(drinks).filter((drink) => kcalPer100(drink) !== null && drink.sizeMl);
  const ranked = [...withEnergy].sort((a, b) => (kcalPer100(b) ?? 0) - (kcalPer100(a) ?? 0)).slice(0, 40);
  const highlights = highlightIds.map((id) => drinks.find((drink) => drink.id === id)).filter((drink): drink is Drink => Boolean(drink));
  const zeroCount = withEnergy.filter((drink) => (kcalPer100(drink) ?? 0) <= 4).length;
  const caloricShares = withEnergy.filter((drink) => (kcalPer100(drink) ?? 0) > 4).map(sugarEnergyShare).filter((share): share is number => share !== null);
  const averageShare = caloricShares.length ? Math.round(caloricShares.reduce((sum, share) => sum + share, 0) / caloricShares.length) : null;

  return (
    <main className="pb-24">
      <PageHero
        title="Kalorien in Getränken"
        text={`${withEnergy.length} Getränke mit Kalorienangabe. ${zeroCount} davon haben höchstens 4 kcal pro 100 ml.${averageShare !== null ? ` Bei den übrigen stammen im Schnitt ${averageShare} % der Kalorien aus Zucker.` : ""}`}
      />

      <Section id="known" title="Bekannte Getränke">
        <CalorieTable drinks={highlights} caption="Kalorien bekannter Getränke pro 100 ml und pro Packung" />
      </Section>

      <Section id="ranking" title={`Die ${ranked.length} kalorienreichsten Getränke pro 100 ml`}>
        <CalorieTable drinks={ranked} caption="Getränke sortiert nach Kalorien pro 100 ml" numbered />
        <p className="mt-4 text-sm leading-6 text-slate">
          Der Anteil aus Zucker rechnet 4 kcal pro Gramm Zucker. Der Rest stammt aus anderen Kohlenhydraten, Fett oder Eiweiß.{" "}
          <Link href="/de/rankings/zuckerreichste-getraenke" className={textLinkClass}>Getränke nach Zucker pro Packung</Link>
        </p>
      </Section>
    </main>
  );
}

function CalorieTable({ drinks: items, caption, numbered = false }: { drinks: Drink[]; caption: string; numbered?: boolean }) {
  return (
    <div className={`${cardClass} ${ui.tableWrap}`}>
      <table className={ui.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {numbered && <th scope="col">#</th>}
            <th scope="col">Getränk</th>
            <th scope="col" className={ui.num}>kcal / 100 ml</th>
            <th scope="col" className={ui.num}>kcal pro Packung</th>
            <th scope="col" className={ui.num}>davon aus Zucker</th>
          </tr>
        </thead>
        <tbody>
          {items.map((drink, index) => {
            const share = sugarEnergyShare(drink);
            const packageKcal = packageEnergyKcal(drink);
            return (
              <tr key={drink.id}>
                {numbered && <td className="text-slate">{index + 1}</td>}
                <th scope="row">
                  <Link href={drinkPageHref(drink)} className={ui.tableName}>
                    <strong>{drink.name}</strong>
                    <small>{brandName(drink)} · {categoryName(drink)} · {drink.sizeMl} ml</small>
                  </Link>
                </th>
                <td className={ui.num}><b>{formatNumber(kcalPer100(drink) ?? 0)}</b></td>
                <td className={ui.num}>{packageKcal === null ? "/" : formatNumber(Math.round(packageKcal))}</td>
                <td className={ui.num}>{share === null ? "/" : `${share} %`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
