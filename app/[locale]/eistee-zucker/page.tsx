import { LinkCard, PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { averageSugar, drinksByCategory, formatNumber } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Eistee Zucker: Marken und Sorten vergleichen", "Eistee nach Zucker vergleichen: Pfirsich, Zitrone und weitere Sorten pro 100 ml, pro Packung und als Zuckerwürfel. Mit Produktdetails und Quellen.", "/de/eistee-zucker");

export default function IcedTeaSugarPage() {
  const icedTea = drinksByCategory("iced-tea");
  return (
    <main>
      <PageHero kicker="Eistee Zucker" title="Eistee: Zucker pro 100 ml vergleichen" text={`Vergleich von ${icedTea.length} Eistee-Produkten. Durchschnitt: ${formatNumber(averageSugar(icedTea))} g Zucker pro 100 ml.`} />
      <section className="mx-auto grid max-w-page gap-8 px-4 py-10 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Eistee-Liste</h2>
          <p className="mt-3 leading-7 text-slate">Hier siehst du Sorten nach Zucker pro 100 ml. Große Packungen erhöhen den Gesamtzucker schnell.</p>
        </div>
        <SortableDrinkRows drinks={icedTea} />
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto grid max-w-page gap-3 px-4 py-10 sm:grid-cols-3">
          <LinkCard href="/de/wissen/eistee-zucker-im-alltag" title="Eistee im Alltag" text="Kurzer Kontext zu Eistee-Zuckerwerten." />
          <LinkCard href="/de/rankings/zuckerreichste-getraenke" title="Zuckerreichste Getränke" text="Alle Getränke nach Packungszucker." />
          <LinkCard href="/de/marken/pfanner" title="Pfanner vergleichen" text="Eistee, Saft und Packungsgrößen der Marke ansehen." />
        </div>
      </section>
    </main>
  );
}
