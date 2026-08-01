import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { sugarFreeDrinks } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zuckerfreie Getränke: Ranking und Liste", "Getränke mit maximal 0,5 g Zucker pro 100 ml vergleichen: Cola Zero, Light, Energy Drinks und weitere Varianten mit Packungsgröße und Quellen.", "/de/rankings/zuckerfreie-getraenke");

export default function SugarFreeRankingPage() {
  const drinks = sugarFreeDrinks(50);

  return (
    <main>
      <PageHero kicker="Ranking" title="Zuckerfreie Getränke." text="Liste mit Getränken bis 0,5 g Zucker pro 100 ml. Die Angaben kommen aus den vorhandenen Nährwertdaten." />
      <section className="mx-auto max-w-page px-4 py-10">
        <aside className="mb-8 rounded-lg border border-ash bg-mist p-5">
          <h2 className="text-xl font-semibold tracking-tight">Dieses Ranking bewertet nur Zucker.</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate">Ein Platz in dieser Liste ist kein Gesundheitsurteil. Zutaten, Süßstoffe, Koffein und Säuren werden nicht bewertet.</p>
          <Link href="/de/wissen/suessstoffe-aspartam-zuckerfreie-getraenke" className="mt-3 inline-flex text-sm font-medium underline decoration-ash underline-offset-4 hover:decoration-marigold">
            Aspartam und Süßstoffe einordnen
          </Link>
        </aside>
        <SortableDrinkRows drinks={drinks} defaultSort="brand" />
        <p className="mt-6 text-sm text-slate">
          Nicht nur zuckerfreie Varianten ansehen? <Link href="/de/rankings/zuckerarme-softdrinks" className="underline decoration-ash underline-offset-4 hover:decoration-marigold">Softdrinks bis 2,5 g Zucker pro 100 ml vergleichen</Link>.
        </p>
      </section>
    </main>
  );
}
