// Category landing pages. Editorial paragraphs carry category-specific facts only; the table explains itself.
export type CategoryLandingPage = {
  id: string;
  intro: string;
  editorial: {
    title: string;
    paragraphs: string[];
  };
};

export const categoryLandingPages: CategoryLandingPage[] = [
  {
    id: "cola-mix",
    intro: "Spezi, Mezzo Mix und weitere Cola-Mix-Getränke nach Zucker pro 100 ml und pro Packung vergleichen.",
    editorial: {
      title: "Cola-Mix ist nicht gleich Cola",
      paragraphs: [
        "Cola-Mix verbindet Cola mit einer fruchtigen Komponente. Für den Vergleich zählt deshalb die Nährwertangabe der konkreten Sorte – nicht nur der Markenname.",
      ],
    },
  },
  {
    id: "softdrink",
    intro: "Softdrinks verschiedener Marken nach Zucker pro 100 ml, Packungsgröße und Gesamtzucker vergleichen.",
    editorial: {
      title: "Softdrink ist eine Sammelkategorie",
      paragraphs: [
        "Softdrink fasst mehrere alkoholfreie Erfrischungsgetränke zusammen. Die Kategorie ist eine Orientierung; für den Zahlenvergleich zählt das konkrete Produkt.",
      ],
    },
  },
  {
    id: "bio-limo",
    intro: "Bio-Limonaden nach Zucker pro 100 ml vergleichen. Bio sagt nichts über die Zuckermenge eines Getränks aus.",
    editorial: {
      title: "Bio sagt nichts über die Zuckermenge",
      paragraphs: [
        "Die Bio-Kennzeichnung beschreibt die Herstellung und die dafür geltenden Vorgaben. Sie ersetzt nicht den Blick auf die Nährwerttabelle.",
      ],
    },
  },
  {
    id: "orange-limo",
    intro: "Orangenlimonaden von klassisch bis zuckerfrei nach Zucker pro 100 ml und pro Flasche vergleichen.",
    editorial: {
      title: "Orange, Zero und Saftanteil getrennt lesen",
      paragraphs: [
        "Orangenlimonaden unterscheiden sich nicht nur durch „klassisch“ oder „zero“. Produktname, Rezeptur und die Angaben auf der konkreten Packung gehören zusammen.",
        "Der Saftanteil ist eine eigene Produktinformation. Er sagt allein nicht, wie viel Zucker pro 100 ml ausgewiesen ist.",
      ],
    },
  },
  {
    id: "lemon-lime",
    intro: "Zitronen- und Limettenlimonaden nach Zucker pro 100 ml, Packungsgröße und Gesamtzucker vergleichen.",
    editorial: {
      title: "Zitrone und Limette: gleicher Stil, andere Zahlen",
      paragraphs: [
        "Lemon-Lime-Getränke wirken auf den ersten Blick ähnlich. Für den Vergleich übernehmen wir den Nährwert der jeweiligen Sorte und führen die Produkte einzeln.",
      ],
    },
  },
  {
    id: "juice",
    intro: "Säfte nach Zucker pro 100 ml vergleichen. Die Tabelle berücksichtigt den gesamten Zucker aus der Nährwertangabe.",
    editorial: {
      title: "Fruchtzucker bleibt Zucker",
      paragraphs: [
        "Bei Saft gehört der natürliche Zucker aus der Frucht zur ausgewiesenen Zuckermenge. „Ohne Zuckerzusatz“ ist deshalb nicht automatisch gleichbedeutend mit „zuckerfrei“.",
      ],
    },
  },
  {
    id: "juice-drink",
    intro: "Fruchtsaftgetränke nach Zucker pro 100 ml und pro Packung vergleichen. Produktart und Füllmenge bleiben sichtbar.",
    editorial: {
      title: "Produktart und Zuckerwert zusammen lesen",
      paragraphs: [
        "Fruchtsaftgetränke sind nicht dasselbe wie reiner Saft. Für den Vergleich bleibt deshalb die Kategorie sichtbar.",
        "Der Saftanteil und der Nährwert sind zwei verschiedene Angaben. Der Zuckerwert wird aus der Nährwerttabelle übernommen, nicht aus dem Produktnamen abgeleitet.",
      ],
    },
  },
  {
    id: "schorle",
    intro: "Schorlen nach Zucker pro 100 ml und pro Flasche vergleichen. Entscheidend ist die konkrete Nährwertangabe.",
    editorial: {
      title: "Bei Schorle entscheidet das Mischungsverhältnis mit",
      paragraphs: [
        "Schorle ist Saft mit Wasser, aber das Verhältnis ist nicht bei jedem Produkt gleich. Die konkrete Nährwertangabe bleibt deshalb der Maßstab.",
      ],
    },
  },
  {
    id: "mate",
    intro: "Mate-Getränke nach Zucker pro 100 ml, Packungsgröße und Gesamtzucker vergleichen.",
    editorial: {
      title: "Mate-Getränke: Zuckerwert und Getränketyp trennen",
      paragraphs: [
        "Mate-Getränke können sich bei Rezeptur und Gebinde unterscheiden. In dieser Kategorie geht es um den ausgewiesenen Zuckerwert des konkreten Produkts.",
      ],
    },
  },
];

export const categoryLandingPageById = Object.fromEntries(
  categoryLandingPages.map((page) => [page.id, page]),
);

const establishedCategoryRoutes: Record<string, string> = {
  cola: "/de/wissen/cola-zucker-pro-100ml",
  energy: "/de/wissen/energy-drinks-zucker-vergleichen",
  "iced-tea": "/de/wissen/eistee-zucker-im-alltag",
};

export function categoryPageHref(categoryId: string) {
  if (establishedCategoryRoutes[categoryId]) return establishedCategoryRoutes[categoryId];
  return categoryLandingPageById[categoryId] ? `/de/kategorien/${categoryId}` : null;
}
