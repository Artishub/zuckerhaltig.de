import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import type { Range } from "./common";
import { dailySugarGrams, format, latestCheck, loadDrink, sizeLabel, type DrinkRef, type VideoDrink } from "./data";
import { LightFrame, Logo, Mark, Pill, Safe, Scene, cardShadow, rise, tone, useIn } from "./light";

// One drink, one statement: guess the grams, see 100 ml fill the screen, then the whole package against the 50 g day limit.
export type FillProps = { drink: DrinkRef; answer?: 0 | 1 | 2 };

export const fillDuration = 705;

const scene: Record<"hook" | "per100" | "pack" | "outro", Range> = {
  hook: [0, 165],
  per100: [165, 330],
  pack: [330, 525],
  outro: [525, 705],
};

const letters = ["A", "B", "C"];

// Two wrong answers at half and three quarters of the real value; the real one sits at `answer`.
export function guessOptions(total: number, answer: number) {
  const wrong = [Math.round(total * 0.5), Math.round(total * 0.75)];
  const options = [...wrong];
  options.splice(answer, 0, Math.round(total));
  return options;
}

export function Fill({ drink: ref, answer = 2 }: FillProps) {
  const item = loadDrink(ref);
  const options = guessOptions(item.total, answer);
  return (
    <LightFrame>
      <Scene range={scene.hook}><Hook item={item} options={options} /></Scene>
      <Scene range={scene.per100}><Per100 item={item} /></Scene>
      <Scene range={scene.pack}><Pack item={item} letter={letters[answer]} /></Scene>
      <Scene range={scene.outro}><Outro item={item} /></Scene>
    </LightFrame>
  );
}

const nbsp = (text: string) => text.replace(/(\d) (g|ml|l)\b/g, "$1 $2");

function Hook({ item, options }: { item: VideoDrink; options: number[] }) {
  const frame = useCurrentFrame();
  const pill = useIn(4);
  const title = useIn(12, 30);
  const timer = interpolate(frame, [80, 158], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Safe>
      <Pill value={pill}>Rate mal</Pill>
      <div style={{ marginTop: 44, fontSize: 104, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.04, ...rise(title) }}>
        Wie viel <Mark>Zucker</Mark> steckt in {nbsp(`${sizeLabel(item.sizeMl)}`)} {item.label}?
      </div>
      <div style={{ marginTop: 70, display: "grid", gap: 26 }}>
        {options.map((grams, index) => <Option key={index} letter={letters[index]} text={`${grams} g`} delay={44 + index * 12} />)}
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

// The lime area is 100 ml; it rises to the sugar share of it.
function Per100({ item }: { item: VideoDrink }) {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [20, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const kicker = useIn(6);
  const after = useIn(100);
  const share = item.per100 / 100;
  return (
    <>
      <FillArea height={share * grow} label={`${format(item.per100 * grow)} g`} />
      <Safe>
        <Pill value={kicker}>In 100 ml {item.label}</Pill>
        <div style={{ marginTop: 40, fontSize: 260, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.95 }}>{format(item.per100 * grow)}&nbsp;g</div>
        <div style={{ marginTop: 16, fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em" }}>Zucker</div>
        <div style={{ marginTop: 90, fontSize: 64, fontWeight: 600, color: tone.muted, ...rise(after) }}>Klingt wenig? Warte.</div>
      </Safe>
    </>
  );
}

// Full lime screen means 50 g, the day limit; the package fills towards and past that line.
const LIMIT_HEIGHT = 0.8;

function Pack({ item, letter }: { item: VideoDrink; letter: string }) {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [24, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const grams = item.total * grow;
  const kicker = useIn(4);
  const over = item.total > dailySugarGrams;
  const answer = useIn(130);
  const share = Math.round((item.total / dailySugarGrams) * 100);
  return (
    <>
      <FillArea height={Math.min(1, (grams / dailySugarGrams) * LIMIT_HEIGHT)} />
      <LimitLine reached={grams >= dailySugarGrams} />
      <Safe>
        <Pill value={kicker}>{nbsp(`In ${sizeLabel(item.sizeMl)} ${item.label}`)}</Pill>
        <div style={{ marginTop: 40, fontSize: 260, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.95 }}>{format(Math.round(grams))}&nbsp;g</div>
        <div style={{ marginTop: 16, fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em" }}>Zucker</div>
        <div style={{ marginTop: 80, display: "flex", flexWrap: "wrap", gap: 20, ...rise(answer) }}>
          <Chip strong>Antwort {letter}</Chip>
          <Chip>{over ? `${share} % der Tagesgrenze` : `${share} % von 50 g`}</Chip>
          <Chip>≈ {format(Math.round(item.cubes))} Zuckerwürfel</Chip>
        </div>
      </Safe>
    </>
  );
}

function Chip({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span style={{ padding: "18px 30px", borderRadius: 999, background: strong ? tone.moss : tone.card, color: strong ? tone.lime : tone.ink, fontSize: 44, fontWeight: 700, boxShadow: cardShadow }}>{children}</span>
  );
}

function FillArea({ height, label }: { height: number; label?: string }) {
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <div style={{ position: "relative", height: `${height * 100}%`, background: tone.lime, borderTop: `6px solid ${tone.moss}` }}>
        {label && height > 0.01 && (
          <span style={{ position: "absolute", right: 150, top: -78, fontSize: 44, fontWeight: 700, color: tone.moss }}>{label}</span>
        )}
      </div>
    </AbsoluteFill>
  );
}

function LimitLine({ reached }: { reached: boolean }) {
  const show = useIn(10);
  const top = `${(1 - LIMIT_HEIGHT) * 100}%`;
  return (
    <AbsoluteFill style={{ opacity: show }}>
      <div style={{ position: "absolute", left: 0, right: 0, top, borderTop: `5px dashed ${tone.moss}` }} />
      <div style={{ position: "absolute", left: 84, top: `calc(${top} - 74px)`, fontSize: 38, fontWeight: 700, color: tone.moss, padding: "8px 20px", borderRadius: 999, background: reached ? tone.card : "transparent" }}>
        {dailySugarGrams}&nbsp;g · Tagesgrenze laut WHO
      </div>
    </AbsoluteFill>
  );
}

function Outro({ item }: { item: VideoDrink }) {
  const question = useIn(4, 30);
  const sub = useIn(26);
  const brand = useIn(44);
  const checked = latestCheck([item.drink]);
  return (
    <Safe>
      <div>
        <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.02, ...rise(question) }}>Hättest du’s <Mark>gewusst?</Mark></div>
        <div style={{ marginTop: 44, fontSize: 60, fontWeight: 600, color: tone.muted, ...rise(sub) }}>Schreib deinen Tipp in die Kommentare.</div>
      </div>
      <div style={{ marginTop: 180, ...rise(brand, 20) }}>
        <Logo size={70} />
        <div style={{ marginTop: 26, fontSize: 32, color: tone.muted, lineHeight: 1.4 }}>Quelle: {item.drink.source}{checked ? `, Stand ${checked}` : ""}</div>
      </div>
    </Safe>
  );
}
