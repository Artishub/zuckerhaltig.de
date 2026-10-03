import { formatNumber } from "./data";
import styles from "./redesign.module.css";

// Single-drink scale: where does this drink sit between 0 g and the highest value in the database?
export function SugarScale({ value, average, categoryName, max, freeMax, lowMax }: {
  value: number;
  average: number | null;
  categoryName: string;
  max: number;
  freeMax: number;
  lowMax: number;
}) {
  const pct = (input: number) => `${Math.min(input / max, 1) * 100}%`;
  const ticks = Array.from({ length: Math.floor(max / 2) + 1 }, (_, index) => index * 2);

  return (
    <figure className={styles.scale}>
      <figcaption className="sr-only">
        {formatNumber(value)} g Zucker pro 100 ml{average !== null ? `, Durchschnitt ${categoryName}: ${formatNumber(average)} g` : ""}.
      </figcaption>
      <div className={styles.scaleTrack} aria-hidden="true">
        <span className={styles.bandFree} style={{ width: pct(freeMax) }} />
        <span className={styles.bandLow} style={{ left: pct(freeMax), width: `calc(${pct(lowMax)} - ${pct(freeMax)})` }} />
        <span className={styles.scaleFill} style={{ width: pct(value) }} />
        {average !== null && (
          <span className={styles.scaleAverage} style={{ left: pct(average) }} />
        )}
        <span className={styles.scaleMarker} style={{ left: pct(value) }}>
          <em>{formatNumber(value)} g</em>
        </span>
      </div>
      <div className={styles.scaleAxis} aria-hidden="true">
        {ticks.map((tick) => <span key={tick} style={{ left: pct(tick) }}>{tick}</span>)}
      </div>
      <p className={styles.scaleNote}>
        Zucker pro 100 ml.{average !== null ? ` Dünner Strich: Ø ${categoryName} (${formatNumber(average)} g).` : ""} Hell hinterlegt: zuckerfrei bis {formatNumber(freeMax)} g und zuckerarm bis {formatNumber(lowMax)} g nach EU-Regeln für Getränke.
      </p>
    </figure>
  );
}
