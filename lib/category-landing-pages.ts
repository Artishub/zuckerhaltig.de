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
        "Der Wert je 100 ml macht die Produkte vergleichbar. Daneben steht der rechnerische Zucker für das hinterlegte Gebinde, damit unterschiedliche Flaschengrößen nicht in einer Zahl verschwimmen.",
        "Spezi, Mezzo Mix und ähnliche Produkte werden als eigene Datensätze geführt. Rezeptur, Füllmenge und Quelle bleiben an der jeweiligen Zeile.",
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
        "Der Wert je 100 ml zeigt, wie sich Marken und Sorten vergleichen lassen. Der Packungswert beantwortet die zweite Frage: Wie viel steckt in der Dose oder Flasche vor dir?",
        "Zero- und Light-Varianten bleiben getrennt, genauso wie unterschiedliche Gebinde. So entsteht keine Mischzahl aus verschiedenen Rezepturen.",
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
        "In dieser Übersicht vergleichen wir Bio-Limonaden nach Zucker je 100 ml. Der Wert pro Flasche wird erst aus dem hinterlegten Gebinde berechnet.",
        "Auch bei ähnlicher Bezeichnung bleiben Rezeptur, Füllmenge und Quelle getrennt. Das ist wichtig, wenn eine Marke mehrere Limonaden führt.",
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
        "Für die Rangfolge verwenden wir Zucker je 100 ml; daneben rechnen wir den Wert des hinterlegten Gebindes aus. So bleibt die Bezugsgröße sichtbar.",
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
        "Eine Flasche mit mehr Inhalt hat bei gleichem 100-ml-Wert entsprechend mehr Gesamtzucker. Deshalb zeigt jedes Gebinde seinen eigenen Packungswert.",
        "Zero-Varianten sind kein Durchschnitt der klassischen Rezeptur. Sie bleiben als eigene Produkte mit eigener Quelle in der Übersicht.",
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
        "Wir stellen den Wert je 100 ml in den Vordergrund. Der Packungswert folgt aus der Füllmenge, sofern sie für das Produkt hinterlegt ist.",
        "Säfte werden separat von Nektar, Schorle und Fruchtsaftgetränken geführt, damit die Produktart beim Vergleich erkennbar bleibt.",
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
        "Wie viel insgesamt in einer Packung steckt, hängt von der Füllmenge ab. Die Tabelle zeigt deshalb den 100-ml-Wert und die Rechnung für das Gebinde.",
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
        "Wir vergleichen zuerst Zucker je 100 ml und rechnen daraus den Wert für das hinterlegte Gebinde. So lässt sich eine Flasche mit einer Dose vergleichen.",
        "Eine Schorle darf nicht automatisch mit Saft oder einer anderen Schorle gleichgesetzt werden. Produktname und Quelle bleiben sichtbar.",
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
        "Die Tabelle macht den Wert je 100 ml und pro Flasche sichtbar. Ein größeres Gebinde verändert die Gesamtmenge auch dann, wenn der Basiswert gleich bleibt.",
        "Angaben wie Koffein oder Zutaten gehören in die jeweilige Quelle. Wir ergänzen sie nicht aus dem Markennamen.",
      ],
    },
  },
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
