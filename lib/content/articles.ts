export type Article = {
  slug: string;
  title: string;
  description: string;
  minutes: number;
  body: string[];
  quickAnswer?: string;
  sections?: {
    heading: string;
    paragraphs: string[];
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  sources?: { label: string; url: string }[];
};

export const articles: Article[] = [
  {
    slug: "zucker-pro-100ml-verstehen",
    title: "Wie viel Zucker pro 100 ml ist viel?",
    description: "Zucker pro 100 ml verstehen: Cola, Eistee, Energy Drinks, Saft und Limo fair vergleichen.",
    minutes: 3,
    body: [
      "Eine allgemeine Grenze dafür, ab wann ein Getränk viel Zucker hat, gibt es nicht. Für Angaben auf Verpackungen gelten aber feste EU-Schwellen: Als zuckerarm darf ein Getränk bis 2,5 g Zucker pro 100 ml bezeichnet werden, als zuckerfrei bis 0,5 g.",
      "Zur Einordnung nennt die Deutsche Gesellschaft für Ernährung für viele zuckergesüßte Getränke etwa 80 bis 100 g Zucker pro Liter. Das entspricht 8 bis 10 g pro 100 ml.",
      "Der Wert pro 100 ml macht unterschiedliche Getränke vergleichbar. Die Packungsgröße zeigt anschließend, wie viel Zucker insgesamt enthalten ist. Ein Getränk mit 8 g pro 100 ml kommt bei 250 ml auf 20 g und bei 1 Liter auf 80 g.",
      "Lies deshalb zuerst Zucker pro 100 ml und dann die Füllmenge. Aus beiden Werten lässt sich der Gesamtzucker berechnen: Zucker pro 100 ml mal Milliliter, geteilt durch 100.",
      "Zuckerwürfel sind nur eine Rechenhilfe. Zuckerhaltig.de teilt den Gesamtzucker durch 3 g pro Würfel, damit sich Packungen leichter vergleichen lassen.",
    ],
    sources: [
      { label: "EU-Verordnung zu den Angaben zuckerarm und zuckerfrei", url: "https://eur-lex.europa.eu/eli/reg/2006/1924/oj?locale=de" },
      { label: "DGE: Getränke", url: "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-ernaehrungskreis/getraenke/" },
    ],
  },
  {
    slug: "zuckerwuerfel-als-orientierung",
    title: "Wie viele Zuckerwürfel sind in Getränken?",
    description: "Zuckerwürfel in Cola, Saft, Eistee und Energy Drinks berechnen: Gramm Zucker geteilt durch 3.",
    minutes: 2,
    body: [
      "35 g Zucker bleiben auf dem Etikett ziemlich abstrakt. Ungefähr 12 Zuckerwürfel versteht man schneller, auch wenn es nur eine Rechenhilfe ist.",
      "Zuckerhaltig.de nutzt 3 g Zucker pro Würfel. Würfel können je nach Hersteller etwas anders ausfallen, aber 3 g ist ein brauchbarer Richtwert für schnelle Vergleiche.",
      "Die Rechnung ist simpel: Gesamtzucker in Gramm geteilt durch 3. Eine 500-ml-Flasche mit 50 g Zucker liegt bei etwa 16,7 Zuckerwürfeln. Eine 250-ml-Dose mit 27,5 g Zucker kommt auf ungefähr 9,2 Würfel.",
      "Gerade große Packungen werden dadurch greifbarer. Ein 100-ml-Wert kann harmlos wirken, während die ganze Flasche deutlich mehr liefert.",
      "Zuckerwürfel sind kein medizinischer Grenzwert. Sie helfen nur dabei, Grammzahlen schneller zu sortieren.",
    ],
  },
  {
    slug: "cola-zucker-pro-100ml",
    title: "Wie viel Zucker hat Cola pro 100 ml?",
    description: "Wie viel Zucker hat Cola? Coca-Cola, afri cola und Cola-Mix nach 100 ml, Flasche und Zuckerwürfeln vergleichen.",
    minutes: 4,
    body: [
      "Für einen fairen Cola-Vergleich zählt zuerst der Zuckerwert pro 100 ml. So lassen sich Dose, Flasche und verschiedene Marken auf derselben Basis lesen.",
      "Der zweite Wert ist der Gesamtzucker pro Packung. Eine kleine Dose und eine 1-Liter-Flasche können denselben Wert pro 100 ml haben, enthalten insgesamt aber unterschiedliche Mengen.",
      "Classic, Zero und Light sollten getrennt gelesen werden. Der genaue Produktname ist wichtiger als die Marke allein, weil die Rezepturen deutlich voneinander abweichen können.",
      "Auch Cola-Mix ist eine eigene Gruppe. Spezi und Mezzo Mix verbinden Cola mit Orangenlimonade und müssen nicht denselben Zuckerwert wie klassische Cola haben.",
      "Die Tabelle verwendet die hinterlegten Nährwertangaben und verlinkt jedes Produkt mit Quelle und Prüfdatum. Zuckerwürfel werden mit 3 g pro Würfel berechnet.",
    ],
  },
  {
    slug: "saft-ist-nicht-automatisch-zuckerarm",
    title: "Wie viel Zucker hat Saft wirklich?",
    description: "Wie viel Zucker hat Saft? Orangensaft, Multivitaminsaft, Nektar und Fruchtsaftgetränke richtig lesen.",
    minutes: 3,
    body: [
      "Saft fühlt sich oft anders an als Limonade, weil der Zucker aus Früchten stammt oder kein zusätzlicher Haushaltszucker zugesetzt wurde. Auf dem Etikett zählt trotzdem die gesamte Zuckermenge.",
      "„Ohne Zuckerzusatz“ heißt daher nicht „zuckerarm“. Der natürlich enthaltene Fruchtzucker bleibt Teil der Nährwertangabe.",
      "Bei Nektar, Fruchtsaftgetränken und großen Saftflaschen lohnt sich der Blick auf die Größe. Ein Glas Saft ist eine andere Menge als eine 1-Liter-Flasche im Kühlschrank.",
      "Zuckerhaltig.de stellt Säfte neben Cola, Eistee, Limonade, Energy Drinks und Milchgetränke. Das bewertet die Getränke nicht gleich; es rechnet nur die Zuckerangaben nach derselben Logik.",
      "Wenn du Saft einordnen willst, prüfe Zucker pro 100 ml, Packungsgröße und Produktart. Direktsaft, Nektar und Fruchtsaftgetränk können deutlich auseinanderliegen.",
    ],
  },
  {
    slug: "energy-drinks-zucker-vergleichen",
    title: "Wie viel Zucker hat ein Energy Drink?",
    description: "Wie viel Zucker hat ein Energy Drink? Red Bull, Monster und Rockstar nach Dose, 500 ml und Zuckerwürfeln vergleichen.",
    minutes: 3,
    body: [
      "Bei Energy Drinks hängt die Antwort stark von Sorte und Dose ab. Original, Mango, Kirsche, Tropical oder Zero können nah beieinander liegen, müssen es aber nicht.",
      "250 ml und 500 ml machen einen großen Unterschied. 11 g Zucker pro 100 ml ergeben bei 500 ml bereits 55 g Zucker pro Dose.",
      "Der 100-ml-Wert zeigt, wie süß die Rezeptur ist. Der Gesamtwert zeigt, was beim Trinken der ganzen Dose zusammenkommt. Beide Werte gehören zusammen.",
      "Neben Zucker spielen Koffein, Säuren, Süßstoffe und Gewohnheit eine Rolle. Diese Seite bleibt bewusst bei Zucker- und Nährwertdaten, damit die Produkte vergleichbar bleiben.",
      "Für Suchanfragen wie „Monster Zucker 500 ml“ oder „Red Bull Zucker pro Dose“ zählt deshalb nicht nur die Marke. Entscheidend sind Sorte und konkrete Dose.",
    ],
  },
  {
    slug: "cola-zero-light-und-klassisch",
    title: "Wie viel Zucker hat Cola, Cola Zero und Cola Light?",
    description: "Wie viel Zucker hat Cola Zero, Cola Light und klassische Cola? Zucker pro 100 ml und pro Flasche vergleichen.",
    minutes: 3,
    body: [
      "Klassische Cola, Cola Zero und Cola Light gehören nicht in denselben Topf. Classic enthält in der Regel deutlich Zucker; Zero- und Light-Varianten sind meist mit wenig oder keinem Zucker deklariert.",
      "Wer nach „Wie viel Zucker hat Coca-Cola?“ sucht, sollte auf die genaue Variante achten. Classic, Zero, Light, Vanilla, Cherry oder Lemon können andere Werte haben.",
      "Auch die Größe zählt. 330 ml, 500 ml und 1 Liter führen bei gleichem 100-ml-Wert zu anderen Gesamtmengen.",
      "Zero heißt nicht, dass alle Ernährungsfragen erledigt sind. Der Zuckerwert ist niedrig, aber Süßstoffe, Koffein und Trinkgewohnheiten bleiben eigene Themen.",
      "Der praktische Vergleich läuft über die Produktseiten: Zucker pro 100 ml prüfen, Gesamtzucker ansehen, ähnliche Varianten nebeneinander legen.",
    ],
  },
  {
    slug: "eistee-zucker-im-alltag",
    title: "Wie viel Zucker hat Eistee?",
    description: "Wie viel Zucker hat Eistee? Pfirsich, Zitrone und große Flaschen nach Zucker pro 100 ml prüfen.",
    minutes: 3,
    body: [
      "Eistee wird oft nebenbei getrunken, fast wie Wasser. Genau deshalb wird sein Zuckerwert leicht unterschätzt.",
      "Je nach Marke und Sorte schwankt Zucker pro 100 ml deutlich. Manche Eistees liegen niedriger, andere nähern sich klassischen Softdrinks. Zero- und Light-Varianten verändern den Vergleich noch einmal.",
      "Die Flaschengröße ist besonders wichtig. Ein moderater 100-ml-Wert kann bei 1 Liter oder 1,5 Litern trotzdem viel Gesamtzucker ergeben.",
      "Für den Vergleich reichen wenige Werte: Zucker pro 100 ml, Gesamtzucker pro Flasche und Zuckerwürfel. Dann sieht man schnell, ob ein Eistee nur leicht gesüßt ist oder als ganze Flasche deutlich ins Gewicht fällt.",
      "Suchanfragen wie „Eistee Pfirsich Zucker“ oder „Eistee Zitrone Zucker pro 100 ml“ meinen meist eine konkrete Sorte. Genau dafür sind einzelne Produktseiten nützlicher als allgemeine Aussagen.",
    ],
  },
  {
    slug: "packungsgroesse-entscheidet",
    title: "Zucker pro Flasche berechnen: warum die Größe zählt",
    description: "Zucker pro Flasche berechnen: 250 ml, 330 ml, 500 ml und 1 Liter nach derselben Formel vergleichen.",
    minutes: 3,
    body: [
      "Zucker pro 100 ml ist der Startpunkt. Die Packungsgröße entscheidet, wie viel Zucker am Ende wirklich im Getränk steckt.",
      "Ein Getränk mit 8 g Zucker pro 100 ml enthält in 250 ml etwa 20 g Zucker, in 500 ml etwa 40 g und in 1 Liter etwa 80 g.",
      "Deshalb kann ein kleiner Energy Drink mit hohem 100-ml-Wert weniger Gesamtzucker liefern als eine große Limonade mit etwas niedrigerem Wert.",
      "Die Formel bleibt einfach: Zucker pro 100 ml mal Milliliter geteilt durch 100. Zuckerhaltig.de nutzt diese Rechnung für Dose, Flasche, Karton und Trinkpäckchen.",
      "Gerade bei Vorratsflaschen lohnt der Gesamtwert. Viele trinken nicht die ganze Flasche auf einmal, aber große Packungen machen größere Mengen im Alltag leichter.",
    ],
  },
  {
    slug: "kindergetraenke-und-zucker",
    title: "Kindergetränke unter der Lupe: Zuckerfallen erkennen",
    description: "Zucker in Kindergetränken prüfen: Trinkpäckchen, Saftgetränke, Limo und Schorle nach 100 ml und Packung einordnen.",
    minutes: 5,
    body: [
      "Kindergetränke wirken durch kleine Packungen oft überschaubar. Ein Trinkpäckchen ist schnell leer, eine kleine Flasche passt in jede Brotdose, und Wörter wie Frucht, mild oder Vitamine klingen erst einmal freundlich. Der Zuckerwert steht trotzdem in der Nährwerttabelle.",
      "Der beste Einstieg bleibt Zucker pro 100 ml. Ein 200-ml-Trinkpäckchen mit 8 g Zucker pro 100 ml enthält rechnerisch etwa 16 g Zucker. Bei 9 g pro 100 ml sind es 18 g. Die Portion ist kleiner als bei einer 500-ml-Flasche, aber die Rezeptur ist deshalb nicht automatisch zuckerarm.",
      "Gerade Saftgetränke machen die Einordnung schwer. „Ohne Zuckerzusatz“ kann stimmen und trotzdem bleibt natürlich enthaltener Fruchtzucker übrig. Bei Nektar, Fruchtsaftgetränken und Schorlen lohnt sich deshalb dieselbe Reihenfolge wie bei Cola: erst 100 ml lesen, dann die Packung rechnen.",
      "Eltern suchen oft nach gesunden Getränken für Kinder. Für den Alltag sind Wasser und stark verdünnte Schorlen meist einfacher als ständig neue Spezialprodukte. Wenn ein süßes Getränk dabei ist, hilft die Menge: kleine Packung, nicht nebenbei nachfüllen, Werte vergleichen.",
      "Wer Werbesprache ausblenden will, achtet auf drei Stellen auf dem Etikett: Zucker pro 100 ml, Packungsgröße und die Zutatenliste. Stehen Saftkonzentrat, Zucker, Glukose-Fruktose-Sirup oder mehrere süße Bestandteile weit vorn, ist das kein Zufall.",
      "Zuckerhaltig.de bewertet keine Brotdose. Die Daten machen nur sichtbar, ob ein Getränk eher wie eine leichte Schorle wirkt oder beim Nachrechnen näher an Limo liegt.",
    ],
  },
  {
    slug: "bekannte-softdrinks-im-zuckervergleich",
    title: "10 bekannte Softdrinks im Zuckervergleich",
    description: "Zuckergehalt von Coca-Cola, Pepsi, Fanta, Spezi und weiteren Softdrinks pro 100 ml und pro Flasche vergleichen.",
    minutes: 6,
    body: [
      "Wer „Zuckergehalt Cola vs. Pepsi“ oder „Zuckervergleich Softdrinks“ sucht, will selten eine Grundsatzrede über Ernährung. Meist geht es um konkrete Zahlen: Wie viel Zucker steckt pro 100 ml drin, und was bedeutet das für die ganze Flasche?",
      "Coca-Cola Classic ist in der Datenbank mit 10,6 g Zucker pro 100 ml hinterlegt. Bei 500 ml sind das rechnerisch 53 g Zucker. Coca-Cola Vanilla liegt mit 11,1 g pro 100 ml etwas höher; eine 500-ml-Flasche kommt auf 55,5 g.",
      "Pepsi Original ist hier mit 4,6 g Zucker pro 100 ml und 330 ml erfasst. Das zeigt schon, warum man nicht nur nach der Marke gehen sollte. Rezepturen unterscheiden sich je nach Markt, Sorte und Quelle; der konkrete Datensatz zählt.",
      "Fanta Orange liegt in den hinterlegten deutschen Angaben bei 7,6 g pro 100 ml. Bei 500 ml ergeben sich 38 g Zucker. Fanta Exotic, Fanta Grape oder Fanta Pineapple können anders ausfallen, vor allem wenn Daten aus internationalen Produkten oder Händlerinformationen stammen.",
      "Spezi und Cola-Mix sind keine kleine Randkategorie. Paulaner Spezi ist mit 9,2 g Zucker pro 100 ml erfasst, Mezzo Mix Original mit 7,9 g. Bei großen Flaschen wächst der Abstand zwischen 100-ml-Wert und Gesamtzucker schnell.",
      "Sprite, 7UP, Sinalco, Orangina und Mountain Dew zeigen dasselbe Muster: Der Name sagt weniger als die Nährwerttabelle. Manche Sorten liegen nahe an klassischen Softdrinks, andere sind als Zero- oder Light-Variante fast ohne Zucker hinterlegt.",
      "Für einen fairen Softdrink-Vergleich reichen zwei Rechnungen. Erstens: Zucker pro 100 ml, damit alle Produkte auf derselben Basis stehen. Zweitens: Zucker pro Packung, weil 330 ml, 500 ml, 1 Liter und 1,5 Liter im Alltag nicht dasselbe sind.",
      "Die Zuckerwürfel helfen beim Gefühl für die Menge. Zuckerhaltig.de rechnet mit 3 g pro Würfel. Eine 500-ml-Flasche mit 53 g Zucker liegt damit bei rund 17,7 Würfeln. Das klingt anders als „10,6 g pro 100 ml“.",
    ],
  },
  {
    slug: "low-sugar-energy-drinks-trend",
    title: "Low-Sugar-Energy-Drinks: was wirklich zuckerarm ist",
    description: "Zuckerfreie Energy Drinks, Low-Sugar-Sorten und klassische Dosen nach Zucker pro 100 ml und Süßstoffen einordnen.",
    minutes: 6,
    body: [
      "Zuckerarme Energy Drinks stehen inzwischen direkt neben klassischen Dosen. Red Bull Sugarfree, Monster Ultra, Rockstar Sugar Free oder effect Zero wirken auf den ersten Blick wie die einfache Lösung: Koffein bleibt, Zucker verschwindet.",
      "Für die Zuckerfrage stimmt das oft. Red Bull Sugarfree ist in der Datenbank mit 0 g Zucker pro 100 ml erfasst. Monster Energy Ultra White liegt ebenfalls bei 0 g. effect Zero ist mit 0 g pro 100 ml hinterlegt. Wer nur Zucker reduzieren will, findet hier klare Unterschiede zu klassischen Energy Drinks.",
      "Der Vergleich kippt aber, wenn man aus „zuckerarm“ automatisch „gesund“ macht. Energy Drinks enthalten Koffein, Säuren, Aromen und oft Süßstoffe. Diese Stoffe sind nicht dasselbe wie Zucker, aber sie lösen die Frage nach Trinkmenge und Gewohnheit nicht.",
      "Bei klassischen Varianten wird die Packung wichtig. 11 g Zucker pro 100 ml ergeben bei 500 ml 55 g Zucker. Eine große Dose kann damit mehr Zucker liefern als manche Limonade, obwohl beide auf dem Etikett ähnlich harmlos aussehen.",
      "Viele Suchanfragen lauten „zuckerfreier Energy Drink“ oder „gesunde Energy Drinks“. Besser ist eine engere Frage: Wie viel Zucker hat genau diese Dose, und trinke ich sie wegen Geschmack, Koffein oder Gewohnheit? Die Antwort verändert die Einordnung.",
      "Süßstoffe machen Produkte nicht automatisch schlecht. Sie machen sie aber auch nicht zu Wasser. Wer Energy Drinks vergleicht, sollte Zucker, Koffein und Packungsgröße getrennt lesen, sonst vermischt man drei verschiedene Themen.",
      "Der praktische Filter: Kategorie Energy Drink öffnen, nach Zucker pro 100 ml sortieren und Zero-Sorten neben klassische Varianten legen. Dann sieht man sofort, ob eine Sorte wirklich zuckerfrei ist oder nur weniger Zucker enthält.",
    ],
  },
  {
    slug: "kombucha-probiotische-getraenke-zucker",
    title: "Kombucha und probiotische Getränke: was steckt drin?",
    description: "Kombucha, Kefir und probiotische Getränke einordnen: Fermentation, Säure, Zucker und Marketing sauber trennen.",
    minutes: 5,
    body: [
      "Kombucha klingt nach Teepilz, Fermentation und Darmgefühl. Genau deshalb landet das Getränk oft in einer anderen Schublade als Limo. Für die Zuckerfrage reicht dieses Image nicht.",
      "Bei fermentierten Getränken passiert etwas, das normale Softdrinks nicht haben: Mikroorganismen bauen einen Teil des Zuckers um. Trotzdem kann am Ende Zucker übrig bleiben, und manche Produkte werden nach der Fermentation noch gesüßt oder mit Saft gemischt.",
      "Wer nach „Kombucha Zuckergehalt“ sucht, sollte deshalb nicht nur auf Begriffe wie probiotisch, lebende Kulturen oder fermentiert achten. Entscheidend bleibt die Nährwerttabelle pro 100 ml. Ein Getränk kann sauer schmecken und trotzdem Zucker enthalten.",
      "Kefir, Wasserkefir, Kombucha und prebiotische Limonaden unterscheiden sich stark. Manche gehören eher in die Nähe von Teegetränken, andere schmecken wie Limo mit funktionalem Etikett. Ohne konkreten Zuckerwert bleibt das Gefühl unscharf.",
      "Auch die Portion zählt. Eine kleine Glasflasche mit moderatem Zuckerwert ist etwas anderes als eine große Flasche, die man über den Nachmittag verteilt trinkt. Der Körper liest keine Trendbegriffe, sondern Mengen.",
      "Für die Datenbank heißt das: Sobald Kombucha oder ähnliche Getränke mit belastbaren Nährwerten vorliegen, gehören sie ganz normal in den Vergleich. Zucker pro 100 ml, Packung, Quelle. Mehr braucht es für den ersten Blick nicht.",
    ],
  },
  {
    slug: "sugar-light-weniger-zucker-natuerlicher-geschmack",
    title: "Weniger Zucker, echter Geschmack: was Sugar Light meint",
    description: "Sugar-Light-Getränke verstehen: weniger Zucker, natürliche Süße, Süßstoffe und Zuckergehalt pro 100 ml vergleichen.",
    minutes: 5,
    body: [
      "Viele Menschen wollen nicht unbedingt ein komplett zuckerfreies Getränk. Sie wollen weniger Zucker, aber keinen Geschmack, der sofort nach Ersatzlösung schmeckt. Genau in diese Lücke fallen Produkte, die mit reduzierter Süße arbeiten.",
      "Der Begriff Sugar Light ist nicht so eindeutig wie Zero. Bei Zero erwartet man 0 g oder fast 0 g Zucker pro 100 ml. Bei weniger Zucker muss man genauer hinsehen: Wie viel weniger? Gegenüber welcher Rezeptur? Und wurde Zucker durch Süßstoff ersetzt oder einfach reduziert?",
      "Ein Getränk mit 5 g Zucker pro 100 ml kann im Vergleich zu 10 g deutlich niedriger liegen. Bei einer 500-ml-Flasche sind es aber immer noch 25 g Zucker. Wer nur das Wort light liest, übersieht schnell die Packung.",
      "Natürliche Süße klingt angenehm, sagt aber wenig über die Menge. Saftkonzentrat, Fruchtsüße, Agavendicksaft oder Dattelsirup liefern ebenfalls Zucker. Anders benannt ist nicht automatisch weniger.",
      "Für Hersteller ist reduzierte Süße schwierig, weil viele Käufer den gewohnten Geschmack erwarten. Wer zu stark kürzt, bekommt Beschwerden über wässrigen Geschmack. Wer Süßstoffe einsetzt, verliert andere Käufer. Deshalb landen viele Produkte irgendwo dazwischen.",
      "Für Verbraucher ist die Lösung weniger romantisch, aber zuverlässiger: 100-ml-Wert lesen, Flasche rechnen, ähnliche Produkte vergleichen. Dann erkennt man schnell, ob „weniger Zucker“ nur gut klingt oder wirklich einen Abstand schafft.",
    ],
  },
  {
    slug: "functional-drinks-adaptogene-vitamine-zucker",
    title: "Functional Drinks: Adaptogene, Vitamine und Zucker",
    description: "Funktionale Getränke mit Vitaminen, Ginseng, Ashwagandha oder Pilzen prüfen: Wirkungsaussagen und Zucker getrennt lesen.",
    minutes: 6,
    body: [
      "Functional Drinks versprechen selten nur Durstlöschen. Auf Dosen und Flaschen stehen Begriffe wie Fokus, Balance, Immun, Beauty oder Relax. Dazu kommen Vitamine, Pflanzenextrakte, Ginseng, Ashwagandha, Lion’s Mane oder Magnesium.",
      "Für den Zuckerwert ist das erst einmal egal. Ein Getränk mit funktionalen Zutaten kann zuckerfrei sein, leicht gesüßt oder so süß wie klassische Limo. Die Zutaten erzählen eine Geschichte; die Nährwerttabelle liefert die Menge.",
      "Adaptogene klingen nach Apotheke, aber Getränke sind keine neutrale Darreichungsform. Häufig kommen Säure, Aroma, Süßstoffe oder Zucker dazu, damit das Produkt trinkbar schmeckt. Gerade bittere Pflanzenextrakte brauchen Gegengewicht.",
      "Wer nach „Adaptogene Getränke“ oder „funktionale Getränke Zucker“ sucht, sollte Wirkung und Zucker trennen. Ob ein Pflanzenstoff sinnvoll dosiert ist, steht auf einem anderen Blatt. Die Zuckerfrage lässt sich sofort prüfen: Gramm pro 100 ml und Packungsgröße.",
      "Vitamingetränke verdienen denselben Blick. Ein Getränk kann Vitamin C enthalten und trotzdem viel Zucker liefern. Das eine löscht das andere nicht aus. Bei Kindern, Sportgetränken und Büro-Drinks wird dieser Punkt leicht übersehen.",
      "Viele funktionale Getränke arbeiten mit kleinen Dosen oder schlanken Flaschen. Das senkt den Gesamtzucker, falls der 100-ml-Wert moderat bleibt. Bei 500 ml oder größeren Flaschen lohnt sich die Rechnung doppelt.",
      "Für Zuckerhaltig.de gehören Functional Drinks nicht in eine Sonderwelt. Sobald Quelle, Zuckerwert und Packungsgröße vorliegen, lassen sie sich neben Energy Drinks, Eistee und Limo stellen. Genau dort wird das Marketing leiser.",
    ],
  },
  {
    slug: "mocktails-alkoholfreie-cocktails-wenig-zucker",
    title: "Mocktails ohne Zucker-Overload: so geht es einfacher",
    description: "Alkoholfreie Cocktails und Mocktails mit wenig Zucker planen: Saft, Sirup, Tonic und Limo richtig dosieren.",
    minutes: 5,
    body: [
      "Mocktails klingen automatisch leichter als Cocktails, weil Alkohol fehlt. Beim Zucker stimmt das nicht immer. Saft, Sirup, Limonade, Tonic Water und fertige Mixer können aus einem alkoholfreien Drink schnell eine süße Angelegenheit machen.",
      "Der größte Hebel ist nicht ein exotisches Rezept, sondern das Mischverhältnis. Viel Eis, Mineralwasser, ungesüßter Tee, Limette, Kräuter und ein kleiner Anteil Saft reichen oft aus. Wenn ein Glas hauptsächlich aus Mango- oder Ananassaft besteht, wird es dagegen schnell zuckerreich.",
      "Sirup ist praktisch, aber konzentriert. Ein Esslöffel klingt wenig, mehrere Gläser später merkt man den Unterschied. Wer Sirup nutzt, sollte ihn wie Zucker behandeln und nicht wie Aroma.",
      "Alkoholfreie Cocktails mit wenig Zucker funktionieren besser, wenn Bitterkeit und Säure mitspielen. Grapefruit, Zitrone, Limette, Gurke, Minze, Rosmarin oder Ingwer geben Geschmack, ohne dass immer mehr Süße nötig wird.",
      "Fertige Mixer verdienen einen Blick auf 100 ml. Manche Tonic- oder Ginger-Ale-Produkte liegen deutlich niedriger als klassische Limo, andere nicht. Bei einem Mocktail zählt am Ende die gesamte Mischung, nicht der gesündeste Bestandteil.",
      "Eine einfache Faustformel: ein Teil Saft oder süßer Mixer, zwei bis vier Teile Wasser, Tee oder Soda. Das ist kein Gesetz, aber es verhindert, dass ein alkoholfreier Abend unbemerkt zur Sirupprobe wird.",
    ],
  },
  {
    slug: "saft-zucker-reduzieren-schorle-sirup",
    title: "Zucker reduzieren beim Saft: Schorle und Sirup richtig nutzen",
    description: "Saftschorle selbst machen, Sirup dosieren und Zucker in Saftgetränken senken, ohne den Geschmack komplett zu verlieren.",
    minutes: 5,
    body: [
      "Saft hat ein gutes Image, aber sein Zucker verschwindet nicht, nur weil er aus Früchten stammt. Orangensaft, Multivitaminsaft und Apfelsaft können pro 100 ml in Bereichen liegen, die man bei Limo sofort ernst nehmen würde.",
      "Die einfachste Senkung heißt Verdünnen. Eine Schorle aus einem Teil Saft und einem Teil Wasser halbiert den Zucker pro Glas ungefähr. Wer ein Teil Saft mit zwei Teilen Wasser mischt, senkt ihn noch stärker, ohne komplett auf Geschmack zu verzichten.",
      "Bei Kindern und großen Vorratsflaschen macht das viel aus. Ein Liter Saft ist schnell offen, und ein großes Glas wird selten exakt abgemessen. Schorle verzeiht solche Mengen eher als purer Saft.",
      "DIY-Sirupe sind nicht automatisch zuckerarm. Dattelsirup, Agavendicksaft, Honig oder Fruchtsirup klingen natürlicher, liefern aber ebenfalls Zucker. Der Vorteil liegt eher in der Dosierung: Man kann sehr wenig nehmen und mit Wasser, Tee, Zitrone oder Kräutern strecken.",
      "Wer Saftschorle selbst macht, sollte den Saft als Geschmacksgeber behandeln, nicht als Basis. Das verändert den Blick. Plötzlich reichen 50 bis 100 ml Saft in einem großen Glas, statt dass das Glas fast voll damit ist.",
      "Für die Datenbank bleibt Saft trotzdem Saft. Zuckerhaltig.de zeigt den Wert pro 100 ml des Produkts. Was du zu Hause daraus machst, entscheidet dann das Mischverhältnis.",
    ],
  },
  {
    slug: "getraenkeetiketten-naehrwerttabelle-verstehen",
    title: "Getränkeetiketten verstehen: Zuckerangaben richtig lesen",
    description: "Nährwerttabelle erklärt: Zucker pro 100 ml, Kohlenhydrate, kcal, Portion und Packungsgröße bei Getränken verstehen.",
    minutes: 6,
    body: [
      "Viele Etiketten wirken komplizierter, als sie sind. Für Zucker in Getränken brauchst du zuerst zwei Zeilen: „Kohlenhydrate“ und darunter „davon Zucker“. Der zweite Wert ist der, den die meisten suchen.",
      "Die Angabe steht fast immer pro 100 ml. Das ist praktisch, weil alle Getränke damit dieselbe Basis haben. Eine Dose mit 250 ml, eine Flasche mit 500 ml und ein Literkarton lassen sich so überhaupt erst vergleichen.",
      "Der Fehler passiert danach. Wer nur 100 ml liest, unterschätzt größere Packungen. Die Rechnung lautet: Zucker pro 100 ml mal Packungsgröße in ml, geteilt durch 100. Bei 8 g pro 100 ml und 500 ml sind das 40 g Zucker.",
      "Kohlenhydrate und Zucker sind nicht identisch. Bei vielen Softdrinks liegen beide Werte nah beieinander, weil fast alle Kohlenhydrate Zucker sind. Bei Milchgetränken, Säften oder Spezialprodukten kann der Unterschied stärker auffallen.",
      "Kilokalorien helfen beim Gesamtbild, beantworten aber nicht die Zuckerfrage. Ein Getränk kann wenig Zucker enthalten und trotzdem Kalorien aus anderen Bestandteilen liefern. Umgekehrt kann ein Zuckerwert niedrig sein, weil Süßstoffe statt Zucker eingesetzt wurden.",
      "Portionsangaben auf der Vorderseite können irritieren. Eine Flasche kann zwei Portionen enthalten, obwohl viele sie allein trinken. Deshalb ist die Packungsgröße für den Alltag oft ehrlicher als die Portion, die ein Hersteller vorschlägt.",
      "Wenn du wenig Zeit hast, lies in dieser Reihenfolge: Zucker pro 100 ml, Packungsgröße, Zucker pro Packung, Zutatenliste. Danach weißt du mehr als durch jedes grüne Blatt auf dem Etikett.",
    ],
  },
  {
    slug: "nachhaltige-zuckerarme-getraenke-verpackung",
    title: "Zuckerarm und nachhaltiger trinken: Verpackung mitdenken",
    description: "Zuckerarme Getränke und Verpackungen einordnen: Mehrweg, Dose, PET, Glas und große Flaschen nicht getrennt betrachten.",
    minutes: 5,
    body: [
      "Zuckerarm und nachhaltig werden oft getrennt diskutiert. Im Regal stehen sie aber nebeneinander: Zero-Limo in der Einwegflasche, Bio-Limo im Glas, Saft im Karton, Energy Drink in der Dose.",
      "Für den Zuckervergleich zählt zuerst der Inhalt. 0 g Zucker pro 100 ml bleiben 0 g, egal ob die Verpackung aus Glas, PET oder Aluminium besteht. Für die Kaufentscheidung reicht das aber nicht jedem.",
      "Mehrwegflaschen können sinnvoll sein, wenn sie im passenden System bleiben und nicht quer durch Europa reisen. Große Einwegflaschen wirken manchmal praktisch, führen aber schneller dazu, dass mehr getrunken wird. Beim Zucker zählt dann wieder die Menge.",
      "Kleine Glasflaschen bremsen den Konsum oft ganz banal: Sie sind teurer, schwerer und schneller leer. Das kann beim Zucker helfen, sagt aber noch nichts über die Umweltbilanz eines konkreten Produkts.",
      "Wer umweltfreundliche Verpackung sucht, sollte regionales Mehrweg, Nachfülloptionen und Leitungswasser nicht ausblenden. Ein zuckerarmes Getränk in einer aufwendigen Verpackung ist nicht automatisch die sauberste Wahl.",
      "Der ehrliche Vergleich fragt deshalb doppelt: Wie viel Zucker steckt pro 100 ml und pro Packung drin? Und welche Verpackung kaufe ich dafür jedes Mal mit? Erst zusammen wird daraus eine brauchbare Entscheidung.",
    ],
  },
  {
    slug: "zuckerfreie-getraenke-in-der-datenbank",
    title: "Welche Getränke haben wenig oder keinen Zucker?",
    description: "Getränke ohne Zucker finden: Zero, Light und zuckerarme Varianten direkt mit klassischen Getränken vergleichen.",
    minutes: 2,
    body: [
      "Getränke ohne Zucker gehören in dieselbe Datenbank wie klassische Varianten. Nur so sieht man den Abstand wirklich.",
      "Eine Cola Classic kann deutlich Zucker enthalten, während eine Zero-Variante mit 0 g Zucker pro 100 ml deklariert ist. Bei anderen Marken sieht es wieder anders aus.",
      "Wenig Zucker bedeutet nicht automatisch „beste Wahl“. Süßstoffe, Koffein, Säuren und Gewohnheit bleiben eigene Fragen.",
      "Für die reine Zuckerfrage ist der Filter trotzdem hilfreich. Sortiere nach Zucker pro 100 ml oder setze eine Obergrenze, dann tauchen Zero-Produkte und zuckerärmere Varianten schneller auf.",
      "Gerade Marken mit vielen Sorten profitieren davon. Classic, Light, Zero und Sondergeschmack stehen nicht mehr getrennt im Kopf, sondern direkt nebeneinander.",
    ],
  },
  {
    slug: "suessstoffe-aspartam-zuckerfreie-getraenke",
    title: "Aspartam und Süßstoffe: Ist zuckerfrei automatisch gesund?",
    description: "Was zuckerfrei wirklich bedeutet, wie Aspartam bewertet wird und warum Zero-Getränke kein allgemeines Gesundheitsurteil verdienen.",
    minutes: 7,
    body: [],
    quickAnswer: "Zuckerfrei bedeutet bei Getränken höchstens 0,5 g Zucker pro 100 ml. Die Angabe bewertet weder das ganze Getränk noch die Ernährungsweise. Zero-Getränke können gegenüber zuckergesüßten Varianten Zucker und Kalorien sparen, sind aber nicht mit Wasser oder ungesüßtem Tee gleichzusetzen.",
    sections: [
      {
        heading: "Was „zuckerfrei“ tatsächlich sagt",
        paragraphs: [
          "Nach der EU-Verordnung darf ein Getränk als zuckerfrei bezeichnet werden, wenn es höchstens 0,5 g Zucker pro 100 ml enthält. Das ist eine klare Aussage über Zucker. Sie sagt nichts darüber, ob das Getränk Koffein, Säuren, Aromen oder Süßstoffe enthält.",
          "Wer eine klassische Limo durch eine Zero-Variante ersetzt, nimmt in der Regel deutlich weniger Zucker auf. Daraus folgt aber kein allgemeines Gesundheitsurteil. Menge, Trinkhäufigkeit und die übrige Ernährung bleiben wichtig.",
        ],
      },
      {
        heading: "Welche Süßstoffe stecken häufig in Getränken?",
        paragraphs: [
          "Das BfR nennt für Erfrischungsgetränke vor allem Acesulfam K (E 950), Aspartam (E 951), Cyclamat (E 952), Saccharin (E 954), Sucralose (E 955) und Steviolglykoside (E 960). Hersteller kombinieren Stoffe häufig, weil sie unterschiedlich süßen und schmecken.",
          "Acesulfam K, Aspartam, Cyclamat, Saccharin und Sucralose sind synthetisch hergestellte Süßstoffe. Steviolglykoside werden aus Bestandteilen der Steviapflanze gewonnen. Für jeden Stoff gelten eigene Bewertungen und Aufnahmewerte; der Aspartam-Wert lässt sich nicht auf andere Süßstoffe übertragen.",
          "Die Zutatenliste zeigt, welche Stoffe ein konkretes Produkt verwendet, nennt aber meist nicht deren Menge. Zuckerhaltig.de erfasst derzeit keine Zutaten je Getränk. Deshalb behaupten unsere Produktseiten nicht, dass ein bestimmtes Getränk Aspartam oder einen anderen Süßstoff enthält.",
        ],
      },
      {
        heading: "Aspartam: Gefährdung ist nicht dasselbe wie Risiko",
        paragraphs: [
          "Die Krebsforschungsagentur IARC stufte Aspartam 2023 als „möglicherweise krebserregend für Menschen“ ein. Diese Einstufung beschreibt, ob ein Stoff grundsätzlich eine Gefahr verursachen könnte. Sie berechnet nicht das Risiko bei einer bestimmten aufgenommenen Menge.",
          "Der gemeinsame Sachverständigenausschuss von WHO und FAO prüfte gleichzeitig die tatsächliche Aufnahme und bestätigte den akzeptablen Tageswert von 0 bis 40 mg Aspartam je Kilogramm Körpergewicht. Auch die EFSA betrachtet 40 mg/kg Körpergewicht pro Tag als schützenden Wert für die Allgemeinbevölkerung.",
          "Für Menschen mit Phenylketonurie (PKU) gilt diese Einordnung nicht. Sie müssen Phenylalanin streng begrenzen. Lebensmittel mit Aspartam tragen deshalb einen entsprechenden Hinweis auf dem Etikett.",
        ],
      },
      {
        heading: "Helfen Süßstoffe beim Abnehmen?",
        paragraphs: [
          "Die WHO rät davon ab, zuckerfreie Süßstoffe als langfristige Strategie zur Gewichtskontrolle oder zur Vorbeugung ernährungsbedingter Krankheiten zu verwenden. Die Empfehlung ist bedingt, weil Beobachtungsdaten durch bestehende Unterschiede zwischen den untersuchten Personen verzerrt sein können.",
          "Diese WHO-Empfehlung ersetzt keine Sicherheitsbewertung einzelner Stoffe und ändert keine festgelegten Tageswerte. Sie beantwortet eine andere Frage: Ob Süßstoffe langfristig beim Gewichtsmanagement helfen. Das ist nicht dasselbe wie die toxikologische Frage, welche Menge als akzeptabel gilt.",
        ],
      },
      {
        heading: "So liest du ein Zero-Getränk",
        paragraphs: [
          "Prüfe zuerst Zucker pro 100 ml und danach die Zutatenliste. Bei koffeinhaltigen Getränken gehört auch der Koffeinhinweis dazu. Die Packungsgröße zeigt, wie viel du tatsächlich trinkst.",
          "Für den täglichen Durst empfehlen DGE und andere Fachstellen Wasser oder ungesüßten Tee. Ein Zero-Getränk kann eine zuckerreiche Variante ersetzen, muss deshalb aber nicht zum Standardgetränk werden.",
        ],
      },
    ],
    faq: [
      {
        question: "Ist Aspartam in üblichen Mengen gefährlich?",
        answer: "JECFA und EFSA halten einen täglichen Wert bis 40 mg pro Kilogramm Körpergewicht für die Allgemeinbevölkerung für akzeptabel. Menschen mit Phenylketonurie müssen Aspartam beziehungsweise Phenylalanin meiden oder streng begrenzen.",
      },
      {
        question: "Bedeutet die IARC-Einstufung, dass Aspartam Krebs verursacht?",
        answer: "Nein. Die Einstufung „möglicherweise krebserregend“ beschreibt eine mögliche Gefährdung. Das persönliche Risiko hängt unter anderem von der aufgenommenen Menge ab; die Evidenz beim Menschen wurde als begrenzt bewertet.",
      },
      {
        question: "Sind Zero-Getränke gesünder als zuckerhaltige Getränke?",
        answer: "Sie enthalten meist deutlich weniger Zucker und Kalorien. Das macht sie für die Zuckerfrage günstiger, aber nicht automatisch zu einem empfehlenswerten Alltagsgetränk.",
      },
      {
        question: "Wo sehe ich, welcher Süßstoff enthalten ist?",
        answer: "In der Zutatenliste stehen Süßstoffe mit ihrem Namen oder ihrer E-Nummer. Zuckerhaltig.de erfasst diese Angaben derzeit nicht für einzelne Produkte.",
      },
    ],
    sources: [
      { label: "EU-Verordnung: Bedingungen für die Angabe „zuckerfrei“", url: "https://eur-lex.europa.eu/eli/reg/2006/1924/oj?locale=de" },
      { label: "IARC und WHO: Bewertung von Aspartam, 14. Juli 2023", url: "https://www.iarc.who.int/news-events/aspartame-hazard-and-risk-assessment-results-released/" },
      { label: "WHO/JECFA: Aspartam und akzeptable tägliche Aufnahmemenge", url: "https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/62" },
      { label: "EFSA: Aspartam", url: "https://www.efsa.europa.eu/en/topics/topic/aspartame" },
      { label: "WHO-Leitlinie zu zuckerfreien Süßstoffen", url: "https://www.who.int/publications/i/item/9789240073616" },
      { label: "BfR: Süßungsmittel in Lebensmitteln", url: "https://www.bfr.bund.de/fragen-und-antworten/thema/suessungsmittel-in-lebensmitteln-ausgewaehlte-fragen-und-antworten/" },
      { label: "DGE: Getränke", url: "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-ernaehrungskreis/getraenke/" },
      { label: "EU-Kennzeichnung für Aspartam und Süßstoffe", url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32011R1169" },
    ],
  },
];

export const articleBySlug = Object.fromEntries(articles.map((article) => [article.slug, article]));
