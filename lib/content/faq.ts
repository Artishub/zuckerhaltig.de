export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  intro: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "grundlagen",
    title: "Zucker in Getränken verstehen",
    intro: "Häufig gesuchte Fragen zu Zucker pro 100 ml, Gesamtzucker und Zuckerwürfeln.",
    items: [
      {
        question: "Wie viel Zucker pro 100 ml ist in Getränken viel?",
        answer: "Der Wert Zucker pro 100 ml zeigt, wie süß die Rezeptur ist. Ab etwa 8 bis 10 g Zucker pro 100 ml liegt ein Getränk im Vergleich vieler Softdrinks, Eistees und Energy Drinks eher hoch.",
      },
      {
        question: "Wie berechnet man Zucker pro Flasche oder Dose?",
        answer: "Zucker pro 100 ml wird mit der Packungsgröße multipliziert und durch 100 geteilt. 10 g Zucker pro 100 ml ergeben bei 500 ml zum Beispiel 50 g Zucker pro Flasche oder Dose.",
      },
      {
        question: "Wie viele Gramm Zucker hat ein Zuckerwürfel?",
        answer: "Zuckerhaltig.de rechnet mit 3 g Zucker pro Zuckerwürfel. Damit lassen sich Angaben wie 30 g Zucker schnell als ungefähr 10 Zuckerwürfel verstehen.",
      },
      {
        question: "Ist Fruchtzucker in Saft auch Zucker?",
        answer: "Ja. Auf dem Nährwertetikett zählt die gesamte Zuckermenge, also auch natürlich vorkommender Fruchtzucker in Saft, Nektar oder Schorle.",
      },
      {
        question: "Warum hat dasselbe Getränk manchmal andere Zuckerwerte?",
        answer: "Rezepturen, Länder, Gebindegrößen und Produktvarianten können sich unterscheiden. Maßgeblich bleibt immer die aktuelle Verpackung oder Herstellerangabe.",
      },
    ],
  },
  {
    id: "gesundheit",
    title: "Gesundheit & Alltag",
    intro: "Suchfragen zu Zucker, Kalorien, Zähnen und zuckerfreien Getränken.",
    items: [
      {
        question: "Sind die Zuckerwerte medizinische Empfehlungen?",
        answer: "Nein. Die Seite erklärt Nährwerte und macht Produkte vergleichbar. Sie ersetzt keine Ernährungsberatung.",
      },
      {
        question: "Warum sind zuckerhaltige Getränke ungesund?",
        answer: "Sie können schnell viel Zucker und Energie liefern, ohne stark zu sättigen. Häufiger Konsum kann dadurch ungünstige Ernährungsgewohnheiten fördern.",
      },
      {
        question: "Ist ein Energy Drink oder eine Cola am Tag schädlich?",
        answer: "Ein einzelnes Getränk entscheidet nicht über Gesundheit. Wichtiger sind Menge, Häufigkeit und der gesamte Lebensstil.",
      },
      {
        question: "Warum ist Zucker in Getränken schlecht für die Zähne?",
        answer: "Zucker kann Karies begünstigen, wenn er häufig konsumiert wird und lange Kontakt mit den Zähnen hat.",
      },
      {
        question: "Sind Zero-Getränke und Light-Getränke besser als normale Cola?",
        answer: "Sie enthalten meist weniger Zucker, sind aber nicht automatisch die beste Wahl für jeden Zweck. Wasser bleibt die neutralste Option.",
      },
    ],
  },
  {
    id: "berechnung",
    title: "Zucker berechnen",
    intro: "Formeln für Zucker pro 100 ml, Gesamtzucker, Kalorien und Zuckerwürfel.",
    items: [
      {
        question: "Wie rechne ich Zucker pro 100 ml auf 500 ml um?",
        answer: "Zucker pro 100 ml mal Packungsgröße in ml geteilt durch 100. Beispiel: 10 g/100 ml bei 500 ml ergibt 50 g.",
      },
      {
        question: "Wie rechnet man Zucker in Zuckerwürfel um?",
        answer: "Gesamtzucker in Gramm geteilt durch 3. Das Ergebnis wird auf eine gut lesbare Dezimalstelle gerundet.",
      },
      {
        question: "Warum sind Zuckerangaben manchmal gerundet?",
        answer: "Nährwertangaben sind für Verbraucher gedacht und oft selbst gerundet. Die Website rundet, damit Vergleiche lesbar bleiben.",
      },
      {
        question: "Warum gibt es ein Getränk mehrfach mit 250 ml, 330 ml oder 500 ml?",
        answer: "Jede Packungsgröße sollte als eigener Datensatz behandelt werden, weil der Gesamtzucker anders ausfällt.",
      },
      {
        question: "Warum sortiert die Getränkesuche zuerst nach Zucker pro 100 ml?",
        answer: "Dieser Wert zeigt die Süße des Getränks unabhängig von der Flaschengröße und ist deshalb der fairste Startvergleich.",
      },
    ],
  },
  {
    id: "daten",
    title: "Daten, Quellen & Genauigkeit",
    intro: "Fragen zu Quellen, Aktualität und verlässlichen Zuckerwerten.",
    items: [
      {
        question: "Warum finde ich ein bestimmtes Getränk nicht?",
        answer: "Das MVP nutzt lokale Beispieldaten. Die Struktur ist bewusst so vorbereitet, dass später eine Datenbank oder ein CMS ergänzt werden kann.",
      },
      {
        question: "Woher kommen die Zuckerwerte der Getränke?",
        answer: "Im MVP stehen Beispielwerte mit Quellenhinweis. Später sollten Werte aus Verpackungsangaben, Herstellerseiten oder verlässlichen Produktdaten stammen.",
      },
      {
        question: "Wie aktuell sind die Nährwerte und Zuckerangaben?",
        answer: "Produkte können sich ändern. Vor Kauf oder Veröffentlichung sollte der Wert immer gegen die aktuelle Verpackung geprüft werden.",
      },
      {
        question: "Ist Zuckerhaltig.de mit Coca-Cola, Red Bull oder Monster verbunden?",
        answer: "Marken dienen der Einordnung und Filterung. Die Seite ist kein offizieller Partner der genannten Hersteller.",
      },
      {
        question: "Kommen weitere Getränke und Marken dazu?",
        answer: "Ja. Die Datenstruktur ist lokal und typisiert, kann aber später durch CMS, Datenbank oder Importpipeline ersetzt werden.",
      },
    ],
  },
  {
    id: "nutzung",
    title: "Suche & Vergleich nutzen",
    intro: "So findest du Getränke, Marken, Kategorien und niedrige Zuckerwerte.",
    items: [
      {
        question: "Wie finde ich den Zuckerwert von Coca-Cola, Fanta oder Monster?",
        answer: "Nutze die Suche im Header oder auf der Getränkeseite. Sie filtert nach Produkt- und Markennamen.",
      },
      {
        question: "Wie kann ich alle Getränke einer Marke anzeigen?",
        answer: "Er zeigt nur Getränke einer Marke. Marken-Karten verlinken direkt zur passenden gefilterten Ansicht.",
      },
      {
        question: "Wie vergleiche ich Cola, Eistee, Saft und Energy Drinks?",
        answer: "Nutze den Kategorie-Filter, um etwa Eistee, Softdrinks, Energy Drinks oder Säfte getrennt zu betrachten.",
      },
      {
        question: "Wie finde ich Getränke mit wenig Zucker?",
        answer: "Er hilft, große Gebinde mit hoher Gesamtmenge auszublenden oder gezielt zu finden.",
      },
      {
        question: "Speichert Zuckerhaltig.de meine Suche oder Filter?",
        answer: "Nein. Das MVP nutzt lokale Filter im Browser und URL-Parameter, aber keine Nutzerkonten oder gespeicherten Listen.",
      },
    ],
  },
];

export const faq = faqCategories.flatMap((category) => category.items);
