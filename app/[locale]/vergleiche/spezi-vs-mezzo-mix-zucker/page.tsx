import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SortableDrinkRows } from "@/components/sortable-drink-list";
import { drinks, packageEnergyKcal, sugarCubes, totalSugarGrams, type Drink } from "@/lib/data/drinks";
import { drinkPageHref } from "@/lib/page-routing";
import { brandName, drinksByBrand, formatNumber } from "@/lib/seo-drinks";
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
    <main>
      <PageHero
        kicker="Spezi vs. Mezzo Mix"
        title="Spezi oder Mezzo Mix: Wo steckt mehr Zucker drin?"
        text={`${sweetest.name} hat mit ${formatNumber(sweetest.sugarPer100Ml)} g pro 100 ml am meisten Zucker, ${lightest.name} mit ${formatNumber(lightest.sugarPer100Ml)} g am wenigsten. Bei 500 ml sind das ${formatNumber(difference)} g Unterschied.`}
      />

      <section className="mx-auto max-w-page px-4 py-10" aria-labelledby="table-title">
        <h2 id="table-title" className="text-3xl font-semibold tracking-tight">Die drei Cola-Mixe im Vergleich</h2>
        <div className="mt-6 overflow-x-auto rounded-lg border border-ash bg-mist">
          <table className="w-full border-collapse text-sm tabular-nums">
            <caption className="sr-only">Zucker und Kalorien von Paulaner Spezi, Spezi Original und Mezzo Mix</caption>
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate">
                <th scope="col" className="px-4 py-3 font-semibold">Getränk</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Zucker pro 100 ml</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Zucker pro 500 ml</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Würfel</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">kcal pro 500 ml</th>
              </tr>
            </thead>
            <tbody>
              {main.map((drink) => (
                <tr key={drink.id} className="border-t border-ash">
                  <th scope="row" className="px-4 py-3 text-left font-semibold">
                    <Link href={drinkPageHref(drink)} className="underline decoration-ash underline-offset-4 hover:decoration-marigold">{drink.name}</Link>
                    <span className="block text-xs font-normal text-slate">{brandName(drink)}</span>
                  </th>
                  <td className="px-4 py-3 text-right font-semibold">{formatNumber(drink.sugarPer100Ml)} g</td>
                  <td className="px-4 py-3 text-right">{formatNumber(totalSugarGrams(drink) ?? at500(drink))} g</td>
                  <td className="px-4 py-3 text-right">{formatNumber(sugarCubes(drink) ?? 0)}</td>
                  <td className="px-4 py-3 text-right">{packageEnergyKcal(drink) === null ? "/" : formatNumber(Math.round(packageEnergyKcal(drink) ?? 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate">Alle drei Werte beziehen sich auf die 500-ml-Flasche. Quellen und Prüfdatum stehen auf den Produktseiten.</p>
      </section>

      {zero.length > 0 && (
        <section className="mx-auto max-w-page px-4 pb-10" aria-labelledby="zero-title">
          <h2 id="zero-title" className="text-2xl font-semibold tracking-tight">Zero-Varianten</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {zero.map((drink) => (
              <li key={drink.id} className="rounded-lg border border-ash bg-mist p-4">
                <Link href={drinkPageHref(drink)} className="font-semibold underline decoration-ash underline-offset-4 hover:decoration-marigold">{drink.name}</Link>
                <p className="mt-1 text-sm text-slate">{formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml. Bei 500 ml sind das {formatNumber(at500(drink))} g statt {formatNumber(at500(drink.brandId === "mezzo-mix" ? mezzo : paulaner))} g beim Original.</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto grid max-w-page gap-6 px-4 py-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Spezi-Sorten</h2>
          <SortableDrinkRows drinks={spezi} />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Mezzo-Mix-Sorten</h2>
          <SortableDrinkRows drinks={mezzoMix} />
        </div>
      </section>

      <section className="border-y border-ash bg-mist">
        <div className="mx-auto max-w-page px-4 py-10">
          <p className="text-sm"><Link href="/de/wissen/zucker-pro-100ml-verstehen" className="underline decoration-ash underline-offset-4 hover:decoration-marigold">Zucker pro 100 ml richtig einordnen</Link></p>
        </div>
      </section>
    </main>
  );
}
