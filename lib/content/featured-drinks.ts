export type FeaturedDrinkComparison = {
  title: string;
  drinkIds: string[];
};

export type FeaturedDrinkPackageNote = {
  label: string;
  value: string;
  text: string;
  sourceUrl: string;
};

// Hand-written notes for allowlisted drinks. Only facts the page does not already show
// (no restated package math, no "100 ml vs. bottle" explanations).
export type FeaturedDrinkEditorial = {
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
    metaDescription: "Coca-Cola Classic: 10,6 g Zucker je 100 ml und 53 g in 500 ml. Mit Zuckerwürfeln, Packungsrechnung, Variantenvergleich und Quelle.",
    points: [],
    comparison: {
      title: "Coca-Cola Classic im Vergleich mit anderen Sorten",
      drinkIds: [
        "coca-cola-classic-500",
        "coca-cola-zero-sugar-500",
        "coca-cola-light-500",
        "coca-cola-cherry-500",
        "coca-cola-vanilla-500",
      ],
    },
    faq: [
      { question: "Wie viel Zucker hat eine 500-ml-Flasche Coca-Cola Classic?", answer: "Eine 500-ml-Flasche enthält rechnerisch 53 g Zucker. Die Rechnung basiert auf 10,6 g je 100 ml." },
      { question: "Wie viele Zuckerwürfel sind 53 g?", answer: "53 g entsprechen rund 17,7 Zuckerwürfeln, wenn ein Würfel mit 3 g gerechnet wird." },
      { question: "Ist Coca-Cola Zero Sugar in den 53 g enthalten?", answer: "Nein. Die 53 g beziehen sich ausschließlich auf Coca-Cola Classic. Zero Sugar und Light werden getrennt berechnet." },
    ],
  },
  "fanta-orange-500": {
    metaDescription: "Fanta Orange: 7,6 g Zucker je 100 ml und 38 g in 500 ml. Mit Orangensaftanteil, Zuckerwürfeln, Variantenvergleich und Quelle.",
    points: [
      { title: "3 % Orangensaft", text: "Laut Herstellerseite enthält Fanta Orange 3 % Orangensaft aus Konzentrat." },
      { title: "Flasche oder Zapfanlage", text: "Laut Coca-Cola können die Angaben je nach Land oder Schankanlage abweichen. Maßgeblich ist die Nährwerttabelle auf der Packung." },
    ],
    comparison: {
      title: "Fanta Orange gegen Zero und andere Sorten",
      drinkIds: [
        "fanta-orange-500",
        "fanta-orange-ohne-zucker-500",
        "fanta-mango-ohne-zucker-500",
        "fanta-mandarine-ohne-zucker-500",
      ],
    },
    faq: [
      { question: "Wie viel Zucker hat Fanta Orange in 500 ml?", answer: "500 ml Fanta Orange enthalten rechnerisch 38 g Zucker. Der Ausgangswert beträgt 7,6 g je 100 ml." },
      { question: "Wie viel Orangensaft steckt in Fanta Orange?", answer: "Die deutsche Coca-Cola-Produktseite nennt 3 % Orangensaft aus Orangensaftkonzentrat." },
      { question: "Ist Fanta Orange ohne Zucker dasselbe Getränk?", answer: "Nein. Die zuckerfreie Variante hat eine eigene Rezeptur und steht mit 0,3 g Zucker je 100 ml separat in der Datenbank." },
      { question: "Kann Fanta aus dem Restaurant andere Werte haben?", answer: "Ja. Coca-Cola weist auf mögliche Unterschiede zwischen geschlossenen Packungen und Schankanlagen hin. Für die genaue Portion gilt die Angabe vor Ort." },
    ],
  },
  "paulaner-spezi-500": {
    metaDescription: "Paulaner Spezi: 9,2 g Zucker je 100 ml und 46 g in 500 ml. Mit Zuckerwürfeln, Cola-Mix-Vergleich, Packungsrechnung und Quelle.",
    points: [
      { title: "Cola-Mix, keine Cola", text: "Paulaner führt Spezi als Cola-Mix mit Cola- und Fruchtkomponenten. Vergleichbar ist es deshalb mit Mezzo Mix und anderen Cola-Mix-Getränken." },
    ],
    comparison: {
      title: "Paulaner Spezi, Zero, Cola und Limo im Vergleich",
      drinkIds: [
        "paulaner-spezi-500",
        "paulaner-spezi-330",
        "paulaner-spezi-zero-500",
        "paulaner-cola-330",
        "paulaner-limo-orange-500",
      ],
    },
    faq: [
      { question: "Wie viel Zucker hat Paulaner Spezi in 500 ml?", answer: "500 ml Paulaner Spezi enthalten rechnerisch 46 g Zucker. Die Grundlage sind 9,2 g je 100 ml." },
      { question: "Warum zählt Paulaner Spezi als Cola-Mix?", answer: "Paulaner führt Spezi als Cola-Mix und nennt neben Cola- auch Fruchtkomponenten. Deshalb wird das Getränk nicht als klassische Cola eingeordnet." },
      { question: "Wie viel Zucker stecken in 330 ml Paulaner Spezi?", answer: "Bei 9,2 g je 100 ml enthalten 330 ml rechnerisch rund 30,4 g Zucker." },
      { question: "Ist Spezi Zero in den 46 g enthalten?", answer: "Nein. Die 46 g beziehen sich ausschließlich auf Paulaner Spezi. Spezi Zero wird mit seinen eigenen Nährwerten berechnet." },
    ],
  },
  "sprite-500": {
    metaDescription: "Sprite: 7,9 g Zucker je 100 ml und 39,5 g in 500 ml. Mit Zuckerwürfeln, Größenvergleich, Sprite Zero und Quelle.",
    points: [
      { title: "Knapp über Fanta Orange", text: "Sprite hat 7,9 g Zucker je 100 ml, Fanta Orange 7,6 g." },
    ],
    comparison: {
      title: "Sprite Original, Zero und Fanta im Vergleich",
      drinkIds: [
        "sprite-500",
        "sprite-330",
        "sprite-1250",
        "sprite-zero-sugar-330",
        "fanta-orange-500",
      ],
    },
    faq: [
      { question: "Wie viel Zucker hat Sprite in 500 ml?", answer: "Eine 500-ml-Flasche Sprite enthält rechnerisch 39,5 g Zucker. Der Wert je 100 ml beträgt 7,9 g." },
      { question: "Hat Sprite mehr Zucker als Fanta Orange?", answer: "In diesem Datensatz enthält Sprite 7,9 g Zucker je 100 ml, Fanta Orange 7,6 g. Sprite liegt damit leicht darüber." },
      { question: "Ist Sprite Zero in den 39,5 g enthalten?", answer: "Nein. Die 39,5 g beziehen sich ausschließlich auf Sprite Original in 500 ml. Sprite Zero Sugar steht separat." },
      { question: "Wie viele Zuckerwürfel sind 39,5 g?", answer: "39,5 g geteilt durch 3 g pro Würfel ergeben rund 13,2 Zuckerwürfel." },
    ],
  },
  "red-bull-energy-drink-250": {
    metaDescription: "Red Bull Energy Drink: 11 g Zucker je 100 ml, 27 g laut Hersteller pro 250 ml und 27,5 g rechnerisch. Mit Dosenvergleich und Quelle.",
    points: [
      { title: "80 mg Koffein", text: "Red Bull nennt auf der Produktseite 80 mg Koffein pro 250-ml-Dose." },
    ],
    comparison: {
      title: "Red Bull in verschiedenen Dosengrößen",
      drinkIds: [
        "red-bull-energy-drink-250",
        "red-bull-energy-drink-355",
        "red-bull-energy-drink-473",
        "red-bull-sugarfree-250",
        "red-bull-apricot-edition-250",
      ],
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
    ],
  },
};
