import { interpolate, useCurrentFrame, Easing } from "remotion";
import type { Range } from "./common";
import { format, loadDrink, sizeLabel, type DrinkRef, type VideoDrink } from "./data";
import { LightFrame, Logo, Mark, Pill, Safe, Scene, cardShadow, rise, tone, useIn } from "./light";
import { formatCents, sugarTax, sugarTaxCentsPerLiter, sugarTaxPerPackageCents } from "@/lib/sugar-tax";

// Planned sugar tax on one drink: guess the cents, see the tiers, get the amount per package.
export type TaxProps = { drink: DrinkRef; ask?: string };

export const taxDuration = 705;

const scene: Record<"hook" | "tiers" | "result" | "outro", Range> = {
  hook: [0, 165],
  tiers: [165, 345],
  result: [345, 525],
  outro: [525, 705],
};

const letters = ["A", "B", "C"];
const nbsp = (text: string) => text.replace(/(\d) (g|ml|l|ct)\b/g, "$1 $2");
const startLabel = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(sugarTax.startDate));

// Wrong answers: half the amount and the per-litre rate, a common mix-up.
export function taxOptions(item: VideoDrink) {
  const cents = sugarTaxPerPackageCents(item.per100, item.sizeMl);
  const rate = sugarTaxCentsPerLiter(item.per100);
  return { answer: 1, options: [Math.round(cents / 2), cents, rate] };
}

export function Tax({ drink: ref, ask = "Würdest du deshalb weniger kaufen?" }: TaxProps) {
  const item = loadDrink(ref);
  if (sugarTaxCentsPerLiter(item.per100) === 0) throw new Error(`${ref.id} liegt unter der Steuergrenze`);
  const { answer, options } = taxOptions(item);
  return (
    <LightFrame>
      <Scene range={scene.hook}><Hook item={item} options={options} /></Scene>
      <Scene range={scene.tiers}><Tiers item={item} /></Scene>
      <Scene range={scene.result}><Result item={item} letter={letters[answer]} /></Scene>
      <Scene range={scene.outro}><Outro ask={ask} /></Scene>
    </LightFrame>
  );
}

function Hook({ item, options }: { item: VideoDrink; options: number[] }) {
  const frame = useCurrentFrame();
  const pill = useIn(4);
  const title = useIn(12, 30);
  const timer = interpolate(frame, [80, 158], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Safe>
      <Pill value={pill}>Rate mal</Pill>
      <div style={{ marginTop: 44, fontSize: 100, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.04, ...rise(title) }}>
        Wie viel <Mark>Zuckersteuer</Mark> käme auf {nbsp(`${sizeLabel(item.sizeMl)} ${item.label}`)}?
      </div>
      <div style={{ marginTop: 70, display: "grid", gap: 26 }}>
        {options.map((cents, index) => <Option key={index} letter={letters[index]} text={formatCents(cents)} delay={44 + index * 12} />)}
      </div>
      <div style={{ marginTop: 50, height: 10, borderRadius: 999, background: tone.line, overflow: "hidden", opacity: useIn(70) }}>
        <div style={{ width: `${timer * 100}%`, height: "100%", borderRadius: 999, background: tone.moss }} />
      </div>
    </Safe>
  );
}

function Option({ letter, text, delay }: { letter: string; text: string; delay: number }) {
  const show = useIn(delay);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 34, padding: "26px 34px", borderRadius: 30, background: tone.card, border: `2px solid ${tone.line}`, boxShadow: cardShadow, ...rise(show, 28) }}>
      <span style={{ display: "grid", placeItems: "center", width: 76, height: 76, borderRadius: 999, background: tone.paper, fontSize: 40, fontWeight: 800, color: tone.moss }}>{letter}</span>
      <span style={{ fontSize: 66, fontWeight: 800, letterSpacing: "-0.04em" }}>{text}</span>
    </div>
  );
}

// Three tier rows; the drink's row lights up after a marker shows its sugar value.
function Tiers({ item }: { item: VideoDrink }) {
  const pill = useIn(4);
  const title = useIn(10, 30);
  const mark = useIn(100);
  const [high, low] = sugarTax.tiers;
  const rows = [
    { label: `unter ${low.minPer100Ml} g`, rate: 0 },
    { label: `ab ${low.minPer100Ml} g`, rate: low.centsPerLiter },
    { label: `ab ${high.minPer100Ml} g`, rate: high.centsPerLiter },
  ];
  const active = sugarTaxCentsPerLiter(item.per100);
  return (
    <Safe>
      <Pill value={pill}>Geplant ab {startLabel}</Pill>
      <div style={{ marginTop: 40, fontSize: 92, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.04, ...rise(title) }}>Zucker pro 100 ml entscheidet</div>
      <div style={{ marginTop: 60, display: "grid", gap: 22 }}>
        {rows.map((row, index) => <TierRow key={row.label} {...row} delay={40 + index * 14} on={row.rate === active ? mark : 0} />)}
      </div>
      <div style={{ marginTop: 50, fontSize: 56, fontWeight: 700, ...rise(mark, 20) }}>{item.label}: {nbsp(`${format(item.per100)} g`)}</div>
    </Safe>
  );
}

function TierRow({ label, rate, delay, on }: { label: string; rate: number; delay: number; on: number }) {
  const show = useIn(delay);
  const lit = on > 0.5;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "30px 36px", borderRadius: 30, background: lit ? tone.lime : tone.card, border: `2px solid ${lit ? tone.moss : tone.line}`, boxShadow: cardShadow, ...rise(show, 28) }}>
      <span style={{ fontSize: 52, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em" }}>{rate}&nbsp;ct<span style={{ fontSize: 36, fontWeight: 600, color: tone.muted }}> / l</span></span>
    </div>
  );
}

function Result({ item, letter }: { item: VideoDrink; letter: string }) {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [20, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const pill = useIn(4);
  const chips = useIn(100);
  const cents = sugarTaxPerPackageCents(item.per100, item.sizeMl);
  return (
    <Safe>
      <Pill value={pill}>{nbsp(`Auf ${sizeLabel(item.sizeMl)} ${item.label}`)}</Pill>
      <div style={{ marginTop: 40, fontSize: 280, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.95 }}>{format(Math.round(cents * count * 10) / 10)}&nbsp;ct</div>
      <div style={{ marginTop: 16, fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em" }}>Zuckersteuer</div>
      <div style={{ marginTop: 80, display: "flex", flexWrap: "wrap", gap: 20, ...rise(chips) }}>
        <Chip strong>Antwort {letter}</Chip>
        <Chip>{sugarTaxCentsPerLiter(item.per100)} ct pro Liter</Chip>
        <Chip>noch kein Gesetz</Chip>
      </div>
    </Safe>
  );
}

function Chip({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return <span style={{ padding: "18px 30px", borderRadius: 999, background: strong ? tone.moss : tone.card, color: strong ? tone.lime : tone.ink, fontSize: 44, fontWeight: 700, boxShadow: cardShadow }}>{children}</span>;
}

function Outro({ ask }: { ask: string }) {
  const question = useIn(4, 30);
  const sub = useIn(26);
  const brand = useIn(44);
  const status = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(sugarTax.statusDate));
  return (
    <Safe>
      <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.04, ...rise(question) }}>{ask.replace(/ (\S+)\?$/, " ")}<Mark>{ask.match(/(\S+\?)$/)?.[1]}</Mark></div>
      <div style={{ marginTop: 44, fontSize: 60, fontWeight: 600, color: tone.muted, ...rise(sub) }}>Schreib’s in die Kommentare.</div>
      <div style={{ marginTop: 160, ...rise(brand, 20) }}>
        <Logo size={70} />
        <div style={{ marginTop: 26, fontSize: 34, color: tone.muted, lineHeight: 1.4 }}>Rechner für jedes Getränk: zuckerhaltig.de/de/zuckersteuer</div>
        <div style={{ marginTop: 8, fontSize: 30, color: tone.muted, lineHeight: 1.4 }}>Stand {status}: Einigung der Koalition, Gesetz noch nicht beschlossen.</div>
      </div>
    </Safe>
  );
}
