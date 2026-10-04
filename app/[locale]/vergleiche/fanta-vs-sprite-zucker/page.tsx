import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { HeadToHead } from "@/components/ui/head-to-head";
import { Section, textLinkClass } from "@/components/ui/section";
import { drinksByBrand, formatNumber, topBySugarPer100 } from "@/lib/seo-drinks";
import { drinks, totalSugarGrams } from "@/lib/data/drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Fanta vs. Sprite: Zucker pro 100 ml und pro Flasche", "Fanta Orange und Sprite nach Zucker vergleichen: Werte pro 100 ml, 500-ml-Flasche und Zuckerwürfel. Mit Produktseiten und Quellen.", "/de/vergleiche/fanta-vs-sprite-zucker");

export default function FantaSpritePage() {
  const fanta = topBySugarPer100(drinksByBrand("fanta", ["orange-limo", "softdrink"]), 8);
  const sprite = topBySugarPer100(drinksByBrand("sprite", ["lemon-lime", "softdrink"]), 8);
  const fantaOrange = drinks.find((drink) => drink.id === "fanta-orange-500");
  const spriteClassic = drinks.find((drink) => drink.id === "sprite-500");

  if (!fantaOrange || !spriteClassic) return null;

  return (
    <main className="pb-24">
      <PageHero title="Fanta oder Sprite: Wo steckt mehr Zucker drin?" text={`Fanta Orange enthält ${formatNumber(fantaOrange.sugarPer100Ml)} g Zucker pro 100 ml, Sprite ${formatNumber(spriteClassic.sugarPer100Ml)} g. Bei 500 ml sind das ${formatNumber(totalSugarGrams(fantaOrange) ?? 0)} g beziehungsweise ${formatNumber(totalSugarGrams(spriteClassic) ?? 0)} g.`} />
      <Section>
        <HeadToHead drinks={[fantaOrange, spriteClassic]} />
      </Section>
      <section className="mx-auto grid max-w-page gap-8 px-5 pt-14 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-[750] tracking-[-0.03em]">Fanta-Sorten</h2>
          <SortableDrinkRows drinks={fanta} compact />
        </div>
        <div>
          <h2 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-[750] tracking-[-0.03em]">Sprite-Sorten</h2>
          <SortableDrinkRows drinks={sprite} compact />
        </div>
      </section>
      <p className="mx-auto max-w-page px-5 pt-8 text-sm text-slate">
        Quellen und Prüfdatum stehen auf den Produktseiten. <Link href="/de/wissen/zucker-pro-100ml-verstehen" className={textLinkClass}>Zucker pro 100 ml einordnen</Link>
      </p>
    </main>
  );
}
