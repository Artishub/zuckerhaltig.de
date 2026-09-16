export type FeaturedBrandPage = {
  id: string;
  intro: string;
  knowledgeHref: string;
  knowledgeLabel: string;
  comparison?: {
    title: string;
    intro: string;
    drinkIds: string[];
    note?: string;
  };
  editorial?: {
    title: string;
    intro: string;
    points: Array<{
      title: string;
      text: string;
    }>;
  };
};

export const featuredBrandPages: FeaturedBrandPage[] = [
  {
    id: "coca-cola",
    intro: "Wie viel Zucker steckt in Coca-Cola? Classic, Zero Sugar, Light und weitere Sorten lassen sich hier pro 100 ml und pro Packung vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Zucker einordnen",
    editorial: {
      title: "Coca-Cola Classic, Zero und weitere Sorten im Vergleich",
      intro: "Bei der Frage nach Zucker in Coca-Cola kommt es zuerst auf die Sorte an. Classic, Zero Sugar, Light, Cherry und Vanilla stehen deshalb mit ihren jeweiligen Nährwerten in der Übersicht.",
      points: [
        { title: "Classic liefert die Rechenbasis", text: "10,6 g Zucker je 100 ml ergeben in der 500-ml-Flasche 53 g. Die Packungsgröße kommt erst nach dem Grundwert ins Spiel." },
        { title: "Zero Sugar und Light getrennt", text: "Beide Varianten haben eigene Nährwerte und Quellen. Sie gehören nicht in den Zuckerwert von Coca-Cola Classic." },
        { title: "Cherry und Vanilla bleiben eigene Sorten", text: "Aromen ändern das Produkt. Deshalb führt die Übersicht die beiden Varianten mit ihrem jeweiligen Namen und Datensatz." },
        { title: "100 ml oder ganze Flasche", text: "Der Wert je 100 ml macht verschiedene Gebinde vergleichbar. Die Rechnung pro Packung zeigt, was eine 330- oder 500-ml-Flasche insgesamt enthält." },
      ],
    },
    comparison: {
      title: "Coca-Cola-Produkte in 500 ml verglichen",
      intro: "Classic, Zero Sugar, Light, Cherry und Vanilla stehen auf derselben Füllmenge nebeneinander. So lässt sich der Unterschied zwischen den Sorten ohne Größenwechsel lesen.",
      drinkIds: ["coca-cola-classic-500", "coca-cola-zero-sugar-500", "coca-cola-light-500", "coca-cola-cherry-500", "coca-cola-vanilla-500"],
      note: "Die Tabelle vergleicht Zucker pro 100 ml und pro 500 ml. Eine Bewertung von Geschmack oder Süßungsmitteln ist nicht enthalten.",
    },
  },
  {
    id: "red-bull",
    intro: "Wie viel Zucker hat Red Bull? Energy Drink, Editions und Sugarfree lassen sich nach Sorte, Dosengröße und Zucker pro Packung vergleichen.",
    knowledgeHref: "/de/wissen/energy-drinks-zucker-vergleichen",
    knowledgeLabel: "Energy Drinks vergleichen",
    editorial: {
      title: "Red Bull: Zucker nach Sorte und Dosengröße",
      intro: "Bei Red Bull hängt die Gesamtmenge Zucker von der Rezeptur und von der Dose ab. Original, Editions und Sugarfree werden deshalb getrennt betrachtet.",
      points: [
        { title: "Die Dose verändert die Summe", text: "250, 355 und 473 ml können denselben Grundwert je 100 ml haben, enthalten als ganze Dose aber unterschiedlich viel Zucker." },
        { title: "Original und Sugarfree", text: "Sugarfree steht mit seiner eigenen Rezeptur in der Liste. Der Zuckerwert des Originals bleibt davon unberührt." },
        { title: "Jede Edition hat ihren Datensatz", text: "Apricot und andere Editions sind keine verkleideten Original-Dosen. Der Produktname und die zugehörige Quelle bleiben erhalten." },
        { title: "Koffein separat lesen", text: "80 mg Koffein pro 250 ml gehören zu einer anderen Angabe als der Zuckerwert. Die beiden Zahlen werden deshalb nicht miteinander verrechnet." },
      ],
    },
    comparison: {
      title: "Red Bull in 250, 355 und 473 ml",
      intro: "Original, eine größere Dose, Sugarfree und eine Edition zeigen, wie Sorte und Füllmenge den Zucker pro Packung verändern.",
      drinkIds: ["red-bull-energy-drink-250", "red-bull-energy-drink-355", "red-bull-energy-drink-473", "red-bull-sugarfree-250", "red-bull-apricot-edition-250"],
      note: "Koffein erscheint nur dort, wo die verknüpfte Quelle den Wert ausdrücklich nennt.",
    },
  },
  {
    id: "fanta",
    intro: "Wie viel Zucker hat Fanta? Fanta Orange, Zero-Varianten und weitere Sorten lassen sich nach Rezeptur, 100-ml-Wert und Packungsgröße vergleichen.",
    knowledgeHref: "/de/vergleiche/fanta-vs-sprite-zucker",
    knowledgeLabel: "Fanta mit Sprite vergleichen",
    editorial: {
      title: "Fanta: Zuckerwerte nach Sorte vergleichen",
      intro: "Fanta Orange ist die bekannteste Sorte, aber nicht die einzige. Orange ohne Zucker, Mango, Lemon und Mandarine stehen mit ihren eigenen Produktangaben in der Liste.",
      points: [
        { title: "Fanta Orange als Bezugspunkt", text: "Fanta Orange steht in unserem Datensatz bei 7,6 g Zucker je 100 ml. Die anderen Sorten lassen sich daran einordnen, ohne sie gleichzusetzen." },
        { title: "Zero ist ein eigenes Getränk", text: "Fanta Orange ohne Zucker und weitere Zero-Sorten haben eigene Rezepturen. Ihr niedriger Zuckerwert ersetzt nicht die Angabe von Fanta Orange." },
        { title: "Der Orangensaftanteil gehört dazu", text: "Für Fanta Orange nennt Coca-Cola 3 % Orangensaft aus Konzentrat. Ein Zuckerwert allein erzählt damit noch nicht die ganze Rezeptur." },
        { title: "Packung vor allgemeiner Suche", text: "Coca-Cola weist auf Unterschiede nach Land und zwischen Flasche und Schankanlage hin. Für eine konkrete Packung zählt das Etikett." },
      ],
    },
    comparison: {
      title: "Fanta Orange gegen Zero und weitere Sorten",
      intro: "Fanta Orange, Orange ohne Zucker, Mango ohne Zucker, Mandarine ohne Zucker und Lemon ohne Zucker stehen in einer Auswahl. So bleibt jede Rezeptur zugeordnet.",
      drinkIds: ["fanta-orange-500", "fanta-orange-ohne-zucker-500", "fanta-mango-ohne-zucker-500", "fanta-mandarine-ohne-zucker-500", "fanta-lemon-ohne-zucker-500"],
      note: "Die Herstellerseite weist auf mögliche Unterschiede zwischen geschlossenen Packungen und Schankanlagen hin.",
    },
  },
  {
    id: "monster",
    intro: "Wie viel Zucker steckt in Monster Energy? Original, Ultra und weitere 500-ml-Dosen lassen sich pro 100 ml und pro Dose vergleichen.",
    knowledgeHref: "/de/vergleiche/red-bull-vs-monster-zucker",
    knowledgeLabel: "Red Bull mit Monster vergleichen",
    editorial: {
      title: "Monster Energy: Original, Ultra und Sorten im 500-ml-Vergleich",
      intro: "Viele Monster-Dosen in der Datenbank fassen 500 ml. Dadurch lässt sich der Zucker pro Dose schnell ablesen, während die Unterschiede zwischen Original, Ultra und Editions erhalten bleiben.",
      points: [
        { title: "Original und Ultra White", text: "Beide Sorten stehen mit ihrem jeweiligen Nährwert in der Liste. Ultra White wird nicht als zuckerärmere Version von Original beschrieben." },
        { title: "500 ml pro Dose", text: "Bei einer halben Literdose lässt sich der Wert je 100 ml ohne Umweg auf die ganze Dose übertragen." },
        { title: "Mango Loco bleibt Mango Loco", text: "Die Edition bekommt keine Sammelzahl mit Original oder Ultra. Ihr Produktname bleibt die erste Orientierung." },
        { title: "Quelle an jeder Zeile", text: "Die Übersicht verknüpft Hersteller- und Händlerangaben. So lässt sich nachsehen, woher ein Nährwert stammt." },
      ],
    },
    comparison: {
      title: "Monster-Dosen mit 500 ml im Vergleich",
      intro: "Original, Mango Loco, Ultra White, Assault und Nitro haben dieselbe Füllmenge, aber unterschiedliche Produktangaben. Genau dieser Unterschied steht hier im Mittelpunkt.",
      drinkIds: ["monster-energy-original-500", "monster-mango-loco-500", "monster-ultra-white-500", "monster-energy-assault-500", "monster-energy-nitro-500"],
      note: "Die Tabelle übernimmt die verknüpften Quellen. Fehlende Zutaten- oder Koffeinangaben ergänzen wir nicht aus Vermutungen.",
    },
  },
  {
    id: "paulaner",
    intro: "Wie viel Zucker hat Paulaner Spezi? Spezi, Spezi Zero, Cola und Limonaden lassen sich nach Getränketyp, Zuckerwert und Packungsgröße vergleichen.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola und Cola-Mix einordnen",
    editorial: {
      title: "Paulaner Spezi, Cola und Limonade getrennt vergleichen",
      intro: "Paulaner führt mehrere Getränketypen. Spezi, Cola, Orange und Zitrone stehen deshalb als unterschiedliche Produkte in der Übersicht, auch wenn sie im selben Regal landen.",
      points: [
        { title: "Spezi und Spezi Zero", text: "Beide Getränke gehören zum Cola-Mix, haben aber unterschiedliche Rezepturen. Der Hub führt sie deshalb in getrennten Zeilen." },
        { title: "Paulaner Cola bleibt Cola", text: "Die Marke allein entscheidet nicht über die Kategorie. Cola wird getrennt von Spezi und den Limonaden gerechnet." },
        { title: "Orange und Zitrone", text: "Die beiden Limonaden werden mit ihren eigenen Nährwerten geführt. Ein Cola-Mix-Wert lässt sich auf sie nicht übertragen." },
        { title: "100 ml gegen 500 ml", text: "Der Basiswert eignet sich zum Vergleichen. Die Packungsrechnung zeigt, was in einer ganzen 500-ml-Flasche steckt." },
      ],
    },
    comparison: {
      title: "Spezi, Cola und Limonade von Paulaner",
      intro: "Spezi, Spezi Zero, Cola, Orange und Zitrone bilden die Produktkarte. Die klassische und die zuckerreduzierte Spezi stehen dabei nebeneinander.",
      drinkIds: ["paulaner-spezi-500", "paulaner-spezi-zero-500", "paulaner-cola-330", "paulaner-limo-orange-500", "paulaner-limo-zitrone-500"],
      note: "Die Sortierung folgt Getränketyp und Quelle, nicht einer Geschmacksrangliste.",
    },
  },
  {
    id: "sprite",
    intro: "Wie viel Zucker hat Sprite? Original, Zero Sugar und Mint Chill lassen sich nach Zucker je 100 ml, Packungsgröße und Gesamtmenge vergleichen.",
    knowledgeHref: "/de/vergleiche/fanta-vs-sprite-zucker",
    knowledgeLabel: "Sprite mit Fanta vergleichen",
    editorial: {
      title: "Sprite Original und Zero Sugar im Vergleich",
      intro: "Sprite Original, Zero Sugar und Mint Chill tragen denselben Markennamen, stehen aber für verschiedene Produktangaben. Die Tabelle verbindet Sorte und Packungsgröße.",
      points: [
        { title: "Sprite Original mit Fanta Orange", text: "Sprite Original liegt in unserem Datensatz bei 7,9 g Zucker je 100 ml. Fanta Orange liegt bei 7,6 g und dient als Vergleich aus einer anderen Limonadenfamilie." },
        { title: "Zero Sugar separat", text: "Zero Sugar und Mint Chill haben eigene Produktangaben. Aus dem Markennamen entsteht kein Durchschnitt für Sprite Original." },
        { title: "330 ml, 500 ml und 1,25 l", text: "Die Bezugsgröße je 100 ml bleibt gleich, während die Gesamtmenge mit der Flaschengröße wächst." },
        { title: "Zucker ist nur eine Kennzahl", text: "Zutaten, Süßungsmittel und Geschmack brauchen eigene Angaben. Der Hub bleibt bei den Daten, die die Quellen hergeben." },
      ],
    },
    comparison: {
      title: "Sprite Original, Zero und Fanta Orange",
      intro: "Drei Größen von Sprite Original stehen neben Sprite Zero Sugar und Fanta Orange. So lässt sich die Flaschenmenge von der Rezeptur trennen.",
      drinkIds: ["sprite-500", "sprite-330", "sprite-1250", "sprite-zero-sugar-330", "fanta-orange-500"],
      note: "Verglichen wird Zucker je 100 ml und je Packung. Die Tabelle enthält kein Geschmacksurteil.",
    },
  },
  {
    id: "spezi",
    intro: "Wie viel Zucker hat Spezi? Spezi Original und Spezi Light stehen mit Zucker je 100 ml, Packungsgröße und Gesamtzucker nebeneinander.",
    knowledgeHref: "/de/wissen/cola-zucker-pro-100ml",
    knowledgeLabel: "Cola-Mix einordnen",
    editorial: {
      title: "Spezi Original oder Light? Zucker pro Packung im Vergleich",
      intro: "Spezi Original und Spezi Light gehören zusammen, sind aber nicht dasselbe Getränk. Beide Sorten stehen mit ihrer eigenen Nährwertangabe in der Übersicht.",
      points: [
        { title: "Original und Light getrennt", text: "Light bekommt keinen Wert aus der Original-Rezeptur. Die beiden Datensätze bleiben sauber auseinandergehalten." },
        { title: "500 ml als gemeinsamer Maßstab", text: "Die gleiche Flaschengröße macht den Packungsvergleich einfach. Daneben bleibt der Wert je 100 ml erhalten." },
        { title: "Cola-Mix beschreibt die Sorte", text: "Die Kategorie sagt, um welche Getränkart es geht. Für Zucker zählt die Nährwertangabe des konkreten Produkts." },
        { title: "Quelle und Prüfdatum", text: "Auf der Detailseite steht, woher der jeweilige Spezi-Wert stammt und wann wir ihn geprüft haben." },
      ],
    },
    comparison: {
      title: "Spezi Original und Light",
      intro: "Spezi Original, Spezi Light, Paulaner Spezi und Spezi Zero zeigen vier Einträge aus der Cola-Mix-Kategorie. Die Packungsgröße bleibt dabei im Blick.",
      drinkIds: ["spezi-original-500", "spezi-light-500", "paulaner-spezi-500", "paulaner-spezi-zero-500"],
      note: "Die Seite zeigt Produktdaten. Aussagen über Geschmack oder Süßungsmittel übernehmen wir nur, wenn eine Quelle sie belegt.",
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
    editorial: {
      title: "Pepsi Original, Zero und Varianten im Zuckercheck",
      intro: "Pepsi Original, Zero Zucker, Cherry und weitere Sorten teilen sich den Markennamen, aber nicht die Nährwertangabe. Für den Vergleich zählen Sorte und Packungsgröße.",
      points: [
        { title: "Pepsi Original zuerst", text: "Die deutsche Pepsi-Produktseite führt das Original mit einem eigenen Nährwertblock und einer Portion von 250 ml." },
        { title: "Zero und Geschmacksvarianten", text: "Zero Zucker, Cherry, Lemon und Mango haben eigene Produktangaben. Daraus entsteht kein Durchschnittswert für Pepsi Original." },
        { title: "Portion und Packung sind verschieden", text: "Eine Angabe für 250 ml kann neben einer 330-, 500- oder 1.500-ml-Flasche stehen. Erst die Umrechnung beantwortet die Frage nach der ganzen Packung." },
        { title: "Offene Quellen bleiben offen", text: "Fehlen bei einer Variante vollständige Herstellerdaten, ergänzen wir nichts. Die vorhandene Quellenlage bleibt am Produkt nachvollziehbar." },
      ],
    },
    comparison: {
      title: "Pepsi Original neben Zero und Varianten",
      intro: "Die Auswahl stellt Pepsi Original, Zero Zucker und Cherry nebeneinander. 330, 500 und 1.500 ml zeigen zusätzlich, wie stark die Packungsgröße die Gesamtmenge verändert.",
      drinkIds: ["pepsi-330", "pepsi-500", "pepsi-1500", "pepsi-zero-zucker-330", "pepsi-cherry-330"],
      note: "Die Originalwerte wurden mit der deutschen Pepsi-Produktseite abgeglichen. Bei Varianten mit unvollständiger Quellenlage bleibt der Hinweis bestehen.",
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
    intro: "Wie viel Zucker hat Fuze Tea? Pfirsich, Zitrone und weitere Teegetränke lassen sich nach Sorte, Zucker je 100 ml und Flaschengröße vergleichen.",
    knowledgeHref: "/de/eistee-zucker",
    knowledgeLabel: "Eistee vergleichen",
    editorial: {
      title: "Fuze Tea: Zuckerwerte nach Sorte und Flasche",
      intro: "Fuze Tea Pfirsich und Zitrone teilen sich die Marke, schmecken laut Produktnamen aber in unterschiedliche Richtungen. Hibiskus, Kamille, Limette, Minze und Zero kommen als eigene Einträge dazu.",
      points: [
        { title: "Eistee bleibt Eistee", text: "Fuze Tea gehört in die Kategorie Eistee. Der Zuckerwert entscheidet nicht darüber, ob ein Getränk als Limonade gilt." },
        { title: "Pfirsich und Zitrone", text: "Die beiden bekannten Sorten stehen mit ihren jeweiligen Zuckerwerten und Flaschengrößen in der Übersicht." },
        { title: "Hibiskus, Kamille, Limette und Minze", text: "Die Mischungen werden beim Namen genannt, damit man die Produktangabe einer konkreten Sorte zuordnen kann." },
        { title: "Zero sagt nichts über die anderen Sorten", text: "Eine zuckerfreie Flasche verändert nicht die Werte von Pfirsich, Zitrone oder den übrigen Fuze-Tea-Produkten." },
      ],
    },
    comparison: {
      title: "Fuze Tea nach Geschmacksrichtung",
      intro: "Pfirsich und Zitrone stehen neben Hibiskus, Limette, Minze und Wassermelone. Dazu kommt eine zuckerfreie Variante, damit die Spanne innerhalb der Marke nachvollziehbar bleibt.",
      drinkIds: ["fuze-tea-pfirsich-400", "fuze-tea-zitrone-330", "fuze-tea-pfirsich-hibiskus-400", "fuze-tea-limette-minze-400", "fuze-tea-wassermelone-minze-400"],
      note: "Die Werte stammen aus der verknüpften Coca-Cola-Produktquelle und werden auf die jeweilige Flaschengröße gerechnet.",
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
