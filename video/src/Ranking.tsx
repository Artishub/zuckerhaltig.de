import { Frame, Guess, Kicker, Note, Outro, Part, Stage, Title, color, useSpring, type Range } from "./common";
import { format, loadDrink, sizeLabel, type DrinkRef, type VideoDrink } from "./data";

export type RankingProps = { question: string; subject: string; items: DrinkRef[]; metric: "per100" | "pack" };

const scene: Record<"hook" | "guess" | "list" | "note" | "outro", Range> = {
  hook: [0, 105],
  guess: [105, 210],
  list: [210, 690],
  note: [690, 825],
  outro: [825, 900],
};

const value = (item: VideoDrink, metric: RankingProps["metric"]) => (metric === "per100" ? item.per100 : item.total);

export function Ranking({ question, subject, items: refs, metric }: RankingProps) {
  // Order comes from the data, not from the config.
  const items = refs.map(loadDrink).sort((x, y) => value(y, metric) - value(x, metric));
  return (
    <Frame>
      <Part range={scene.hook}><Hook question={question} subject={subject} /></Part>
      <Part range={scene.guess}><Guess /></Part>
      <Part range={scene.list}><List items={items} metric={metric} /></Part>
      <Part range={scene.note}><Summary items={items} metric={metric} /></Part>
      <Part range={scene.outro}><Outro drinks={items} /></Part>
    </Frame>
  );
}

function Hook({ question, subject }: { question: string; subject: string }) {
  const title = useSpring(6);
  const sub = useSpring(40);
  return (
    <Stage>
      <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, opacity: title, transform: `translateY(${(1 - title) * 40}px)` }}>{question}</div>
      <div style={{ marginTop: 60, fontSize: 56, fontWeight: 600, color: color.muted, opacity: sub }}>{subject} im Vergleich</div>
    </Stage>
  );
}

function List({ items, metric }: { items: VideoDrink[]; metric: RankingProps["metric"] }) {
  const max = value(items[0], metric);
  const step = Math.floor(380 / items.length);
  return (
    <Stage justify="flex-start">
      <Kicker>{metric === "per100" ? "Zucker pro 100 ml" : "Zucker pro Packung"}</Kicker>
      <Title size={96}>Die Rangliste</Title>
      <div style={{ marginTop: 60, display: "flex", flexDirection: "column-reverse", gap: 38 }}>
        {items.map((item, index) => {
          // Last place appears first; the winner comes last.
          const order = items.length - 1 - index;
          return <Row key={item.drink.id} item={item} rank={index + 1} max={max} metric={metric} delay={20 + order * step} winner={index === 0} />;
        })}
      </div>
    </Stage>
  );
}

function Row({ item, rank, max, metric, delay, winner }: { item: VideoDrink; rank: number; max: number; metric: RankingProps["metric"]; delay: number; winner: boolean }) {
  const show = useSpring(delay);
  const grow = useSpring(delay + 6, 18);
  const amount = value(item, metric);
  return (
    <div style={{ opacity: show, transform: `translateX(${(1 - show) * 60}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontSize: 44, fontWeight: 700 }}>
          <span style={{ color: color.muted, marginRight: 16 }}>{rank}</span>{item.label}
          {metric === "pack" && <span style={{ fontSize: 32, color: color.muted, fontWeight: 500 }}> · {sizeLabel(item.sizeMl)}</span>}
        </span>
        <span style={{ fontSize: 60, fontWeight: 800, letterSpacing: "-0.04em", color: winner ? color.lime : color.ink }}>{format(amount)} g</span>
      </div>
      <div style={{ marginTop: 14, height: 22, borderRadius: 999, background: color.line, overflow: "hidden" }}>
        <div style={{ width: `${(amount / max) * 100 * grow}%`, height: "100%", borderRadius: 999, background: winner ? color.lime : "rgba(216, 243, 106, 0.55)" }} />
      </div>
    </div>
  );
}

function Summary({ items, metric }: { items: VideoDrink[]; metric: RankingProps["metric"] }) {
  const title = useSpring(0);
  const first = items[0];
  const last = items[items.length - 1];
  const top = value(first, metric);
  const bottom = value(last, metric);
  const ratio = bottom > 0 ? top / bottom : null;
  return (
    <Stage>
      <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02, opacity: title }}>
        Platz 1: <span style={{ color: color.lime }}>{first.label}</span>
      </div>
      <div style={{ marginTop: 60, fontSize: 52, lineHeight: 1.35, fontWeight: 500, opacity: title }}>
        {format(top)} g {metric === "per100" ? "pro 100 ml" : `in ${sizeLabel(first.sizeMl)}`}. Am wenigsten hat {last.label} mit {format(bottom)} g.
      </div>
      <Note delay={45}>
        {ratio && ratio >= 1.5
          ? `${first.label} hat ${format(ratio)}-mal so viel Zucker wie ${last.label}.`
          : `Der Unterschied zwischen Platz 1 und dem letzten Platz: ${format(top - bottom)} g.`}
      </Note>
    </Stage>
  );
}
