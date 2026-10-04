import { Suspense } from "react";
import { DrinkRows, PageHero } from "@/components/seo-drink-list";
import { Section } from "@/components/ui/section";
import { DrinkExplorer } from "@/components/drink-explorer";
import { featuredIndexableDrinks } from "@/lib/seo-drinks";
import { pageMetadata, siteUrl } from "@/lib/site";

export const metadata = pageMetadata("Getränke-Datenbank", "Suche Getränke nach Marke, Kategorie, Gebindegröße und Zuckerwerten. Vergleiche Zucker pro 100 ml, Packung, Kalorien, Zuckerwürfel und Quellen.", "/de/getraenke");

export default function DrinksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Zuckerhaltig.de Getränkedatenbank",
    description: "Getränkedatenbank mit Zucker- und Nährwertangaben, Packungsgrößen, Berechnungen und Quellen.",
    url: `${siteUrl}/de/getraenke`,
    inLanguage: "de",
    creator: { "@type": "Organization", name: "Zuckerhaltig.de", url: siteUrl },
    publisher: { "@type": "Organization", name: "Zuckerhaltig.de", url: siteUrl },
  };

  return (
    <main className="pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero title="Zucker in Getränken vergleichen" text="Filtere nach Marke, Kategorie, Packungsgröße und Zucker. Jede Produktseite zeigt Quelle und Prüfdatum." />
      <div className="mx-auto max-w-page px-5">
        <Suspense fallback={<div className="border-t border-hair py-6 text-sm text-slate">Getränke werden geladen …</div>}>
          <DrinkExplorer />
        </Suspense>
      </div>
      <Section id="featured" title="Häufig verglichen">
        <DrinkRows drinks={featuredIndexableDrinks()} />
      </Section>
    </main>
  );
}
