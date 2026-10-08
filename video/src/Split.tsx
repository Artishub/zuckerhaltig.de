import { interpolate, useCurrentFrame, Easing } from "remotion";
import type { Range } from "./common";
import { format, latestCheck, loadDrink, type DrinkRef, type VideoDrink } from "./data";
import { LightFrame, Logo, Mark, Pill, Safe, Scene, cardShadow, rise, tone, useIn } from "./light";

// Two drinks side by side, pro 100 ml: guess, two columns fill, one sentence with the result.
// `note` is an optional fact sentence without numbers; every number comes from the data.
export type SplitProps = { a: DrinkRef; b: DrinkRef; note?: string; ask?: string };

export const splitDuration = 705;

const scene: Record<"hook" | "fill" | "result" | "outro", Range> = {
  hook: [0, 165],
  fill: [165, 345],
  result: [345, 525],
  outro: [525, 705],
};

export function Split({ a: refA, b: refB, note, ask = "Was trinkst du lieber?" }: SplitProps) {
  const a = loadDrink(refA);
  const b = loadDrink(refB);
  return (
    <LightFrame>
      <Scene range={scene.hook}><Hook a={a} b={b} /></Scene>
      <Scene range={scene.fill}><Columns a={a} b={b} /></Scene>
      <Scene range={scene.result}><Result a={a} b={b} note={note} /></Scene>
      <Scene range={scene.outro}><Outro items={[a, b]} ask={ask} /></Scene>
    </LightFrame>
  );
}

function Hook({ a, b }: { a: VideoDrink; b: VideoDrink }) {
  const frame = useCurrentFrame();
  const pill = useIn(4);
  const title = useIn(12, 30);
  const sub = useIn(70);
  const timer = interpolate(frame, [80, 158], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Safe>
      <Pill value={pill}>Rate mal</Pill>
      <div style={{ marginTop: 44, fontSize: 112, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02, ...rise(title) }}>
        Was hat mehr <Mark>Zucker?</Mark>
      </div>
      <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        <Choice letter="A" label={a.label} delay={40} />
        <Choice letter="B" label={b.label} delay={54} />
      </div>
      <div style={{ marginTop: 40, fontSize: 48, fontWeight: 600, color: tone.muted, ...rise(sub, 20) }}>Jeweils 100 ml</div>
      <div style={{ marginTop: 40, height: 10, borderRadius: 999, background: tone.line, overflow: "hidden", opacity: useIn(70) }}>
        <div style={{ width: `${timer * 100}%`, height: "100%", borderRadius: 999, background: tone.moss }} />
      </div>
    </Safe>
  );
}

function Choice({ letter, label, delay }: { letter: string; label: string; delay: number }) {
  const show = useIn(delay);
  return (
    <div style={{ padding: "40px 34px 46px", borderRadius: 34, background: tone.card, border: `2px solid ${tone.line}`, boxShadow: cardShadow, ...rise(show, 28) }}>
      <span style={{ display: "grid", placeItems: "center", width: 76, height: 76, borderRadius: 999, background: tone.paper, fontSize: 40, fontWeight: 800, color: tone.moss }}>{letter}</span>
      <div style={{ marginTop: 34, fontSize: label.length > 8 ? 64 : 80, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1 }}>{label}</div>
    </div>
  );
}

const COLUMN_HEIGHT = 900;

// The larger value fills 80 % of its column; the other one in proportion.
function Columns({ a, b }: { a: VideoDrink; b: VideoDrink }) {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [26, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const kicker = useIn(4);
  const max = Math.max(a.per100, b.per100);
  return (
    <Safe>
      <Pill value={kicker}>Zucker pro 100 ml</Pill>
      <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {[a, b].map((item) => (
          <Column key={item.drink.id} item={item} share={(item.per100 / max) * 0.8} grow={grow} winner={item.per100 === max && a.per100 !== b.per100} />
        ))}
      </div>
    </Safe>
  );
}

function Column({ item, share, grow, winner }: { item: VideoDrink; share: number; grow: number; winner: boolean }) {
  const done = grow > 0.98;
  return (
    <div>
      <div style={{ position: "relative", height: COLUMN_HEIGHT, borderRadius: 40, background: tone.card, border: `2px solid ${tone.line}`, boxShadow: cardShadow, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${share * grow * 100}%`, background: tone.lime, borderTop: `6px solid ${tone.moss}` }} />
        <div style={{ position: "absolute", left: 30, right: 30, top: 34, fontSize: 104, fontWeight: 800, letterSpacing: "-0.055em" }}>{format(item.per100 * grow)}&nbsp;g</div>
      </div>
      <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14, fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em" }}>
        {item.label}
        {winner && <span style={{ padding: "6px 18px", borderRadius: 999, background: tone.moss, color: tone.lime, fontSize: 32, fontWeight: 700, opacity: done ? 1 : 0 }}>mehr</span>}
      </div>
    </div>
  );
}

// Headline follows from the numbers: tie, close call or clear win.
function Result({ a, b, note }: { a: VideoDrink; b: VideoDrink; note?: string }) {
  const title = useIn(4, 30);
  const sub = useIn(34);
  const card = useIn(70);
  const [more, less] = a.per100 >= b.per100 ? [a, b] : [b, a];
  const tie = Math.abs(a.per100 - b.per100) < 0.05;
  const share = Math.round((less.per100 / more.per100) * 100);
  const close = share >= 75;
  return (
    <Safe>
      <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.02, ...rise(title) }}>
        {tie ? <>Gleich viel <Mark>Zucker.</Mark></> : close ? <>{more.label} liegt vorn. <Mark>Aber knapp.</Mark></> : <><Mark>{more.label}</Mark> liegt klar vorn.</>}
      </div>
      {!tie && (
        <div style={{ marginTop: 50, fontSize: 60, fontWeight: 600, lineHeight: 1.3, ...rise(sub) }}>
          {less.label} hat {share}&nbsp;% vom Zucker {close ? "der" : "von"} {more.label}.
        </div>
      )}
      {note && (
        <div style={{ marginTop: 70, padding: "36px 40px", borderRadius: 32, background: tone.card, border: `2px solid ${tone.line}`, boxShadow: cardShadow, fontSize: 46, lineHeight: 1.35, fontWeight: 500, ...rise(card, 28) }}>{note}</div>
      )}
    </Safe>
  );
}

function Outro({ items, ask }: { items: VideoDrink[]; ask: string }) {
  const question = useIn(4, 30);
  const sub = useIn(26);
  const brand = useIn(44);
  const checked = latestCheck(items.map((item) => item.drink));
  const sources = Array.from(new Set(items.map((item) => item.drink.source)));
  return (
    <Safe>
      <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.02, ...rise(question) }}>Hättest du’s <Mark>gedacht?</Mark></div>
      <div style={{ marginTop: 44, fontSize: 60, fontWeight: 600, color: tone.muted, ...rise(sub) }}>{ask} Schreib’s in die Kommentare.</div>
      <div style={{ marginTop: 180, ...rise(brand, 20) }}>
        <Logo size={70} />
        <div style={{ marginTop: 26, fontSize: 32, color: tone.muted, lineHeight: 1.4 }}>Quellen: {sources.join("; ")}{checked ? `, Stand ${checked}` : ""}</div>
      </div>
    </Safe>
  );
}
