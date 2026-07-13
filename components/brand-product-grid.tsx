import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sugarCubes, totalSugarGrams, type Drink } from "@/lib/data/drinks";
import { categoryName, drinkHref, formatNumber, sizeLabel } from "@/lib/seo-drinks";

export function BrandProductGrid({ drinks }: { drinks: Drink[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {drinks.map((drink) => {
        const totalSugar = totalSugarGrams(drink);
        const cubes = sugarCubes(drink);

        return (
          <li key={drink.id}>
            <Link
              href={drinkHref(drink)}
              className="focus-ring group grid h-full gap-5 rounded-lg border border-ash bg-mist p-5 transition hover:border-marigold active:translate-y-px"
            >
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <h3 className="font-semibold leading-tight tracking-tight">{drink.name}</h3>
                  <p className="mt-2 text-sm text-slate">{categoryName(drink)} · {sizeLabel(drink)}</p>
                </div>
                <ArrowRight size={17} className="mt-0.5 text-slate transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm tabular-nums">
                <div>
                  <p className="text-slate">Pro 100 ml</p>
                  <p className="mt-1 font-semibold">{formatNumber(drink.sugarPer100Ml)} g Zucker</p>
                </div>
                <div>
                  <p className="text-slate">Pro Packung</p>
                  <p className="mt-1 font-semibold">
                    {totalSugar === null ? "/" : `${formatNumber(totalSugar)} g`}
                    {cubes === null ? "" : `, ${formatNumber(cubes)} Würfel`}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
