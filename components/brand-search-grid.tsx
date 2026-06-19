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
        {filteredBrands.map((brand) => {
          const count = counts[brand.id] ?? 0;
          const products = topDrinks[brand.id] ?? [];
          const remaining = Math.max(0, count - products.length);
          const actionLabel = remaining > 0 ? `${remaining} weitere` : "Getränke ansehen";

          return (
          <article key={brand.id} className="flex min-h-[236px] flex-col rounded-lg border border-ash p-4">
            <div>
              <h2 className="font-semibold">{brand.name}</h2>
              <p className="mt-1 text-sm text-slate">{brand.note}</p>
            </div>
            {!!products.length && (
              <div className="mt-4 flex flex-1 flex-col border-t border-ash pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate">Produkte</p>
                <div className="mb-5 mt-2 flex flex-col items-start gap-2">
                {products.map((drink) => (
                  <Link key={drink.id} href={`/de/getraenke/${drink.id}`} className="focus-ring max-w-full truncate rounded-md bg-mist px-2.5 py-1.5 text-sm leading-5 hover:bg-cream">
                    {drink.name}
                  </Link>
                ))}
                </div>
                <Link href={`/de/getraenke?brand=${brand.id}`} className="focus-ring mt-auto inline-flex w-fit rounded-md border border-ink bg-paper px-2.5 py-1.5 text-sm leading-5 hover:bg-ink hover:text-white dark:hover:text-black">
                  {actionLabel}
                </Link>
              </div>
            )}
          </article>
          );
        })}
      </div>

      {!filteredBrands.length && (
        <p className="mt-5 rounded-lg border border-ash bg-mist p-4 text-sm text-slate">
          Keine Marke zu "{query}" gefunden.
        </p>
      )}
    </section>
  );
}
