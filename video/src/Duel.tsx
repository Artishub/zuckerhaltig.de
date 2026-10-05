import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Frame, Guess, Kicker, Note, Outro, Part, Stage, Title, CubePile, color, useSpring, type Range } from "./common";
import { dailySugarGrams, format, loadDrink, packageWord, sizeLabel, type DrinkRef, type VideoDrink } from "./data";

export type DuelProps = { a: DrinkRef; b: DrinkRef; question?: string };

// Timeline in frames (30 fps, 30 s). Every text stays at least 3 s on screen.
const scene: Record<"hook" | "guess" | "per100" | "pack" | "reveal" | "outro", Range> = {
  hook: [0, 105],
  guess: [105, 210],
  per100: [210, 390],
  pack: [390, 660],
  reveal: [660, 825],
  outro: [825, 900],
};

export function Duel({ a: refA, b: refB, question = "Wo steckt mehr Zucker?" }: DuelProps) {
  const a = loadDrink(refA);
  const b = loadDrink(refB);
  return (
    <Frame>
      <Part range={scene.hook}><Hook a={a} b={b} question={question} /></Part>
      <Part range={scene.guess}><Guess /></Part>
      <Part range={scene.per100}><Per100 items={[a, b]} /></Part>
      <Part range={scene.pack}><Pack a={a} b={b} /></Part>
      <Part range={scene.reveal}><Reveal a={a} b={b} /></Part>
      <Part range={scene.outro}><Outro drinks={[a, b]} /></Part>
    </Frame>
  );
}

function Hook({ a, b, question }: { a: VideoDrink; b: VideoDrink; question: string }) {
  const left = useSpring(6);
  const right = useSpring(20);
  const sub = useSpring(42);
  const size = Math.max(a.label.length, b.label.length) > 9 ? 120 : 150;
  return (
    <Stage>
      <div style={{ fontSize: size, fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.05em" }}>
        <div style={{ transform: `translateX(${(1 - left) * -700}px)` }}>{a.label}</div>
        <div style={{ color: color.muted, fontSize: 90, fontWeight: 600, margin: "18px 0", opacity: left }}>oder</div>
        <div style={{ transform: `translateX(${(1 - right) * 700}px)`, color: color.lime }}>{b.label}?</div>
      </div>
      <div style={{ marginTop: 70, fontSize: 60, fontWeight: 600, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>{question}</div>
    </Stage>
  );
}

function Per100({ items }: { items: VideoDrink[] }) {
  const max = Math.max(...items.map((item) => item.per100));
  const [first, second] = items;
  const tie = Math.abs(first.per100 - second.per100) < 0.05;
  const winner = first.per100 >= second.per100 ? first : second;
  const gap = Math.abs(first.per100 - second.per100);
  const glow = useSpring(105, 20);
  return (
    <Stage>
      <Kicker>Runde 1</Kicker>
      <Title>pro 100 ml</Title>
      <div style={{ marginTop: 110, display: "grid", gap: 80 }}>
        {items.map((item, index) => (
          <Bar key={item.label} item={item} max={max} delay={20 + index * 22} highlight={!tie && item === winner ? glow : 0} />
        ))}
      </div>
      <div style={{ marginTop: 100, fontSize: 52, fontWeight: 600, opacity: glow }}>
        {tie ? "Gleichstand." : gap < 0.6 ? `${winner.label} liegt knapp vorn.` : `${winner.label} liegt vorn.`}
      </div>
    </Stage>
  );
}

function Bar({ item, max, delay, highlight }: { item: VideoDrink; max: number; delay: number; highlight: number }) {
  const grow = useSpring(delay, 18);
  const width = (item.per100 / max) * 100 * grow;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 54, fontWeight: 700 }}>
        <span>{item.label}</span>
        <span style={{ fontSize: 84, fontWeight: 800, letterSpacing: "-0.04em", color: highlight > 0.5 ? color.lime : color.ink }}>{format(item.per100 * grow)} g</span>
      </div>
      <div style={{ marginTop: 22, height: 34, borderRadius: 999, background: color.line, overflow: "hidden" }}>
        <div style={{ width: `${width}%`, height: "100%", borderRadius: 999, background: color.lime, boxShadow: `0 0 ${40 * highlight}px rgba(216, 243, 106, ${0.7 * highlight})` }} />
      </div>
    </div>
  );
}

function Pack({ a, b }: { a: VideoDrink; b: VideoDrink }) {
  const sameSize = a.sizeMl === b.sizeMl && a.kind === b.kind;
  return (
    <Stage justify="flex-start">
      <Kicker>Runde 2</Kicker>
      <Title>{sameSize ? `pro ${packageWord(a.kind)}` : "pro Packung"}</Title>
      <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, flex: 1 }}>
        <Column item={a} />
        <Column item={b} />
      </div>
    </Stage>
  );
}

const CUBE = 64;
const PER_ROW = 3;

function Column({ item }: { item: VideoDrink }) {
  const frame = useCurrentFrame();
  const count = Math.min(Math.round(item.cubes), 36);
  // Long enough to watch, short enough that 1-litre bottles still finish inside the scene.
  const perCube = Math.min(10, Math.floor(200 / Math.max(count, 1)));
  const delay = 20;
  const done = delay + count * perCube + 10;
  const progress = interpolate(frame, [delay, done], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 50, fontWeight: 700 }}>{item.label}</div>
      <div style={{ fontSize: 36, color: color.muted, marginTop: 6 }}>{sizeLabel(item.sizeMl)}</div>
      <div style={{ marginTop: 30 }}>
        <CubePile count={count} perRow={PER_ROW} size={CUBE} delay={delay} perCube={perCube} kind={item.kind} height={760} />
      </div>
      <div style={{ marginTop: 26, fontSize: 104, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>{format(item.total * progress)} g</div>
      <div style={{ fontSize: 40, color: color.muted, marginTop: 10 }}>{format(item.cubes * progress)} Würfel</div>
    </div>
  );
}

// The reveal text follows from the numbers: a flip between the rounds, a tie per 100 ml, or a clear winner.
function Reveal({ a, b }: { a: VideoDrink; b: VideoDrink }) {
  const title = useSpring(0);
  const note = useSpring(40);
  const per100Winner = a.per100 >= b.per100 ? a : b;
  const packWinner = a.total >= b.total ? a : b;
  const packLoser = packWinner === a ? b : a;
  const tie100 = Math.abs(a.per100 - b.per100) < 0.05;
  const flip = !tie100 && per100Winner !== packWinner;
  const ratio = packWinner.total / packLoser.total;
  const diff = packWinner.total - packLoser.total;
  const word = packageWord(packWinner.kind);

  const headline = flip || (tie100 && a.sizeMl !== b.sizeMl)
    ? <>Die {word} macht den <span style={{ color: color.lime }}>Unterschied.</span></>
    : <><span style={{ color: color.lime }}>{packWinner.label}</span> hat mehr Zucker.</>;

  const amount = ratio >= 1.9 && ratio < 2.15 ? "fast doppelt so viel wie" : ratio >= 2.15 ? `${format(ratio)}-mal so viel wie` : `${format(diff)} g mehr als`;
  const body = `In ${sizeLabel(packWinner.sizeMl)} ${packWinner.label} stecken ${format(packWinner.total)} g Zucker, ${amount} in ${sizeLabel(packLoser.sizeMl)} ${packLoser.label}.`;
  const cubesDiff = packWinner.cubes - packLoser.cubes;

  return (
    <Stage>
      <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02, opacity: title, transform: `translateY(${(1 - title) * 40}px)` }}>{headline}</div>
      <div style={{ marginTop: 70, fontSize: 52, lineHeight: 1.35, fontWeight: 500, opacity: note }}>{body.replace(/(\d) (g|ml|l)\b/g, "$1 $2")}</div>
      {packWinner.total > dailySugarGrams ? (
        <Note delay={80}>Das ist mehr als die {dailySugarGrams} g freier Zucker, die WHO und DGE als Obergrenze für einen ganzen Tag nennen.</Note>
      ) : cubesDiff >= 1 ? (
        <Note delay={80}>Der Unterschied: rund {format(cubesDiff)} Zuckerwürfel.</Note>
      ) : null}
    </Stage>
  );
}
