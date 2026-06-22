import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleBySlug, articles } from "@/lib/content/articles";

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
  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/de/wissen/${article.slug}`,
    },
  };
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
      <div className="mt-10 space-y-5 border-t border-ash pt-8 text-lg leading-8 text-ink">
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
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
    </main>
  );
}

function relatedLinks(slug: string) {
  const links: Record<string, { href: string; label: string; description: string }[]> = {
    "zucker-pro-100ml-verstehen": [
      { href: "/de/getraenke", label: "Getränke nach Zucker sortieren", description: "Vergleiche alle Produkte direkt nach Zucker pro 100 ml." },
      { href: "/de/wissen/packungsgroesse-entscheidet", label: "Zucker pro Flasche berechnen", description: "Warum die Packungsgröße den Gesamtzucker stark verändert." },
    ],
    "energy-drinks-zucker-vergleichen": [
      { href: "/de/getraenke?category=energy", label: "Energy Drinks vergleichen", description: "Red Bull, Monster und weitere Energy Drinks nach Zucker filtern." },
      { href: "/de/getraenke/red-bull-energy-drink-250", label: "Red Bull Energy Drink", description: "Zucker und Nährwerte der 250-ml-Dose ansehen." },
    ],
    "cola-zero-light-und-klassisch": [
      { href: "/de/getraenke?category=cola", label: "Cola vergleichen", description: "Classic, Zero und Varianten in der Getränkesuche filtern." },
      { href: "/de/getraenke/coca-cola-classic-500", label: "Coca-Cola Classic", description: "Zuckerwerte der 500-ml-Flasche im Detail." },
    ],
    "cola-zucker-pro-100ml": [
      { href: "/de/getraenke?category=cola", label: "Cola nach Zucker sortieren", description: "Coca-Cola, afri cola und weitere Cola-Produkte nach Zucker pro 100 ml vergleichen." },
      { href: "/de/getraenke/coca-cola-classic-500", label: "Coca-Cola Classic 500 ml", description: "53 g Zucker pro 500 ml aus dem 100-ml-Wert berechnen." },
      { href: "/de/getraenke/afri-cola-classic-330", label: "afri cola classic", description: "afri cola nach Zucker pro 100 ml und pro Dose einordnen." },
      { href: "/de/wissen/cola-zero-light-und-klassisch", label: "Cola, Zero und Light", description: "Classic-Cola mit Zero- und Light-Varianten vergleichen." },
    ],
    "saft-ist-nicht-automatisch-zuckerarm": [
      { href: "/de/getraenke?category=juice", label: "Säfte vergleichen", description: "Saft, Nektar und Fruchtsaftgetränke nach Zucker einordnen." },
      { href: "/de/getraenke/granini-trinkgenuss-orange-1000", label: "granini Trinkgenuss Orange", description: "Ein Beispiel für Zuckerwerte in Saftprodukten." },
    ],
    "eistee-zucker-im-alltag": [
      { href: "/de/getraenke?category=iced-tea", label: "Eistee vergleichen", description: "Pfirsich, Zitrone und weitere Sorten nach Zucker filtern." },
      { href: "/de/wissen/packungsgroesse-entscheidet", label: "Packungsgröße prüfen", description: "Warum große Flaschen trotz moderater 100-ml-Werte relevant sind." },
    ],
    "zuckerfreie-getraenke-in-der-datenbank": [
      { href: "/de/getraenke", label: "Zuckerarme Getränke finden", description: "Filtere nach niedrigen Zuckerwerten und Zero-Produkten." },
      { href: "/de/wissen/cola-zero-light-und-klassisch", label: "Cola Zero und Light", description: "Was sich bei Zuckerwerten und Varianten unterscheidet." },
    ],
  };

  return links[slug] ?? [
    { href: "/de/getraenke", label: "Getränkedatenbank öffnen", description: "Alle Produkte nach Marke, Kategorie und Zuckerwerten filtern." },
    { href: "/de/wissen/zucker-pro-100ml-verstehen", label: "Zucker pro 100 ml verstehen", description: "Der wichtigste Vergleichswert für Getränke." },
  ];
}
