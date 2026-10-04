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
import { PageHero } from "@/components/seo-drink-list";
import { Section, cardClass } from "@/components/ui/section";
import ui from "@/components/ui/ui.module.css";

export const metadata = pageMetadata("Zucker in Getränken: Wissen und Vergleiche", "Zucker in Getränken nachschlagen: Cola Zucker pro 100 ml, Zuckerwürfel, Energy Drink Zucker pro Dose, Eistee Zucker und Saft im Vergleich.", "/de/wissen");

export default function KnowledgePage() {
  const [sweetenerArticle, sugarArticle, labelArticle] = homepageArticleSlugs.map(getArticle);
  const compactArticles = knowledgeFeaturedArticleSlugs.slice(homepageArticleSlugs.length).map(getArticle);
  const featuredSlugs = new Set<string>(knowledgeFeaturedArticleSlugs);
  const remainingArticles = articles.filter((article) => !featuredSlugs.has(article.slug));

  return (
    <main className="pb-24">
      <PageHero title="Wie viel Zucker ist in Getränken?" text="Artikel zu Zucker pro 100 ml, Packungsgrößen, Zuckerwürfeln und Süßstoffen. Mit Werten aus der Datenbank und Quellen." />

      <section className="mx-auto max-w-page px-5" aria-labelledby="featured-knowledge-title">
        <h2 id="featured-knowledge-title" className="sr-only">Grundlagen</h2>
        <ul className={ui.articleGrid}>
          {[sweetenerArticle, sugarArticle, labelArticle].map((article) => <li key={article.slug}><ArticleCard article={article} /></li>)}
        </ul>
      </section>

      <Section id="categories" title="Cola, Energy Drinks und Eistee">
        <ul className={ui.articleGrid}>
          {compactArticles.map((article) => <li key={article.slug}><ArticleCard article={article} /></li>)}
        </ul>
      </Section>

      <Section id="more" title="Weitere Artikel">
        <ul className={`${cardClass} divide-y divide-hair px-5`}>
          {remainingArticles.map((article) => (
            <li key={article.slug}>
              <Link href={`/de/wissen/${article.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <span className="min-w-0">
                  <span className="block font-semibold group-hover:underline">{article.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate">{article.description}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-slate">{article.minutes} Min. <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/de/wissen/${article.slug}`} className={ui.articleCard}>
      {article.image && (
        <Image src={article.image.src} alt="" width={article.image.width} height={article.image.height} sizes="(max-width: 1023px) 100vw, 360px" />
      )}
      <span className={ui.articleBody}>
        <small>{article.minutes} Min. Lesezeit</small>
        <strong>{article.title}</strong>
      </span>
    </Link>
  );
}

function getArticle(slug: string) {
  const article = articleBySlug[slug];
  if (!article) throw new Error(`Article ${slug} fehlt.`);
  return article;
}
