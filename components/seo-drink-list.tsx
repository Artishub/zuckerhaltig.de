import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brandName, categoryName, drinkHref, formatNumber, sizeLabel } from "@/lib/seo-drinks";
import { sugarCubes, totalSugarGrams, type Drink } from "@/lib/data/drinks";

export function DrinkRows({ drinks }: { drinks: Drink[] }) {
  return (
    <div className="divide-y divide-ash overflow-hidden rounded-lg border border-ash bg-paper">
      {drinks.map((drink) => {
        const total = totalSugarGrams(drink);
        const cubes = sugarCubes(drink);

        return (
          <Link key={drink.id} href={drinkHref(drink)} className="grid gap-3 px-4 py-4 hover:bg-mist sm:grid-cols-[1fr_auto]">
            <div>
              <p className="font-semibold">{drink.name}</p>
              <p className="mt-1 text-sm text-slate">
                {brandName(drink)} · {categoryName(drink)} · {sizeLabel(drink)}
              </p>
            </div>
            <div className="text-sm tabular-nums text-slate sm:text-right">
              <p className="font-semibold text-ink">{formatNumber(drink.sugarPer100Ml)} g/100 ml</p>
              <p>{total === null ? "Packung offen" : `${formatNumber(total)} g`}{cubes === null ? "" : ` · ${formatNumber(cubes)} Würfel`}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function PageHero({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <section className="border-b border-ash bg-mist">
      <div className="mx-auto max-w-page px-4 py-16 md:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">{kicker}</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[.94] tracking-[-0.06em] md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate">{text}</p>
      </div>
    </section>
  );
}

export function LinkCard({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate">{text}</p>
      <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium">
        Öffnen <ArrowRight size={15} />
      </span>
    </Link>
  );
}
