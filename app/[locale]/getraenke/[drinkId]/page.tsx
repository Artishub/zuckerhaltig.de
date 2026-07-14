import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Info } from "lucide-react";
import { brandById } from "@/lib/data/brands";
import { categoryById } from "@/lib/data/categories";
import { canonicalDrinkId, drinks, isIndexableDrink, packageEnergyKcal, productFamilyDrinks, sugarCubes, totalSugarGrams, uniqueProductRepresentatives, type Drink, type DrinkFaq } from "@/lib/data/drinks";
import { brandPageHref } from "@/lib/featured-brand-pages";
import { siteUrl } from "@/lib/site";
import styles from "./drink-detail.module.css";

type PageProps = {
  params: Promise<{ drinkId: string; locale: string }>;
};

export function generateStaticParams() {
  return drinks.map((drink) => ({ drinkId: drink.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { drinkId } = await params;
  const drink = drinks.find((item) => item.id === drinkId);

  if (!drink) {
    return { title: "Getränk nicht gefunden" };
  }

  const canonicalId = canonicalDrinkId(drink);
  const canonicalDrink = drinks.find((item) => item.id === canonicalId) ?? drink;
  const brandName = brandById[canonicalDrink.brandId]?.name ?? "Unbekannte Marke";
  const family = productFamilyDrinks(canonicalDrink);
  const title = metaTitle(canonicalDrink);
  const description = metaDescription(canonicalDrink, brandName, family);
  const canonicalUrl = `${siteUrl}/de/getraenke/${canonicalId}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/de/getraenke/${canonicalId}`,
    },
    ...(!isIndexableDrink(canonicalDrink) && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Zuckerhaltig.de",
      locale: "de_DE",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${canonicalDrink.name} Zuckerwerte`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function DrinkDetailPage({ params }: PageProps) {
  const { drinkId } = await params;
  const drink = drinks.find((item) => item.id === drinkId);

  if (!drink) notFound();

  const canonicalId = canonicalDrinkId(drink);
  if (canonicalId !== drink.id) permanentRedirect(`/de/getraenke/${canonicalId}`);

  const brandName = brandById[drink.brandId]?.name ?? "Unbekannte Marke";
  const categoryName = categoryById[drink.categoryId]?.name ?? "Getränk";
  const family = productFamilyDrinks(drink);
  const totalSugar = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  const energy = packageEnergyKcal(drink);
  const similar = similarDrinks(drink);
  const faqs = generatedFaq(drink, brandName);
  const brandHref = brandPageHref(drink.brandId);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Link href="/de/getraenke" className={styles.back}><ArrowLeft size={16} /> Zur Getränkesuche</Link>
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.category}>{categoryName} · {sizeLabel(drink)}</p>
            <h1>Wie viel Zucker hat {drink.name}?</h1>
            <p className={styles.summary}>{introText(drink, brandName, categoryName, family.length)}</p>
            <p className={styles.sourceLine}><Info size={15} /> Quelle: {drink.source}</p>
          </div>
          <div className={styles.sugarPanel}>
            <p>{brandName}</p>
            <div><strong>{formatOptionalNumber(totalSugar)}</strong><span>g Zucker</span></div>
            <div className={styles.cubeSummary}>
              <p>pro {sizeLabel(drink)} · {formatOptionalNumber(cubes)} Zuckerwürfel</p>
              <div className={styles.cubes} aria-hidden="true">{Array.from({ length: Math.min(Math.max(Math.round(cubes ?? 0), 1), 24) }).map((_, index) => <i key={index} />)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.facts} aria-label={`Werte für ${drink.name}`}>
        <Nutrient label="Zucker pro 100 ml" value={`${formatNumber(drink.sugarPer100Ml)} g`} highlight />
        <Nutrient label={`Zucker pro ${sizeLabel(drink)}`} value={formatOptionalGrams(totalSugar)} highlight />
        <Nutrient label="Zuckerwürfel" value={formatOptionalNumber(cubes)} />
        <Nutrient label="Energie pro Packung" value={energy === null ? "/" : `${formatNumber(energy)} kcal`} />
      </section>

      {family.length > 1 && <PackageSizes drinks={family} />}

      <section className={styles.contentGrid}>
        <div className={styles.nutrition}>
          <p className={styles.category}>Nährwerte</p>
          <h2>Pro 100 ml</h2>
          <div className={styles.nutrientGrid}>
            <Nutrient label="Energie" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.energyKcal)} kcal / ${formatNumber(drink.nutritionPer100Ml.energyKj)} kJ` : "/"} />
            <Nutrient label="Kohlenhydrate" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.carbohydrates)} g` : "/"} />
            <Nutrient label="davon Zucker" value={`${formatNumber(drink.sugarPer100Ml)} g`} />
            <Nutrient label="Fett" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.fat)} g` : "/"} />
            <Nutrient label="Eiweiss" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.protein)} g` : "/"} />
            <Nutrient label="Salz" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.salt)} g` : "/"} />
          </div>
        </div>
        <aside className={styles.sourceCard}>
          <p className={styles.category}>Datenquelle</p>
          <h2>Nachprüfbar.</h2>
          <p>{drink.note}</p>
          {drink.lastCheckedAt && <p className={styles.checked}>Zuletzt geprüft: {formatDate(drink.lastCheckedAt)}</p>}
          {drink.sourceUrl && <a href={drink.sourceUrl} target="_blank" rel="noreferrer">Quelle öffnen <ExternalLink size={16} /></a>}
        </aside>
      </section>

      <section className={styles.compare}>
        <div><h2>Ähnliche Getränke.</h2></div>
        <div className={styles.related}>
          {similar.map((item) => {
            const similarBrand = brandById[item.brandId]?.name ?? "Marke";
            return <Link key={item.id} href={`/de/getraenke/${canonicalDrinkId(item)}`}><span>{similarBrand}</span><strong>{item.name.replace(`${similarBrand} `, "")}</strong><b>{formatNumber(item.sugarPer100Ml)} g / 100 ml</b><ArrowRight size={16} /></Link>;
          })}
        </div>
      </section>

      <section className={styles.faq}>
        <p className={styles.category}>Fragen und Antworten</p>
        <h2>FAQ zu {drink.name}</h2>
        <div>
          {faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
        <div className={styles.knowledgeLinks}>
          <Link href={knowledgeLink(drink)} className={styles.knowledge}>Passendes Wissen lesen <ArrowRight size={16} /></Link>
          {brandHref && <Link href={brandHref} className={styles.knowledge}>Alle {brandName}-Getränke <ArrowRight size={16} /></Link>}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
            },
            breadcrumbJsonLd(drink),
          ]),
        }}
      />
    </main>
  );
}

function Nutrient({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-ash bg-paper p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate">{label}</p>
      <p className={`mt-2 tabular-nums ${highlight ? "text-2xl font-semibold" : "text-lg font-semibold"}`}>{value}</p>
    </div>
  );
}

function PackageSizes({ drinks }: { drinks: Drink[] }) {
  return (
    <section className={styles.packages} aria-labelledby="package-sizes-title">
      <div>
        <h2 id="package-sizes-title">Zucker nach Packungsgröße</h2>
        <p>Der Wert pro 100 ml bleibt gleich. Die Packungsgröße verändert die Gesamtmenge.</p>
      </div>
      <ul className={styles.packageGrid}>
        {drinks.map((drink) => (
          <li key={drink.id}>
            <strong>{sizeLabel(drink)}</strong>
            <span>{formatOptionalGrams(totalSugarGrams(drink))} Zucker</span>
            <span>{formatOptionalNumber(sugarCubes(drink))} Würfel</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function similarDrinks(drink: Drink) {
  const currentCanonicalId = canonicalDrinkId(drink);

  return uniqueProductRepresentatives(
    drinks.filter((item) => (
      item.categoryId === drink.categoryId &&
      canonicalDrinkId(item) !== currentCanonicalId &&
      item.name !== drink.name
    )),
  )
    .sort((a, b) => Math.abs(a.sugarPer100Ml - drink.sugarPer100Ml) - Math.abs(b.sugarPer100Ml - drink.sugarPer100Ml))
    .slice(0, 4);
}

function generatedFaq(drink: Drink, brandName: string): DrinkFaq[] {
  const totalSugar = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);

  return [
    {
      question: `Wie viel Zucker hat ${drink.name}?`,
      answer: totalSugar === null || !drink.sizeMl
        ? `${drink.name} von ${brandName} enthält ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml. Eine Packungsgröße ist noch nicht hinterlegt.`
        : `${drink.name} von ${brandName} enthält ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml. Bei ${drink.sizeMl} ml ergibt das rechnerisch ${formatNumber(totalSugar)} g Zucker pro Gebinde.`,
    },
    {
      question: `Wie viele Zuckerwürfel stecken in ${drink.name}?`,
      answer: cubes === null || !drink.sizeMl
        ? `Die Zuckerwürfel pro Gebinde werden ergänzt, sobald eine Packungsgröße hinterlegt ist.`
        : `Bei 3 g pro Zuckerwürfel entspricht das ungefähr ${formatNumber(cubes)} Zuckerwürfeln pro ${drink.sizeMl}-ml-Gebinde.`,
    },
    {
      question: `Warum ist der Wert pro 100 ml wichtig?`,
      answer: `Der Wert pro 100 ml macht ${drink.name} unabhängig von der Packungsgröße mit anderen Getränken vergleichbar.`,
    },
    {
      question: `Woher stammen die Werte zu ${drink.name}?`,
      answer: `Die gespeicherten Werte basieren auf der hinterlegten Quelle: ${drink.source}. Produktwerte können sich ändern und sollten bei Bedarf auf der Verpackung geprüft werden.`,
    },
  ];
}

function metaTitle(drink: Drink) {
  const sugar = `${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml`;
  return `${shortenTitleName(drink.name)}: ${sugar}`;
}

function metaDescription(drink: Drink, brandName: string, family: Drink[]) {
  const totalSugar = totalSugarGrams(drink);
  const packagePart = drink.sizeMl && totalSugar !== null
    ? ` In ${drink.sizeMl} ml stecken rechnerisch ${formatNumber(totalSugar)} g.`
    : "";
  const familyPart = family.length > 1 ? ` Vergleiche ${family.length} Packungsgrößen.` : "";
  return `${drink.name} von ${brandName} enthält ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml.${packagePart}${familyPart} Mit Nährwerten, Zuckerwürfeln und Quelle.`;
}

function shortenTitleName(name: string) {
  const normalized = name
    .replace(/\bThe\s+/gi, "")
    .replace(/\bEnergy Drink\b/gi, "Energy")
    .replace(/\bohne Zucker\b/gi, "Zero")
    .replace(/\bZero Sugar\b/gi, "Zero")
    .replace(/\s+/g, " ")
    .trim();
  const maxNameLength = 38;
  if (normalized.length <= maxNameLength) return normalized;
  const shortened = normalized.slice(0, maxNameLength + 1).trim();
  const wordBoundary = shortened.lastIndexOf(" ");
  return wordBoundary >= 22 ? shortened.slice(0, wordBoundary) : shortened.slice(0, maxNameLength);
}

function introText(drink: Drink, brandName: string, categoryName: string, familySize: number) {
  const totalSugar = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  const answer = `${drink.name} enthält ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml.`;
  const family = familySize > 1 ? ` Auf dieser Seite stehen ${familySize} Packungsgrößen im direkten Vergleich.` : "";
  const base = totalSugar === null || cubes === null || !drink.sizeMl
    ? "Eine Packungsgröße ist noch nicht hinterlegt; Gesamtzucker und Zuckerwürfel werden deshalb als / angezeigt."
    : `Für das ${drink.sizeMl}-ml-Gebinde ergeben sich rechnerisch ${formatNumber(totalSugar)} g Zucker. Das entspricht ungefähr ${formatNumber(cubes)} Zuckerwürfeln bei 3 g pro Würfel.`;

  if (drink.brandId === "coca-cola" && drink.name.includes("Classic")) {
    return `${answer}${family} ${base}`;
  }
  if (drink.brandId === "red-bull") {
    return `${answer}${family} Der Gesamtwert hängt von der Dose ab. ${base}`;
  }
  if (drink.id === "monster-mango-loco-500") {
    return `${answer} Die 500-ml-Dose macht den Gesamtzucker besonders sichtbar. ${base}`;
  }
  if (drink.brandId === "fanta") {
    return `${answer}${family} Klassische und zuckerarme Varianten können deutlich auseinanderliegen. ${base}`;
  }
  if (drink.brandId === "sprite") {
    return `${answer}${family} Der Vergleich mit Zero-Varianten zeigt den Unterschied. ${base}`;
  }
  if (drink.brandId === "club-mate") {
    return `${answer}${family} Diese Seite konzentriert sich auf die Nährwertdaten. ${base}`;
  }
  if (drink.brandId === "capri-sun") {
    return `${answer}${family} Das Trinkpäckchen ist kleiner als viele Flaschen. ${base}`;
  }
  if (drink.brandId === "granini") {
    return `${answer}${family} Bei Saft und Nektar bleibt die Nährwerttabelle der feste Vergleichspunkt. ${base}`;
  }
  if (drink.brandId === "mueller") {
    return `${answer}${family} Bei Milchmischgetränken helfen auch Energie und Kohlenhydrate pro 100 ml beim Vergleich. ${base}`;
  }
  if (drink.brandId === "fritz-kola") {
    return `${answer}${family} Cola, Limo und Schorle der Marke können unterschiedliche Zuckerwerte haben. ${base}`;
  }

  return `${answer}${family} Die Datenbank führt das Produkt als ${categoryName} von ${brandName}. ${base}`;
}

function knowledgeLink(drink: Drink) {
  if (drink.categoryId === "energy") return "/de/wissen/energy-drinks-zucker-vergleichen";
  if (drink.categoryId === "cola" || drink.categoryId === "cola-mix") {
    return drink.sugarPer100Ml <= 0.5
      ? "/de/wissen/cola-zero-light-und-klassisch"
      : "/de/wissen/cola-zucker-pro-100ml";
  }
  if (drink.categoryId === "juice") return "/de/wissen/saft-ist-nicht-automatisch-zuckerarm";
  if (drink.categoryId === "iced-tea") return "/de/wissen/eistee-zucker-im-alltag";
  if (drink.sugarPer100Ml <= 1) return "/de/wissen/zuckerfreie-getraenke-in-der-datenbank";
  return "/de/wissen/zucker-pro-100ml-verstehen";
}

function breadcrumbJsonLd(drink: Drink) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: `${siteUrl}/de`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Getränke",
        item: `${siteUrl}/de/getraenke`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: drink.name,
        item: `${siteUrl}/de/getraenke/${drink.id}`,
      },
    ],
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function formatOptionalNumber(value: number | null) {
  return value === null ? "/" : formatNumber(value);
}

function formatOptionalGrams(value: number | null) {
  return value === null ? "/" : `${formatNumber(value)} g`;
}

function sizeLabel(drink: Drink) {
  return drink.sizeMl ? `${drink.sizeMl} ml` : "/";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE").format(new Date(value));
}
