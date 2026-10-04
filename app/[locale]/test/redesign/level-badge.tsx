import { sugarLevelLabel, type SugarLevel } from "@/lib/sugar-context";
import styles from "./redesign.module.css";

const levelClass: Record<SugarLevel, string> = {
  free: styles.levelFree,
  low: styles.levelLow,
  sugared: styles.levelSugared,
};

export function LevelBadge({ level }: { level: SugarLevel }) {
  return <span className={`${styles.level} ${levelClass[level]}`}>{sugarLevelLabel[level]}</span>;
}
