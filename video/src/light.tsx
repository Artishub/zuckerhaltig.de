import "@fontsource-variable/inter";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import type { Range } from "./common";

// Site tokens from app/globals.css: paper background, white cards with hairlines, moss text, lime accent.
export const tone = {
  paper: "#edf0e8",
  card: "#ffffff",
  ink: "#17201d",
  muted: "#68786d",
  line: "#d4dbd2",
  moss: "#1f4539",
  lime: "#d8f36a",
  limeSoft: "#eaf9a8",
};

export const font = "'Inter Variable', Inter, system-ui, sans-serif";
export const cardShadow = "0 2px 0 rgba(23, 32, 29, 0.04), 0 40px 80px -50px rgba(23, 32, 29, 0.45)";

export function LightFrame({ children }: { children: React.ReactNode }) {
  return <AbsoluteFill style={{ background: tone.paper, color: tone.ink, fontFamily: font }}>{children}</AbsoluteFill>;
}

// Scenes cross-fade over 15 frames so cuts never jump.
export function Scene({ range, children }: { range: Range; children: React.ReactNode }) {
  return (
    <Sequence from={range[0]} durationInFrames={range[1] - range[0]}>
      <SceneFade length={range[1] - range[0]}>{children}</SceneFade>
    </Sequence>
  );
}

function SceneFade({ length, children }: { length: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, length - 15, length], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

// Calm ease-out from 0 to 1, no overshoot. Every element uses this, so the motion feels the same everywhere.
export function useIn(delay: number, duration = 24) {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
}

export const rise = (value: number, distance = 36) => ({ opacity: value, transform: `translateY(${(1 - value) * distance}px)` });

// Platform UI covers the top bar, the right-hand buttons and the caption at the bottom; content stays inside.
export function Safe({ children, justify = "center" }: { children: React.ReactNode; justify?: "center" | "flex-start" | "space-between" }) {
  return <AbsoluteFill style={{ padding: "230px 150px 400px 84px", display: "flex", flexDirection: "column", justifyContent: justify }}>{children}</AbsoluteFill>;
}

export function Pill({ children, value }: { children: React.ReactNode; value: number }) {
  return (
    <div style={{ alignSelf: "flex-start", padding: "14px 28px", borderRadius: 999, background: tone.card, border: `2px solid ${tone.line}`, fontSize: 38, fontWeight: 600, color: tone.moss, ...rise(value, 20) }}>
      {children}
    </div>
  );
}

// Lime marker behind a word, as the site highlights key numbers.
export function Mark({ children }: { children: React.ReactNode }) {
  return <span style={{ background: `linear-gradient(transparent 58%, ${tone.lime} 58%, ${tone.lime} 92%, transparent 92%)`, padding: "0 6px" }}>{children}</span>;
}

export function Logo({ size = 72 }: { size?: number }) {
  const box = size * 1.15;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: box * 0.07, width: box, height: box, padding: box * 0.16, borderRadius: box * 0.26, background: tone.moss }}>
        {[0, 1, 2, 3].map((index) => <i key={index} style={{ borderRadius: box * 0.07, background: index === 3 ? tone.paper : tone.lime }} />)}
      </div>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.06em" }}>zuckerhaltig<span style={{ color: tone.muted }}>.de</span></div>
    </div>
  );
}
