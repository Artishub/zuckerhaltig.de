import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { Section, textLinkClass } from "@/components/ui/section";
import { lowSugarSoftDrinks } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zuckerarme Softdrinks: bis 2,5 g Zucker pro 100 ml", "Softdrinks mit höchstens 2,5 g Zucker pro 100 ml vergleichen. Cola, Limo und Cola-Mix mit Packungsgröße, Zuckerwürfeln und Quellen.", "/de/rankings/zuckerarme-softdrinks");

export default function LowSugarSoftDrinksPage() {
  const drinks = lowSugarSoftDrinks(50);

  return (
    <main className="pb-24">
      <PageHero title="Zuckerarme Softdrinks" text="Cola, Limo und Cola-Mix mit höchstens 2,5 g Zucker pro 100 ml, der EU-Grenze für die Angabe „zuckerarm“." />
      <p className="mx-auto max-w-page px-5 text-sm leading-6 text-slate">
        Bewertet wird nur Zucker, nicht Süßstoffe, Koffein oder Säuren. <Link href="/de/wissen/zucker-pro-100ml-verstehen" className={textLinkClass}>Zucker pro 100 ml einordnen</Link>
      </p>
      <Section id="liste" title={`${drinks.length} Softdrinks bis 2,5 g`}>
        <SortableDrinkRows drinks={drinks} ascending />
      </Section>
    </main>
  );
}
