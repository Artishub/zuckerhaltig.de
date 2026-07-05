import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { brandById } from "@/lib/data/brands";
import { categoryById } from "@/lib/data/categories";
import { canonicalDrinkId, drinks, packageEnergyKcal, sugarCubes, totalSugarGrams, type Drink, type DrinkFaq } from "@/lib/data/drinks";
import { siteUrl } from "@/lib/site";

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

  const brandName = brandById[drink.brandId]?.name ?? "Unbekannte Marke";
  const categoryName = categoryById[drink.categoryId]?.name ?? "Getränk";
  const canonicalId = canonicalDrinkId(drink);
  const totalSugar = totalSugarGrams(drink);
  const title = metaTitle(drink);
  const description = metaDescription(drink, brandName, categoryName, totalSugar);
  const canonicalUrl = `${siteUrl}/de/getraenke/${canonicalId}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/de/getraenke/${canonicalId}`,
    },
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
          alt: `${drink.name} Zuckerwerte`,
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

  const brandName = brandById[drink.brandId]?.name ?? "Unbekannte Marke";
  const categoryName = categoryById[drink.categoryId]?.name ?? "Getränk";
  const totalSugar = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  const energy = packageEnergyKcal(drink);
  const similar = similarDrinks(drink);
  const faqs = generatedFaq(drink, brandName);

  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <Link href="/de/getraenke" className="focus-ring inline-flex items-center gap-2 rounded-md text-sm text-slate hover:text-ink">
        <ArrowLeft size={16} />
        Zurück zur Suche
      </Link>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-slate">{categoryName}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{drink.name}</h1>
          <p className="mt-4 text-lg leading-8 text-slate">
            {brandName} · {sizeLabel(drink)} · {formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml
          </p>
          <p className="mt-6 max-w-2xl leading-7 text-slate">
            {introText(drink, brandName, categoryName)}
          </p>
          {drink.note && <p className="mt-4 max-w-2xl leading-7 text-slate">{drink.note}</p>}
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <Link href={`/de/getraenke?brand=${drink.brandId}`} className="focus-ring rounded-md border border-ash bg-mist px-3 py-2 hover:border-marigold">
              Mehr von {brandName}
            </Link>
            <Link href={`/de/getraenke?category=${drink.categoryId}`} className="focus-ring rounded-md border border-ash bg-mist px-3 py-2 hover:border-marigold">
              Kategorie {categoryName}
            </Link>
            <Link href={knowledgeLink(drink)} className="focus-ring rounded-md border border-ash bg-mist px-3 py-2 hover:border-marigold">
              Passendes Wissen lesen
            </Link>
          </div>
        </div>

        <section className="rounded-lg border border-ash bg-mist p-5">
          <h2 className="text-xl font-semibold tracking-tight">Nährwerte</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Nutrient label="Zucker pro 100 ml" value={`${formatNumber(drink.sugarPer100Ml)} g`} highlight />
            <Nutrient label="Zucker pro Gebinde" value={formatOptionalGrams(totalSugar)} highlight />
            <Nutrient label="Zuckerwürfel" value={formatOptionalNumber(cubes)} />
            <Nutrient label="Energie pro Gebinde" value={energy === null ? "/" : `${formatNumber(energy)} kcal`} />
            <Nutrient label="Energie pro 100 ml" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.energyKcal)} kcal / ${formatNumber(drink.nutritionPer100Ml.energyKj)} kJ` : "/"} />
            <Nutrient label="Kohlenhydrate" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.carbohydrates)} g` : "/"} />
            <Nutrient label="Fett" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.fat)} g` : "/"} />
            <Nutrient label="Eiweiss" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.protein)} g` : "/"} />
            <Nutrient label="Salz" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.salt)} g` : "/"} />
            <Nutrient label="Gebinde" value={sizeLabel(drink)} />
          </div>
          <p className="mt-4 text-xs leading-5 text-slate">Alle Angaben beziehen sich auf die hinterlegten Produktdaten und können sich durch Rezeptur- oder Verpackungsänderungen unterscheiden.</p>
        </section>
      </section>

      <section className="mt-10 grid gap-6 border-t border-ash pt-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Einordnung</h2>
          <p className="mt-3 leading-7 text-slate">
            Der Wert pro 100 ml macht {drink.name} mit anderen Getränken vergleichbar. Der Gesamtzucker zeigt dagegen, welche Menge Zucker beim Trinken des ganzen Gebindes zusammenkommt.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Quelle</h2>
          <p className="mt-3 leading-7 text-slate">{drink.source}</p>
          {drink.sourceUrl && (
            <a href={drink.sourceUrl} target="_blank" rel="noreferrer" className="focus-ring mt-3 inline-flex items-center gap-2 rounded-md text-sm font-medium underline decoration-ash underline-offset-4 hover:decoration-marigold">
              Quelle öffnen <ExternalLink size={15} />
            </a>
          )}
          {drink.lastCheckedAt && <p className="mt-3 text-sm text-slate">Zuletzt geprüft: {formatDate(drink.lastCheckedAt)}</p>}
        </div>
      </section>

      <section className="mt-10 border-t border-ash pt-8">
        <h2 className="text-2xl font-semibold tracking-tight">FAQ zu {drink.name}</h2>
        <div className="mt-5 divide-y divide-ash">
          {faqs.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold">
                {item.question}
              </summary>
              <p className="mt-3 max-w-3xl leading-7 text-slate">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 border-t border-ash pt-8">
        <h2 className="text-2xl font-semibold tracking-tight">Ähnliche Getränke</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((item) => {
            const similarBrand = brandById[item.brandId]?.name ?? "Marke";
            return (
              <Link key={item.id} href={`/de/getraenke/${item.id}`} className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-slate">{similarBrand} · {sizeLabel(item)}</p>
                <p className="mt-4 text-sm tabular-nums">{formatNumber(item.sugarPer100Ml)} g / 100 ml</p>
              </Link>
            );
          })}
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

function similarDrinks(drink: Drink) {
  return drinks
    .filter((item) => item.id !== drink.id && (item.categoryId === drink.categoryId || item.brandId === drink.brandId))
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
        ? `${drink.name} von ${brandName} enthaelt ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml. Eine Packungsgröße ist noch nicht hinterlegt.`
        : `${drink.name} von ${brandName} enthaelt ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml. Bei ${drink.sizeMl} ml ergibt das rechnerisch ${formatNumber(totalSugar)} g Zucker pro Gebinde.`,
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
  const size = drink.sizeMl ? ` ${drink.sizeMl} ml` : "";
  const sugar = `${formatNumber(drink.sugarPer100Ml)} g Zucker`;
  return `${shortenTitleName(drink.name, size)}${size}: ${sugar}`;
}

function metaDescription(drink: Drink, brandName: string, categoryName: string, totalSugar: number | null) {
  const sugarPart = `${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml`;
  const packagePart = drink.sizeMl && totalSugar !== null
    ? `, ${formatNumber(totalSugar)} g pro ${drink.sizeMl}-ml-Packung`
    : "";
  return `${drink.name} von ${brandName}: ${sugarPart}${packagePart}. Daten zu ${categoryName}, Nährwerten, Zuckerwürfeln und Quelle.`;
}

function shortenTitleName(name: string, size: string) {
  const normalized = name
    .replace(/\bThe\s+/gi, "")
    .replace(/\bEnergy Drink\b/gi, "Energy")
    .replace(/\bohne Zucker\b/gi, "Zero")
    .replace(/\bZero Sugar\b/gi, "Zero")
    .replace(/\s+/g, " ")
    .trim();
  const maxNameLength = Math.max(22, 39 - size.length);
  if (normalized.length <= maxNameLength) return normalized;
  return `${normalized.slice(0, maxNameLength - 3).trim()}...`;
}

function introText(drink: Drink, brandName: string, categoryName: string) {
  const totalSugar = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  const base = totalSugar === null || cubes === null || !drink.sizeMl
    ? "Eine Packungsgröße ist noch nicht hinterlegt; Gesamtzucker und Zuckerwürfel werden deshalb als / angezeigt."
    : `Für das ${drink.sizeMl}-ml-Gebinde ergeben sich rechnerisch ${formatNumber(totalSugar)} g Zucker. Das entspricht ungefähr ${formatNumber(cubes)} Zuckerwürfeln bei 3 g pro Würfel.`;

  if (drink.brandId === "coca-cola" && drink.name.includes("Classic")) {
    return `Coca-Cola Classic ist einer der bekanntesten Cola-Vergleiche in der Datenbank. Der Wert von ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml zeigt die Rezeptur, während die Packungsgröße den Gesamtzucker bestimmt. ${base}`;
  }
  if (drink.brandId === "red-bull") {
    return `${drink.name} ist als Energy Drink besonders gut über die Dose vergleichbar. Der 100-ml-Wert zeigt die Süße der Rezeptur, der Gesamtwert macht die komplette Portion sichtbar. ${base}`;
  }
  if (drink.id === "monster-mango-loco-500") {
    return `Monster Mango Loco wird hier als 500-ml-Dose eingeordnet. Gerade bei großen Energy-Drink-Dosen ist der Gesamtzucker wichtiger als der erste Blick auf 100 ml vermuten lässt. ${base}`;
  }
  if (drink.brandId === "fanta") {
    return `${drink.name} steht für fruchtige Limonade, bei der sich klassische und zuckerarme Varianten deutlich unterscheiden können. ${base}`;
  }
  if (drink.brandId === "sprite") {
    return `${drink.name} lässt sich gut mit anderen Zitronen-Limetten-Limonaden und Zero-Varianten vergleichen. ${base}`;
  }
  if (drink.brandId === "club-mate") {
    return `${drink.name} ist ein Mate-Getränk, bei dem Zuckerwert und Koffeinwahrnehmung oft gemeinsam betrachtet werden. Diese Seite konzentriert sich auf die Nährwertdaten. ${base}`;
  }
  if (drink.brandId === "capri-sun") {
    return `${drink.name} ist ein kleines Trinkpäckchen. Die Portion ist kleiner als bei vielen Flaschen, trotzdem lohnt sich der Blick auf Zucker pro 100 ml. ${base}`;
  }
  if (drink.brandId === "granini") {
    return `${drink.name} zeigt, dass Saft und Nektar trotz Fruchtbezug relevante Zuckerwerte haben können. Entscheidend bleibt die Nährwerttabelle. ${base}`;
  }
  if (drink.brandId === "mueller") {
    return `${drink.name} ist ein Milchmischgetränk. Neben Zucker sind hier auch Energie und Kohlenhydrate pro 100 ml hilfreich für den Vergleich. ${base}`;
  }
  if (drink.brandId === "fritz-kola") {
    return `${drink.name} gehört zu den fritz-Getränken, bei denen Cola, Limo und Schorle sehr unterschiedliche Zuckerwerte haben können. ${base}`;
  }

  return `${drink.name} ist in der Datenbank als ${categoryName} von ${brandName} gespeichert. ${base}`;
}

function knowledgeLink(drink: Drink) {
  if (drink.categoryId === "energy") return "/de/wissen/energy-drinks-zucker-vergleichen";
  if (drink.categoryId === "cola" || drink.categoryId === "cola-mix") return "/de/wissen/cola-zero-light-und-klassisch";
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
