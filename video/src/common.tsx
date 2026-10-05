import "@fontsource-variable/inter";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { latestCheck, type ContainerKind, type VideoDrink } from "./data";

export const color = {
  ink: "#f5f8f2",
  muted: "#b9d4c3",
  lime: "#d8f36a",
  line: "rgba(245, 248, 242, 0.18)",
};

const font = "'Inter Variable', Inter, system-ui, sans-serif";

export const fps = 30;
export const durationInFrames = 900;

export type Range = readonly [number, number];

export function Frame({ children }: { children: React.ReactNode }) {
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 100% 0%, #2c5a4a 0%, #1f4539 45%, #163328 100%)", color: color.ink, fontFamily: font }}>
      <Ring />
      {children}
    </AbsoluteFill>
  );
}

export function Part({ range, children }: { range: Range; children: React.ReactNode }) {
  return (
    <Sequence from={range[0]} durationInFrames={range[1] - range[0]}>
      <Fade length={range[1] - range[0]}>{children}</Fade>
    </Sequence>
  );
}

// Every scene fades in and out briefly, so cuts never jump.
function Fade({ length, children }: { length: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, length - 12, length], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

// Thin decorative circle in the corner, as on the site's fact card.
function Ring() {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", right: -260, top: -220 + frame * 0.15, width: 760, height: 760, borderRadius: "50%", border: "2px solid rgba(216, 243, 106, 0.28)" }} />
  );
}

export function useSpring(delay = 0, damping = 14) {
  const frame = useCurrentFrame();
  const { fps: rate } = useVideoConfig();
  return spring({ frame: frame - delay, fps: rate, config: { damping, mass: 1.1, stiffness: 80 } });
}

export function Stage({ children, justify = "center" }: { children: React.ReactNode; justify?: "center" | "flex-start" }) {
  return (
    <AbsoluteFill style={{ padding: "250px 90px 350px", display: "flex", flexDirection: "column", justifyContent: justify }}>{children}</AbsoluteFill>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 44, fontWeight: 600, color: color.muted, letterSpacing: "-0.01em" }}>{children}</div>;
}

export function Title({ children, size = 110 }: { children: React.ReactNode; size?: number }) {
  return <div style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.02, marginTop: 10 }}>{children}</div>;
}

export function Guess() {
  const frame = useCurrentFrame();
  const intro = useSpring(0);
  const step = Math.min(2, Math.floor(Math.max(0, frame - 15) / 30));
  const local = (Math.max(0, frame - 15) % 30) / 30;
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
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 200, fontWeight: 800, letterSpacing: "-0.05em" }}>{frame < 15 ? 3 : 3 - step}</div>
      </div>
    </Stage>
  );
}

export function Note({ children, delay }: { children: React.ReactNode; delay: number }) {
  const show = useSpring(delay);
  return (
    <div style={{ marginTop: 60, padding: "36px 40px", borderRadius: 32, background: "rgba(216, 243, 106, 0.14)", border: `2px solid ${color.line}`, fontSize: 44, lineHeight: 1.35, opacity: show }}>
      {children}
    </div>
  );
}

export function FallingCube({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  const frame = useCurrentFrame();
  const { fps: rate } = useVideoConfig();
  const land = spring({ frame: frame - delay, fps: rate, config: { damping: 13, mass: 0.8, stiffness: 90 } });
  if (frame < delay) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{ position: "absolute", left: x, bottom: y + (1 - land) * 800, opacity: Math.min(1, land * 3) }}>
      <polygon points="14,2 26,8 14,14 2,8" fill="#eefab8" />
      <polygon points="2,8 14,14 14,27 2,21" fill="#d8f36a" />
      <polygon points="14,14 26,8 26,21 14,27" fill="#b3d14a" />
    </svg>
  );
}

// Cubes stacking inside a package outline. Returns nothing but the drawing; numbers are rendered by the caller.
export function CubePile({ count, perRow, size, delay, perCube, kind, height }: { count: number; perRow: number; size: number; delay: number; perCube: number; kind: ContainerKind; height: number }) {
  const width = perRow * size + 80;
  return (
    <div style={{ position: "relative", width, height }}>
      <Container kind={kind} width={width} height={height} />
      <div style={{ position: "absolute", left: 40, bottom: 40, width: perRow * size, height: height - 80 }}>
        {Array.from({ length: count }).map((_, index) => {
          const row = Math.floor(index / perRow);
          const col = index % perRow;
          return <FallingCube key={index} size={size} delay={delay + index * perCube} x={col * size + (row % 2 ? size * 0.12 : 0)} y={row * size * 0.82} />;
        })}
      </div>
    </div>
  );
}

export function Container({ kind, width, height }: { kind: ContainerKind; width: number; height: number }) {
  const stroke = "rgba(245, 248, 242, 0.55)";
  const fill = "rgba(245, 248, 242, 0.05)";
  if (kind === "can") {
    const top = height * 0.4;
    return (
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <rect x={10} y={top} width={width - 20} height={height - top - 20} rx={34} fill={fill} stroke={stroke} strokeWidth={4} />
        <line x1={24} y1={top + 46} x2={width - 24} y2={top + 46} stroke={stroke} strokeWidth={3} />
      </svg>
    );
  }
  if (kind === "pouch") {
    const top = height * 0.42;
    return (
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={`M30 ${top} L${width - 30} ${top} L${width - 10} ${height - 20} L10 ${height - 20} Z`} fill={fill} stroke={stroke} strokeWidth={4} strokeLinejoin="round" />
        <line x1={width - 70} y1={top - 70} x2={width - 60} y2={top} stroke={stroke} strokeWidth={6} strokeLinecap="round" />
      </svg>
    );
  }
  const neck = 70;
  const cx = width / 2;
  const shoulder = width / 2 - neck / 2 - 10;
  const body = height - 20 - 34 - 270;
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      <path
        d={`M${cx - neck / 2} 20 h${neck} v90 c0 50 ${shoulder} 70 ${shoulder} 160 v${body} a34 34 0 0 1 -34 34 h${-(width - 88)} a34 34 0 0 1 -34 -34 v${-body} c0 -90 ${shoulder} -110 ${shoulder} -160 z`}
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Outro({ drinks }: { drinks: VideoDrink[] }) {
  const logo = useSpring(0);
  const line = useSpring(18);
  const small = useSpring(32);
  const checked = latestCheck(drinks.map((item) => item.drink));
  const sources = Array.from(new Set(drinks.map((item) => item.drink.source)));
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: logo, transform: `scale(${0.92 + logo * 0.08})` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: 110, height: 110, padding: 18, borderRadius: 28, background: color.lime }}>
          {[0, 1, 2, 3].map((index) => <i key={index} style={{ borderRadius: 8, background: index === 3 ? "#f5f8f2" : "#1f4539" }} />)}
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.065em" }}>zuckerhaltig<span style={{ color: color.muted }}>.de</span></div>
      </div>
      <div style={{ marginTop: 70, fontSize: 56, fontWeight: 600, lineHeight: 1.3, opacity: line }}>Jedes Getränk mit Quelle und Rechenweg.</div>
      <div style={{ marginTop: 40, fontSize: 30, color: color.muted, opacity: small, lineHeight: 1.4 }}>
        Quellen: {sources.length > 3 ? "Hersteller- und Händlerangaben" : sources.join("; ")}{checked ? `. Stand ${checked}` : ""}
      </div>
    </Stage>
  );
}
