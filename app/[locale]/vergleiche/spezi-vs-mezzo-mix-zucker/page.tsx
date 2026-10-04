import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { HeadToHead } from "@/components/ui/head-to-head";
import { Section, cardClass, textLinkClass } from "@/components/ui/section";
import { drinks, type Drink } from "@/lib/data/drinks";
import { drinkPageHref } from "@/lib/page-routing";
import { drinksByBrand, formatNumber } from "@/lib/seo-drinks";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Spezi vs. Mezzo Mix: Zucker pro 100 ml und pro Flasche",
  "Paulaner Spezi, Spezi Original und Mezzo Mix nach Zucker vergleichen: Werte pro 100 ml, pro 500-ml-Flasche, Zuckerwürfel und Kalorien. Mit Zero-Varianten und Quellen.",
  "/de/vergleiche/spezi-vs-mezzo-mix-zucker",
);

const mainIds = ["paulaner-spezi-500", "spezi-original-500", "mezzo-mix-original-500"];
const zeroIds = ["paulaner-spezi-zero-500", "mezzo-mix-zero-1250"];

function find(ids: string[]) {
  return ids.map((id) => drinks.find((drink) => drink.id === id)).filter((drink): drink is Drink => Boolean(drink));
}

const at500 = (drink: Drink) => (drink.sugarPer100Ml * 500) / 100;

export default function SpeziMezzoPage() {
  const main = find(mainIds);
  const zero = find(zeroIds);
  const [paulaner, original, mezzo] = main;
  if (!paulaner || !original || !mezzo) return null;

  const spezi = [...drinksByBrand("paulaner", ["cola-mix"]), ...drinksByBrand("spezi", ["cola-mix"])];
  const mezzoMix = drinksByBrand("mezzo-mix", ["cola-mix"]);
  const sweetest = [...main].sort((a, b) => b.sugarPer100Ml - a.sugarPer100Ml)[0];
  const lightest = [...main].sort((a, b) => a.sugarPer100Ml - b.sugarPer100Ml)[0];
  const difference = at500(sweetest) - at500(lightest);

  return (
    <main className="pb-24">
      <PageHero
        title="Spezi oder Mezzo Mix: Wo steckt mehr Zucker drin?"
        text={`${sweetest.name} hat mit ${formatNumber(sweetest.sugarPer100Ml)} g pro 100 ml am meisten Zucker, ${lightest.name} mit ${formatNumber(lightest.sugarPer100Ml)} g am wenigsten. Bei 500 ml sind das ${formatNumber(difference)} g Unterschied.`}
      />

      <Section id="table" title="Die drei Cola-Mixe in 500 ml">
        <HeadToHead drinks={main} caption="Zucker und Kalorien von Paulaner Spezi, Spezi Original und Mezzo Mix" />
      </Section>

      {zero.length > 0 && (
        <Section id="zero" title="Zero-Varianten">
          <ul className="grid gap-4 sm:grid-cols-2">
            {zero.map((drink) => (
              <li key={drink.id} className={`${cardClass} p-5`}>
                <Link href={drinkPageHref(drink)} className={textLinkClass}>{drink.name}</Link>
                <p className="mt-2 text-sm leading-6 text-slate">{formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml. Bei 500 ml sind das {formatNumber(at500(drink))} g statt {formatNumber(at500(drink.brandId === "mezzo-mix" ? mezzo : paulaner))} g beim Original.</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <section className="mx-auto grid max-w-page gap-8 px-5 pt-14 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-[750] tracking-[-0.03em]">Spezi-Sorten</h2>
          <SortableDrinkRows drinks={spezi} compact />
        </div>
        <div>
          <h2 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-[750] tracking-[-0.03em]">Mezzo-Mix-Sorten</h2>
          <SortableDrinkRows drinks={mezzoMix} compact />
        </div>
      </section>

      <p className="mx-auto max-w-page px-5 pt-8 text-sm text-slate">
        Quellen und Prüfdatum stehen auf den Produktseiten. <Link href="/de/wissen/zucker-pro-100ml-verstehen" className={textLinkClass}>Zucker pro 100 ml einordnen</Link>
      </p>
    </main>
  );
}
