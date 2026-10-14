"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { formatCents, sugarTax, sugarTaxCaveatText, sugarTaxCentsPerLiter, sugarTaxPerPackageCents, type SugarTaxCaveat } from "@/lib/sugar-tax";

export type TaxCalculatorItem = {
  id: string;
  href: string;
  name: string;
  brand: string;
  sizeMl: number | null;
  per100: number;
  caveat: SugarTaxCaveat;
};

const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function parseInput(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function SugarTaxCalculator({ items }: { items: TaxCalculatorItem[] }) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<TaxCalculatorItem | null>(null);
  const [sugarInput, setSugarInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  const index = useMemo(() => items.map((item) => ({ item, haystack: normalize(`${item.brand} ${item.name}`) })), [items]);
  const results = useMemo(() => {
    const terms = normalize(query).split(" ").filter(Boolean);
    if (!terms.length) return [];
    return index.filter(({ haystack }) => terms.every((term) => haystack.includes(term))).slice(0, 6).map(({ item }) => item);
  }, [index, query]);

  const sugar = parseInput(sugarInput);
  const size = parseInput(sizeInput);
  const sugarError = sugarInput.trim() && (sugar === null || sugar > 100) ? "Bitte gib einen Wert zwischen 0 und 100 ein." : null;
  const sizeError = sizeInput.trim() && (size === null || size < 1 || size > 10000) ? "Bitte gib eine Füllmenge zwischen 1 und 10.000 ml ein." : null;
  const ready = sugar !== null && size !== null && !sugarError && !sizeError;

  function pick(item: TaxCalculatorItem) {
    setPicked(item);
    setQuery("");
    setSugarInput(numberFormat.format(item.per100));
    setSizeInput(item.sizeMl ? String(item.sizeMl) : "");
  }

  function reset() {
    setPicked(null);
    setQuery("");
    setSugarInput("");
    setSizeInput("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <form className="rounded-lg border border-hair bg-mist p-6 shadow-card md:p-7" onSubmit={(event) => event.preventDefault()}>
        <h2 className="text-[1.6rem] font-[750] leading-tight tracking-[-0.03em]">Getränk wählen</h2>
        <div className="relative mt-5">
          <label className="flex items-center gap-2 rounded-md border border-ash bg-paper px-3 focus-within:border-ink">
            <Search size={18} aria-hidden="true" className="text-slate" />
            <span className="sr-only">Getränk suchen</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="z. B. Cola, Eistee, Red Bull"
              autoComplete="off"
              className="focus-ring h-12 min-w-0 flex-1 rounded-md bg-transparent outline-none placeholder:text-steel"
            />
          </label>
          {query.trim() && (
            <ul className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-md border border-hair bg-paper shadow-card" aria-live="polite">
              {results.length === 0 && <li className="px-4 py-3 text-sm text-slate">Kein Getränk gefunden. Trag die Werte unten selbst ein.</li>}
              {results.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => pick(item)} className="focus-ring flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-mist">
                    <span>
                      <span className="block font-semibold">{item.name}</span>
                      <span className="block text-sm text-slate">{item.brand}{item.sizeMl ? ` · ${item.sizeMl} ml` : ""}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">{numberFormat.format(item.per100)} g</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-sm text-slate">Oder Werte vom Etikett eintragen:</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field id="tax-sugar" label="Zucker pro 100 ml" unit="g" value={sugarInput} onChange={(value) => { setPicked(null); setSugarInput(value); }} placeholder="z. B. 10,6" error={sugarError} />
          <Field id="tax-size" label="Füllmenge" unit="ml" value={sizeInput} onChange={setSizeInput} placeholder="z. B. 500" error={sizeError} />
        </div>

        <button type="button" onClick={reset} className="focus-ring mt-2 inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate hover:text-ink active:translate-y-px">
          <RotateCcw size={15} aria-hidden="true" /> Eingaben löschen
        </button>
      </form>

      <section className="rounded-lg border border-ash bg-paper p-5 md:p-7" aria-live="polite">
        {ready ? <Result sugar={sugar} size={size} picked={picked} /> : (
          <div className="grid min-h-80 content-center">
            <p className="text-[clamp(1.6rem,3vw,2.2rem)] font-[750] leading-tight tracking-[-0.03em]">Noch kein Ergebnis</p>
            <p className="mt-3 max-w-md leading-7 text-slate">Wähle ein Getränk oder trag Zucker pro 100 ml und die Füllmenge ein.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ id, label, unit, value, onChange, placeholder, error }: { id: string; label: string; unit: string; value: string; onChange: (value: string) => void; placeholder: string; error: string | null }) {
  return (
    <label className="grid min-w-0 gap-2" htmlFor={id}>
      <span className="font-medium">{label}</span>
      <div className="flex items-center rounded-md border border-ash bg-paper px-3 focus-within:border-ink">
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} inputMode="decimal" autoComplete="off" placeholder={placeholder} className="focus-ring h-12 w-0 min-w-0 flex-1 rounded-md bg-transparent outline-none placeholder:text-steel" />
        <span className="text-sm text-slate">{unit}</span>
      </div>
      {error && <span className="text-sm text-red-700 dark:text-red-300">{error}</span>}
    </label>
  );
}

function Result({ sugar, size, picked }: { sugar: number; size: number; picked: TaxCalculatorItem | null }) {
  const rate = sugarTaxCentsPerLiter(sugar);
  const perPackage = sugarTaxPerPackageCents(sugar, size);
  const [high, low] = sugarTax.tiers;
  // Distance to the next lower tier: how much less sugar per 100 ml would change the rate.
  const nextLower = sugar >= high.minPer100Ml ? { gap: sugar - high.minPer100Ml, rate: low.centsPerLiter } : sugar >= low.minPer100Ml ? { gap: sugar - low.minPer100Ml, rate: 0 } : null;
  const caveat = picked?.caveat ?? null;

  return (
    <div className="flex h-full flex-col">
      <p className="text-sm font-medium text-slate">{picked ? `${picked.name}, ${numberFormat.format(size)} ml` : `${numberFormat.format(sugar)} g Zucker pro 100 ml, ${numberFormat.format(size)} ml`}</p>
      <p className="mt-3 text-6xl font-semibold leading-none tracking-[-0.07em] tabular-nums md:text-7xl">{formatCents(perPackage)}</p>
      <p className="mt-2 text-lg text-slate">{rate ? "Zuckersteuer auf diese Packung" : "Keine Zuckersteuer: unter 5 g pro 100 ml"}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-cream p-4">
          <p className="text-sm text-slate">Steuersatz</p>
          <p className="mt-2 text-[clamp(1.6rem,3vw,2.2rem)] font-[750] leading-tight tracking-[-0.03em] tabular-nums">{rate}&nbsp;ct<span className="text-lg font-semibold"> / Liter</span></p>
        </div>
        <div className="rounded-lg border border-ash p-4">
          <p className="text-sm text-slate">Rechnung</p>
          <p className="mt-2 font-semibold tabular-nums">{rate} ct × {numberFormat.format(size)} ml ÷ 1000</p>
        </div>
      </div>

      {nextLower && (
        <p className="mt-6 leading-7 text-slate">
          Mit {numberFormat.format(Math.round((nextLower.gap + 0.1) * 10) / 10)}&nbsp;g weniger Zucker pro 100 ml läge der Satz bei {nextLower.rate}&nbsp;ct pro Liter.
        </p>
      )}
      {caveat && <p className="mt-4 rounded-md border border-hair bg-mist p-4 text-sm leading-6">{sugarTaxCaveatText[caveat]}</p>}
      <p className="mt-auto pt-6 text-sm leading-6 text-slate">
        Die Steuer soll bei den Herstellern erhoben werden. Wie viel davon im Ladenpreis ankommt, ist offen.
        {picked && <> <Link href={picked.href} className="font-semibold underline decoration-smoke underline-offset-4 hover:decoration-ink">Zum Getränk</Link></>}
      </p>
    </div>
  );
}
