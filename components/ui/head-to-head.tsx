import Link from "next/link";
import { packageEnergyKcal, sugarCubes, totalSugarGrams, type Drink } from "@/lib/data/drinks";
import { drinkPageHref } from "@/lib/page-routing";
import { brandName, formatNumber } from "@/lib/seo-drinks";
import ui from "./ui.module.css";

// Side-by-side table for the main products of a comparison page.
export function HeadToHead({ drinks, caption }: { drinks: Drink[]; caption?: string }) {
  return (
    <div className={`${ui.card} ${ui.tableWrap}`}>
      <table className={ui.table}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            <th scope="col">Getränk</th>
            <th scope="col" className={ui.num}>pro 100 ml</th>
            <th scope="col" className={ui.num}>pro Packung</th>
            <th scope="col" className={ui.num}>Würfel</th>
            <th scope="col" className={ui.num}>kcal</th>
          </tr>
        </thead>
        <tbody>
          {drinks.map((drink) => {
            const total = totalSugarGrams(drink);
            const cubes = sugarCubes(drink);
            const energy = packageEnergyKcal(drink);
            return (
              <tr key={drink.id}>
                <th scope="row">
                  <Link href={drinkPageHref(drink)} className={ui.tableName}>
                    <strong>{drink.name}</strong>
                    <small>{brandName(drink)} · {drink.sizeMl ? `${drink.sizeMl} ml` : "Größe offen"}</small>
                  </Link>
                </th>
                <td className={ui.num}><b>{formatNumber(drink.sugarPer100Ml)} g</b></td>
                <td className={ui.num}>{total === null ? "/" : `${formatNumber(total)} g`}</td>
                <td className={ui.num}>{cubes === null ? "/" : formatNumber(cubes)}</td>
                <td className={ui.num}>{energy === null ? "/" : formatNumber(Math.round(energy))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
