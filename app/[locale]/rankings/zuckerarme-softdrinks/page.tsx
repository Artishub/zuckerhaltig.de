import Link from "next/link";
import { DrinkRows, PageHero } from "@/components/seo-drink-list";
import { lowSugarSoftDrinks } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zuckerarme Softdrinks: bis 2,5 g Zucker pro 100 ml", "Softdrinks mit höchstens 2,5 g Zucker pro 100 ml vergleichen. Cola, Limo und Cola-Mix mit Packungsgröße, Zuckerwürfeln und Quellen.", "/de/rankings/zuckerarme-softdrinks");

export default function LowSugarSoftDrinksPage() {
  const drinks = lowSugarSoftDrinks(50);

  return (
    <main>
      <PageHero kicker="Ranking" title="Zuckerarme Softdrinks." text="Liste mit Cola, Limo und Cola-Mix bis höchstens 2,5 g Zucker pro 100 ml. Sortiert vom niedrigsten Zuckerwert aus den hinterlegten Nährwertdaten." />
      <section className="mx-auto max-w-page px-4 py-10">
        <aside className="mb-8 rounded-lg border border-ash bg-mist p-5">
          <h2 className="text-xl font-semibold tracking-tight">Die Grenze liegt bei 2,5 g Zucker pro 100 ml.</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate">Diese Liste nutzt die Schwelle für die Angabe „zuckerarm“. Sie bewertet nur Zucker, nicht Süßstoffe, Koffein, Säuren oder die gesamte Ernährung.</p>
          <Link href="/de/wissen/zucker-pro-100ml-verstehen" className="mt-3 inline-flex text-sm font-medium underline decoration-ash underline-offset-4 hover:decoration-marigold">
            Zucker pro 100 ml richtig einordnen
          </Link>
        </aside>
        <DrinkRows drinks={drinks} />
      </section>
    </main>
  );
}
