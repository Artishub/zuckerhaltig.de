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
    title: "Grundlagen",
    intro: "Die wichtigsten Begriffe rund um Zuckerangaben auf Getränken.",
    items: [
      {
        question: "Was bedeutet Zucker pro 100 ml?",
        answer: "Der Wert zeigt, wie viel Zucker in 100 ml eines Getränks enthalten ist. Er macht kleine Dosen, große Flaschen und Kartons vergleichbar.",
      },
      {
        question: "Warum zeigt die Seite zusätzlich Gesamtzucker?",
        answer: "Für den Alltag zählt oft das ganze Gebinde. 10 g pro 100 ml wirken abstrakt, ergeben bei 500 ml aber 50 g Zucker.",
      },
      {
        question: "Was ist ein Zuckerwürfel in dieser Datenbank?",
        answer: "Zuckerhaltig.de rechnet grob mit 3 g pro Würfel. Das ist eine verständliche Orientierung, keine exakte Normgröße.",
      },
      {
        question: "Sind natürliche Zucker anders als zugesetzter Zucker?",
        answer: "Auf dem Nährwertetikett zählt die gesamte Zuckermenge. Ob Zucker natürlich vorkommt oder zugesetzt wurde, steht dort nicht immer getrennt.",
      },
      {
        question: "Warum können ähnliche Produkte verschiedene Werte haben?",
        answer: "Rezepturen, Länder, Gebinde und Produktvarianten können sich unterscheiden. Maßgeblich bleibt immer die aktuelle Verpackung.",
      },
    ],
  },
  {
    id: "gesundheit",
    title: "Gesundheit",
    intro: "Einordnung ohne medizinische Beratung.",
    items: [
      {
        question: "Sind die Werte medizinische Empfehlungen?",
        answer: "Nein. Die Seite erklärt Nährwerte und macht Produkte vergleichbar. Sie ersetzt keine Ernährungsberatung.",
      },
      {
        question: "Warum stehen zuckerhaltige Getränke in der Kritik?",
        answer: "Sie können schnell viel Zucker und Energie liefern, ohne stark zu sättigen. Häufiger Konsum kann dadurch ungünstige Ernährungsgewohnheiten fördern.",
      },
      {
        question: "Kann ein einzelnes Getränk schaden?",
        answer: "Ein einzelnes Getränk entscheidet nicht über Gesundheit. Wichtiger sind Menge, Häufigkeit und der gesamte Lebensstil.",
      },
      {
        question: "Warum ist Zucker für Zähne relevant?",
        answer: "Zucker kann Karies begünstigen, wenn er häufig konsumiert wird und lange Kontakt mit den Zähnen hat.",
      },
      {
        question: "Sind Light- oder Zero-Getränke automatisch besser?",
        answer: "Sie enthalten meist weniger Zucker, sind aber nicht automatisch die beste Wahl für jeden Zweck. Wasser bleibt die neutralste Option.",
      },
    ],
  },
  {
    id: "berechnung",
    title: "Berechnung",
    intro: "So entstehen die Werte in der Datenbank.",
    items: [
      {
        question: "Wie wird Gesamtzucker berechnet?",
        answer: "Zucker pro 100 ml mal Packungsgröße in ml geteilt durch 100. Beispiel: 10 g/100 ml bei 500 ml ergibt 50 g.",
      },
      {
        question: "Wie werden Zuckerwürfel berechnet?",
        answer: "Gesamtzucker in Gramm geteilt durch 3. Das Ergebnis wird auf eine gut lesbare Dezimalstelle gerundet.",
      },
      {
        question: "Warum wird gerundet?",
        answer: "Nährwertangaben sind für Verbraucher gedacht und oft selbst gerundet. Die Website rundet, damit Vergleiche lesbar bleiben.",
      },
      {
        question: "Was passiert bei mehreren Packungsgrößen?",
        answer: "Jede Packungsgröße sollte als eigener Datensatz behandelt werden, weil der Gesamtzucker anders ausfällt.",
      },
      {
        question: "Warum ist pro 100 ml die Standardsortierung?",
        answer: "Dieser Wert zeigt die Süße des Getränks unabhängig von der Flaschengröße und ist deshalb der fairste Startvergleich.",
      },
    ],
  },
  {
    id: "daten",
    title: "Daten & Quellen",
    intro: "Wie Produktdaten gepflegt und bewertet werden.",
    items: [
      {
        question: "Warum fehlen Produkte?",
        answer: "Das MVP nutzt lokale Beispieldaten. Die Struktur ist bewusst so vorbereitet, dass später eine Datenbank oder ein CMS ergänzt werden kann.",
      },
      {
        question: "Woher kommen die Zuckerwerte?",
        answer: "Im MVP stehen Beispielwerte mit Quellenhinweis. Später sollten Werte aus Verpackungsangaben, Herstellerseiten oder verlässlichen Produktdaten stammen.",
      },
      {
        question: "Wie aktuell sind die Werte?",
        answer: "Produkte können sich ändern. Vor Kauf oder Veröffentlichung sollte der Wert immer gegen die aktuelle Verpackung geprüft werden.",
      },
      {
        question: "Warum werden Markenlogos angezeigt?",
        answer: "Logos helfen bei der schnellen Orientierung. Sie ersetzen keine offizielle Partnerschaft oder Empfehlung.",
      },
      {
        question: "Kann die Datenbank später wachsen?",
        answer: "Ja. Die Datenstruktur ist lokal und typisiert, kann aber später durch CMS, Datenbank oder Importpipeline ersetzt werden.",
      },
    ],
  },
  {
    id: "nutzung",
    title: "Nutzung der Seite",
    intro: "Suche, Filter und Sortierung praktisch verwenden.",
    items: [
      {
        question: "Wie finde ich ein bestimmtes Getränk?",
        answer: "Nutze die Suche im Header oder auf der Getränkeseite. Sie filtert nach Produkt- und Markennamen.",
      },
      {
        question: "Was macht der Markenfilter?",
        answer: "Er zeigt nur Getränke einer Marke. Marken-Karten verlinken direkt zur passenden gefilterten Ansicht.",
      },
      {
        question: "Wie vergleiche ich Kategorien?",
        answer: "Nutze den Kategorie-Filter, um etwa Eistee, Softdrinks, Energy Drinks oder Säfte getrennt zu betrachten.",
      },
      {
        question: "Warum gibt es einen Gesamtzucker-Filter?",
        answer: "Er hilft, große Gebinde mit hoher Gesamtmenge auszublenden oder gezielt zu finden.",
      },
      {
        question: "Speichert die Seite meine Auswahl?",
        answer: "Nein. Das MVP nutzt lokale Filter im Browser und URL-Parameter, aber keine Nutzerkonten oder gespeicherten Listen.",
      },
    ],
  },
];

export const faq = faqCategories.flatMap((category) => category.items);
