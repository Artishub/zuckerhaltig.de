"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, LinkIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { brands } from "@/lib/data/brands";
import { categories, categoryById } from "@/lib/data/categories";
import { Drink, DrinkDisplayItem, drinks, groupedDrinkFamilies, packageEnergyKcal, sugarCubes, totalSugarGrams, uniqueProductRepresentatives } from "@/lib/data/drinks";

type SortKey = "total-desc" | "total-asc" | "per100-desc" | "per100-asc" | "name-asc" | "name-desc";

const sizes = [
  { label: "Alle Größen", value: "all" },
  { label: "bis 330 ml", value: "small" },
  { label: "331-500 ml", value: "medium" },
  { label: "über 500 ml", value: "large" },
];

function matchesSize(drink: Drink, size: string) {
  if (size === "small") return drink.sizeMl <= 330;
  if (size === "medium") return drink.sizeMl > 330 && drink.sizeMl <= 500;
  if (size === "large") return drink.sizeMl > 500;
  return true;
}

export function DrinkExplorer() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [size, setSize] = useState("all");
  const [maxPer100, setMaxPer100] = useState(12);
  const [maxTotal, setMaxTotal] = useState(110);
  const [sort, setSort] = useState<SortKey>("per100-desc");
  const [compactGroups, setCompactGroups] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [openId, setOpenId] = useState<string | null>(drinks[0]?.id ?? null);

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    const nextBrand = searchParams.get("brand") ?? "";
    const nextCategory = searchParams.get("category") ?? "";
    setQuery(nextQuery);
    setBrand("all");
    setCategory("all");
    if (brands.some((item) => item.id === nextBrand)) setBrand(nextBrand);
    if (categories.some((item) => item.id === nextCategory)) setCategory(nextCategory);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matching = drinks
      .filter((drink) => {
        const brandName = brands.find((item) => item.id === drink.brandId)?.name ?? "";
        const haystack = `${drink.name} ${brandName}`.toLowerCase();
        return (
          (!normalizedQuery || haystack.includes(normalizedQuery)) &&
          (brand === "all" || drink.brandId === brand) &&
          (category === "all" || drink.categoryId === category) &&
          matchesSize(drink, size) &&
          drink.sugarPer100Ml <= maxPer100 &&
          totalSugarGrams(drink) <= maxTotal
        );
      });

    const sortedItems = sort.startsWith("per100") ? uniqueProductRepresentatives(matching) : matching;

    return sortedItems.sort((a, b) => {
      if (sort === "per100-desc") return b.sugarPer100Ml - a.sugarPer100Ml;
      if (sort === "per100-asc") return a.sugarPer100Ml - b.sugarPer100Ml;
      if (sort === "name-asc") return a.name.localeCompare(b.name, "de");
      if (sort === "name-desc") return b.name.localeCompare(a.name, "de");
      if (sort === "total-asc") return totalSugarGrams(a) - totalSugarGrams(b);
      return totalSugarGrams(b) - totalSugarGrams(a);
    });
  }, [brand, category, maxPer100, maxTotal, query, size, sort]);

  const reset = () => {
    setQuery("");
    setBrand("all");
    setCategory("all");
    setSize("all");
    setMaxPer100(12);
    setMaxTotal(110);
    setSort("per100-desc");
    setPage(1);
    window.history.replaceState(null, "", window.location.pathname);
  };

  useEffect(() => {
    setPage(1);
  }, [brand, category, compactGroups, maxPer100, maxTotal, query, size, sort, pageSize]);

  const displayItems = useMemo(
    () => (compactGroups ? groupedDrinkFamilies(filtered) : filtered.map((drink) => ({ type: "drink", id: drink.id, drink }) as DrinkDisplayItem)),
    [compactGroups, filtered],
  );
  const showPagination = displayItems.length > 15;
  const pageCount = Math.max(1, Math.ceil(displayItems.length / pageSize));
  const visibleItems = showPagination ? displayItems.slice((page - 1) * pageSize, page * pageSize) : displayItems;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit border border-ash bg-paper lg:sticky lg:top-20">
        <div className="flex items-center justify-between border-b border-ash px-4 py-3">
          <h2 className="text-sm font-semibold">Filter</h2>
          <SlidersHorizontal size={16} />
        </div>
        <div className="space-y-4 p-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-slate">Suche</span>
            <div className="mt-2 flex h-10 items-center gap-2 rounded-md border border-marigold px-3">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name oder Marke"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>
          <Select label="Marke" value={brand} onChange={setBrand} options={[{ label: "Alle Marken", value: "all" }, ...brands.map((item) => ({ label: item.name, value: item.id }))]} />
          <Select label="Kategorie" value={category} onChange={setCategory} options={[{ label: "Alle Kategorien", value: "all" }, ...categories.map((item) => ({ label: item.name, value: item.id }))]} />
          <Select label="Gebinde" value={size} onChange={setSize} options={sizes} />
          <Select
            label="Varianten zusammenfassen"
            value={compactGroups ? "yes" : "no"}
            onChange={(value) => setCompactGroups(value === "yes")}
            options={[
              { label: "Nein", value: "no" },
              { label: "Ja", value: "yes" },
            ]}
          />
          <Range label="Max. Zucker pro 100 ml" value={maxPer100} max={12} step={0.5} unit="g" onChange={setMaxPer100} />
          <Range label="Max. Gesamtzucker" value={maxTotal} max={110} step={5} unit="g" onChange={setMaxTotal} />
          <button onClick={reset} className="focus-ring inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-ash text-sm hover:border-marigold">
            <X size={15} />
            Zurücksetzen
          </button>
        </div>
      </aside>

      <section>
        <div className="mb-4 flex flex-col gap-3 border-b border-ash pb-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate">
            <strong className="text-ink">{displayItems.length}</strong> {compactGroups ? "Einträge" : "Getränke"} gefunden
          </p>
          <div className="flex items-center gap-2">
            <Select
              label="Sortierung"
              compact
              value={sort}
              onChange={(value) => setSort(value as SortKey)}
              options={[
                { label: "pro 100 ml absteigend", value: "per100-desc" },
                { label: "pro 100 ml aufsteigend", value: "per100-asc" },
                { label: "Gesamtzucker absteigend", value: "total-desc" },
                { label: "Gesamtzucker aufsteigend", value: "total-asc" },
                { label: "Name A-Z", value: "name-asc" },
                { label: "Name Z-A", value: "name-desc" },
              ]}
            />
          </div>
        </div>
        <div className="space-y-3" aria-live="polite">
          {visibleItems.map((item, index) => {
            const drink = item.type === "drink" ? item.drink : item.representative;
            const brandName = brands.find((brandItem) => brandItem.id === drink.brandId)?.name ?? "";
            const categoryData = categoryById[drink.categoryId];
            const isOpen = openId === item.id;
            const title = item.type === "group" ? `${brandName} - Mehrere` : drink.name;
            const subtitle =
              item.type === "group"
                ? `${categoryData?.name ?? "Getränk"} · ${item.drinks.length} Produkte`
                : `${brandName} · ${drink.sizeMl} ml`;
            const per100 = item.type === "group" ? Math.max(...item.drinks.map((groupDrink) => groupDrink.sugarPer100Ml)) : drink.sugarPer100Ml;
            const total = item.type === "group" ? Math.max(...item.drinks.map(totalSugarGrams)) : totalSugarGrams(drink);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.12) }}
                className="border-b border-ash bg-mist"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="focus-ring grid w-full grid-cols-[1fr_auto_auto] gap-x-3 gap-y-2 p-3 text-left md:grid-cols-[1fr_120px_120px_36px] md:items-center md:p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: categoryData?.color ?? "#838383" }} />
                      <span className="text-xs font-medium uppercase tracking-wide text-slate">{categoryData?.name}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold leading-tight tracking-tight md:text-lg">{title}</h3>
                    <p className="mt-1 text-sm text-slate">{subtitle}</p>
                  </div>
                  <Metric label="pro 100 ml" value={`${formatNumber(per100)} g`} />
                  <Metric label="gesamt" value={`${formatNumber(total)} g`} strong />
                  <ChevronDown className={`col-start-3 justify-self-end self-end transition md:col-start-auto md:self-center ${isOpen ? "rotate-180" : ""}`} size={18} />
                </button>
                {isOpen && (
                  <div className="grid gap-4 border-t border-ash px-4 py-4 text-sm text-slate md:grid-cols-[1.4fr_0.8fr]">
                    <div>
                      {item.type === "group" && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {item.drinks.map((groupDrink) => (
                            <Link key={groupDrink.id} href={`/de/getraenke/${groupDrink.id}`} className="rounded-md border border-ash bg-paper px-2 py-1 text-xs text-slate hover:border-marigold hover:text-ink">
                              {groupDrink.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      <p className="leading-6">
                        {item.type === "group"
                          ? groupSentence(item.drinks, brandName, categoryData?.name ?? "Getränk")
                          : productSentence(drink, brandName, categoryData?.name ?? "Getränk")}
                      </p>
                    </div>
                    <div className="space-y-2 leading-6">
                      <p><span className="text-ink">{formatNumber(item.type === "group" ? Math.max(...item.drinks.map(sugarCubes)) : sugarCubes(drink))} Zuckerwürfel</span> bei 3 g pro Würfel.</p>
                      <p>{item.type === "group" ? `Spanne: ${formatNumber(Math.min(...item.drinks.map((groupDrink) => groupDrink.sugarPer100Ml)))} bis ${formatNumber(per100)} g Zucker pro 100 ml.` : `${formatNumber(drink.sugarPer100Ml)} g × ${drink.sizeMl} ml / 100 = ${formatNumber(totalSugarGrams(drink))} g Zucker`}</p>
                      <div className="mt-7 flex flex-col items-start gap-2">
                        <Link href={`/de/getraenke/${drink.id}`} className="focus-ring inline-flex h-10 items-center justify-center rounded-md border border-ink bg-ink px-4 text-sm font-medium text-white hover:bg-paper hover:text-ink dark:text-black dark:hover:text-ink">
                          Zur Detailseite
                        </Link>
                        {drink.sourceUrl ? (
                          <a href={drink.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-ink underline decoration-ash underline-offset-4 hover:decoration-marigold">
                            <LinkIcon size={14} />
                            Quelle öffnen
                          </a>
                        ) : (
                          <p className="text-sm text-slate">{drink.source}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
        {showPagination && (
          <div className="mt-5 flex flex-col gap-3 border-t border-ash pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Select
              label="Pro Seite"
              compact
              value={String(pageSize)}
              onChange={(value) => setPageSize(Number(value))}
              options={[
                { label: "15", value: "15" },
                { label: "30", value: "30" },
                { label: "60", value: "60" },
              ]}
            />
            <div className="flex items-center gap-3 text-sm text-slate">
              <button
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={page === 1}
                className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-ash px-3 disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Zurück
              </button>
              <span>
                Seite {page} von {pageCount}
              </span>
              <button
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                disabled={page === pageCount}
                className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-ash px-3 disabled:opacity-40"
              >
                Weiter
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function productSentence(drink: Drink, brandName: string, categoryName: string) {
  const energy = packageEnergyKcal(drink);
  const checked = drink.lastCheckedAt ? ` zuletzt geprüft am ${formatDate(drink.lastCheckedAt)}` : "";
  const energyPart = energy === null ? "" : ` und rechnerisch etwa ${formatNumber(energy)} kcal`;

  return `${drink.name} von ${brandName} ist ein Getränk aus der Kategorie ${categoryName} im ${drink.sizeMl}-ml-Gebinde. Laut hinterlegter Quelle enthält es ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml; daraus ergeben sich ${formatNumber(totalSugarGrams(drink))} g Zucker pro Packung${energyPart}. Die Angabe basiert auf „${drink.source}“${checked}. ${drink.note}`;
}

function groupSentence(groupDrinks: Drink[], brandName: string, categoryName: string) {
  const minSugar = Math.min(...groupDrinks.map((drink) => drink.sugarPer100Ml));
  const maxSugar = Math.max(...groupDrinks.map((drink) => drink.sugarPer100Ml));
  const sizes = Array.from(new Set(groupDrinks.map((drink) => `${drink.sizeMl} ml`))).join(", ");
  const products = groupDrinks.length;

  return `${brandName} - Mehrere fasst ${products} Produkte aus der Kategorie ${categoryName} zusammen. Die hinterlegten Varianten liegen zwischen ${formatNumber(minSugar)} und ${formatNumber(maxSugar)} g Zucker pro 100 ml; gespeicherte Gebinde in dieser Gruppe sind ${sizes}. Öffne die einzelnen Varianten über die Suche oder deaktiviere die Zusammenfassung, wenn du Packungsgrößen und Produktdetails separat vergleichen möchtest.`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE").format(new Date(value));
}

function Select({
  label,
  value,
  options,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <label className={compact ? "flex items-center gap-2" : "block"}>
      <span className={compact ? "text-sm text-slate" : "text-xs font-medium uppercase tracking-wide text-slate"}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 h-10 w-full rounded-md border border-ash bg-paper px-3 text-sm outline-none hover:border-smoke">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function Range({ label, value, max, step, unit, onChange }: { label: string; value: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs font-medium uppercase tracking-wide text-slate">
        {label}
        <span>{value} {unit}</span>
      </span>
      <input type="range" min="0" max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 w-full accent-marigold" />
    </label>
  );
}

function Metric({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="text-right">
      <p className="text-xs uppercase tracking-wide text-slate">{label}</p>
      <p className={`mt-1 tabular-nums ${strong ? "text-lg font-semibold md:text-xl" : "font-medium"}`}>{value}</p>
    </div>
  );
}
