export type CategoryLandingPage = {
  id: string;
  intro: string;
};

export const categoryLandingPages: CategoryLandingPage[] = [
  { id: "cola-mix", intro: "Spezi, Mezzo Mix und weitere Cola-Mix-Getränke nach Zucker pro 100 ml und pro Packung vergleichen." },
  { id: "softdrink", intro: "Softdrinks verschiedener Marken nach Zucker pro 100 ml, Packungsgröße und Gesamtzucker vergleichen." },
  { id: "bio-limo", intro: "Bio-Limonaden nach Zucker pro 100 ml vergleichen. Bio sagt nichts über die Zuckermenge eines Getränks aus." },
  { id: "orange-limo", intro: "Orangenlimonaden von klassisch bis zuckerfrei nach Zucker pro 100 ml und pro Flasche vergleichen." },
  { id: "lemon-lime", intro: "Zitronen- und Limettenlimonaden nach Zucker pro 100 ml, Packungsgröße und Gesamtzucker vergleichen." },
  { id: "juice", intro: "Säfte nach Zucker pro 100 ml vergleichen. Die Tabelle berücksichtigt den gesamten Zucker aus der Nährwertangabe." },
  { id: "juice-drink", intro: "Fruchtsaftgetränke nach Zucker pro 100 ml und pro Packung vergleichen. Produktart und Füllmenge bleiben sichtbar." },
  { id: "schorle", intro: "Schorlen nach Zucker pro 100 ml und pro Flasche vergleichen. Entscheidend ist die konkrete Nährwertangabe." },
  { id: "mate", intro: "Mate-Getränke nach Zucker pro 100 ml, Packungsgröße und Gesamtzucker vergleichen." },
];

export const categoryLandingPageById = Object.fromEntries(
  categoryLandingPages.map((page) => [page.id, page]),
);

const establishedCategoryRoutes: Record<string, string> = {
  cola: "/de/wissen/cola-zucker-pro-100ml",
  energy: "/de/energy-drinks-zucker",
  "iced-tea": "/de/eistee-zucker",
};

export function categoryPageHref(categoryId: string) {
  if (establishedCategoryRoutes[categoryId]) return establishedCategoryRoutes[categoryId];
  return categoryLandingPageById[categoryId] ? `/de/kategorien/${categoryId}` : null;
}
