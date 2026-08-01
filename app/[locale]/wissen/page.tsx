import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  articleBySlug,
  articles,
  homepageArticleSlugs,
  knowledgeFeaturedArticleSlugs,
  type Article,
} from "@/lib/content/articles";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zucker in Getränken: Wissen und Vergleiche", "Zucker in Getränken nachschlagen: Cola Zucker pro 100 ml, Zuckerwürfel, Energy Drink Zucker pro Dose, Eistee Zucker und Saft im Vergleich.", "/de/wissen");

export default function KnowledgePage() {
  const [sweetenerArticle, sugarArticle, labelArticle] = homepageArticleSlugs.map(getArticle);
  const compactArticles = knowledgeFeaturedArticleSlugs.slice(homepageArticleSlugs.length).map(getArticle);
  const featuredSlugs = new Set<string>(knowledgeFeaturedArticleSlugs);
  const remainingArticles = articles.filter((article) => !featuredSlugs.has(article.slug));

  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Wie viel Zucker ist in Getränken?</h1>
      <div className="mt-6 grid gap-8 border-y border-ash py-8 md:grid-cols-[0.9fr_1.1fr]">
        <p className="text-2xl font-semibold leading-9 tracking-tight">
          Cola, Eistee, Saft und Energy Drinks sind schnell getrunken. Der Zuckerwert bleibt oft hängen, wenn die Flasche längst leer ist.
        </p>
        <div className="space-y-4 leading-7 text-slate">
          <p>
            Viele Suchanfragen klingen sehr konkret: „Wie viel Zucker hat Cola?“, „Wie viele Zuckerwürfel hat Red Bull?“ oder „Monster Zucker 500 ml“. Genau deshalb trennt Zuckerhaltig.de den Wert pro 100 ml vom Zucker pro Packung.
          </p>
          <p>
            Ein einzelnes Getränk entscheidet nicht über Gesundheit. Aber wer regelmäßig süße Getränke trinkt, sollte die Menge kennen: Zucker pro 100 ml, Gesamtzucker und Zuckerwürfel.
          </p>
          <p>
            Die Seite liest keine Absicht in Produkte hinein. Sie rechnet Verpackungsangaben um und macht Cola, Eistee, Energy Drinks, Saft und Zero-Varianten vergleichbar.
          </p>
        </div>
      </div>
      <section className="mt-10" aria-labelledby="featured-knowledge-title">
        <h2 id="featured-knowledge-title" className="sr-only">Ausgewählte Wissensartikel</h2>
        <div className="space-y-3">
          {[sweetenerArticle, sugarArticle, labelArticle].map((article) => <ProminentArticle key={article.slug} article={article} />)}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="category-knowledge-title">
        <h2 id="category-knowledge-title" className="text-2xl font-semibold tracking-tight">Cola, Energy Drinks und Eistee</h2>
        <div className="mt-4 space-y-3">
          {compactArticles.map((article) => <CompactArticle key={article.slug} article={article} />)}
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-ash bg-mist p-5">
        <h2 className="text-2xl font-semibold tracking-tight">Häufig gesucht</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { href: "/de/wissen/cola-zucker-pro-100ml", label: "Cola Zucker pro 100 ml" },
            { href: "/de/wissen/cola-zucker-pro-100ml", label: "Wie viel Zucker hat Cola?" },
            { href: "/de/wissen/cola-zucker-pro-100ml", label: "Zuckerwürfel in Cola" },
            { href: "/de/wissen/energy-drinks-zucker-vergleichen", label: "Red Bull Zucker pro Dose" },
            { href: "/de/wissen/energy-drinks-zucker-vergleichen", label: "Monster Energy Zucker 500 ml" },
            { href: "/de/wissen/eistee-zucker-im-alltag", label: "Eistee Pfirsich Zucker" },
            { href: "/de/zuckerrechner", label: "Zucker pro Flasche berechnen" },
            { href: "/de/wissen/cola-zucker-pro-100ml", label: "Cola-Produkte vergleichen" },
            { href: "/de/getraenke/afri-cola-classic-330", label: "afri cola Zucker" },
            { href: "/de/wissen/suessstoffe-aspartam-zuckerfreie-getraenke", label: "Aspartam und Süßstoffe" },
            { href: "/de/rankings/zuckerarme-softdrinks", label: "Zuckerarme Softdrinks" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="focus-ring rounded-md border border-ash bg-paper px-3 py-2 text-sm hover:border-marigold">
              {item.label}
            </Link>
          ))}
        </div>
      </section>
      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Weitere Artikel</h2>
      <div className="mt-4 grid gap-x-8 md:grid-cols-2">
        {remainingArticles.map((article) => (
          <Link key={article.slug} href={`/de/wissen/${article.slug}`} className="focus-ring grid gap-4 border-t border-ash py-5 hover:bg-mist md:grid-cols-[1fr_auto] md:px-3">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">{article.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate">{article.description}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-slate">
              {article.minutes} Min. <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}

function ProminentArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/de/wissen/${article.slug}`}
      className="focus-ring group grid overflow-hidden rounded-lg border border-ash bg-paper hover:border-marigold sm:grid-cols-[17.5rem_1fr]"
    >
      {article.image && (
        <div className="aspect-[3/2] overflow-hidden bg-ink sm:aspect-auto">
          <Image
            src={article.image.src}
            alt=""
            width={article.image.width}
            height={article.image.height}
            sizes="(max-width: 639px) calc(100vw - 2rem), 280px"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-col p-5">
        <p className="text-sm text-slate">{article.minutes} Min. Lesezeit</p>
        <h2 className="mt-2 text-2xl font-medium tracking-tight">{article.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate">{article.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium sm:mt-auto sm:pt-4">
          Artikel lesen <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function CompactArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/de/wissen/${article.slug}`}
      className="focus-ring group grid gap-4 rounded-lg border border-ash bg-paper p-3 hover:border-marigold sm:grid-cols-[12rem_1fr_auto] sm:items-center"
    >
      {article.image && (
        <div className="aspect-[3/2] overflow-hidden rounded-md bg-ink">
          <Image
            src={article.image.src}
            alt=""
            width={article.image.width}
            height={article.image.height}
            sizes="(max-width: 640px) calc(100vw - 3.5rem), 192px"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
          />
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{article.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate">{article.description}</p>
      </div>
      <span className="inline-flex items-center gap-2 text-sm text-slate sm:px-3">
        {article.minutes} Min. <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" />
      </span>
    </Link>
  );
}

function getArticle(slug: string) {
  const article = articleBySlug[slug];
  if (!article) throw new Error(`Article ${slug} fehlt.`);
  return article;
}
