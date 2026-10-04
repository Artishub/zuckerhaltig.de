import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { Section, textLinkClass } from "@/components/ui/section";
import { sugarFreeDrinks } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zuckerfreie Getränke: Ranking und Liste", "Getränke mit maximal 0,5 g Zucker pro 100 ml vergleichen: Cola Zero, Light, Energy Drinks und weitere Varianten mit Packungsgröße und Quellen.", "/de/rankings/zuckerfreie-getraenke");

export default function SugarFreeRankingPage() {
  const drinks = sugarFreeDrinks(50);

  return (
    <main className="pb-24">
      <PageHero title="Zuckerfreie Getränke" text="Getränke mit höchstens 0,5 g Zucker pro 100 ml. Bis zu diesem Wert darf ein Getränk in der EU als „zuckerfrei“ bezeichnet werden." />
      <p className="mx-auto max-w-page px-5 text-sm leading-6 text-slate">
        Die Liste bewertet nur Zucker, nicht Süßstoffe, Koffein oder Säuren. <Link href="/de/wissen/suessstoffe-aspartam-zuckerfreie-getraenke" className={textLinkClass}>Süßstoffe einordnen</Link>
      </p>
      <Section id="liste" title={`${drinks.length} zuckerfreie Getränke`}>
        <SortableDrinkRows drinks={drinks} defaultSort="brand" />
        <p className="mt-6 text-sm text-slate">
          Etwas mehr Spielraum: <Link href="/de/rankings/zuckerarme-softdrinks" className={textLinkClass}>Softdrinks bis 2,5 g Zucker pro 100 ml</Link>
        </p>
      </Section>
    </main>
  );
}
