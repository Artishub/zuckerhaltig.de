import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, ListFilter } from "lucide-react";
import { homeContent } from "@/lib/content/home";
import { articles } from "@/lib/content/articles";
import { drinks, groupedDrinkFamilies } from "@/lib/data/drinks";
import { brandById } from "@/lib/data/brands";
import { categories, categoryById } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Zucker in Getränken: Cola, Eistee, Energy Drinks",
  description: "Wie viel Zucker hat dein Getränk? Vergleiche Cola, Energy Drinks, Eistee, Saft und Limo pro 100 ml, pro Packung und als Zuckerwürfel.",
  alternates: {
    canonical: "/de",
  },
};

export default function HomePage() {
  const highest = groupedDrinkFamilies(drinks)
    .sort((a, b) => highestPer100(b) - highestPer100(a))
    .slice(0, 4);
  const popularDrinkIds = [
    "coca-cola-classic-500",
    "red-bull-energy-drink-250",
    "monster-mango-loco-500",
    "fanta-orange-500",
    "club-mate-500",
  ];
  const popularDrinks = popularDrinkIds
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink) => Boolean(drink));
  const categoryLinks = ["cola", "energy", "iced-tea", "juice", "orange-limo"]
    .map((id) => categories.find((category) => category.id === id))
    .filter((category) => Boolean(category));
  const featuredArticles = ["cola-zucker-pro-100ml", "zucker-pro-100ml-verstehen", "energy-drinks-zucker-vergleichen", "cola-zero-light-und-klassisch"]
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article) => Boolean(article));

  return (
    <main>
      <section className="page-grid border-b border-ash">
        <div className="mx-auto grid max-w-page gap-10 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <div>
            <p className="mb-4 text-sm font-medium text-slate">{homeContent.eyebrow}</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
              {homeContent.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate">{homeContent.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/de/getraenke" className="focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-ink bg-ink px-4 text-sm font-medium text-white dark:text-black">
                Getränke ansehen <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="self-end border border-ash bg-paper">
            <div className="flex items-center justify-between border-b border-ash px-4 py-3">
              <span className="text-sm font-medium">Viel Zucker pro 100 ml</span>
              <ListFilter size={16} />
            </div>
            <div className="divide-y divide-ash">
              {highest.map((item) => {
                const drink = item.type === "drink" ? item.drink : item.representative;
                const brandName = brandById[drink.brandId]?.name ?? "";
                const categoryName = categoryById[drink.categoryId]?.name ?? "";
                const title = item.type === "group" ? `${brandName} - Mehrere` : drink.name;
                const subtitle = item.type === "group" ? `${categoryName} · ${item.drinks.length} Produkte` : `${brandName} · ${categoryName} · ${drink.sizeMl ? `${drink.sizeMl} ml` : "/"}`;
                const href = item.type === "group" ? `/de/getraenke?brand=${drink.brandId}&category=${drink.categoryId}` : `/de/getraenke/${drink.id}`;

                return (
                <Link key={item.id} href={href} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-4 hover:bg-mist">
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm text-slate">{subtitle}</p>
                  </div>
                  <strong className="tabular-nums">{highestPer100(item)} g/100 ml</strong>
                </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-page px-4 py-10">
        <div className="grid overflow-hidden rounded-lg border border-ash md:grid-cols-3">
          {homeContent.guide.map((item, index) => (
            <div key={item.title} className="border-b border-ash p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate">0{index + 1}</p>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate">
          Hinweis: Rezepturen ändern sich. Prüfe bei Bedarf die aktuelle Verpackung.
        </p>
      </section>
      <section className="mx-auto max-w-page px-4 py-10">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold tracking-tight">Schnell einsteigen</h2>
          <p className="mt-3 leading-7 text-slate">Die wichtigsten Übersichten direkt öffnen.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/de/cola-zucker" className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">
            <p className="font-semibold">Cola Zucker</p>
            <p className="mt-2 text-sm leading-6 text-slate">Cola-Werte und Zero-Varianten vergleichen.</p>
          </Link>
          <Link href="/de/energy-drinks-zucker" className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">
            <p className="font-semibold">Energy Drinks Zucker</p>
            <p className="mt-2 text-sm leading-6 text-slate">Red Bull, Monster und weitere Dosen.</p>
          </Link>
          <Link href="/de/eistee-zucker" className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">
            <p className="font-semibold">Eistee Zucker</p>
            <p className="mt-2 text-sm leading-6 text-slate">Sorten nach 100-ml-Wert und Packung.</p>
          </Link>
          <Link href="/de/rankings/zuckerreichste-getraenke" className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">
            <p className="font-semibold">Zucker-Ranking</p>
            <p className="mt-2 text-sm leading-6 text-slate">Getränke nach Zucker pro Packung.</p>
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-page px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Beliebte Vergleiche</h2>
            <p className="mt-3 leading-7 text-slate">Cola, Red Bull, Monster, Fanta und Club-Mate direkt nach Zuckerwert öffnen.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {popularDrinks.map((drink) => {
              if (!drink) return null;
              const brandName = brandById[drink.brandId]?.name ?? "";
              return (
                <Link key={drink.id} href={`/de/getraenke/${drink.id}`} className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">
                  <p className="font-semibold">{drink.name}</p>
                  <p className="mt-1 text-sm text-slate">{brandName} · {drink.sizeMl ? `${drink.sizeMl} ml` : "/"}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto max-w-page px-4 py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">Nach Kategorie entdecken</h2>
            <Link href="/de/kategorien" className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-ash bg-paper px-4 text-sm font-medium hover:border-marigold">
              Alle Kategorien anzeigen <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {categoryLinks.map((category) => {
              if (!category) return null;
              return (
                <Link key={category.id} href={`/de/getraenke?category=${category.id}`} className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">
                  <p className="font-semibold">{category.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{category.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-page px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Zucker verstehen</h2>
            <p className="mt-3 leading-7 text-slate">Kurze Texte zu 100-ml-Werten, Packungsgrößen, Cola, Energy Drinks und Zero-Varianten.</p>
            <Link href="/de/wissen" className="focus-ring mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-ash bg-paper px-4 text-sm font-medium hover:border-marigold">
              Weitere wissenswerte Artikel <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-2">
            {featuredArticles.map((article) => {
              if (!article) return null;
              return (
                <Link key={article.slug} href={`/de/wissen/${article.slug}`} className="grid gap-3 rounded-lg border border-ash bg-paper p-4 hover:border-marigold sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-semibold">{article.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{article.description}</p>
                  </div>
                  <span className="text-sm text-slate">{article.minutes} Min.</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto grid max-w-page gap-8 px-4 py-12 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Calculator size={20} />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Rechnen statt schätzen.</h2>
          </div>
          <p className="text-lg leading-8 text-slate">
            Die Datenbank nutzt die Nährwertangaben und rechnet daraus Zucker pro Packung und Zuckerwürfel. So siehst du den Unterschied zwischen kleiner Dose, 500-ml-Flasche und Literpackung schneller.
          </p>
        </div>
      </section>
    </main>
  );
}

function highestPer100(item: ReturnType<typeof groupedDrinkFamilies>[number]) {
  if (item.type === "drink") return item.drink.sugarPer100Ml;
  return Math.max(...item.drinks.map((drink) => drink.sugarPer100Ml));
}
