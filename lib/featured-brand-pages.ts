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
  {
    id: "sprite",
    intro: "Sprite und Zero-Varianten nach Zucker pro 100 ml und pro Packung vergleichen.",
    knowledgeHref: "/de/vergleiche/fanta-vs-sprite-zucker",
    knowledgeLabel: "Sprite mit Fanta vergleichen",
  },
  {
    id: "spezi",
    intro: "Spezi-Produkte nach Zucker pro 100 ml, Packungsgröße und Gesamtzucker vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Mix einordnen",
  },
  {
    id: "mezzo-mix",
    intro: "Mezzo Mix Original und Zero nach Zucker pro 100 ml und pro Packung vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Mix einordnen",
  },
  {
    id: "pepsi",
    intro: "Pepsi Original, Zero und weitere Varianten nach Zucker pro 100 ml und pro Packung vergleichen.",
    knowledgeHref: "/de/vergleiche/coca-cola-vs-pepsi-zucker",
    knowledgeLabel: "Pepsi mit Coca-Cola vergleichen",
  },
  {
    id: "bionade",
    intro: "Bionade-Sorten nach Zucker pro 100 ml und pro Flasche vergleichen.",
    knowledgeHref: "/de/wissen/zucker-pro-100ml-verstehen",
    knowledgeLabel: "Zuckerwerte einordnen",
  },
  {
    id: "fritz-kola",
    intro: "fritz-kola, Limonaden und Schorlen der Marke nach Zucker pro 100 ml und pro Flasche vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Zucker einordnen",
  },
  {
    id: "pfanner",
    intro: "Pfanner Eistee, Saft und weitere Getränke nach Zucker pro 100 ml und pro Packung vergleichen.",
    knowledgeHref: "/de/eistee-zucker",
    knowledgeLabel: "Eistee vergleichen",
  },
  {
    id: "thomas-henry",
    intro: "Thomas Henry Bitterlimonaden und Mixer nach Zucker pro 100 ml und pro Flasche vergleichen.",
    knowledgeHref: "/de/wissen/zucker-pro-100ml-verstehen",
    knowledgeLabel: "Zuckerwerte einordnen",
  },
  {
    id: "vita-cola",
    intro: "VITA COLA und VITA COLA Mix nach Zucker pro 100 ml und pro Flasche vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Zucker einordnen",
  },
  {
    id: "gerolsteiner",
    intro: "Gerolsteiner Erfrischungsgetränke und Schorlen nach Zucker pro 100 ml und pro Flasche vergleichen.",
    knowledgeHref: "/de/wissen/zucker-pro-100ml-verstehen",
    knowledgeLabel: "Zuckerwerte einordnen",
  },
  {
    id: "fuze-tea",
    intro: "Fuze Tea Pfirsich, Zitrone und weitere Sorten nach Zucker pro 100 ml und pro Flasche vergleichen.",
    knowledgeHref: "/de/eistee-zucker",
    knowledgeLabel: "Eistee vergleichen",
  },
  {
    id: "club-mate",
    intro: "Club-Mate, Cola und weitere Sorten nach Zucker pro 100 ml und pro Flasche vergleichen.",
    knowledgeHref: "/de/wissen/zucker-pro-100ml-verstehen",
    knowledgeLabel: "Zuckerwerte einordnen",
  },
  {
    id: "lipton",
    intro: "Lipton Ice Tea nach Sorte, Zucker pro 100 ml und Packungsgröße vergleichen.",
    knowledgeHref: "/de/eistee-zucker",
    knowledgeLabel: "Eistee vergleichen",
  },
  {
    id: "schweppes",
    intro: "Schweppes Mixer und Zero-Varianten nach Zucker pro 100 ml und pro Flasche vergleichen.",
    knowledgeHref: "/de/wissen/zucker-pro-100ml-verstehen",
    knowledgeLabel: "Zuckerwerte einordnen",
  },
];

export const featuredBrandPageById = Object.fromEntries(
  featuredBrandPages.map((page) => [page.id, page]),
);

export function brandPageHref(brandId: string) {
  return featuredBrandPageById[brandId] ? `/de/marken/${brandId}` : null;
}
