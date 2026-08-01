import Link from "next/link";
import { LinkCard, PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { drinksByBrand, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";
import { drinks, sugarCubes, totalSugarGrams } from "@/lib/data/drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Fanta vs. Sprite: Zucker pro 100 ml und pro Flasche", "Fanta Orange und Sprite nach Zucker vergleichen: Werte pro 100 ml, 500-ml-Flasche und Zuckerwürfel. Mit Produktseiten und Quellen.", "/de/vergleiche/fanta-vs-sprite-zucker");

export default function FantaSpritePage() {
  const fanta = topBySugarPer100(drinksByBrand("fanta", ["orange-limo", "softdrink"]), 8);
  const sprite = topBySugarPer100(drinksByBrand("sprite", ["lemon-lime", "softdrink"]), 8);
  const fantaOrange = drinks.find((drink) => drink.id === "fanta-orange-500");
  const spriteClassic = drinks.find((drink) => drink.id === "sprite-500");

  if (!fantaOrange || !spriteClassic) return null;

  const fantaTotal = totalSugarGrams(fantaOrange);
  const spriteTotal = totalSugarGrams(spriteClassic);

  return (
    <main>
      <PageHero kicker="Fanta vs. Sprite" title="Fanta oder Sprite: Wo steckt mehr Zucker drin?" text={`Fanta Orange enthält ${formatNumber(fantaOrange.sugarPer100Ml)} g Zucker pro 100 ml, Sprite ${formatNumber(spriteClassic.sugarPer100Ml)} g. Bei 500 ml sind das ${formatNumber(fantaTotal ?? 0)} g beziehungsweise ${formatNumber(spriteTotal ?? 0)} g.`} />
      <section className="mx-auto max-w-page px-4 py-10">
        <h2 className="text-3xl font-semibold tracking-tight">Kurzantwort</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate">Sprite liegt bei den hinterlegten 500-ml-Produkten mit {formatNumber(spriteClassic.sugarPer100Ml)} g Zucker pro 100 ml über Fanta Orange mit {formatNumber(fantaOrange.sugarPer100Ml)} g. Das sind {formatNumber(sugarCubes(spriteClassic) ?? 0)} Zuckerwürfel für Sprite und {formatNumber(sugarCubes(fantaOrange) ?? 0)} für Fanta Orange.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <LinkCard href="/de/getraenke/fanta-orange-500" title="Fanta Orange, 500 ml" text={`${formatNumber(fantaOrange.sugarPer100Ml)} g Zucker pro 100 ml · ${formatNumber(fantaTotal ?? 0)} g pro Flasche.`} />
          <LinkCard href="/de/getraenke/sprite-500" title="Sprite, 500 ml" text={`${formatNumber(spriteClassic.sugarPer100Ml)} g Zucker pro 100 ml · ${formatNumber(spriteTotal ?? 0)} g pro Flasche.`} />
        </div>
      </section>
      <section className="mx-auto grid max-w-page gap-6 px-4 py-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Fanta</h2>
          <SortableDrinkRows drinks={fanta} />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Sprite</h2>
          <SortableDrinkRows drinks={sprite} />
        </div>
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto max-w-page px-4 py-10">
          <h2 className="text-2xl font-semibold tracking-tight">Worauf es beim Vergleich ankommt</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate">Vergleiche zuerst den Zucker pro 100 ml. Danach zeigt die Füllmenge, wie viel Zucker in der ganzen Flasche steckt. Zero-Varianten stehen getrennt in den Listen, weil sie andere Zuckerwerte haben.</p>
          <p className="mt-4 text-sm text-slate">Die Produktseiten enthalten die hinterlegten Quellen und den jeweiligen Prüfzeitpunkt.</p>
          <p className="mt-4 text-sm"><Link href="/de/wissen/zucker-pro-100ml-verstehen" className="underline decoration-ash underline-offset-4 hover:decoration-marigold">Zucker pro 100 ml richtig einordnen</Link></p>
        </div>
      </section>
    </main>
  );
}
