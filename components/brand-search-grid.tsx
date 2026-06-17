"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Brand } from "@/lib/data/brands";

type BrandSearchGridProps = {
  brands: Brand[];
  counts: Record<string, number>;
};

export function BrandSearchGrid({ brands, counts }: BrandSearchGridProps) {
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
          <Link key={brand.id} href={`/de/getraenke?brand=${brand.id}`} className="group rounded-lg border border-ash p-4 hover:border-marigold">
            <div className="mb-5 flex h-6 items-start justify-end">
              <span className="text-xs text-slate opacity-0 transition group-hover:opacity-100">Filtern</span>
            </div>
            <h2 className="font-semibold">{brand.name}</h2>
            <p className="mt-1 text-sm text-slate">{brand.note}</p>
            <p className="mt-4 text-sm tabular-nums">{counts[brand.id] ?? 0} Einträge</p>
          </Link>
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
