import type { Metadata } from "next";
import { LinkCard, PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { averageSugar, drinksByCategory, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";

export const metadata: Metadata = {
  title: "Eistee Zucker: Marken und Sorten vergleichen",
  description: "Eistee nach Zucker vergleichen: Werte pro 100 ml, pro Packung und als Zuckerwürfel.",
  alternates: { canonical: "/de/eistee-zucker" },
};

export default function IcedTeaSugarPage() {
  const icedTea = drinksByCategory("iced-tea");
  const top = topBySugarPer100(icedTea, 12);

  return (
    <main>
      <PageHero kicker="Eistee Zucker" title="Eistee kann viel Zucker enthalten." text={`Vergleich von ${icedTea.length} Eistee-Produkten. Durchschnitt: ${formatNumber(averageSugar(icedTea))} g Zucker pro 100 ml.`} />
      <section className="mx-auto grid max-w-page gap-8 px-4 py-10 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Eistee-Liste</h2>
          <p className="mt-3 leading-7 text-slate">Hier siehst du Sorten nach Zucker pro 100 ml. Große Packungen erhöhen den Gesamtzucker schnell.</p>
        </div>
        <SortableDrinkRows drinks={top} />
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto grid max-w-page gap-3 px-4 py-10 sm:grid-cols-3">
          <LinkCard href="/de/wissen/eistee-zucker-im-alltag" title="Eistee im Alltag" text="Kurzer Kontext zu Eistee-Zuckerwerten." />
          <LinkCard href="/de/rankings/zuckerreichste-getraenke" title="Zuckerreichste Getränke" text="Alle Getränke nach Packungszucker." />
          <LinkCard href="/de/getraenke?category=iced-tea" title="Alle Eistees" text="Datenbank mit Filter öffnen." />
        </div>
      </section>
    </main>
  );
}
