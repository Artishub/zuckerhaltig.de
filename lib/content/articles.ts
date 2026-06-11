export type Article = {
  slug: string;
  title: string;
  description: string;
  minutes: number;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "zucker-pro-100ml-verstehen",
    title: "Zucker pro 100 ml richtig lesen",
    description: "Warum der kleine Vergleichswert wichtig ist und wo er täuschen kann.",
    minutes: 3,
    body: [
      "Der Wert pro 100 ml macht Getränke vergleichbar, unabhängig von Dose, Flasche oder Karton.",
      "Für die Alltagseinschätzung zählt zusätzlich die Packungsgröße. Ein moderater Wert kann bei einer Literpackung trotzdem viel Zucker bedeuten.",
      "Zuckerhaltig.de zeigt deshalb beide Werte nebeneinander: pro 100 ml und pro Gebinde.",
    ],
  },
  {
    slug: "zuckerwuerfel-als-orientierung",
    title: "Was Zuckerwürfel aussagen",
    description: "Eine grobe, verständliche Umrechnung für den schnellen Blick.",
    minutes: 2,
    body: [
      "Ein Zuckerwürfel wird hier mit 3 g Zucker gerechnet. Das ist eine einfache Orientierung, keine Laborgröße.",
      "Die Umrechnung hilft, Gesamtmengen besser einzuschätzen. Besonders bei großen Flaschen wird der Unterschied schnell sichtbar.",
    ],
  },
  {
    slug: "saft-ist-nicht-automatisch-zuckerarm",
    title: "Warum Saft nicht automatisch zuckerarm ist",
    description: "Fruchtzucker bleibt Zucker, auch wenn er natürlich vorkommt.",
    minutes: 3,
    body: [
      "Viele Säfte enthalten keinen zugesetzten Zucker, bringen aber natürlicherweise relevante Mengen Zucker mit.",
      "Für die Nährwertbetrachtung zählt die Gesamtmenge Zucker. Deshalb stehen Säfte in der Datenbank neben Limos, Eistees und Milchgetränken.",
    ],
  },
  {
    slug: "energy-drinks-zucker-vergleichen",
    title: "Energy Drinks nach Zucker vergleichen",
    description: "Warum kleine Dosen trotzdem hohe Zuckerwerte haben können.",
    minutes: 4,
    body: [
      "Energy Drinks werden häufig in 250-ml-Dosen verkauft. Das Gebinde wirkt klein, der Wert pro 100 ml liegt aber oft im oberen Bereich.",
      "Für den Vergleich lohnt sich deshalb beides: pro 100 ml für die Rezeptur und pro Dose für die tatsächlich getrunkene Menge.",
      "Editionen einer Marke können ähnliche Zuckerwerte haben. Die Zusammenfassung in der Getränkesuche hilft, Varianten schneller als Gruppe zu prüfen.",
    ],
  },
  {
    slug: "cola-zero-light-und-klassisch",
    title: "Cola, Zero und Light einordnen",
    description: "Was sich beim Zuckerwert unterscheidet und was nicht auf dem Etikett steht.",
    minutes: 4,
    body: [
      "Klassische Cola enthält meist deutlich Zucker, während Zero- und Light-Varianten in der Regel mit sehr wenig oder keinem Zucker deklariert sind.",
      "Der Zuckerwert allein erklärt aber nicht jedes Thema: Süßstoffe, Koffein und persönliche Gewohnheiten stehen auf einem anderen Blatt.",
      "Zuckerhaltig.de konzentriert sich bewusst auf messbare Nährwerte, damit Produkte fair vergleichbar bleiben.",
    ],
  },
  {
    slug: "eistee-zucker-im-alltag",
    title: "Eistee: oft unterschätzt",
    description: "Warum Eistee im Alltag schnell zur Zuckerquelle wird.",
    minutes: 3,
    body: [
      "Eistee wird oft wie Wasser nebenbei getrunken. Je nach Rezeptur kann er aber relevante Mengen Zucker enthalten.",
      "Große Flaschen sind dabei besonders wichtig: Ein moderater Wert pro 100 ml kann sich bei einem Liter deutlich summieren.",
      "Wer Eistees vergleicht, sollte daher Packungsgröße und Rezeptur gleichzeitig ansehen.",
    ],
  },
  {
    slug: "packungsgroesse-entscheidet",
    title: "Warum Packungsgröße entscheidet",
    description: "Der gleiche Zuckerwert kann je nach Flasche ganz anders wirken.",
    minutes: 3,
    body: [
      "Ein Getränk mit 8 g Zucker pro 100 ml enthält in 250 ml deutlich weniger Gesamtzucker als in 1,5 Litern.",
      "Deshalb ist die höchste Süße pro 100 ml nicht immer identisch mit der höchsten Zuckerlast pro Gebinde.",
      "Die Datenbank trennt beide Perspektiven, damit kleine Dosen und große Flaschen nicht verwechselt werden.",
    ],
  },
  {
    slug: "kindergetraenke-und-zucker",
    title: "Kindergetränke und Zucker",
    description: "Trinkpäckchen, Saftgetränke und kleine Portionen richtig lesen.",
    minutes: 4,
    body: [
      "Kindergetränke erscheinen oft klein portioniert. Trotzdem lohnt sich ein Blick auf Zucker pro 100 ml.",
      "Gerade bei Trinkpäckchen ist die Packung schnell leer. Die absolute Menge wirkt kleiner, kann aber bei häufiger Nutzung relevant werden.",
      "Eine neutrale Datenansicht hilft Eltern und Betreuungspersonen, Produkte ohne Marketingversprechen zu vergleichen.",
    ],
  },
  {
    slug: "zuckerfreie-getraenke-in-der-datenbank",
    title: "Warum auch zuckerfreie Getränke auftauchen",
    description: "Zero-Werte sind wichtig, damit der Vergleich vollständig bleibt.",
    minutes: 2,
    body: [
      "Zuckerfreie oder zuckerarme Varianten zeigen, wie stark Rezepturen innerhalb einer Marke auseinandergehen können.",
      "Sie helfen außerdem beim Filtern: Wer gezielt niedrige Zuckerwerte sucht, braucht diese Produkte in derselben Datenbank.",
      "Die Seite bewertet diese Getränke nicht pauschal, sondern zeigt den deklarierten Zuckerwert transparent an.",
    ],
  },
];

export const articleBySlug = Object.fromEntries(articles.map((article) => [article.slug, article]));
