import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CubePile, Frame, Guess, Kicker, Note, Outro, Part, Stage, color, useSpring, type Range } from "./common";
import { alternativeFor, dailySugarGrams, format, loadDrink, packageWord, sizeLabel, type DrinkRef, type VideoDrink } from "./data";

export type CubesProps = { drink: DrinkRef; altLabel?: string };

const scene: Record<"hook" | "guess" | "pour" | "context" | "swap" | "outro", Range> = {
  hook: [0, 105],
  guess: [105, 210],
  pour: [210, 510],
  context: [510, 690],
  swap: [690, 825],
  outro: [825, 900],
};

export function Cubes({ drink: ref, altLabel }: CubesProps) {
  const item = loadDrink(ref);
  const alt = alternativeFor(item.drink);
  return (
    <Frame>
      <Part range={scene.hook}><Hook item={item} /></Part>
      <Part range={scene.guess}><Guess /></Part>
      <Part range={scene.pour}><Pour item={item} /></Part>
      <Part range={scene.context}><Context item={item} /></Part>
      {alt && <Part range={scene.swap}><Swap item={item} altName={altLabel ?? alt.name} altPer100={alt.sugarPer100Ml} /></Part>}
      <Part range={alt ? scene.outro : [scene.swap[0], scene.outro[1]]}><Outro drinks={[item]} /></Part>
    </Frame>
  );
}

function Hook({ item }: { item: VideoDrink }) {
  const top = useSpring(6);
  const name = useSpring(22);
  const size = useSpring(42);
  return (
    <Stage>
      <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.2, opacity: top }}>Wie viele Zuckerwürfel stecken in</div>
      <div style={{ marginTop: 30, fontSize: item.label.length > 14 ? 112 : 140, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.98, color: color.lime, transform: `translateY(${(1 - name) * 50}px)`, opacity: name }}>{item.label}</div>
      <div style={{ marginTop: 34, fontSize: 64, fontWeight: 600, opacity: size }}>{sizeLabel(item.sizeMl)}?</div>
    </Stage>
  );
}

function Pour({ item }: { item: VideoDrink }) {
  const frame = useCurrentFrame();
  const count = Math.round(item.cubes);
  const perRow = count > 30 ? 6 : count > 16 ? 5 : 4;
  const perCube = Math.min(10, Math.floor(220 / Math.max(count, 1)));
  const delay = 20;
  const done = delay + count * perCube + 10;
  const progress = interpolate(frame, [delay, done], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return (
    <Stage justify="flex-start">
      <Kicker>{item.label} · {sizeLabel(item.sizeMl)}</Kicker>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <CubePile count={count} perRow={perRow} size={64} delay={delay} perCube={perCube} kind={item.kind} height={820} />
      </div>
      <div style={{ marginTop: 40, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 24 }}>
        <span style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>{format(item.cubes * progress)}</span>
        <span style={{ fontSize: 52, fontWeight: 700, color: color.muted }}>Würfel</span>
      </div>
    </Stage>
  );
}

function Context({ item }: { item: VideoDrink }) {
  const title = useSpring(0);
  const grow = useSpring(20, 18);
  const share = Math.round((item.total / dailySugarGrams) * 100);
  const width = Math.min(share, 100);
  return (
    <Stage>
      <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, opacity: title }}>{format(item.total)} g</div>
      <div style={{ fontSize: 56, fontWeight: 600, marginTop: 20, opacity: title }}>Zucker in einer {packageWord(item.kind)}</div>
      <div style={{ marginTop: 100, fontSize: 48, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
        <span>Anteil an 50 g</span>
        <span style={{ color: color.lime, fontWeight: 800 }}>{Math.round(share * grow)} %</span>
      </div>
      <div style={{ marginTop: 22, height: 40, borderRadius: 999, background: color.line, overflow: "hidden" }}>
        <div style={{ width: `${width * grow}%`, height: "100%", borderRadius: 999, background: color.lime }} />
      </div>
      <Note delay={50}>
        {share > 100
          ? `Mehr als die ${dailySugarGrams} g freier Zucker, die WHO und DGE Erwachsenen als Obergrenze für einen ganzen Tag nennen.`
          : `${dailySugarGrams} g freier Zucker am Tag nennen WHO und DGE als Obergrenze für Erwachsene.`}
      </Note>
    </Stage>
  );
}

function Swap({ item, altName, altPer100 }: { item: VideoDrink; altName: string; altPer100: number }) {
  const title = useSpring(0);
  const card = useSpring(25);
  const altTotal = (altPer100 * item.sizeMl) / 100;
  return (
    <Stage>
      <div style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02, opacity: title }}>Weniger Zucker, gleiche Größe</div>
      <div style={{ marginTop: 70, padding: "44px 48px", borderRadius: 36, background: "rgba(245, 248, 242, 0.06)", border: `2px solid ${color.line}`, opacity: card, transform: `translateY(${(1 - card) * 40}px)` }}>
        <div style={{ fontSize: 54, fontWeight: 700 }}>{altName}</div>
        <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.05em", color: color.lime }}>{format(altTotal)} g</span>
          <span style={{ fontSize: 44, color: color.muted }}>statt {format(item.total)} g</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 40, color: color.muted }}>bei {sizeLabel(item.sizeMl)}, {format(altPer100)} g pro 100 ml</div>
      </div>
    </Stage>
  );
}
