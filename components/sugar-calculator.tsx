"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { calculatePackageSugar, calculateSugarCubes } from "@/lib/data/drinks";

export function SugarCalculator() {
  const [sugarInput, setSugarInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const calculation = useMemo(() => {
    const sugar = parseInput(sugarInput);
    const size = parseInput(sizeInput);
    const sugarError = fieldError(sugarInput, sugar, 0, 100, "Bitte gib einen Wert zwischen 0 und 100 ein.");
    const sizeError = fieldError(sizeInput, size, 1, 10000, "Bitte gib eine Füllmenge zwischen 1 und 10.000 ml ein.");

    if (sugarError || sizeError || sugar === null || size === null) {
      return { sugar, size, sugarError, sizeError, result: null };
    }

    const totalSugar = calculatePackageSugar(sugar, size);
    return {
      sugar,
      size,
      sugarError,
      sizeError,
      result: {
        totalSugar,
        cubes: calculateSugarCubes(totalSugar),
      },
    };
  }, [sizeInput, sugarInput]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSugarInput((params.get("zucker") ?? "").slice(0, 12));
    setSizeInput((params.get("menge") ?? "").slice(0, 12));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setCopied(false);
    setCopyError("");

    if (!sugarInput && !sizeInput) {
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    if (!calculation.result || calculation.sugar === null || calculation.size === null) return;
    window.history.replaceState(null, "", calculatorUrl(calculation.sugar, calculation.size, false));
  }, [calculation.result, calculation.size, calculation.sugar, ready, sizeInput, sugarInput]);

  async function copyLink() {
    if (!calculation.result || calculation.sugar === null || calculation.size === null) return;
    const url = calculatorUrl(calculation.sugar, calculation.size, true);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        legacyCopy(url);
      }
      setCopied(true);
      setCopyError("");
    } catch {
      setCopied(false);
      setCopyError("Der Link konnte nicht kopiert werden.");
    }
  }

  function reset() {
    setSugarInput("");
    setSizeInput("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <form className="rounded-lg border border-ash bg-mist p-5 md:p-7" onSubmit={(event) => event.preventDefault()}>
        <h2 className="text-2xl font-semibold tracking-tight">Werte eingeben</h2>
        <div className="mt-6 grid gap-5">
          <label className="grid gap-2" htmlFor="sugar-per-100">
            <span className="font-medium">Zucker pro 100 ml</span>
            <span className="text-sm leading-6 text-slate">Den Wert findest du in der Nährwerttabelle.</span>
            <div className="flex items-center rounded-md border border-ash bg-paper px-3 focus-within:border-marigold">
              <input
                id="sugar-per-100"
                value={sugarInput}
                onChange={(event) => setSugarInput(event.target.value)}
                inputMode="decimal"
                autoComplete="off"
                placeholder="z. B. 10,6"
                aria-describedby="sugar-per-100-help"
                className="focus-ring h-12 min-w-0 flex-1 rounded-md bg-transparent outline-none placeholder:text-steel"
              />
              <span className="text-sm text-slate">g</span>
            </div>
            <span id="sugar-per-100-help" className={`min-h-5 text-sm ${calculation.sugarError ? "text-red-700 dark:text-red-300" : "text-slate"}`}>
              {calculation.sugarError ?? "Komma und Punkt werden akzeptiert."}
            </span>
          </label>

          <label className="grid gap-2" htmlFor="package-size">
            <span className="font-medium">Füllmenge</span>
            <span className="text-sm leading-6 text-slate">Dose, Flasche oder Karton in Millilitern.</span>
            <div className="flex items-center rounded-md border border-ash bg-paper px-3 focus-within:border-marigold">
              <input
                id="package-size"
                value={sizeInput}
                onChange={(event) => setSizeInput(event.target.value)}
                inputMode="decimal"
                autoComplete="off"
                placeholder="z. B. 500"
                aria-describedby="package-size-help"
                className="focus-ring h-12 min-w-0 flex-1 rounded-md bg-transparent outline-none placeholder:text-steel"
              />
              <span className="text-sm text-slate">ml</span>
            </div>
            <span id="package-size-help" className={`min-h-5 text-sm ${calculation.sizeError ? "text-red-700 dark:text-red-300" : "text-slate"}`}>
              {calculation.sizeError ?? "Nutze die Füllmenge der ganzen Packung."}
            </span>
          </label>
        </div>

        <button type="button" onClick={reset} className="focus-ring mt-2 inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate hover:text-ink active:translate-y-px">
          <RotateCcw size={15} aria-hidden="true" /> Eingaben löschen
        </button>
      </form>

      <section className="rounded-lg border border-ash bg-paper p-5 md:p-7" aria-live="polite">
        {calculation.result && calculation.sugar !== null && calculation.size !== null ? (
          <div className="flex h-full flex-col">
            <div>
              <p className="text-sm font-medium text-slate">Ergebnis für {formatNumber(calculation.size)} ml</p>
              <p className="mt-3 text-6xl font-semibold leading-none tracking-[-0.07em] tabular-nums md:text-7xl">
                {formatNumber(calculation.result.totalSugar)} g
              </p>
              <p className="mt-2 text-lg text-slate">Zucker in der ganzen Packung</p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-cream p-4">
                <p className="text-sm text-slate">Zuckerwürfel</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">ca. {formatNumber(calculation.result.cubes)}</p>
              </div>
              <div className="rounded-lg border border-ash p-4">
                <p className="text-sm text-slate">Rechnung</p>
                <p className="mt-2 font-semibold tabular-nums">
                  {formatNumber(calculation.sugar)} × {formatNumber(calculation.size)} ÷ 100
                </p>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={copyLink}
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper hover:opacity-85 active:translate-y-px"
              >
                <Copy size={16} aria-hidden="true" /> {copied ? "Link kopiert" : "Ergebnis teilen"}
              </button>
              {copyError && <p className="mt-3 text-sm text-red-700 dark:text-red-300">{copyError}</p>}
            </div>
          </div>
        ) : (
          <div className="grid min-h-80 content-center">
            <p className="text-3xl font-semibold tracking-tight">Noch kein Ergebnis</p>
            <p className="mt-3 max-w-md leading-7 text-slate">Trage beide Werte ein. Das Ergebnis erscheint sofort und lässt sich als Link kopieren.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function parseInput(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function fieldError(value: string, parsed: number | null, min: number, max: number, rangeMessage: string) {
  if (!value.trim()) return null;
  if (parsed === null) return "Bitte gib eine Zahl ein.";
  if (parsed < min || parsed > max) return rangeMessage;
  return null;
}

function calculatorUrl(sugar: number, size: number, absolute: boolean) {
  const params = new URLSearchParams({
    zucker: String(sugar),
    menge: String(size),
  });
  const path = `${window.location.pathname}?${params.toString()}`;
  return absolute ? `${window.location.origin}${path}` : path;
}

function legacyCopy(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy failed");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}
