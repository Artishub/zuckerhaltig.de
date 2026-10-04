"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export type SwapOption = {
  id: string;
  name: string;
  brand: string;
  sugarPer100Ml: number;
  href: string;
  compareHref: string;
};

const frequencies = [
  { id: "daily", label: "täglich", perYear: 365 },
  { id: "five", label: "5× pro Woche", perYear: 260 },
  { id: "three", label: "3× pro Woche", perYear: 156 },
  { id: "weekly", label: "1× pro Woche", perYear: 52 },
];

const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

function formatMass(grams: number) {
  return grams >= 1000 ? `${numberFormat.format(grams / 1000)} kg` : `${numberFormat.format(Math.round(grams))} g`;
}

// Swap block under the main number. Each card keeps a slot (data-buy-slot) for a later, labelled purchase link.
export function SwapCalculator({ drinkName, sugarPer100Ml, sizeMl, options }: {
  drinkName: string;
  sugarPer100Ml: number;
  sizeMl: number | null;
  options: SwapOption[];
}) {
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? "");
  const [frequencyId, setFrequencyId] = useState("daily");
  const selected = options.find((option) => option.id === selectedId) ?? options[0];
  const frequency = frequencies.find((item) => item.id === frequencyId) ?? frequencies[0];
  if (!selected) return null;

  const savedPerPackage = sizeMl ? ((sugarPer100Ml - selected.sugarPer100Ml) * sizeMl) / 100 : null;
  const savedPerYear = savedPerPackage === null ? null : savedPerPackage * frequency.perYear;

  return (
    <div className="grid gap-5">
      <ul className="grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Alternative wählen">
        {options.map((option) => {
          const saved = sizeMl ? ((sugarPer100Ml - option.sugarPer100Ml) * sizeMl) / 100 : null;
          const active = option.id === selected.id;
          return (
            <li key={option.id} data-buy-slot={option.id}>
              <div className={`grid h-full gap-3 rounded-2xl border p-4 transition ${active ? "border-ink bg-paper shadow-[0_18px_40px_-28px_rgba(23,32,29,0.5)]" : "border-ash bg-mist"}`}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedId(option.id)}
                  className="focus-ring grid gap-1 rounded-md text-left"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate">{option.brand}</span>
                  <span className="font-semibold leading-tight">{option.name}</span>
                  <span className="text-sm text-slate">{numberFormat.format(option.sugarPer100Ml)} g Zucker pro 100 ml</span>
                  {saved !== null && <span className="mt-1 text-lg font-bold tabular-nums">{numberFormat.format(saved)} g weniger pro Packung</span>}
                </button>
                <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                  <Link href={option.href} className="inline-flex items-center gap-1 underline decoration-ash underline-offset-4 hover:decoration-ink">Werte <ArrowRight size={14} /></Link>
                  <Link href={option.compareHref} className="inline-flex items-center gap-1 underline decoration-ash underline-offset-4 hover:decoration-ink">Vergleichen <ArrowRight size={14} /></Link>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {savedPerYear !== null && sizeMl && (
        <div className="grid gap-3 rounded-2xl bg-[#1f4539] p-5 text-[#f5f8f2] md:grid-cols-[1fr_auto] md:items-center">
          <p className="text-lg leading-7">
            <span className="text-[#b9d4c3]">Tausch-Rechner: </span>
            {frequency.label === "täglich" ? "Täglich" : frequency.label} eine {sizeMl}-ml-Packung {drinkName} durch {selected.name} ersetzt ={" "}
            <strong className="text-[#d8f36a]">rund {formatMass(savedPerYear)} Zucker weniger im Jahr</strong>.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-[#b9d4c3]">Wie oft?</span>
            <select
              value={frequencyId}
              onChange={(event) => setFrequencyId(event.target.value)}
              className="focus-ring h-10 rounded-full border border-white/20 bg-[#163328] px-3 text-sm text-white"
            >
              {frequencies.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
