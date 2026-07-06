"use client";

import { useMemo, useState } from "react";
import { DrinkRows } from "@/components/seo-drink-list";
import { brandName } from "@/lib/seo-drinks";
import { totalSugarGrams, type Drink } from "@/lib/data/drinks";

type SortKey = "sugar100" | "package" | "name" | "brand";

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "sugar100", label: "Zucker pro 100 ml" },
  { value: "package", label: "Zucker pro Packung" },
  { value: "name", label: "Name A-Z" },
  { value: "brand", label: "Marke A-Z" },
];

export function SortableDrinkRows({
  drinks,
  defaultSort = "sugar100",
}: {
  drinks: Drink[];
  defaultSort?: SortKey;
}) {
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const sorted = useMemo(() => sortDrinks(drinks, sort), [drinks, sort]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="drink-sort" className="text-sm font-medium text-slate">Sortieren</label>
        <select
          id="drink-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          className="focus-ring h-10 rounded-md border border-ash bg-paper px-3 text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <DrinkRows drinks={sorted} />
    </div>
  );
}

function sortDrinks(drinks: Drink[], sort: SortKey) {
  return [...drinks].sort((a, b) => {
    if (sort === "package") return (totalSugarGrams(b) ?? -1) - (totalSugarGrams(a) ?? -1);
    if (sort === "name") return a.name.localeCompare(b.name, "de");
    if (sort === "brand") return brandName(a).localeCompare(brandName(b), "de") || a.name.localeCompare(b.name, "de");
    return b.sugarPer100Ml - a.sugarPer100Ml;
  });
}
