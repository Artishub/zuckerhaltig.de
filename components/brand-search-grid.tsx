"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Brand } from "@/lib/data/brands";

type BrandSearchGridProps = {
  brands: Brand[];
  counts: Record<string, number>;
  topDrinks: Record<string, { id: string; name: string; sugar: number }[]>;
};

export function BrandSearchGrid({ brands, counts, topDrinks }: BrandSearchGridProps) {
  const [query, setQuery] = useState("");
  const filteredBrands = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return brands;

    return brands.filter((brand) => `${brand.name} ${brand.note}`.toLowerCase().includes(value));
  }, [brands, query]);

  return (
    <section className="mt-8">
      <label className="flex h-11 max-w-md items-center gap-2 rounded-md border border-ash bg-paper px-3 transition focus-within:border-marigold">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Marke suchen"
          aria-label="Marke suchen"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate"
        />
      </label>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {filteredBrands.map((brand) => (
          <article key={brand.id} className="rounded-lg border border-ash p-4">
            <div className="mb-5 flex h-6 items-start justify-end">
              <Link href={`/de/getraenke?brand=${brand.id}`} className="focus-ring rounded-md text-xs text-slate underline decoration-ash underline-offset-4 hover:text-ink hover:decoration-marigold">
                Filtern
              </Link>
            </div>
            <h2 className="font-semibold">{brand.name}</h2>
            <p className="mt-1 text-sm text-slate">{brand.note}</p>
            <p className="mt-4 text-sm tabular-nums">{counts[brand.id] ?? 0} Einträge</p>
            {!!topDrinks[brand.id]?.length && (
              <div className="mt-4 space-y-2 border-t border-ash pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate">Top Produkte</p>
                {topDrinks[brand.id].map((drink) => (
                  <Link key={drink.id} href={`/de/getraenke/${drink.id}`} className="focus-ring block rounded-md text-sm leading-5 hover:text-marigold">
                    {drink.name}
                    <span className="block text-xs text-slate">{formatNumber(drink.sugar)} g gesamt</span>
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {!filteredBrands.length && (
        <p className="mt-5 rounded-lg border border-ash bg-mist p-4 text-sm text-slate">
          Keine Marke zu "{query}" gefunden.
        </p>
      )}
    </section>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}
