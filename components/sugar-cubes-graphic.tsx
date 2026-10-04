// Drawn sugar cubes next to the package. Decorative: the numbers stay in the text next to it.

const EDGE = 14;
const HALF_W = EDGE * 0.866;
const HALF_H = EDGE * 0.5;
const PER_ROW = 6;
const MAX_CUBES = 30;
const CELL_W = HALF_W * 2 + 3;
const CELL_H = EDGE + HALF_H * 2 + 4;
const PACKAGE_W = 64;
const GAP = 22;

function Cube({ x, y }: { x: number; y: number }) {
  const top = `${x},${y} ${x + HALF_W},${y + HALF_H} ${x},${y + HALF_H * 2} ${x - HALF_W},${y + HALF_H}`;
  const left = `${x - HALF_W},${y + HALF_H} ${x},${y + HALF_H * 2} ${x},${y + HALF_H * 2 + EDGE} ${x - HALF_W},${y + HALF_H + EDGE}`;
  const right = `${x},${y + HALF_H * 2} ${x + HALF_W},${y + HALF_H} ${x + HALF_W},${y + HALF_H + EDGE} ${x},${y + HALF_H * 2 + EDGE}`;
  return (
    <g>
      <polygon points={top} fill="#eefab8" />
      <polygon points={left} fill="#d8f36a" />
      <polygon points={right} fill="#b3d14a" />
    </g>
  );
}

function Package({ sizeMl, height }: { sizeMl: number | null; height: number }) {
  const isCan = sizeMl !== null && sizeMl <= 355;
  const stroke = "rgba(245,248,242,0.6)";
  const fill = "rgba(245,248,242,0.07)";
  if (isCan) {
    const top = height - 118;
    return (
      <g>
        <rect x={8} y={top} width={48} height={112} rx={9} fill={fill} stroke={stroke} strokeWidth={2} />
        <line x1={12} y1={top + 14} x2={52} y2={top + 14} stroke={stroke} strokeWidth={1.5} />
        <line x1={12} y1={top + 98} x2={52} y2={top + 98} stroke={stroke} strokeWidth={1.5} />
      </g>
    );
  }
  const top = height - 150;
  return (
    <path
      d={`M24 ${top} h16 v18 c0 10 16 16 16 34 v86 a8 8 0 0 1 -8 8 h-32 a8 8 0 0 1 -8 -8 v-86 c0 -18 16 -24 16 -34 z`}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  );
}

export function SugarCubesGraphic({ cubes, sizeMl, className }: { cubes: number | null; sizeMl: number | null; className?: string }) {
  if (cubes === null) return null;
  const count = Math.max(Math.round(cubes), cubes > 0 ? 1 : 0);
  const shown = Math.min(count, MAX_CUBES);
  const rows = Math.max(Math.ceil(shown / PER_ROW), 1);
  const cubesHeight = rows * CELL_H;
  const height = Math.max(cubesHeight + 8, 160);
  const width = PACKAGE_W + GAP + PER_ROW * CELL_W + 8;
  const startX = PACKAGE_W + GAP + HALF_W;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-hidden="true" focusable="false">
      <Package sizeMl={sizeMl} height={height - 4} />
      {Array.from({ length: shown }).map((_, index) => {
        const row = Math.floor(index / PER_ROW);
        const col = index % PER_ROW;
        const x = startX + col * CELL_W + (row % 2 ? HALF_W / 2 : 0);
        const y = height - 4 - (row + 1) * CELL_H + 4;
        return <Cube key={index} x={x} y={y} />;
      })}
      {count > MAX_CUBES && (
        <text x={width - 4} y={14} textAnchor="end" fill="#d8f36a" fontSize={13} fontWeight={700}>+{count - MAX_CUBES}</text>
      )}
    </svg>
  );
}
