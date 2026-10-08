import type { CubesProps } from "./Cubes";
import type { DuelProps } from "./Duel";
import type { FillProps } from "./Fill";
import type { RankingProps } from "./Ranking";
import { format, loadDrink, sizeLabel } from "./data";

export type VideoConfig =
  | { id: string; template: "duel"; props: DuelProps; tags: string[] }
  | { id: string; template: "cubes"; props: CubesProps; tags: string[] }
  | { id: string; template: "ranking"; props: RankingProps; tags: string[] }
  | { id: string; template: "fill"; props: FillProps; tags: string[] };

// Drinks are referenced by id only; every number in the videos and captions is read from the site data.
export const videos: VideoConfig[] = [
  { id: "01-redbull-vs-cola", template: "duel", props: { a: { id: "red-bull-energy-drink-250", label: "Red Bull", kind: "can" }, b: { id: "coca-cola-classic-500", label: "Cola", kind: "bottle" } }, tags: ["redbull", "cocacola"] },
  { id: "02-spezi-vs-mezzo-mix", template: "duel", props: { a: { id: "paulaner-spezi-500", label: "Spezi" }, b: { id: "mezzo-mix-original-500", label: "Mezzo Mix" } }, tags: ["spezi", "mezzomix"] },
  { id: "03-fanta-vs-sprite", template: "duel", props: { a: { id: "fanta-orange-500", label: "Fanta" }, b: { id: "sprite-500", label: "Sprite" } }, tags: ["fanta", "sprite"] },
  { id: "04-coca-cola-vs-pepsi", template: "duel", props: { a: { id: "coca-cola-classic-500", label: "Coca-Cola" }, b: { id: "pepsi-500", label: "Pepsi" } }, tags: ["cocacola", "pepsi"] },
  { id: "05-redbull-vs-monster", template: "duel", props: { a: { id: "red-bull-energy-drink-250", label: "Red Bull", kind: "can" }, b: { id: "monster-energy-original-500", label: "Monster", kind: "can" } }, tags: ["redbull", "monster", "energydrink"] },
  { id: "06-orangensaft-vs-cola", template: "duel", props: { a: { id: "hohes-c-orange-1000", label: "Orangensaft" }, b: { id: "coca-cola-classic-1000", label: "Cola" } }, tags: ["saft", "orangensaft", "cola"] },
  { id: "07-monster-mango-loco", template: "cubes", props: { drink: { id: "monster-mango-loco-500", label: "Monster Mango Loco", kind: "can" } }, tags: ["monster", "energydrink"] },
  { id: "08-pfanner-eistee-2-liter", template: "cubes", props: { drink: { id: "pfanner-ice-tea-pfirsich-2000", label: "Pfanner Eistee Pfirsich" } }, tags: ["eistee", "icetea", "pfanner"] },
  { id: "09-capri-sun", template: "cubes", props: { drink: { id: "capri-sun-kirsche-200", label: "Capri-Sun Kirsche", kind: "pouch" } }, tags: ["caprisun", "kinder"] },
  {
    id: "10-cola-ranking",
    template: "ranking",
    props: {
      question: "Welche Cola hat am meisten Zucker?",
      subject: "Sechs Colas",
      metric: "per100",
      items: [
        { id: "coca-cola-classic-500", label: "Coca-Cola" },
        { id: "pepsi-500", label: "Pepsi" },
        { id: "afri-cola-classic-330", label: "afri cola" },
        { id: "fritz-kola-original-330", label: "fritz-kola" },
        { id: "vita-cola-original-1000", label: "Vita Cola" },
        { id: "coca-cola-zero-sugar-500", label: "Coca-Cola Zero" },
      ],
    },
    tags: ["cola", "cocacola", "pepsi"],
  },
  {
    id: "11-eistee-ranking",
    template: "ranking",
    props: {
      question: "Welcher Eistee hat am meisten Zucker?",
      subject: "Fünf Eistees",
      metric: "per100",
      items: [
        { id: "lipton-ice-tea-zitrone-500", label: "Lipton Zitrone" },
        { id: "fuze-tea-pfirsich-1250", label: "Fuze Tea Pfirsich" },
        { id: "arizona-iced-tea-peach-500", label: "Arizona Peach" },
        { id: "durstloescher-eistee-zitrone-500", label: "Durstlöscher Zitrone" },
        { id: "pfanner-ice-tea-pfirsich-2000", label: "Pfanner Pfirsich" },
      ],
    },
    tags: ["eistee", "icetea"],
  },
  { id: "12-cola-fill", template: "fill", props: { drink: { id: "coca-cola-classic-500", label: "Cola" }, answer: 2 }, tags: ["cola", "cocacola"] },
];

const footer = (tags: string[]) => `\n\nAlle Werte mit Quelle auf zuckerhaltig.de\n\n${["zucker", ...tags, "ernährung", "wissen"].map((tag) => `#${tag}`).join(" ")}`;

// Caption text for the post, built from the same data as the video.
export function caption(video: VideoConfig) {
  if (video.template === "duel") {
    const a = loadDrink(video.props.a);
    const b = loadDrink(video.props.b);
    const [more, less] = a.total >= b.total ? [a, b] : [b, a];
    const per100 = Math.abs(a.per100 - b.per100) < 0.05 ? `Pro 100 ml gleich: ${format(a.per100)} g.` : `Pro 100 ml: ${a.label} ${format(a.per100)} g, ${b.label} ${format(b.per100)} g.`;
    return `${a.label} oder ${b.label}? ${per100} Pro Packung: ${format(more.total)} g in ${sizeLabel(more.sizeMl)} ${more.label} gegen ${format(less.total)} g in ${sizeLabel(less.sizeMl)} ${less.label}.${footer(video.tags)}`;
  }
  if (video.template === "cubes") {
    const item = loadDrink(video.props.drink);
    return `${item.label}, ${sizeLabel(item.sizeMl)}: ${format(item.total)} g Zucker, rund ${format(item.cubes)} Zuckerwürfel. Das sind ${Math.round((item.total / 50) * 100)} % der 50 g, die WHO und DGE Erwachsenen als Obergrenze am Tag nennen.${footer(video.tags)}`;
  }
  if (video.template === "fill") {
    const item = loadDrink(video.props.drink);
    const share = Math.round((item.total / 50) * 100);
    return `Hättest du's gewusst? In ${sizeLabel(item.sizeMl)} ${item.label} stecken ${format(item.total)} g Zucker, rund ${format(Math.round(item.cubes))} Zuckerwürfel. Das sind ${share} % der 50 g, die die WHO als Obergrenze für einen ganzen Tag nennt. Was war dein Tipp?${footer(video.tags)}`;
  }
  const items = video.props.items.map(loadDrink).sort((x, y) => y.per100 - x.per100);
  return `${video.props.question} Zucker pro 100 ml: ${items.map((item) => `${item.label} ${format(item.per100)} g`).join(", ")}.${footer(video.tags)}`;
}
