"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Search, X } from "lucide-react";
import { brands } from "@/lib/data/brands";
import { categoryById } from "@/lib/data/categories";
import {
  canonicalPackageDrinkId,
  canonicalPackageDrinks,
  Drink,
  drinks,
  packageEnergyKcal,
  sugarCubes,
  totalSugarGrams,
} from "@/lib/data/drinks";

type Metric = {
  label: string;
  value: (drink: Drink) => string;
  emphasized?: boolean;
};

const options = canonicalPackageDrinks(drinks).sort((a, b) => {
  const nameOrder = a.name.localeCompare(b.name, "de");
  return nameOrder || (a.sizeMl ?? 0) - (b.sizeMl ?? 0);
});

const validIds = new Set(options.map((drink) => drink.id));

const metrics: Metric[] = [
  { label: "Zucker pro 100 ml", value: (drink) => `${formatNumber(drink.sugarPer100Ml)} g`, emphasized: true },
  { label: "Zucker pro Packung", value: (drink) => formatGrams(totalSugarGrams(drink)), emphasized: true },
  { label: "Zuckerwürfel pro Packung", value: (drink) => formatOptional(sugarCubes(drink)) },
  { label: "Energie pro 100 ml", value: (drink) => drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.energyKcal)} kcal` : "/" },
  { label: "Energie pro Packung", value: (drink) => formatKcal(packageEnergyKcal(drink)) },
  { label: "Kohlenhydrate pro 100 ml", value: (drink) => formatNutrition(drink, "carbohydrates") },
  { label: "Fett pro 100 ml", value: (drink) => formatNutrition(drink, "fat") },
  { label: "Eiweiß pro 100 ml", value: (drink) => formatNutrition(drink, "protein") },
  { label: "Salz pro 100 ml", value: (drink) => formatNutrition(drink, "salt") },
];

export function DrinkComparisonTool() {
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => initialSelection(searchParams));
  const selectedDrinks = selectedIds.map((id) => options.find((drink) => drink.id === id)).filter(isDrink);

  useEffect(() => {
    const params = new URLSearchParams();
    const ids = selectedIds.filter(Boolean);
    if (ids.length) params.set("drinks", ids.join(","));
    const query = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [selectedIds]);

  const setSlot = (index: number, id: string) => {
    setSelectedIds((current) => current.map((value, slot) => slot === index ? id : value));
  };

  return (
    <div>
      <section className="border border-ash bg-mist p-4 md:p-6" aria-labelledby="selection-title">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate">Auswahl</p>
            <h2 id="selection-title" className="mt-2 text-2xl font-medium tracking-[-0.02em]">Bis zu vier Getränke</h2>
          </div>
          {selectedDrinks.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIds(["", "", "", ""])}
              className="focus-ring inline-flex h-9 items-center gap-2 self-start rounded-md border border-ash px-3 text-sm hover:border-marigold sm:self-auto"
            >
              <X size={14} strokeWidth={1.75} aria-hidden="true" />
              Auswahl löschen
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {selectedIds.map((selectedId, index) => (
            <div key={index} className="block min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate">Getränk {index + 1}</p>
              <div className="mt-2 flex gap-2">
                <DrinkCombobox
                  value={selectedId}
                  disabledIds={selectedIds.filter((id) => id && id !== selectedId)}
                  onChange={(id) => setSlot(index, id)}
                />
                {selectedId && (
                  <button
                    type="button"
                    onClick={() => setSlot(index, "")}
                    className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-ash bg-paper hover:border-marigold"
                    aria-label={`Getränk ${index + 1} entfernen`}
                  >
                    <X size={15} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedDrinks.length ? (
        <section className="mt-8" aria-labelledby="comparison-title">
          <div className="flex items-end justify-between gap-4 border-b border-ash pb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate">Direkter Vergleich</p>
              <h2 id="comparison-title" className="mt-2 text-3xl font-medium tracking-[-0.025em]">Werte nebeneinander</h2>
            </div>
            <p className="hidden text-sm text-slate sm:block">{selectedDrinks.length}/4 ausgewählt</p>
          </div>

          <div className="hidden md:block">
            <div className="grid grid-cols-[220px_minmax(0,1fr)] border-b border-ash">
              <div className="border-r border-ash p-4" />
              <div className="grid" style={{ gridTemplateColumns: `repeat(${selectedDrinks.length}, minmax(0, 1fr))` }}>
                {selectedDrinks.map((drink) => <DrinkHeading key={drink.id} drink={drink} />)}
              </div>
            </div>
            <div>
              {metrics.map((metric) => (
                <div key={metric.label} className="grid grid-cols-[220px_minmax(0,1fr)] border-b border-ash">
                  <p className="border-r border-ash p-4 text-sm text-slate">{metric.label}</p>
                  <div className="grid" style={{ gridTemplateColumns: `repeat(${selectedDrinks.length}, minmax(0, 1fr))` }}>
                    {selectedDrinks.map((drink) => (
                      <p key={drink.id} className={`border-r border-ash p-4 text-right tabular-nums last:border-r-0 ${metric.emphasized ? "text-xl font-medium" : "text-sm"}`}>
                        {metric.value(drink)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-4 md:hidden">
            {selectedDrinks.map((drink) => (
              <article key={drink.id} className="border border-ash bg-mist p-4">
                <DrinkHeading drink={drink} compact />
                <dl className="mt-4">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="flex items-baseline justify-between gap-4 border-t border-ash py-3 text-sm">
                      <dt className="text-slate">{metric.label}</dt>
                      <dd className={`shrink-0 text-right tabular-nums ${metric.emphasized ? "font-medium" : ""}`}>{metric.value(drink)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate">Packungswerte werden aus dem hinterlegten 100-ml-Wert und der Füllmenge berechnet. Ein Zuckerwürfel entspricht 3 g.</p>
        </section>
      ) : (
        <section className="mt-8 border-y border-ash py-12 text-center">
          <p className="text-lg font-medium">Noch kein Getränk ausgewählt.</p>
          <p className="mt-2 text-sm text-slate">Nutze eines der Suchfelder oben.</p>
        </section>
      )}
    </div>
  );
}

function DrinkHeading({ drink, compact = false }: { drink: Drink; compact?: boolean }) {
  const brand = brands.find((item) => item.id === drink.brandId)?.name ?? "";
  const category = categoryById[drink.categoryId]?.name ?? "Getränk";

  return (
    <div className={compact ? "" : "border-r border-ash bg-mist p-4 last:border-r-0"}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate">{category}</p>
      <h3 className="mt-2 text-lg font-medium leading-tight">{drink.name}</h3>
      <p className="mt-1 text-sm text-slate">{brand} · {sizeLabel(drink)}</p>
      <Link href={`/de/getraenke/${canonicalPackageDrinkId(drink)}`} className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md text-sm font-medium underline decoration-ash underline-offset-4 hover:decoration-marigold">
        Details
        <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </div>
  );
}

function DrinkCombobox({ value, disabledIds, onChange }: { value: string; disabledIds: string[]; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((drink) => drink.id === value);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return options.filter((drink) => {
      const brand = brands.find((item) => item.id === drink.brandId)?.name ?? "";
      return !normalized || `${drink.name} ${brand} ${sizeLabel(drink)}`.toLowerCase().includes(normalized);
    }).slice(0, 50);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="focus-ring flex h-11 w-full items-center justify-between gap-2 rounded-md border border-ash bg-paper px-3 text-left text-sm hover:border-marigold"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate">{selected ? `${selected.name} · ${sizeLabel(selected)}` : "Getränk auswählen"}</span>
        <ChevronDown className={`shrink-0 transition ${open ? "rotate-180" : ""}`} size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-12 z-30 border border-ash bg-paper p-2 shadow-[0_18px_60px_rgba(26,26,26,0.12)]">
          <div className="flex h-10 items-center gap-2 rounded-md border border-ash px-3">
            <Search size={15} strokeWidth={1.75} aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name oder Marke"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="mt-2 max-h-72 overflow-y-auto" role="listbox">
            {filtered.map((drink) => {
              const disabled = disabledIds.includes(drink.id);
              return (
                <button
                  key={drink.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(drink.id);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="block w-full rounded px-2 py-2 text-left hover:bg-mist disabled:cursor-not-allowed disabled:opacity-35"
                  role="option"
                  aria-selected={drink.id === value}
                >
                  <span className="block truncate text-sm font-medium">{drink.name}</span>
                  <span className="block truncate text-xs text-slate">{brands.find((item) => item.id === drink.brandId)?.name} · {sizeLabel(drink)}</span>
                </button>
              );
            })}
            {!filtered.length && <p className="px-2 py-3 text-sm text-slate">Kein Getränk gefunden.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function initialSelection(searchParams: ReturnType<typeof useSearchParams>) {
  const ids = (searchParams.get("drinks")?.split(",") ?? [searchParams.get("drink") ?? ""])
    .filter((id) => validIds.has(id))
    .slice(0, 4);
  return [...ids, "", "", "", ""].slice(0, 4);
}

function isDrink(drink: Drink | undefined): drink is Drink {
  return Boolean(drink);
}

function formatNutrition(drink: Drink, key: "carbohydrates" | "fat" | "protein" | "salt") {
  return drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml[key])} g` : "/";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function formatOptional(value: number | null) {
  return value === null ? "/" : formatNumber(value);
}

function formatGrams(value: number | null) {
  return value === null ? "/" : `${formatNumber(value)} g`;
}

function formatKcal(value: number | null) {
  return value === null ? "/" : `${formatNumber(value)} kcal`;
}

function sizeLabel(drink: Drink) {
  return drink.sizeMl ? `${drink.sizeMl} ml` : "Größe offen";
}
