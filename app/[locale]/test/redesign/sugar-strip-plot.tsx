"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { DrinkSummary } from "./data";
import styles from "./redesign.module.css";

export type StripRow = {
  id: string;
  name: string;
  average: number | null;
  items: DrinkSummary[];
};

type Hover = { item: DrinkSummary; x: number; y: number };

const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

// Deterministic vertical offset so drinks with equal values do not sit on top of each other.
function jitter(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return ((Math.abs(hash) % 17) - 8);
}

export function SugarStripPlot({ rows, max, freeMax, lowMax }: { rows: StripRow[]; max: number; freeMax: number; lowMax: number }) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Hover | null>(null);
  const ticks = Array.from({ length: Math.floor(max / 2) + 1 }, (_, index) => index * 2);
  const pct = (value: number) => `${Math.min(value / max, 1) * 100}%`;

  function show(item: DrinkSummary, target: HTMLElement) {
    const plot = plotRef.current?.getBoundingClientRect();
    const mark = target.getBoundingClientRect();
    if (!plot) return;
    setHover({ item, x: mark.left + mark.width / 2 - plot.left, y: mark.top - plot.top });
  }

  return (
    <div className={styles.strip} ref={plotRef} onPointerLeave={() => setHover(null)}>
      <div className={styles.stripLegend} aria-hidden="true">
        <span><i className={styles.legendDot} /> ein Getränk</span>
        <span><i className={styles.legendTick} /> Ø der Kategorie</span>
        <span><i className={styles.legendFree} /> zuckerfrei (bis {numberFormat.format(freeMax)} g)</span>
        <span><i className={styles.legendLow} /> zuckerarm (bis {numberFormat.format(lowMax)} g)</span>
      </div>
      {rows.map((row) => (
        <div key={row.id} className={styles.stripRow}>
          <p className={styles.stripLabel}>{row.name} <span>{row.items.length}</span></p>
          <div className={styles.stripTrack}>
            <span className={styles.bandFree} style={{ width: pct(freeMax) }} />
            <span className={styles.bandLow} style={{ left: pct(freeMax), width: `calc(${pct(lowMax)} - ${pct(freeMax)})` }} />
            {row.average !== null && <span className={styles.stripAverage} style={{ left: pct(row.average) }} />}
            {row.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={styles.stripDot}
                style={{ left: pct(item.per100), top: `calc(50% + ${jitter(item.id)}px)` }}
                aria-label={`${item.name}: ${numberFormat.format(item.per100)} g Zucker pro 100 ml`}
                onPointerEnter={(event) => show(item, event.currentTarget)}
                onFocus={(event) => show(item, event.currentTarget)}
                onBlur={() => setHover(null)}
              />
            ))}
          </div>
        </div>
      ))}
      <div className={styles.stripAxis} aria-hidden="true">
        <span />
        <div>
          {ticks.map((tick) => <span key={tick} style={{ left: pct(tick) }}>{tick} g</span>)}
        </div>
      </div>
      {hover && (
        <div className={styles.stripTooltip} style={{ left: hover.x, top: hover.y }} role="status">
          <strong>{numberFormat.format(hover.item.per100)} g / 100 ml</strong>
          <span>{hover.item.name}</span>
          <small>{hover.item.brand}{hover.item.total !== null ? ` · ${numberFormat.format(hover.item.total)} g in ${hover.item.sizeMl} ml` : ""}</small>
        </div>
      )}
    </div>
  );
}
