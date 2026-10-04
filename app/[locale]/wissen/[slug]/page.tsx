import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DrinkRows } from "@/components/seo-drink-list";
import { articleBySlug, articles } from "@/lib/content/articles";
import { calculatePackageSugar, drinks, type Drink } from "@/lib/data/drinks";
import { averageSugar, drinksByCategory, formatNumber } from "@/lib/seo-drinks";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { pageMetadata, siteUrl } from "@/lib/site";
import { drinkPageHref } from "@/lib/page-routing";

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
  const comparison = articleComparison(article.slug);

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
      {article.slug === "cola-zero-light-und-klassisch" && <ZeroLightAnswer />}
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
      {comparison && <ArticleComparison title={comparison.title} intro={comparison.intro} drinks={comparison.drinks} />}
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
      {articleCategoryLists[article.slug] && <CategoryProductList {...articleCategoryLists[article.slug]} />}
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

const colaTableSizes = [330, 500, 1000];

// Answer first: the comparison table sits at the top so search snippets can use it.
function ColaAnswer() {
  const classic = drinks.find((item) => item.id === "coca-cola-classic-500");
  const rows = colaComparisonIds
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink): drink is Drink => Boolean(drink));
  if (!classic || !rows.length) return null;

  return (
    <section className="mt-8 rounded-lg border border-ash bg-mist p-5" aria-labelledby="cola-answer-title">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Kurzantwort</p>
      <h2 id="cola-answer-title" className="mt-2 text-lg font-normal leading-8">
        {classic.name} hat <strong>{formatNumber(classic.sugarPer100Ml)} g Zucker pro 100 ml</strong>. Eine 330-ml-Dose enthält {formatNumber(calculatePackageSugar(classic.sugarPer100Ml, 330))} g, eine 500-ml-Flasche {formatNumber(calculatePackageSugar(classic.sugarPer100Ml, 500))} g und ein Liter {formatNumber(calculatePackageSugar(classic.sugarPer100Ml, 1000))} g.
      </h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-sm tabular-nums">
          <caption className="sr-only">Zucker in Cola pro 100 ml, 330 ml, 500 ml und 1 Liter</caption>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate">
              <th scope="col" className="py-2 pr-3 font-semibold">Cola</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">pro 100 ml</th>
              {colaTableSizes.map((size) => <th key={size} scope="col" className="px-3 py-2 text-right font-semibold">{size >= 1000 ? "1 l" : `${size} ml`}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((drink) => (
              <tr key={drink.id} className="border-t border-ash">
                <th scope="row" className="py-2.5 pr-3 text-left font-medium">
                  <Link href={drinkPageHref(drink)} className="underline decoration-ash underline-offset-4 hover:decoration-marigold">{drink.name}</Link>
                </th>
                <td className="px-3 py-2.5 text-right font-semibold">{formatNumber(drink.sugarPer100Ml)} g</td>
                {colaTableSizes.map((size) => <td key={size} className="px-3 py-2.5 text-right">{formatNumber(calculatePackageSugar(drink.sugarPer100Ml, size))} g</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate">Packungswerte rechnerisch aus dem 100-ml-Wert. Quellen stehen am Ende des Artikels.</p>
    </section>
  );
}

const zeroLightIds = ["coca-cola-classic-500", "coca-cola-zero-sugar-500", "coca-cola-light-500", "coca-cola-zero-sugar-zero-koffein-330", "pepsi-zero-330"];

// Cola Zero vs. Light answered from the data: sugar and energy per 100 ml next to Classic.
function ZeroLightAnswer() {
  const rows = zeroLightIds
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink): drink is Drink => Boolean(drink));
  const classic = rows.find((drink) => drink.id === "coca-cola-classic-500");
  const zero = rows.find((drink) => drink.id === "coca-cola-zero-sugar-500");
  const light = rows.find((drink) => drink.id === "coca-cola-light-500");
  if (!classic || !zero || !light) return null;

  return (
    <section className="mt-8 rounded-lg border border-ash bg-mist p-5" aria-labelledby="zero-light-title">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Kurzantwort</p>
      <h2 id="zero-light-title" className="mt-2 text-lg font-normal leading-8">
        Beim Zucker gibt es keinen Unterschied: {zero.name} und {light.name} haben beide <strong>{formatNumber(zero.sugarPer100Ml)} g Zucker pro 100 ml</strong>. {classic.name} hat {formatNumber(classic.sugarPer100Ml)} g, eine 500-ml-Flasche also {formatNumber(calculatePackageSugar(classic.sugarPer100Ml, 500))} g. Zero und Light unterscheiden sich in Rezeptur und Geschmack; welche Süßstoffe enthalten sind, steht in der Zutatenliste.
      </h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-sm tabular-nums">
          <caption className="sr-only">Zucker und Energie von Cola Classic, Zero und Light pro 100 ml und pro 500 ml</caption>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate">
              <th scope="col" className="py-2 pr-3 font-semibold">Cola</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Zucker / 100 ml</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">kcal / 100 ml</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Zucker / 500 ml</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((drink) => (
              <tr key={drink.id} className="border-t border-ash">
                <th scope="row" className="py-2.5 pr-3 text-left font-medium">
                  <Link href={drinkPageHref(drink)} className="underline decoration-ash underline-offset-4 hover:decoration-marigold">{drink.name}</Link>
                </th>
                <td className="px-3 py-2.5 text-right font-semibold">{formatNumber(drink.sugarPer100Ml)} g</td>
                <td className="px-3 py-2.5 text-right">{drink.nutritionPer100Ml ? formatNumber(drink.nutritionPer100Ml.energyKcal) : "/"}</td>
                <td className="px-3 py-2.5 text-right">{formatNumber(calculatePackageSugar(drink.sugarPer100Ml, 500))} g</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate">Werte laut hinterlegter Quelle auf der jeweiligen Produktseite; 500-ml-Werte rechnerisch.</p>
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
      <section>
        <h2 className="text-xl font-semibold tracking-tight">Quellen zu den Vergleichswerten</h2>
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

function ArticleComparison({ title, intro, drinks: comparisonDrinks }: { title: string; intro: string; drinks: Drink[] }) {
  return (
    <section className="mt-12 border-t border-ash pt-8">
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mb-5 mt-3 leading-7 text-slate">{intro}</p>
      <DrinkRows drinks={comparisonDrinks} />
      <ul className="mt-5 space-y-2 text-sm leading-6">
        {comparisonDrinks.map((drink) => (
          <li key={drink.id}>
            <a href={drink.sourceUrl} target="_blank" rel="noreferrer" className="underline decoration-ash underline-offset-4 hover:decoration-marigold">
              Quelle für {drink.name}: {drink.source}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function articleComparison(slug: string) {
  const configs: Record<string, { title: string; intro: string; ids: string[] }> = {
    "zuckerwuerfel-als-orientierung": {
      title: "Zuckerwürfel im direkten Vergleich",
      intro: "Beispiele aus der Datenbank. Ein Zuckerwürfel entspricht hier 3 g Zucker.",
      ids: ["coca-cola-classic-500", "fanta-orange-500", "sprite-500", "red-bull-energy-drink-250"],
    },
    "energy-drinks-zucker-vergleichen": {
      title: "Red Bull und Monster im Vergleich",
      intro: "Der Zuckerwert pro 100 ml und die Dosenmenge gehören zusammen.",
      ids: ["red-bull-energy-drink-250", "monster-mango-loco-500"],
    },
    "bekannte-softdrinks-im-zuckervergleich": {
      title: "Bekannte Softdrinks vergleichen",
      intro: "Coca-Cola, Pepsi, Fanta, Sprite und Cola-Mix mit hinterlegtem Wert pro 100 ml und pro Packung.",
      ids: ["coca-cola-classic-500", "pepsi-500", "fanta-orange-500", "sprite-500", "paulaner-spezi-500", "mezzo-mix-original-500"],
    },
  };
  const config = configs[slug];
  if (!config) return null;

  const comparisonDrinks = config.ids
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink): drink is Drink => Boolean(drink));

  return comparisonDrinks.length ? { ...config, drinks: comparisonDrinks } : null;
}

function metaTitle(slug: string, fallback: string) {
  const titles: Record<string, string> = {
    "zucker-pro-100ml-verstehen": "Zucker pro 100 ml: Was ist viel?",
    "zuckerwuerfel-als-orientierung": "Zuckerwürfel in Getränken: Cola, Fanta, Sprite und Red Bull",
    "cola-zucker-pro-100ml": "Cola Zucker: Wie viel steckt in 100 ml, 500 ml und 1 Liter?",
    "cola-zero-light-und-klassisch": "Cola Zero oder Light: Unterschied beim Zucker im Vergleich",
    "energy-drinks-zucker-vergleichen": "Energy Drink Zucker: Red Bull, Monster und 500-ml-Dosen",
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
    "cola-zero-light-und-klassisch": "Cola Zero oder Light: Was ist der Unterschied? Zucker und Kalorien von Coca-Cola Zero, Light und Classic pro 100 ml und pro 500-ml-Flasche im Vergleich.",
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
      { href: "/de/vergleiche/red-bull-vs-monster-zucker", label: "Red Bull vs. Monster", description: "Die beiden größten Marken direkt nach Zucker gegenüberstellen." },
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
      { href: "/de/vergleiche/spezi-vs-mezzo-mix-zucker", label: "Spezi vs. Mezzo Mix", description: "Die beiden bekanntesten Cola-Mixe nach Zucker und Kalorien vergleichen." },
    ],
    "saft-ist-nicht-automatisch-zuckerarm": [
      { href: "/de/kategorien/juice", label: "Säfte vergleichen", description: "Saft, Nektar und Fruchtsaftgetränke nach Zucker einordnen." },
      { href: "/de/getraenke/granini-trinkgenuss-orange-1000", label: "granini Trinkgenuss Orange", description: "Ein Beispiel für Zuckerwerte in Saftprodukten." },
    ],
    "eistee-zucker-im-alltag": [
      { href: "/de/marken/fuze-tea", label: "Fuze Tea vergleichen", description: "Sorten und Packungsgrößen der Marke nach Zucker ansehen." },
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

// Category product lists merged into articles (the former /de/eistee-zucker and /de/energy-drinks-zucker pages).
const articleCategoryLists: Record<string, { categoryId: string; title: string; text: string }> = {
  "eistee-zucker-im-alltag": {
    categoryId: "iced-tea",
    title: "Alle Eistees nach Zucker",
    text: "Sortiert nach Zucker pro 100 ml. Große Flaschen erhöhen den Gesamtzucker schnell.",
  },
  "energy-drinks-zucker-vergleichen": {
    categoryId: "energy",
    title: "Alle Energy Drinks nach Zucker",
    text: "Sortiert nach Zucker pro 100 ml. Jede Zeile zeigt auch den Zucker pro Dose.",
  },
};

function CategoryProductList({ categoryId, title, text }: { categoryId: string; title: string; text: string }) {
  const items = drinksByCategory(categoryId);
  if (!items.length) return null;
  return (
    <section id="produkte" className="mt-12 border-t border-ash pt-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 leading-7 text-slate">{items.length} Produkte, Durchschnitt {formatNumber(averageSugar(items))} g Zucker pro 100 ml. {text}</p>
      <div className="mt-6">
        <SortableDrinkRows drinks={items} />
      </div>
    </section>
  );
}
