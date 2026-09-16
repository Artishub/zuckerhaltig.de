export type FeaturedDrinkComparison = {
  title: string;
  intro: string;
  drinkIds: string[];
  note?: string;
};

export type FeaturedDrinkPackageNote = {
  label: string;
  value: string;
  text: string;
  sourceUrl: string;
};

export type FeaturedDrinkEditorial = {
  title: string;
  intro: string;
  metaDescription: string;
  points: Array<{
    title: string;
    text: string;
  }>;
  comparison: FeaturedDrinkComparison;
  packageNote?: FeaturedDrinkPackageNote;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export const featuredDrinkEditorial: Record<string, FeaturedDrinkEditorial> = {
  "coca-cola-classic-500": {
    title: "Wie viel Zucker hat Coca-Cola Classic in 500 ml?",
    intro: "Eine 500-ml-Flasche Coca-Cola Classic enthält 53 g Zucker. Auf dem Etikett stehen 10,6 g je 100 ml; für die ganze Flasche rechnen wir diesen Wert mit fünf.",
    metaDescription: "Coca-Cola Classic: 10,6 g Zucker je 100 ml und 53 g in 500 ml. Mit Zuckerwürfeln, Packungsrechnung, Variantenvergleich und Quelle.",
    points: [
      { title: "53 g Zucker pro Flasche", text: "10,6 g je 100 ml mal fünf ergibt 53 g. Erst die Umrechnung auf 500 ml beantwortet die Frage nach dem ganzen Gebinde." },
      { title: "Rund 17,7 Zuckerwürfel", text: "Für die Würfelrechnung teilen wir 53 g durch 3 g pro Würfel. Das Ergebnis wird auf eine Nachkommastelle gerundet." },
      { title: "Classic ist nicht Zero", text: "Coca-Cola Zero Sugar und Light haben andere Rezepturen und Nährwerte. Deshalb tauchen sie nicht in der Classic-Rechnung auf." },
      { title: "100 ml und Flasche", text: "Der Wert je 100 ml eignet sich für den Vergleich. Die Packungsrechnung zeigt, was beim Trinken der gesamten Flasche zusammenkommt." },
    ],
    comparison: {
      title: "Coca-Cola Classic im Vergleich mit anderen Sorten",
      intro: "Wie groß ist der Unterschied zu Zero Sugar, Light, Cherry oder Vanilla? Fünf Coca-Cola-Produkte stehen auf derselben 500-ml-Größe nebeneinander.",
      drinkIds: [
        "coca-cola-classic-500",
        "coca-cola-zero-sugar-500",
        "coca-cola-light-500",
        "coca-cola-cherry-500",
        "coca-cola-vanilla-500",
      ],
      note: "Die Tabelle vergleicht Zucker pro 100 ml und pro Packung. Geschmack und Süßungsmittel werden daraus nicht abgeleitet.",
    },
    faq: [
      { question: "Wie viel Zucker hat eine 500-ml-Flasche Coca-Cola Classic?", answer: "Eine 500-ml-Flasche enthält rechnerisch 53 g Zucker. Die Rechnung basiert auf 10,6 g je 100 ml." },
      { question: "Wie viele Zuckerwürfel sind 53 g?", answer: "53 g entsprechen rund 17,7 Zuckerwürfeln, wenn ein Würfel mit 3 g gerechnet wird." },
      { question: "Ist Coca-Cola Zero Sugar in den 53 g enthalten?", answer: "Nein. Die 53 g beziehen sich ausschließlich auf Coca-Cola Classic. Zero Sugar und Light werden getrennt berechnet." },
      { question: "Warum rechnen wir mit 100 ml?", answer: "100 ml sind die gemeinsame Bezugsgröße auf der Nährwerttabelle. Damit lassen sich verschiedene Flaschen und Dosen vergleichen, bevor die Packungsgröße einfließt." },
    ],
  },
  "fanta-orange-500": {
    title: "Wie viel Zucker hat Fanta Orange in 500 ml?",
    intro: "In 500 ml Fanta Orange stecken rechnerisch 38 g Zucker. Die deutsche Coca-Cola-Produktseite nennt 7,6 g je 100 ml und 3 % Orangensaft aus Konzentrat.",
    metaDescription: "Fanta Orange: 7,6 g Zucker je 100 ml und 38 g in 500 ml. Mit Orangensaftanteil, Zuckerwürfeln, Variantenvergleich und Quelle.",
    points: [
      { title: "38 g in der 500-ml-Flasche", text: "7,6 g je 100 ml mal fünf ergibt 38 g Zucker. Der Packungswert ist die Zahl, die für die ganze Flasche zählt." },
      { title: "3 % Orangensaft aus Konzentrat", text: "Die Herstellerseite nennt diesen Anteil für Fanta Orange. Der Zuckerwert allein beschreibt die Rezeptur deshalb nicht vollständig." },
      { title: "Orange ohne Zucker bleibt separat", text: "Fanta Orange ohne Zucker steht mit 0,3 g Zucker je 100 ml als eigenes Produkt in der Datenbank." },
      { title: "Das Etikett entscheidet", text: "Laut Coca-Cola können sich Angaben je nach Land oder Schankanlage unterscheiden. Für die Flasche in deiner Hand gilt die dort abgedruckte Nährwerttabelle." },
    ],
    comparison: {
      title: "Fanta Orange gegen Zero und andere Sorten",
      intro: "Fanta Orange, Orange ohne Zucker, Mango ohne Zucker und Mandarine ohne Zucker stehen mit ihren jeweiligen Angaben in einer Tabelle. So lässt sich die Rezeptur vergleichen, ohne Sorten zu vermischen.",
      drinkIds: [
        "fanta-orange-500",
        "fanta-orange-ohne-zucker-500",
        "fanta-mango-ohne-zucker-500",
        "fanta-mandarine-ohne-zucker-500",
      ],
      note: "Die Angaben beziehen sich auf geschlossene Packungen. Bei Fanta aus einer Schankanlage können andere Nährwerte gelten.",
    },
    faq: [
      { question: "Wie viel Zucker hat Fanta Orange in 500 ml?", answer: "500 ml Fanta Orange enthalten rechnerisch 38 g Zucker. Der Ausgangswert beträgt 7,6 g je 100 ml." },
      { question: "Wie viel Orangensaft steckt in Fanta Orange?", answer: "Die deutsche Coca-Cola-Produktseite nennt 3 % Orangensaft aus Orangensaftkonzentrat." },
      { question: "Ist Fanta Orange ohne Zucker dasselbe Getränk?", answer: "Nein. Die zuckerfreie Variante hat eine eigene Rezeptur und steht mit 0,3 g Zucker je 100 ml separat in der Datenbank." },
      { question: "Kann Fanta aus dem Restaurant andere Werte haben?", answer: "Ja. Coca-Cola weist auf mögliche Unterschiede zwischen geschlossenen Packungen und Schankanlagen hin. Für die genaue Portion gilt die Angabe vor Ort." },
    ],
  },
  "paulaner-spezi-500": {
    title: "Wie viel Zucker hat Paulaner Spezi in 500 ml?",
    intro: "Eine 500-ml-Flasche Paulaner Spezi enthält rechnerisch 46 g Zucker. Der Nährwert liegt bei 9,2 g je 100 ml, das entspricht rund 15,3 Zuckerwürfeln pro Flasche.",
    metaDescription: "Paulaner Spezi: 9,2 g Zucker je 100 ml und 46 g in 500 ml. Mit Zuckerwürfeln, Cola-Mix-Vergleich, Packungsrechnung und Quelle.",
    points: [
      { title: "46 g pro 500 ml", text: "9,2 g je 100 ml mal fünf ergibt 46 g. Die Zahl beschreibt die gesamte Flasche, nicht nur eine Portion von 100 ml." },
      { title: "Ein Cola-Mix", text: "Paulaner führt Spezi als Cola-Mix mit Cola- und Fruchtkomponenten. Deshalb passt der Vergleich mit anderen Cola-Mix-Getränken besser als ein reiner Cola-Vergleich." },
      { title: "330 ml oder 500 ml?", text: "Bei derselben Rezeptur kommen 330 ml auf rund 30,4 g Zucker. In der 500-ml-Flasche sind es 46 g." },
      { title: "Spezi Zero nicht einrechnen", text: "Paulaner Spezi Zero hat einen eigenen Datensatz. Der niedrigere Wert gehört zur Zero-Variante und verändert die Classic-Rechnung nicht." },
    ],
    comparison: {
      title: "Paulaner Spezi, Zero, Cola und Limo im Vergleich",
      intro: "Die Auswahl führt durch die Paulaner-Produktfamilie: klassische Spezi, Spezi Zero, Cola und Limonade. Jede Karte zeigt die passende Sorte und Packungsgröße.",
      drinkIds: [
        "paulaner-spezi-500",
        "paulaner-spezi-330",
        "paulaner-spezi-zero-500",
        "paulaner-cola-330",
        "paulaner-limo-orange-500",
      ],
      note: "Die Reihenfolge folgt der Produktfamilie. Sie ist keine Rangliste für Geschmack oder Qualität.",
    },
    faq: [
      { question: "Wie viel Zucker hat Paulaner Spezi in 500 ml?", answer: "500 ml Paulaner Spezi enthalten rechnerisch 46 g Zucker. Die Grundlage sind 9,2 g je 100 ml." },
      { question: "Warum zählt Paulaner Spezi als Cola-Mix?", answer: "Paulaner führt Spezi als Cola-Mix und nennt neben Cola- auch Fruchtkomponenten. Deshalb wird das Getränk nicht als klassische Cola eingeordnet." },
      { question: "Wie viel Zucker stecken in 330 ml Paulaner Spezi?", answer: "Bei 9,2 g je 100 ml enthalten 330 ml rechnerisch rund 30,4 g Zucker." },
      { question: "Ist Spezi Zero in den 46 g enthalten?", answer: "Nein. Die 46 g beziehen sich ausschließlich auf Paulaner Spezi. Spezi Zero wird mit seinen eigenen Nährwerten berechnet." },
    ],
  },
  "sprite-500": {
    title: "Wie viel Zucker hat Sprite in 500 ml?",
    intro: "Eine 500-ml-Flasche Sprite enthält 39,5 g Zucker. Der Ausgangswert beträgt 7,9 g je 100 ml; daraus ergeben sich rund 13,2 Zuckerwürfel.",
    metaDescription: "Sprite: 7,9 g Zucker je 100 ml und 39,5 g in 500 ml. Mit Zuckerwürfeln, Größenvergleich, Sprite Zero und Quelle.",
    points: [
      { title: "39,5 g Zucker pro Flasche", text: "7,9 g je 100 ml mal fünf ergibt 39,5 g. Die Rechnung bezieht sich auf Sprite Original in 500 ml." },
      { title: "Etwas mehr als Fanta Orange", text: "Sprite liegt in diesem Datensatz bei 7,9 g je 100 ml, Fanta Orange bei 7,6 g. Der Abstand ist klein, aber messbar." },
      { title: "Sprite Zero bleibt außen vor", text: "Sprite Zero Sugar hat eine andere Rezeptur und wird separat geführt. Der Wert der klassischen Sprite bleibt dadurch eindeutig." },
      { title: "330 ml, 500 ml oder 1,25 l", text: "Der Wert je 100 ml bleibt gleich vergleichbar. Die Gesamtmenge steigt mit der Füllmenge." },
    ],
    comparison: {
      title: "Sprite Original, Zero und Fanta im Vergleich",
      intro: "Die Tabelle verbindet drei Sprite-Größen mit Sprite Zero Sugar und Fanta Orange. So sieht man schnell, ob der Unterschied von der Sorte oder von der Füllmenge kommt.",
      drinkIds: [
        "sprite-500",
        "sprite-330",
        "sprite-1250",
        "sprite-zero-sugar-330",
        "fanta-orange-500",
      ],
      note: "Verglichen wird Zucker pro 100 ml und pro Packung. Zutaten, Süßungsmittel und Geschmack stehen für sich.",
    },
    faq: [
      { question: "Wie viel Zucker hat Sprite in 500 ml?", answer: "Eine 500-ml-Flasche Sprite enthält rechnerisch 39,5 g Zucker. Der Wert je 100 ml beträgt 7,9 g." },
      { question: "Hat Sprite mehr Zucker als Fanta Orange?", answer: "In diesem Datensatz enthält Sprite 7,9 g Zucker je 100 ml, Fanta Orange 7,6 g. Sprite liegt damit leicht darüber." },
      { question: "Ist Sprite Zero in den 39,5 g enthalten?", answer: "Nein. Die 39,5 g beziehen sich ausschließlich auf Sprite Original in 500 ml. Sprite Zero Sugar steht separat." },
      { question: "Wie viele Zuckerwürfel sind 39,5 g?", answer: "39,5 g geteilt durch 3 g pro Würfel ergeben rund 13,2 Zuckerwürfel." },
    ],
  },
  "red-bull-energy-drink-250": {
    title: "Wie viel Zucker hat eine 250-ml-Dose Red Bull?",
    intro: "Red Bull nennt 27 g Zucker für eine 250-ml-Dose. Rechnet man den Nährwert von 11 g je 100 ml auf 250 ml hoch, ergeben sich 27,5 g; die kleine Abweichung kommt durch Rundung zustande.",
    metaDescription: "Red Bull Energy Drink: 11 g Zucker je 100 ml, 27 g laut Hersteller pro 250 ml und 27,5 g rechnerisch. Mit Dosenvergleich und Quelle.",
    points: [
      { title: "11 g je 100 ml", text: "Dieser Wert ist die gemeinsame Rechenbasis für die verschiedenen Red-Bull-Dosen." },
      { title: "27 g oder 27,5 g?", text: "Auf der Produktseite nennt Red Bull 27 g pro 250 ml. Die Rechnung mit 11 g je 100 ml ergibt 27,5 g. Beide Angaben werden deshalb erklärt, nicht versteckt." },
      { title: "Die Füllmenge zählt mit", text: "250 ml, 355 ml und 473 ml haben dieselbe Bezugsgröße, aber eine andere Gesamtmenge Zucker." },
      { title: "Koffein ist eine andere Angabe", text: "Red Bull nennt 80 mg Koffein pro 250 ml. Dieser Wert kommt aus einer eigenen Angabe und fließt nicht in die Zuckerrechnung ein." },
    ],
    comparison: {
      title: "Red Bull in verschiedenen Dosengrößen",
      intro: "250, 355 und 473 ml zeigen, wie die Füllmenge den Zucker pro Dose verändert. Sugarfree und eine Edition machen den Sortenvergleich komplett.",
      drinkIds: [
        "red-bull-energy-drink-250",
        "red-bull-energy-drink-355",
        "red-bull-energy-drink-473",
        "red-bull-sugarfree-250",
        "red-bull-apricot-edition-250",
      ],
      note: "Für die 250-ml-Dose stehen die Herstellerangabe von 27 g und der rechnerische Wert von 27,5 g getrennt in der Erklärung.",
    },
    packageNote: {
      label: "Herstellerangabe",
      value: "27 g",
      text: "Red Bull nennt auf der Produktseite 27 g Zucker für eine 250-ml-Dose. Mit 11 g je 100 ml ergibt unsere Rechnung 27,5 g. Die Differenz entsteht durch die Rundung.",
      sourceUrl: "https://www.redbull.com/de-de/energydrink/products/red-bull-energy-drink",
    },
    faq: [
      { question: "Wie viel Zucker hat eine 250-ml-Dose Red Bull?", answer: "Red Bull nennt 27 g Zucker pro Dose. Die Rechnung mit 11 g je 100 ml ergibt 27,5 g; die Differenz entsteht durch Rundung." },
      { question: "Warum zeigt Zuckerhaltig.de 27,5 g?", answer: "Wir rechnen 11 g × 250 ml ÷ 100. Das ergibt 27,5 g und macht die Rechenbasis nachvollziehbar." },
      { question: "Wie viel Koffein enthält Red Bull in 250 ml?", answer: "Red Bull nennt 80 mg Koffein pro 250 ml. Die Angabe steht getrennt vom Zuckerwert und wird nicht aus ihm berechnet." },
      { question: "Hat eine größere Red-Bull-Dose mehr Zucker?", answer: "Bei gleicher Rezeptur steigt die Gesamtmenge mit der Füllmenge. Deshalb enthält eine 355- oder 473-ml-Dose mehr Zucker als 250 ml." },
    ],
  },
};
