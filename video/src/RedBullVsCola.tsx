import "@fontsource-variable/inter";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cola, dailySugarGrams, format, latestCheck, redBull, type VideoDrink } from "./data";

const color = {
  ink: "#f5f8f2",
  muted: "#b9d4c3",
  lime: "#d8f36a",
  line: "rgba(245, 248, 242, 0.18)",
};

const font = "'Inter Variable', Inter, system-ui, sans-serif";

// Timeline in frames (30 fps, 24 s).
const scene = {
  hook: [0, 75],
  guess: [75, 150],
  per100: [150, 300],
  pack: [300, 510],
  reveal: [510, 630],
  outro: [630, 720],
} as const;

export const durationInFrames = scene.outro[1];

export function RedBullVsCola() {
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 100% 0%, #2c5a4a 0%, #1f4539 45%, #163328 100%)", color: color.ink, fontFamily: font }}>
      <Ring />
      <Part range={scene.hook}><Hook /></Part>
      <Part range={scene.guess}><Guess /></Part>
      <Part range={scene.per100}><Per100 /></Part>
      <Part range={scene.pack}><Pack /></Part>
      <Part range={scene.reveal}><Reveal /></Part>
      <Part range={scene.outro}><Outro /></Part>
    </AbsoluteFill>
  );
}

function Part({ range, children }: { range: readonly [number, number]; children: React.ReactNode }) {
  return (
    <Sequence from={range[0]} durationInFrames={range[1] - range[0]}>
      <Fade length={range[1] - range[0]}>{children}</Fade>
    </Sequence>
  );
}

// Every scene fades in and out briefly, so cuts never jump.
function Fade({ length, children }: { length: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, length - 8, length], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

// Thin decorative circle in the corner, as on the site's fact card.
function Ring() {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", right: -260, top: -220 + frame * 0.15, width: 760, height: 760, borderRadius: "50%", border: "2px solid rgba(216, 243, 106, 0.28)" }} />
  );
}

function useSpring(delay = 0, damping = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
}

function Stage({ children, justify = "center" }: { children: React.ReactNode; justify?: "center" | "flex-start" }) {
  return (
    <AbsoluteFill style={{ padding: "250px 90px 350px", display: "flex", flexDirection: "column", justifyContent: justify }}>{children}</AbsoluteFill>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 44, fontWeight: 600, color: color.muted, letterSpacing: "-0.01em" }}>{children}</div>;
}

function Hook() {
  const left = useSpring(4);
  const right = useSpring(12);
  const sub = useSpring(24);
  return (
    <Stage>
      <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.05em" }}>
        <div style={{ transform: `translateX(${(1 - left) * -700}px)` }}>Red Bull</div>
        <div style={{ color: color.muted, fontSize: 90, fontWeight: 600, margin: "18px 0", opacity: left }}>oder</div>
        <div style={{ transform: `translateX(${(1 - right) * 700}px)`, color: color.lime }}>Cola?</div>
      </div>
      <div style={{ marginTop: 70, fontSize: 60, fontWeight: 600, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>Wo steckt mehr Zucker?</div>
    </Stage>
  );
}

function Guess() {
  const frame = useCurrentFrame();
  const intro = useSpring(0);
  const step = Math.min(2, Math.floor(Math.max(0, frame - 10) / 20));
  const local = (Math.max(0, frame - 10) % 20) / 20;
  const radius = 170;
  const circumference = 2 * Math.PI * radius;
  return (
    <Stage>
      <div style={{ fontSize: 140, fontWeight: 800, letterSpacing: "-0.05em", opacity: intro, transform: `scale(${0.9 + intro * 0.1})` }}>Rate mal.</div>
      <div style={{ position: "relative", width: 400, height: 400, marginTop: 90, alignSelf: "center" }}>
        <svg width={400} height={400} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={200} cy={200} r={radius} fill="none" stroke={color.line} strokeWidth={10} />
          <circle cx={200} cy={200} r={radius} fill="none" stroke={color.lime} strokeWidth={10} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * local} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 200, fontWeight: 800, letterSpacing: "-0.05em" }}>{frame < 10 ? 3 : 3 - step}</div>
      </div>
    </Stage>
  );
}

function Per100() {
  const items = [redBull, cola];
  const max = Math.max(...items.map((item) => item.per100));
  const winner = items.reduce((a, b) => (b.per100 > a.per100 ? b : a));
  const glow = useSpring(85, 20);
  return (
    <Stage>
      <Kicker>Runde 1</Kicker>
      <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: "-0.045em", marginTop: 10 }}>pro 100 ml</div>
      <div style={{ marginTop: 110, display: "grid", gap: 80 }}>
        {items.map((item, index) => (
          <Bar key={item.label} item={item} max={max} delay={20 + index * 14} highlight={item === winner ? glow : 0} />
        ))}
      </div>
      <div style={{ marginTop: 100, fontSize: 52, fontWeight: 600, opacity: glow }}>
        {winner.label} liegt knapp vorn.
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

function Pack() {
  return (
    <Stage justify="flex-start">
      <Kicker>Runde 2</Kicker>
      <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: "-0.045em", marginTop: 10 }}>pro Packung</div>
      <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, flex: 1 }}>
        <Column item={redBull} delay={20} />
        <Column item={cola} delay={20} />
      </div>
    </Stage>
  );
}

const CUBE = 64;
const PER_ROW = 3;

function Column({ item, delay }: { item: VideoDrink; delay: number }) {
  const frame = useCurrentFrame();
  const count = Math.round(item.cubes);
  const perCube = 7;
  const done = delay + count * perCube + 10;
  const progress = interpolate(frame, [delay, done], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const rows = Math.ceil(count / PER_ROW);
  const pileHeight = rows * (CUBE * 0.82) + CUBE;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 50, fontWeight: 700 }}>{item.label}</div>
      <div style={{ fontSize: 36, color: color.muted, marginTop: 6 }}>{item.sizeMl} ml</div>
      <div style={{ position: "relative", width: PER_ROW * CUBE + 80, height: 760, marginTop: 30 }}>
        <Container kind={item.kind} />
        <div style={{ position: "absolute", left: 40, bottom: 40, width: PER_ROW * CUBE, height: pileHeight }}>
          {Array.from({ length: count }).map((_, index) => (
            <FallingCube key={index} index={index} delay={delay + index * perCube} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 26, fontSize: 104, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>{format(item.total * progress)} g</div>
      <div style={{ fontSize: 40, color: color.muted, marginTop: 10 }}>{format(item.cubes * progress)} Würfel</div>
    </div>
  );
}

function FallingCube({ index, delay }: { index: number; delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const land = spring({ frame: frame - delay, fps, config: { damping: 11, mass: 0.6, stiffness: 140 } });
  const row = Math.floor(index / PER_ROW);
  const col = index % PER_ROW;
  const x = col * CUBE + (row % 2 ? CUBE * 0.12 : 0);
  const y = row * (CUBE * 0.82);
  if (frame < delay) return null;
  return (
    <svg width={CUBE} height={CUBE} viewBox="0 0 28 28" style={{ position: "absolute", left: x, bottom: y + (1 - land) * 700, opacity: Math.min(1, land * 3) }}>
      <polygon points="14,2 26,8 14,14 2,8" fill="#eefab8" />
      <polygon points="2,8 14,14 14,27 2,21" fill="#d8f36a" />
      <polygon points="14,14 26,8 26,21 14,27" fill="#b3d14a" />
    </svg>
  );
}

// Outline of the package the cubes fall into: slim can or bottle.
function Container({ kind }: { kind: "can" | "bottle" }) {
  const stroke = "rgba(245, 248, 242, 0.55)";
  const fill = "rgba(245, 248, 242, 0.05)";
  const width = PER_ROW * CUBE + 80;
  if (kind === "can") {
    return (
      <svg width={width} height={760} style={{ position: "absolute", inset: 0 }}>
        <rect x={10} y={300} width={width - 20} height={440} rx={34} fill={fill} stroke={stroke} strokeWidth={4} />
        <line x1={24} y1={346} x2={width - 24} y2={346} stroke={stroke} strokeWidth={3} />
      </svg>
    );
  }
  const neck = 70;
  const cx = width / 2;
  return (
    <svg width={width} height={760} style={{ position: "absolute", inset: 0 }}>
      <path
        d={`M${cx - neck / 2} 20 h${neck} v90 c0 50 ${width / 2 - neck / 2 - 10} 70 ${width / 2 - neck / 2 - 10} 160 v430 a34 34 0 0 1 -34 34 h${-(width - 88)} a34 34 0 0 1 -34 -34 v-430 c0 -90 ${width / 2 - neck / 2 - 10} -110 ${width / 2 - neck / 2 - 10} -160 z`}
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Reveal() {
  const title = useSpring(0);
  const note = useSpring(30);
  const box = useSpring(60);
  const ratio = cola.total / redBull.total;
  return (
    <Stage>
      <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, opacity: title, transform: `translateY(${(1 - title) * 40}px)` }}>
        Die Flasche macht den <span style={{ color: color.lime }}>Unterschied.</span>
      </div>
      <div style={{ marginTop: 70, fontSize: 52, lineHeight: 1.35, fontWeight: 500, opacity: note }}>
        In {cola.sizeMl} ml Cola stecken {format(cola.total)} g Zucker, {ratio >= 1.9 ? "fast doppelt so viel" : `${format(ratio)}-mal so viel`} wie in der {redBull.sizeMl}‑ml‑Dose Red Bull.
      </div>
      {cola.total > dailySugarGrams && (
        <div style={{ marginTop: 60, padding: "36px 40px", borderRadius: 32, background: "rgba(216, 243, 106, 0.14)", border: `2px solid ${color.line}`, fontSize: 44, lineHeight: 1.35, opacity: box }}>
          Das ist mehr als die {dailySugarGrams} g freier Zucker, die WHO und DGE als Obergrenze für einen ganzen Tag nennen.
        </div>
      )}
    </Stage>
  );
}

function Outro() {
  const logo = useSpring(0);
  const line = useSpring(15);
  const small = useSpring(25);
  const checked = latestCheck([redBull.drink, cola.drink]);
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: logo, transform: `scale(${0.92 + logo * 0.08})` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: 110, height: 110, padding: 18, borderRadius: 28, background: color.lime }}>
          {[0, 1, 2, 3].map((index) => <i key={index} style={{ borderRadius: 8, background: index === 3 ? "#f5f8f2" : "#1f4539" }} />)}
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.065em" }}>zuckerhaltig<span style={{ color: color.muted }}>.de</span></div>
      </div>
      <div style={{ marginTop: 70, fontSize: 56, fontWeight: 600, lineHeight: 1.3, opacity: line }}>Jedes Getränk mit Quelle und Rechenweg.</div>
      <div style={{ marginTop: 40, fontSize: 32, color: color.muted, opacity: small }}>
        Quellen: {redBull.drink.source}; {cola.drink.source}{checked ? `. Stand ${checked}` : ""}
      </div>
    </Stage>
  );
}
