import type { Metadata } from "next";
import Link from "next/link";
import { brands } from "@/lib/data/brands";
import { drinks } from "@/lib/data/drinks";

export const metadata: Metadata = {
  title: "Marken",
  description: "Markenübersicht der Getränkedatenbank.",
};

export default function BrandsPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Marken</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate">
        Vergleiche Getränkemarken nach Zuckerwerten, Produktvarianten und Packungsgrößen. Jede Marke führt direkt zur gefilterten Getränkesuche.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/de/getraenke?brand=${brand.id}`} className="group rounded-lg border border-ash p-4 hover:border-marigold">
            <div className="mb-5 flex h-12 items-center justify-between gap-3">
              <div className="flex h-12 w-[128px] items-center justify-start">
                <img
                  src={brand.logoUrl}
                  alt={`${brand.name} Logo`}
                  className="max-h-8 max-w-[112px] object-contain object-left"
                  loading="lazy"
                />
              </div>
              <span className="text-xs text-slate opacity-0 transition group-hover:opacity-100">Filtern</span>
            </div>
            <h2 className="font-semibold">{brand.name}</h2>
            <p className="mt-1 text-sm text-slate">{brand.note}</p>
            <p className="mt-4 text-sm tabular-nums">{drinks.filter((drink) => drink.brandId === brand.id).length} Einträge</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
