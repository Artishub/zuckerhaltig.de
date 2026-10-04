"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { DrinkSummary } from "./data";
import { LevelBadge } from "./level-badge";
import styles from "./redesign.module.css";

type SortKey = "per100" | "total" | "name";

const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

export function CategoryTable({ items, max }: { items: DrinkSummary[]; max: number }) {
  const [sort, setSort] = useState<SortKey>("per100");
  const [descending, setDescending] = useState(true);

  const sorted = useMemo(() => {
    const direction = descending ? -1 : 1;
    return [...items].sort((a, b) => {
      if (sort === "name") return direction * a.name.localeCompare(b.name, "de");
      const left = sort === "per100" ? a.per100 : a.total ?? -1;
      const right = sort === "per100" ? b.per100 : b.total ?? -1;
      return direction * (left - right) || a.name.localeCompare(b.name, "de");
    });
  }, [items, sort, descending]);

  function toggle(key: SortKey) {
    if (key === sort) setDescending((value) => !value);
    else {
      setSort(key);
      setDescending(key !== "name");
    }
  }

  function header(key: SortKey, label: string, numeric = false) {
    const active = sort === key;
    return (
      <th scope="col" className={numeric ? styles.num : undefined} aria-sort={active ? (descending ? "descending" : "ascending") : "none"}>
        <button type="button" className={styles.sortButton} onClick={() => toggle(key)}>
          {label}
          {active && (descending ? <ArrowDown size={13} /> : <ArrowUp size={13} />)}
        </button>
      </th>
    );
  }

  return (
    <div className={`${styles.card} ${styles.tableWrap}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {header("name", "Getränk")}
            {header("per100", "pro 100 ml", true)}
            <th scope="col" className={styles.barCol}><span className="sr-only">Balken</span></th>
            {header("total", "pro Packung", true)}
            <th scope="col">Einordnung</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr key={item.id}>
              <th scope="row">
                <Link href={item.href} className={styles.tableName}>
                  <strong>{item.name}</strong>
                  <small>{item.brand} · {item.sizeMl ? `${item.sizeMl} ml` : "Größe offen"}</small>
                </Link>
              </th>
              <td className={styles.num}>{numberFormat.format(item.per100)} g</td>
              <td className={styles.barCol} aria-hidden="true">
                <span className={styles.inlineBar}><i style={{ width: `${(item.per100 / max) * 100}%` }} /></span>
              </td>
              <td className={styles.num}>{item.total === null ? "/" : `${numberFormat.format(item.total)} g`}</td>
              <td><LevelBadge level={item.level} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
