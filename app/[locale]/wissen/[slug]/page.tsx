import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DrinkRows } from "@/components/seo-drink-list";
import { articleBySlug, articles } from "@/lib/content/articles";
import { drinks, totalSugarGrams, type Drink } from "@/lib/data/drinks";
import { formatNumber } from "@/lib/seo-drinks";
import { pageMetadata, siteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug[slug];
  if (!article) return {};
  return pageMetadata(
    metaTitle(article.slug, article.title),
    metaDescription(article.slug, article.description),
    `/de/wissen/${article.slug}`,
    {
      type: "article",
      ...(article.image ? { image: article.image } : {}),
    },
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articleBySlug[slug];
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium text-slate">{article.minutes} Minuten Lesezeit</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{article.title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate">{article.description}</p>
      {article.updatedAt && <p className="mt-3 text-sm text-slate">Aktualisiert am {formatArticleDate(article.updatedAt)}</p>}
      {article.image && (
        <div className="mt-8 overflow-hidden rounded-lg border border-ash bg-mist">
          <Image
            src={article.image.src}
            alt={article.image.alt}
            width={article.image.width}
            height={article.image.height}
            sizes="(max-width: 768px) calc(100vw - 2rem), 768px"
            className="h-auto w-full"
            priority
          />
        </div>
      )}
      {article.slug === "cola-zucker-pro-100ml" && <ColaAnswer />}
      {article.quickAnswer && (
        <section className="mt-8 rounded-lg border border-ash bg-mist p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Kurzantwort</p>
          <p className="mt-2 text-lg leading-8">{article.quickAnswer}</p>
        </section>
      )}
      {!!article.body.length && (
        <div className="mt-10 space-y-5 border-t border-ash pt-8 text-lg leading-8 text-ink">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      {!!article.sections?.length && (
        <div className="mt-10 space-y-10 border-t border-ash pt-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
              <div className="mt-4 space-y-5 text-lg leading-8 text-ink">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      )}
      {article.slug === "cola-zucker-pro-100ml" && <ColaComparison />}
      {!!article.faq?.length && (
        <section className="mt-10 border-t border-ash pt-8">
          <h2 className="text-2xl font-semibold tracking-tight">Häufige Fragen</h2>
          <div className="mt-4 divide-y divide-ash border-y border-ash">
            {article.faq.map((item) => (
              <article key={item.question} className="py-5">
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-2 leading-7 text-slate">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      {!!article.sources?.length && (
        <section className="mt-10 border-t border-ash pt-8">
          <h2 className="text-2xl font-semibold tracking-tight">Quellen</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6">
            {article.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer" className="underline decoration-ash underline-offset-4 hover:decoration-marigold">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="mt-10 border-t border-ash pt-8">
        <h2 className="text-2xl font-semibold tracking-tight">Passend dazu</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {relatedLinks(article.slug).map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border border-ash bg-mist p-4 hover:border-marigold">
              <p className="font-semibold">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
      {!!article.faq?.length && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: article.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            mainEntityOfPage: `${siteUrl}/de/wissen/${article.slug}`,
            ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
            author: { "@type": "Organization", name: "Zuckerhaltig.de", url: `${siteUrl}/de/ueber` },
            publisher: { "@type": "Organization", name: "Zuckerhaltig.de", url: siteUrl },
            ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
            ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
          }),
        }}
      />
    </main>
  );
}

function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date(`${value}T00:00:00Z`));
}

function ColaAnswer() {
  const drink = drinks.find((item) => item.id === "coca-cola-classic-500");
  if (!drink) return null;
  const totalSugar = totalSugarGrams(drink);

  return (
    <section className="mt-8 rounded-lg border border-ash bg-mist p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Kurzantwort</p>
      <p className="mt-2 text-lg leading-8">
        {drink.name} liegt in der Datenbank bei <strong>{formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml</strong>.
        {drink.sizeMl && totalSugar !== null ? ` In ${drink.sizeMl} ml sind das rechnerisch ${formatNumber(totalSugar)} g.` : ""}
      </p>
      <Link href={`/de/getraenke/${drink.id}`} className="mt-3 inline-flex text-sm font-medium underline decoration-ash underline-offset-4 hover:decoration-marigold">
        Produktdaten und Quelle ansehen
      </Link>
    </section>
  );
}

const colaComparisonIds = [
  "coca-cola-classic-500",
  "coca-cola-zero-sugar-500",
  "pepsi-500",
  "afri-cola-classic-330",
  "paulaner-spezi-500",
  "mezzo-mix-original-500",
  "fritz-kola-original-330",
  "vita-cola-original-1000",
];

function ColaComparison() {
  const comparisonDrinks = colaComparisonIds
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink): drink is Drink => Boolean(drink));

  return (
    <section className="mt-12 border-t border-ash pt-8">
      <h2 className="text-3xl font-semibold tracking-tight">Cola Zucker im Vergleich</h2>
      <p className="mb-5 mt-3 leading-7 text-slate">Coca-Cola, Pepsi, afri cola, Zero und Cola-Mix: Werte pro 100 ml und für die ganze Packung.</p>
      <DrinkRows drinks={comparisonDrinks} />
      <section className="mt-8">
        <h3 className="text-xl font-semibold tracking-tight">Quellen zu den Vergleichswerten</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6">
          {comparisonDrinks.map((drink) => (
            <li key={drink.id}>
              <a href={drink.sourceUrl} target="_blank" rel="noreferrer" className="underline decoration-ash underline-offset-4 hover:decoration-marigold">
                {drink.name}: {drink.source}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

function metaTitle(slug: string, fallback: string) {
  const titles: Record<string, string> = {
    "zucker-pro-100ml-verstehen": "Zucker pro 100 ml: Was ist viel?",
    "zuckerwuerfel-als-orientierung": "Zuckerwürfel in Getränken: Rechner und Beispiele",
    "cola-zucker-pro-100ml": "Cola Zucker: Wie viel steckt in 100 ml, 500 ml und 1 Liter?",
    "energy-drinks-zucker-vergleichen": "Energy Drink: Zucker pro 100 ml und pro Dose",
    "getraenkeetiketten-naehrwerttabelle-verstehen": "Getränkeetiketten: Zucker richtig lesen",
    "saft-zucker-reduzieren-schorle-sirup": "Zucker im Saft senken: Schorle und Sirup",
    "sugar-light-weniger-zucker-natuerlicher-geschmack": "Sugar Light: weniger Zucker, echter Geschmack",
    "nachhaltige-zuckerarme-getraenke-verpackung": "Zuckerarm trinken: Verpackung mitdenken",
  };

  return titles[slug] ?? fallback;
}

function metaDescription(slug: string, fallback: string) {
  const descriptions: Record<string, string> = {
    "cola-zucker-pro-100ml": "Wie viel Zucker hat Cola? Vergleiche Coca-Cola, Pepsi, afri cola, Zero und Cola-Mix pro 100 ml, Flasche und als Zuckerwürfel.",
    "zucker-pro-100ml-verstehen": "Zucker pro 100 ml verstehen: Cola, Eistee, Energy Drinks, Saft und Limo fair vergleichen. Mit Beispielrechnung für Packung, Portion und Zuckerwürfel.",
    "eistee-zucker-im-alltag": "Wie viel Zucker hat Eistee? Pfirsich, Zitrone und große Flaschen nach Zucker pro 100 ml, Packungsgröße und Zuckerwürfeln im Alltag einordnen.",
    "packungsgroesse-entscheidet": "Zucker pro Flasche berechnen: warum 250 ml, 330 ml, 500 ml und 1 Liter bei gleichem 100-ml-Wert sehr unterschiedliche Mengen ergeben.",
    "zuckerwuerfel-als-orientierung": "Zuckerwürfel in Getränken berechnen: Gramm Zucker durch 3 teilen und Cola, Saft, Eistee oder Energy Drinks schneller einschätzen.",
  };

  const description = descriptions[slug] ?? fallback;
  return description.length >= 120
    ? description
    : `${description} Dazu findest du Rechenwege und passende Produktvergleiche.`;
}

function relatedLinks(slug: string) {
  const links: Record<string, { href: string; label: string; description: string }[]> = {
    "zucker-pro-100ml-verstehen": [
      { href: "/de/getraenke", label: "Getränke nach Zucker sortieren", description: "Vergleiche alle Produkte direkt nach Zucker pro 100 ml." },
      { href: "/de/zuckerrechner", label: "Zucker pro Flasche berechnen", description: "Zuckerwert und Füllmenge direkt umrechnen." },
    ],
    "energy-drinks-zucker-vergleichen": [
      { href: "/de/energy-drinks-zucker", label: "Energy Drinks vergleichen", description: "Red Bull, Monster und weitere Energy Drinks nach Zucker vergleichen." },
      { href: "/de/getraenke/red-bull-energy-drink-250", label: "Red Bull Energy Drink", description: "Zucker und Nährwerte der 250-ml-Dose ansehen." },
    ],
    "cola-zero-light-und-klassisch": [
      { href: "/de/wissen/cola-zucker-pro-100ml", label: "Cola vergleichen", description: "Classic, Zero und weitere Cola-Produkte nach Zucker vergleichen." },
      { href: "/de/getraenke/coca-cola-classic-500", label: "Coca-Cola Classic", description: "Zuckerwerte der 500-ml-Flasche im Detail." },
    ],
    "cola-zucker-pro-100ml": [
      { href: "/de/marken/coca-cola", label: "Coca-Cola-Produkte", description: "Classic, Zero und weitere Varianten nach Zucker pro 100 ml vergleichen." },
      { href: "/de/getraenke/coca-cola-classic-500", label: "Coca-Cola Classic 500 ml", description: "53 g Zucker pro 500 ml aus dem 100-ml-Wert berechnen." },
      { href: "/de/getraenke/afri-cola-classic-330", label: "afri cola classic", description: "afri cola nach Zucker pro 100 ml und pro Dose einordnen." },
      { href: "/de/wissen/cola-zero-light-und-klassisch", label: "Cola, Zero und Light", description: "Classic-Cola mit Zero- und Light-Varianten vergleichen." },
    ],
    "saft-ist-nicht-automatisch-zuckerarm": [
      { href: "/de/kategorien/juice", label: "Säfte vergleichen", description: "Saft, Nektar und Fruchtsaftgetränke nach Zucker einordnen." },
      { href: "/de/getraenke/granini-trinkgenuss-orange-1000", label: "granini Trinkgenuss Orange", description: "Ein Beispiel für Zuckerwerte in Saftprodukten." },
    ],
    "eistee-zucker-im-alltag": [
      { href: "/de/eistee-zucker", label: "Eistee vergleichen", description: "Pfirsich, Zitrone und weitere Sorten nach Zucker vergleichen." },
      { href: "/de/wissen/packungsgroesse-entscheidet", label: "Packungsgröße prüfen", description: "Warum große Flaschen trotz moderater 100-ml-Werte relevant sind." },
    ],
    "packungsgroesse-entscheidet": [
      { href: "/de/zuckerrechner", label: "Zucker pro Flasche berechnen", description: "Zucker pro 100 ml und Packungsgröße selbst eingeben." },
      { href: "/de/getraenke", label: "Getränke vergleichen", description: "Gesamtzucker und Packungsgrößen vorhandener Produkte ansehen." },
    ],
    "zuckerfreie-getraenke-in-der-datenbank": [
      { href: "/de/getraenke", label: "Zuckerarme Getränke finden", description: "Filtere nach niedrigen Zuckerwerten und Zero-Produkten." },
      { href: "/de/wissen/cola-zero-light-und-klassisch", label: "Cola Zero und Light", description: "Was sich bei Zuckerwerten und Varianten unterscheidet." },
    ],
    "suessstoffe-aspartam-zuckerfreie-getraenke": [
      { href: "/de/rankings/zuckerfreie-getraenke", label: "Zuckerfreie Getränke vergleichen", description: "Zero- und Light-Produkte ausschließlich nach ihrem Zuckerwert vergleichen." },
      { href: "/de/wissen/getraenkeetiketten-naehrwerttabelle-verstehen", label: "Getränkeetiketten lesen", description: "Zutatenliste, Nährwerte und Packungsgröße richtig einordnen." },
    ],
  };

  return links[slug] ?? [
    { href: "/de/getraenke", label: "Getränkedatenbank öffnen", description: "Alle Produkte nach Marke, Kategorie und Zuckerwerten filtern." },
    { href: "/de/wissen/zucker-pro-100ml-verstehen", label: "Zucker pro 100 ml verstehen", description: "Der wichtigste Vergleichswert für Getränke." },
  ];
}
