export type FeaturedBrandPage = {
  id: string;
  intro: string;
  knowledgeHref: string;
  knowledgeLabel: string;
  // Second sentence of the meta description. Not rendered on the page.
  metaDescription?: string;
  comparison?: {
    title: string;
    drinkIds: string[];
  };
};

export const featuredBrandPages: FeaturedBrandPage[] = [
  {
    id: "coca-cola",
    intro: "Wie viel Zucker steckt in Coca-Cola? Classic, Zero Sugar, Light und weitere Sorten lassen sich hier pro 100 ml und pro Packung vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Zucker einordnen",
    metaDescription: "Bei der Frage nach Zucker in Coca-Cola kommt es zuerst auf die Sorte an. Classic, Zero Sugar, Light, Cherry und Vanilla stehen deshalb mit ihren jeweiligen Nährwerten in der Übersicht.",
    comparison: {
      title: "Coca-Cola-Produkte in 500 ml verglichen",
      drinkIds: ["coca-cola-classic-500", "coca-cola-zero-sugar-500", "coca-cola-light-500", "coca-cola-cherry-500", "coca-cola-vanilla-500"],
    },
  },
  {
    id: "red-bull",
    intro: "Wie viel Zucker hat Red Bull? Energy Drink, Editions und Sugarfree lassen sich nach Sorte, Dosengröße und Zucker pro Packung vergleichen.",
    knowledgeHref: "/de/wissen/energy-drinks-zucker-vergleichen",
    knowledgeLabel: "Energy Drinks vergleichen",
    metaDescription: "Bei Red Bull hängt die Gesamtmenge Zucker von der Rezeptur und von der Dose ab. Original, Editions und Sugarfree werden deshalb getrennt betrachtet.",
    comparison: {
      title: "Red Bull in 250, 355 und 473 ml",
      drinkIds: ["red-bull-energy-drink-250", "red-bull-energy-drink-355", "red-bull-energy-drink-473", "red-bull-sugarfree-250", "red-bull-apricot-edition-250"],
    },
  },
  {
    id: "fanta",
    intro: "Wie viel Zucker hat Fanta? Fanta Orange, Zero-Varianten und weitere Sorten lassen sich nach Rezeptur, 100-ml-Wert und Packungsgröße vergleichen.",
    knowledgeHref: "/de/vergleiche/fanta-vs-sprite-zucker",
    knowledgeLabel: "Fanta mit Sprite vergleichen",
    metaDescription: "Fanta Orange ist die bekannteste Sorte, aber nicht die einzige. Orange ohne Zucker, Mango, Lemon und Mandarine stehen mit ihren eigenen Produktangaben in der Liste.",
    comparison: {
      title: "Fanta Orange gegen Zero und weitere Sorten",
      drinkIds: ["fanta-orange-500", "fanta-orange-ohne-zucker-500", "fanta-mango-ohne-zucker-500", "fanta-mandarine-ohne-zucker-500", "fanta-lemon-ohne-zucker-500"],
    },
  },
  {
    id: "monster",
    intro: "Wie viel Zucker steckt in Monster Energy? Original, Ultra und weitere 500-ml-Dosen lassen sich pro 100 ml und pro Dose vergleichen.",
    knowledgeHref: "/de/vergleiche/red-bull-vs-monster-zucker",
    knowledgeLabel: "Red Bull mit Monster vergleichen",
    metaDescription: "Viele Monster-Dosen in der Datenbank fassen 500 ml. Dadurch lässt sich der Zucker pro Dose schnell ablesen, während die Unterschiede zwischen Original, Ultra und Editions erhalten bleiben.",
    comparison: {
      title: "Monster-Dosen mit 500 ml im Vergleich",
      drinkIds: ["monster-energy-original-500", "monster-mango-loco-500", "monster-ultra-white-500", "monster-energy-assault-500", "monster-energy-nitro-500"],
    },
  },
  {
    id: "paulaner",
    intro: "Wie viel Zucker hat Paulaner Spezi? Spezi, Spezi Zero, Cola und Limonaden lassen sich nach Getränketyp, Zuckerwert und Packungsgröße vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola und Cola-Mix einordnen",
    metaDescription: "Paulaner führt mehrere Getränketypen. Spezi, Cola, Orange und Zitrone stehen deshalb als unterschiedliche Produkte in der Übersicht, auch wenn sie im selben Regal landen.",
    comparison: {
      title: "Spezi, Cola und Limonade von Paulaner",
      drinkIds: ["paulaner-spezi-500", "paulaner-spezi-zero-500", "paulaner-cola-330", "paulaner-limo-orange-500", "paulaner-limo-zitrone-500"],
    },
  },
  {
    id: "sprite",
    intro: "Wie viel Zucker hat Sprite? Original, Zero Sugar und Mint Chill lassen sich nach Zucker je 100 ml, Packungsgröße und Gesamtmenge vergleichen.",
    knowledgeHref: "/de/vergleiche/fanta-vs-sprite-zucker",
    knowledgeLabel: "Sprite mit Fanta vergleichen",
    metaDescription: "Sprite Original, Zero Sugar und Mint Chill tragen denselben Markennamen, stehen aber für verschiedene Produktangaben. Die Tabelle verbindet Sorte und Packungsgröße.",
    comparison: {
      title: "Sprite Original, Zero und Fanta Orange",
      drinkIds: ["sprite-500", "sprite-330", "sprite-1250", "sprite-zero-sugar-330", "fanta-orange-500"],
    },
  },
  {
    id: "spezi",
    intro: "Wie viel Zucker hat Spezi? Spezi Original und Spezi Light stehen mit Zucker je 100 ml, Packungsgröße und Gesamtzucker nebeneinander.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Mix einordnen",
    metaDescription: "Spezi Original und Spezi Light gehören zusammen, sind aber nicht dasselbe Getränk. Beide Sorten stehen mit ihrer eigenen Nährwertangabe in der Übersicht.",
    comparison: {
      title: "Spezi Original und Light",
      drinkIds: ["spezi-original-500", "spezi-light-500", "paulaner-spezi-500", "paulaner-spezi-zero-500"],
    },
  },
  {
    id: "mezzo-mix",
    intro: "Mezzo Mix Original und Zero nach Zucker pro 100 ml und pro Packung vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Mix einordnen",
  },
  {
    id: "pepsi",
    intro: "Wie viel Zucker hat Pepsi? Original, Zero Zucker und weitere Varianten lassen sich nach Rezeptur, Zucker je 100 ml und Packungsgröße vergleichen.",
    knowledgeHref: "/de/vergleiche/coca-cola-vs-pepsi-zucker",
    knowledgeLabel: "Pepsi mit Coca-Cola vergleichen",
    metaDescription: "Pepsi Original, Zero Zucker, Cherry und weitere Sorten teilen sich den Markennamen, aber nicht die Nährwertangabe. Für den Vergleich zählen Sorte und Packungsgröße.",
    comparison: {
      title: "Pepsi Original neben Zero und Varianten",
      drinkIds: ["pepsi-330", "pepsi-500", "pepsi-1500", "pepsi-zero-zucker-330", "pepsi-cherry-330"],
    },
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
    knowledgeHref: "/de/wissen/eistee-zucker-im-alltag",
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
    intro: "Wie viel Zucker hat Fuze Tea? Pfirsich, Zitrone und weitere Teegetränke lassen sich nach Sorte, Zucker je 100 ml und Flaschengröße vergleichen.",
    knowledgeHref: "/de/wissen/eistee-zucker-im-alltag",
    knowledgeLabel: "Eistee vergleichen",
    metaDescription: "Fuze Tea Pfirsich und Zitrone teilen sich die Marke, schmecken laut Produktnamen aber in unterschiedliche Richtungen. Hibiskus, Kamille, Limette, Minze und Zero kommen als eigene Einträge dazu.",
    comparison: {
      title: "Fuze Tea nach Geschmacksrichtung",
      drinkIds: ["fuze-tea-pfirsich-400", "fuze-tea-zitrone-330", "fuze-tea-pfirsich-hibiskus-400", "fuze-tea-limette-minze-400", "fuze-tea-wassermelone-minze-400"],
    },
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
    knowledgeHref: "/de/wissen/eistee-zucker-im-alltag",
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
