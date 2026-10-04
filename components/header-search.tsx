"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { brands } from "@/lib/data/brands";
import { canonicalPackageDrinks, drinks, uniqueProductRepresentatives } from "@/lib/data/drinks";
import { trackEvent } from "@/lib/analytics";
import { drinkPageHref } from "@/lib/page-routing";

const frequentSearches = ["Coca-Cola", "Energy Drink", "Eistee", "Fanta"];
const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

const searchIndex = uniqueProductRepresentatives(canonicalPackageDrinks(drinks)).map((drink) => {
  const brand = brands.find((item) => item.id === drink.brandId)?.name ?? "";
  return { drink, brand, haystack: normalize(`${brand} ${drink.name}`) };
});

// Visible search in every page header ("Anderes Getränk prüfen"). Suggestions open the product page directly.
export function HeaderSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const terms = normalize(query).split(" ").filter(Boolean);
    if (!terms.length) return [];
    return searchIndex.filter(({ haystack }) => terms.every((term) => haystack.includes(term))).slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const openSearchPage = (value: string) => {
    const q = value.trim();
    if (!q) return;
    trackEvent("header_search_submit", { query_length: q.length });
    setOpen(false);
    router.push(`/de/getraenke?q=${encodeURIComponent(q)}`);
  };

  const openDrink = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (results.length === 1) openDrink(drinkPageHref(results[0].drink));
    else openSearchPage(query);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative flex min-w-0 justify-end">
      <form
        onSubmit={submit}
        className={`flex h-9 items-center rounded-full border bg-mist transition-[width,border-color] duration-200 focus-within:border-ink xl:w-[260px] xl:border-ash ${
          open ? "w-[min(52vw,240px)] border-ink" : "w-9 border-ash"
        }`}
        role="search"
      >
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
          className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          aria-label="Anderes Getränk prüfen"
          aria-expanded={open}
          aria-controls="header-search-results"
        >
          <Search size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Anderes Getränk prüfen"
          aria-label="Anderes Getränk prüfen"
          className={`min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-slate xl:block ${open ? "block" : "hidden"}`}
        />
      </form>

      {open && (
        <div id="header-search-results" className="absolute right-0 top-11 z-40 w-[min(88vw,320px)] overflow-hidden rounded-2xl border border-ash bg-mist text-sm shadow-[0_24px_50px_-20px_rgba(26,26,26,0.3)]">
          {!query.trim() ? (
            <div className="p-2">
              <p className="px-2 pb-2 pt-1 text-sm font-semibold text-slate">Häufig gesucht</p>
              {frequentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                  className="focus-ring flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left hover:bg-paper"
                >
                  <span>{term}</span>
                  <Search size={14} strokeWidth={1.75} aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : results.length ? (
            <div className="p-1.5">
              {results.map(({ drink, brand }) => (
                <button
                  key={drink.id}
                  type="button"
                  onClick={() => {
                    trackEvent("header_search_select", { drink: drink.name });
                    openDrink(drinkPageHref(drink));
                  }}
                  className="focus-ring grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-paper"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{drink.name}</span>
                    <span className="block text-xs text-slate">{brand}</span>
                  </span>
                  <span className="text-right text-xs tabular-nums text-slate"><b className="block text-sm text-ink">{numberFormat.format(drink.sugarPer100Ml)} g</b>pro 100 ml</span>
                </button>
              ))}
              <button type="button" onClick={() => openSearchPage(query)} className="focus-ring w-full rounded-lg px-2.5 py-2.5 text-left text-slate hover:bg-paper">
                Alle Treffer für „{query}“
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => openSearchPage(query)} className="focus-ring w-full px-3 py-3 text-left hover:bg-paper">
              Suche nach „{query}“
            </button>
          )}
        </div>
      )}
    </div>
  );
}
