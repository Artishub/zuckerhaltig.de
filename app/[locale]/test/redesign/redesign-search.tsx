"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { DrinkSummary } from "./data";
import { LevelBadge } from "./level-badge";
import styles from "./redesign.module.css";

const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function RedesignSearch({ items }: { items: DrinkSummary[] }) {
  const [query, setQuery] = useState("");
  const index = useMemo(() => items.map((item) => ({ item, haystack: normalize(`${item.brand} ${item.name} ${item.category}`) })), [items]);

  const results = useMemo(() => {
    const terms = normalize(query).split(" ").filter(Boolean);
    if (!terms.length) return [];
    return index
      .filter(({ haystack }) => terms.every((term) => haystack.includes(term)))
      .slice(0, 8)
      .map(({ item }) => item);
  }, [index, query]);

  return (
    <div className={styles.search}>
      <label className={styles.searchField}>
        <Search size={20} aria-hidden="true" />
        <span className="sr-only">Getränk suchen</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Getränk oder Marke, z. B. Spezi"
          autoComplete="off"
        />
      </label>
      {query.trim() && (
        <ul className={styles.searchResults} aria-live="polite">
          {results.length === 0 && <li className={styles.searchEmpty}>Kein Getränk gefunden.</li>}
          {results.map((item) => (
            <li key={item.id}>
              <Link href={item.href}>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.brand} · {item.sizeMl ? `${item.sizeMl} ml` : "Größe offen"}</small>
                </span>
                <span className={styles.searchValue}>
                  <strong>{numberFormat.format(item.per100)} g</strong>
                  <small>pro 100 ml</small>
                </span>
                <LevelBadge level={item.level} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
