export type FeaturedBrandPage = {
  id: string;
  intro: string;
  knowledgeHref: string;
  knowledgeLabel: string;
};

export const featuredBrandPages: FeaturedBrandPage[] = [
  {
    id: "coca-cola",
    intro: "Classic, Zero Sugar, Light und weitere Varianten nach Zucker pro 100 ml und pro Packung vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Zucker einordnen",
  },
  {
    id: "red-bull",
    intro: "Energy Drink, Editions und Sugarfree nach Zucker pro 100 ml und pro Dose vergleichen.",
    knowledgeHref: "/de/wissen/energy-drinks-zucker-vergleichen",
    knowledgeLabel: "Energy Drinks vergleichen",
  },
  {
    id: "fanta",
    intro: "Orange, Zero-Varianten und weitere Sorten anhand der hinterlegten Nährwertangaben vergleichen.",
    knowledgeHref: "/de/vergleiche/fanta-vs-sprite-zucker",
    knowledgeLabel: "Fanta mit Sprite vergleichen",
  },
  {
    id: "monster",
    intro: "Original, Ultra-Varianten und weitere Sorten nach Zucker pro 100 ml und pro Dose vergleichen.",
    knowledgeHref: "/de/vergleiche/red-bull-vs-monster-zucker",
    knowledgeLabel: "Red Bull mit Monster vergleichen",
  },
  {
    id: "paulaner",
    intro: "Spezi, Spezi Zero, Cola und Limonaden anhand der hinterlegten Werte vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola und Cola-Mix einordnen",
  },
];

export const featuredBrandPageById = Object.fromEntries(
  featuredBrandPages.map((page) => [page.id, page]),
);

export function brandPageHref(brandId: string) {
  return featuredBrandPageById[brandId] ? `/de/marken/${brandId}` : null;
}
