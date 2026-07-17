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
    intro: "Die Begriffe auf dem Etikett, kurz erklärt.",
    items: [
      {
        question: "Wie viel Zucker pro 100 ml ist in Getränken viel?",
        answer: "Der 100-ml-Wert zeigt die Rezeptur. Ab etwa 8 bis 10 g Zucker pro 100 ml liegt ein Getränk bei vielen Softdrinks, Eistees und Energy Drinks eher weit oben.",
      },
      {
        question: "Wie berechnet man Zucker pro Flasche oder Dose?",
        answer: "Rechne Zucker pro 100 ml mal Packungsgröße in ml, dann geteilt durch 100. Bei 10 g pro 100 ml und 500 ml sind das 50 g Zucker.",
      },
      {
        question: "Wie viele Gramm Zucker hat ein Zuckerwürfel?",
        answer: "Zuckerhaltig.de rechnet mit 3 g pro Würfel. 30 g Zucker entsprechen damit ungefähr 10 Zuckerwürfeln.",
      },
      {
        question: "Ist Fruchtzucker in Saft auch Zucker?",
        answer: "Ja. Auf dem Nährwertetikett zählt die gesamte Zuckermenge, also auch natürlich vorkommender Fruchtzucker in Saft, Nektar oder Schorle.",
      },
      {
        question: "Warum hat dasselbe Getränk manchmal andere Zuckerwerte?",
        answer: "Rezeptur, Land, Größe und Sorte können abweichen. Im Zweifel zählt die aktuelle Verpackung oder die Angabe des Herstellers.",
      },
    ],
  },
  {
    id: "gesundheit",
    title: "Gesundheit & Alltag",
    intro: "Was die Zahlen leisten, und was nicht.",
    items: [
      {
        question: "Sind die Zuckerwerte medizinische Empfehlungen?",
        answer: "Nein. Die Seite erklärt Nährwerte und macht Produkte vergleichbar. Sie ersetzt keine Ernährungsberatung.",
      },
      {
        question: "Warum sind zuckerhaltige Getränke ungesund?",
        answer: "Sie liefern schnell Zucker und Energie, sättigen aber kaum. Bei häufigem Konsum kann das die tägliche Zucker- und Kalorienmenge stark erhöhen.",
      },
      {
        question: "Ist ein Energy Drink oder eine Cola am Tag schädlich?",
        answer: "Ein einzelnes Getränk entscheidet das nicht. Menge, Häufigkeit und der restliche Alltag zählen mehr.",
      },
      {
        question: "Warum ist Zucker in Getränken schlecht für die Zähne?",
        answer: "Zucker kann Karies begünstigen, wenn er häufig konsumiert wird und lange Kontakt mit den Zähnen hat.",
      },
      {
        question: "Sind Zero-Getränke und Light-Getränke besser als normale Cola?",
        answer: "Für die reine Zuckerfrage schneiden sie meist niedriger ab. Das ist kein allgemeines Gesundheitsurteil, denn Süßstoffe, Koffein, Säuren und Trinkgewohnheiten sind eigene Themen.",
      },
      {
        question: "Ist Aspartam krebserregend?",
        answer: "Die IARC stuft Aspartam als möglicherweise krebserregend ein. Das beschreibt eine mögliche Gefährdung, nicht das Risiko bei einer bestimmten Menge. JECFA und EFSA halten bis zu 40 mg pro Kilogramm Körpergewicht und Tag für die Allgemeinbevölkerung für akzeptabel.",
      },
      {
        question: "Für wen ist Aspartam ungeeignet?",
        answer: "Menschen mit Phenylketonurie müssen Phenylalanin streng begrenzen. Aspartamhaltige Lebensmittel tragen deshalb einen entsprechenden Hinweis auf dem Etikett.",
      },
      {
        question: "Wo stehen Süßstoffe auf dem Etikett?",
        answer: "Die Zutatenliste nennt Süßstoffe mit Namen oder E-Nummer, zum Beispiel Aspartam oder E 951. Zuckerhaltig.de erfasst Zutaten derzeit nicht für einzelne Produkte.",
      },
      {
        question: "Helfen Süßstoffe langfristig beim Abnehmen?",
        answer: "Die WHO empfiehlt, zuckerfreie Süßstoffe nicht als langfristige Strategie zur Gewichtskontrolle zu verwenden. Diese bedingte Empfehlung ist keine Sicherheitsbewertung einzelner Stoffe.",
      },
    ],
  },
  {
    id: "berechnung",
    title: "Zucker berechnen",
    intro: "Die einfachen Rechnungen hinter den Angaben.",
    items: [
      {
        question: "Wie rechne ich Zucker pro 100 ml auf 500 ml um?",
        answer: "Zucker pro 100 ml mal Packungsgröße in ml geteilt durch 100. Beispiel: 10 g/100 ml bei 500 ml ergibt 50 g.",
      },
      {
        question: "Wie rechnet man Zucker in Zuckerwürfel um?",
        answer: "Teile den Gesamtzucker in Gramm durch 3. Das Ergebnis wird auf eine Dezimalstelle gerundet.",
      },
      {
        question: "Warum sind Zuckerangaben manchmal gerundet?",
        answer: "Viele Etiketten runden bereits. Die Website rundet ebenfalls, damit Vergleiche lesbar bleiben.",
      },
      {
        question: "Warum gibt es ein Getränk mehrfach mit 250 ml, 330 ml oder 500 ml?",
        answer: "Jede Größe braucht einen eigenen Datensatz, weil sich der Gesamtzucker mit der Packung ändert.",
      },
      {
        question: "Warum sortiert die Getränkesuche zuerst nach Zucker pro 100 ml?",
        answer: "Der Wert zeigt die Süße der Rezeptur unabhängig von der Flaschengröße. Deshalb eignet er sich als Startpunkt.",
      },
    ],
  },
  {
    id: "daten",
    title: "Daten, Quellen & Genauigkeit",
    intro: "Wie du die Daten einordnest.",
    items: [
      {
        question: "Warum finde ich ein bestimmtes Getränk nicht?",
        answer: "Die Datenbank wächst schrittweise. Noch nicht jedes Getränk und nicht jede Packungsgröße ist erfasst.",
      },
      {
        question: "Woher kommen die Zuckerwerte der Getränke?",
        answer: "Jeder Drink-Eintrag führt einen Quellenhinweis. Werte sollten aus Verpackungen, Herstellerseiten oder verlässlichen Produktdaten stammen.",
      },
      {
        question: "Wie aktuell sind die Nährwerte und Zuckerangaben?",
        answer: "Produkte ändern sich. Vor Kauf, Veröffentlichung oder genauer Auswertung solltest du die aktuelle Verpackung prüfen.",
      },
      {
        question: "Ist Zuckerhaltig.de mit Coca-Cola, Red Bull oder Monster verbunden?",
        answer: "Marken dienen der Einordnung und Filterung. Die Seite ist kein offizieller Partner der genannten Hersteller.",
      },
      {
        question: "Kommen weitere Getränke und Marken dazu?",
        answer: "Ja. Die aktuelle Struktur ist lokal und typisiert, lässt sich aber später durch Datenbank, CMS oder Importpipeline ersetzen.",
      },
    ],
  },
  {
    id: "nutzung",
    title: "Suche & Vergleich nutzen",
    intro: "Schneller zum passenden Eintrag.",
    items: [
      {
        question: "Wie finde ich den Zuckerwert von Coca-Cola, Fanta oder Monster?",
        answer: "Nutze die Suche im Header oder auf der Getränkeseite. Sie filtert nach Produkt- und Markennamen.",
      },
      {
        question: "Wie kann ich alle Getränke einer Marke anzeigen?",
        answer: "Nutze den Markenfilter in der Getränkesuche. Die Marken-Karten führen ebenfalls direkt zur gefilterten Ansicht.",
      },
      {
        question: "Wie vergleiche ich Cola, Eistee, Saft und Energy Drinks?",
        answer: "Nutze den Kategorie-Filter, um etwa Eistee, Softdrinks, Energy Drinks oder Säfte getrennt zu betrachten.",
      },
      {
        question: "Wie finde ich Getränke mit wenig Zucker?",
        answer: "Nutze den Zuckerfilter oder sortiere nach Zucker pro 100 ml. So findest du Zero-Produkte und zuckerärmere Varianten schneller.",
      },
      {
        question: "Speichert Zuckerhaltig.de meine Suche oder Filter?",
        answer: "Nein. Die Suche nutzt lokale Filter im Browser und URL-Parameter, aber keine Nutzerkonten oder gespeicherten Listen.",
      },
    ],
  },
];

export const faq = faqCategories.flatMap((category) => category.items);
