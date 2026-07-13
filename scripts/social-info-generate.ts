import path from "node:path";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";

const width = 1080;
const height = 1350;

type InfoPost = {
  id: string;
  filename: string;
  caption: string;
  source: string;
};

const posts: InfoPost[] = [
  {
    id: "ohne-zuckerzusatz",
    filename: "01_wissen_ohne-zuckerzusatz.png",
    caption: "Was bedeutet ohne Zuckerzusatz?\n\nAuf dem Nährwertetikett zählt die gesamte Zuckermenge. Natürlich enthaltener Fruchtzucker bleibt in Saft, Nektar oder Schorle Teil der Angabe.\n\nMehr im Wissenbereich von Zuckerhaltig.de\n\n#zuckerwissen #getraenkecheck",
    source: "Wissen: Saft ist nicht automatisch zuckerarm",
  },
  {
    id: "zero-zucker",
    filename: "02_wissen_zero-zucker.png",
    caption: "Was sagt 0 g Zucker?\n\nFür die reine Zuckerfrage liegt ein Zero-Getränk meist niedriger. Süßstoffe, Koffein und Gewohnheit bleiben eigene Themen.\n\nMehr im FAQ von Zuckerhaltig.de\n\n#zuckerwissen #zerogetraenke",
    source: "FAQ: Zero- und Light-Getränke",
  },
  {
    id: "pro-100-ml",
    filename: "03_wissen_pro-100-ml.png",
    caption: "Warum Zucker pro 100 ml?\n\nDer Wert macht Getränke vergleichbar. Danach zeigt die Packungsgröße, wie viel Zucker in Dose oder Flasche zusammenkommt.\n\nMehr im Wissenbereich von Zuckerhaltig.de\n\n#zuckerwissen #naehrwerte",
    source: "Wissen: Zucker pro 100 ml verstehen",
  },
  {
    id: "quellen",
    filename: "04_wissen_quellen-und-werte.png",
    caption: "Woher kommen Zuckerwerte?\n\nJeder Drink-Eintrag führt einen Quellenhinweis. Werte sollten aus Verpackungen, Herstellerseiten oder verlässlichen Produktdaten stammen.\n\nMehr im FAQ von Zuckerhaltig.de\n\n#zuckerwissen #quellen",
    source: "FAQ: Daten, Quellen und Genauigkeit",
  },
  {
    id: "zuckerwuerfel",
    filename: "05_wissen_zuckerwuerfel.png",
    caption: "Warum Zuckerwürfel?\n\nZuckerhaltig.de rechnet mit 3 g Zucker pro Würfel. Die Würfel machen Gramm greifbarer, sind aber kein medizinischer Grenzwert.\n\nMehr im Wissenbereich von Zuckerhaltig.de\n\n#zuckerwissen #zuckerwuerfel",
    source: "Wissen: Zuckerwürfel als Orientierung",
  },
  {
    id: "rundung",
    filename: "06_wissen_rundung.png",
    caption: "Warum sind Zuckerangaben gerundet?\n\nViele Etiketten runden bereits. Zuckerhaltig.de rundet ebenfalls, damit Vergleiche lesbar bleiben.\n\nMehr im FAQ von Zuckerhaltig.de\n\n#zuckerwissen #naehrwerte",
    source: "FAQ: Zucker berechnen",
  },
  {
    id: "packungsgroesse",
    filename: "07_wissen_packungsgroesse.png",
    caption: "Warum ist ein Getränk mehrfach erfasst?\n\n250 ml, 330 ml und 500 ml brauchen eigene Einträge, weil sich der Gesamtzucker mit der Packungsgröße ändert.\n\nMehr im FAQ von Zuckerhaltig.de\n\n#zuckerwissen #getraenkecheck",
    source: "FAQ: Zucker berechnen",
  },
  {
    id: "fruchtzucker",
    filename: "08_wissen_fruchtzucker.png",
    caption: "Ist Fruchtzucker auch Zucker?\n\nAuf dem Nährwertetikett zählt die gesamte Zuckermenge. Das gilt auch für natürlich vorkommenden Fruchtzucker in Saft, Nektar oder Schorle.\n\nMehr im FAQ von Zuckerhaltig.de\n\n#zuckerwissen #saft",
    source: "FAQ: Zucker in Getränken verstehen",
  },
  {
    id: "werte-unterschiede",
    filename: "09_wissen_werte-unterschiede.png",
    caption: "Warum unterscheiden sich Zuckerwerte?\n\nRezeptur, Land, Größe und Sorte können abweichen. Im Zweifel zählt die aktuelle Verpackung oder die Angabe des Herstellers.\n\nMehr im FAQ von Zuckerhaltig.de\n\n#zuckerwissen #quellen",
    source: "FAQ: Zucker in Getränken verstehen",
  },
  {
    id: "pruefdatum",
    filename: "10_wissen_pruefdatum.png",
    caption: "Warum zählt das Prüfdatum?\n\nProdukte ändern sich. Vor Kauf, Veröffentlichung oder genauer Auswertung solltest du die aktuelle Verpackung prüfen.\n\nMehr im FAQ von Zuckerhaltig.de\n\n#zuckerwissen #quellen",
    source: "FAQ: Daten, Quellen und Genauigkeit",
  },
];

async function main() {
  const date = parseDate(process.argv.slice(2));
  const out = path.resolve("social", `${date}-info`);
  await mkdir(out, { recursive: true });
  await clean(out);

  for (const post of posts) {
    const filePath = path.join(out, post.filename);
    await sharp(Buffer.from(render(post))).png().toFile(filePath);
    await assertPng(filePath);
  }

  await writeFile(path.join(out, "posts.json"), `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  await writeFile(path.join(out, "README.md"), `# Zucker-Wissen ${date}\n\n${posts.map((post) => `- ${post.filename}: ${post.source}`).join("\n")}\n`, "utf8");
  console.log(`Generated ${posts.length} information cards in ${out}`);
}

function parseDate(args: string[]) {
  const index = args.indexOf("--date");
  if (index === -1) return today();
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error("Fehlender Wert für --date");
  return value;
}

function render(post: InfoPost) {
  const copy = articleCopy(post.id);
  return renderArticle(post, copy);
}

type ArticleCopy = {
  kicker: string;
  title: string[];
  body: string;
  note: string;
  label: string;
};

function articleCopy(id: string): ArticleCopy {
  if (id === "ohne-zuckerzusatz") {
    return {
      kicker: "ETIKETT LESEN",
      title: ["Was heißt", "ohne Zuckerzusatz?"],
      body: "Auf dem Nährwertetikett zählt die gesamte Zuckermenge. Natürlich enthaltener Fruchtzucker bleibt auch in Saft, Nektar oder Schorle Teil der Angabe. Deshalb sagt der Hinweis auf der Vorderseite allein noch nichts darüber aus, wie viel Zucker im Getränk steckt.",
      label: "MERKE",
      note: "Vorderseite lesen. Nährwerttabelle prüfen.",
    };
  }

  if (id === "zero-zucker") {
    return {
      kicker: "ZERO-CHECK",
      title: ["Was sagt", "0 g Zucker?"],
      body: "0 g beantwortet die Zuckerfrage: Das Getränk enthält laut Nährwerttabelle keinen Zucker. Süßstoffe, Koffein und Gewohnheit bleiben trotzdem eigene Themen. Sie gehören zu einer anderen Frage und brauchen einen getrennten Blick.",
      label: "DAS SAGT DER WERT",
      note: "Zucker pro 100 ml, nicht das ganze Getränk.",
    };
  }

  if (id === "pro-100-ml") {
    return {
      kicker: "VERGLEICHEN LERNEN",
      title: ["Warum steht Zucker", "pro 100 ml da?"],
      body: "Der 100-ml-Wert schafft eine gemeinsame Basis, damit Dose und Literflasche fair vergleichbar bleiben. Erst im zweiten Schritt zeigt die Packungsgröße, wie viel Zucker in der ganzen Dose oder Flasche zusammenkommt. Deshalb gehören beide Angaben zusammen.",
      label: "REIHENFOLGE",
      note: "100 ml vergleichen. Packung mitdenken.",
    };
  }

  if (id === "zuckerwuerfel") {
    return {
      kicker: "RECHENHILFE",
      title: ["Warum nutzen wir", "Zuckerwürfel?"],
      body: "Zuckerhaltig.de rechnet mit 3 g Zucker pro Würfel. So werden Grammangaben schneller greifbar, auch bei großen Packungen. Die Würfel zeigen eine Orientierung für die Menge und sind kein medizinischer Grenzwert.",
      label: "FORMEL",
      note: "Gesamtzucker durch 3 teilen.",
    };
  }

  if (id === "rundung") {
    return {
      kicker: "GENAUIGKEIT",
      title: ["Warum werden", "Werte gerundet?"],
      body: "Viele Etiketten runden ihre Angaben bereits. Zuckerhaltig.de rundet ebenfalls, damit Vergleiche lesbar bleiben und nicht eine Nachkommastelle im Mittelpunkt steht. Kleine Abweichungen zwischen Rechnung und Anzeige sind deshalb möglich.",
      label: "DARUM",
      note: "Kleine Abweichungen sind möglich.",
    };
  }

  if (id === "packungsgroesse") {
    return {
      kicker: "DATENMODELL",
      title: ["Warum gibt es", "mehrere Größen?"],
      body: "250 ml, 330 ml und 500 ml brauchen eigene Einträge, auch wenn die Rezeptur gleich sein kann. Der Wert pro 100 ml bleibt vergleichbar. Der Gesamtzucker ändert sich aber mit der Packungsgröße und genau dieser Wert zählt für die ganze Dose oder Flasche.",
      label: "DESHALB",
      note: "Größe und Gesamtzucker zusammen lesen.",
    };
  }

  if (id === "fruchtzucker") {
    return {
      kicker: "ETIKETT LESEN",
      title: ["Ist Fruchtzucker", "auch Zucker?"],
      body: "Ja. Auf dem Nährwertetikett zählt die gesamte Zuckermenge. Das gilt auch für natürlich vorkommenden Fruchtzucker in Saft, Nektar oder Schorle. Die Produktart ändert nichts daran, was in der Tabelle als Zucker angegeben wird.",
      label: "MERKE",
      note: "Die Produktart ändert die Rechnung nicht.",
    };
  }

  if (id === "werte-unterschiede") {
    return {
      kicker: "GENAU HINSCHAUEN",
      title: ["Warum sind Werte", "nicht immer gleich?"],
      body: "Rezeptur, Land, Größe und Sorte können abweichen. Deshalb kann ein Getränk mit ähnlichem Namen andere Werte haben. Im Zweifel zählt die aktuelle Verpackung oder die Angabe des Herstellers, nicht nur Marke oder Produktname.",
      label: "PRÜFEN",
      note: "Nicht nur nach Marke oder Name gehen.",
    };
  }

  if (id === "pruefdatum") {
    return {
      kicker: "QUELLEN PRÜFEN",
      title: ["Warum zählt", "das Prüfdatum?"],
      body: "Produkte ändern sich und das gilt auch für Zuckerwerte. Das Prüfdatum zeigt, wann ein Wert kontrolliert wurde. Vor Kauf, Veröffentlichung oder genauer Auswertung lohnt sich deshalb immer der Blick auf die aktuelle Verpackung.",
      label: "AKTUELL BLEIBEN",
      note: "Quelle und Prüfdatum zusammen ansehen.",
    };
  }

  return {
    kicker: "DATEN STATT RATEN",
    title: ["Woher kommen", "Zuckerwerte?"],
    body: "Jeder Drink-Eintrag führt einen Quellenhinweis. Werte sollten aus Verpackungen, Herstellerseiten oder verlässlichen Produktdaten stammen. Weil Rezepturen sich ändern können, gehören Quelle und Prüfdatum immer zur Einordnung eines Zuckerwerts dazu.",
    label: "WICHTIG",
    note: "Quelle und Prüfdatum mitlesen.",
  };
}

function renderArticle(post: InfoPost, copy: ArticleCopy) {
  const longestTitleLine = Math.max(...copy.title.map((line) => line.length));
  const titleSize = longestTitleLine > 18 ? 58 : 72;
  const body = wrapText(copy.body, 52);

  return frame(`
    <rect x="64" y="158" width="952" height="342" rx="30" fill="#1f4539"/>
    <rect x="102" y="202" width="${Math.max(186, copy.kicker.length * 13 + 48)}" height="42" rx="21" fill="#d8f36a"/>
    <text x="126" y="230" font-size="17" font-weight="750" letter-spacing="1">${escape(copy.kicker)}</text>
    ${lineText(copy.title, 102, 336, titleSize, titleSize * 0.94, "#f5f8f2", 750)}
    <rect x="64" y="528" width="952" height="476" rx="30" fill="#f8faf4" stroke="#17201d" stroke-opacity="0.12" stroke-width="2"/>
    <text x="102" y="602" fill="#597165" font-size="18" font-weight="750" letter-spacing="1">DIE KURZE ANTWORT</text>
    ${lineText(body, 102, 660, 28, 39, "#17201d", 650)}
    <line x1="102" y1="882" x2="978" y2="882" stroke="#17201d" stroke-opacity="0.14" stroke-width="2"/>
    <rect x="102" y="902" width="876" height="62" rx="20" fill="#d8f36a"/>
    <text x="132" y="928" font-size="15" font-weight="750" letter-spacing="1">${escape(copy.label)}</text>
    <text x="132" y="953" font-size="21" font-weight="700" letter-spacing="-0.7">${escape(copy.note)}</text>
  `, post.source);
}

function wrapText(text: string, maxChars: number) {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function lineText(lines: string[], x: number, y: number, size: number, lineHeight: number, color: string, weight: number) {
  return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" letter-spacing="${size >= 54 ? -Math.round(size * 0.055) : 0}">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escape(line)}</tspan>`).join("")}</text>`;
}

function frame(content: string, source: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M38 0H0V38" fill="none" stroke="#1f4539" stroke-opacity="0.055" stroke-width="1"/></pattern></defs>
    <rect width="${width}" height="${height}" fill="#edf0e8"/><rect width="${width}" height="${height}" fill="url(#grid)"/>
    <g font-family="Inter, Arial, Helvetica, sans-serif" fill="#17201d">
      ${mark(64, 58)}
      <text x="118" y="87" font-size="30" font-weight="750" letter-spacing="-1.8">zuckerhaltig<tspan fill="#597165" font-weight="650">.de</tspan></text>
      <text x="1016" y="87" text-anchor="end" font-size="17" font-weight="750" letter-spacing="1.6">ZUCKER-WISSEN</text>
      <line x1="64" y1="118" x2="1016" y2="118" stroke="#17201d" stroke-opacity="0.16" stroke-width="2"/>
      ${content}
      <line x1="64" y1="1214" x2="1016" y2="1214" stroke="#17201d" stroke-opacity="0.16" stroke-width="2"/>
      <text x="64" y="1256" fill="#597165" font-size="16" font-weight="700">${escape(source.toUpperCase())}</text>
      <text x="1016" y="1256" text-anchor="end" font-size="17" font-weight="750">zuckerhaltig.de</text>
    </g>
  </svg>`;
}

function renderOhneZucker(post: InfoPost) {
  return frame(`
    <rect x="64" y="158" width="952" height="846" rx="30" fill="#f8faf4" stroke="#17201d" stroke-opacity="0.12" stroke-width="2"/>
    <rect x="102" y="204" width="230" height="42" rx="21" fill="#d8f36a"/><text x="217" y="231" text-anchor="middle" font-size="17" font-weight="750" letter-spacing="1">ETIKETT LESEN</text>
    <text x="102" y="366" font-size="62" font-weight="750" letter-spacing="-3.2">Was heißt</text>
    <text x="102" y="434" font-size="54" font-weight="750" letter-spacing="-2.7">ohne Zuckerzusatz?</text>
    <g transform="rotate(-4 766 430)"><rect x="618" y="292" width="296" height="264" rx="28" fill="#1f4539"/><text x="650" y="365" fill="#d8f36a" font-size="23" font-weight="750" letter-spacing="1.5">OHNE</text><text x="650" y="430" fill="#f5f8f2" font-size="43" font-weight="750" letter-spacing="-2.2">ZUCKER</text><text x="650" y="477" fill="#f5f8f2" font-size="43" font-weight="750" letter-spacing="-2.2">ZUSATZ</text><line x1="650" y1="502" x2="882" y2="502" stroke="#b9d4c3" stroke-opacity="0.45" stroke-width="2"/><text x="650" y="535" fill="#b9d4c3" font-size="16" font-weight="650">Vorderseite einer Packung</text></g>
    <rect x="102" y="598" width="812" height="310" rx="24" fill="#1f4539"/>
    <text x="136" y="660" fill="#d8f36a" font-size="18" font-weight="750" letter-spacing="1">DIE KURZE ANTWORT</text>
    <text x="136" y="724" fill="#f5f8f2" font-size="29" font-weight="650">Ohne Zuckerzusatz heißt nicht zuckerarm.</text>
    <text x="136" y="770" fill="#b9d4c3" font-size="23" font-weight="650">In Saft, Nektar und Schorle zählt natürlich enthaltener</text>
    <text x="136" y="804" fill="#b9d4c3" font-size="23" font-weight="650">Fruchtzucker auf dem Nährwertetikett trotzdem mit.</text>
    <line x1="136" y1="842" x2="880" y2="842" stroke="#b9d4c3" stroke-opacity="0.35" stroke-width="2"/>
    <text x="136" y="878" fill="#f5f8f2" font-size="21" font-weight="700">Merke: Vorderseite lesen, Nährwerttabelle prüfen.</text>
  `, post.source);
}

function renderZero(post: InfoPost) {
  return frame(`
    <rect x="64" y="158" width="566" height="846" rx="30" fill="#1f4539"/>
    <rect x="102" y="204" width="178" height="42" rx="21" fill="#d8f36a"/><text x="191" y="231" text-anchor="middle" font-size="17" font-weight="750" letter-spacing="1">ZERO-CHECK</text>
    <text x="102" y="370" fill="#b9d4c3" font-size="27" font-weight="700">Was sagt</text><text x="102" y="518" fill="#d8f36a" font-size="168" font-weight="750" letter-spacing="-12">0<tspan font-size="66" letter-spacing="-4"> g</tspan></text><text x="102" y="568" fill="#f5f8f2" font-size="53" font-weight="750" letter-spacing="-2.8">Zucker?</text>
    <line x1="102" y1="644" x2="592" y2="644" stroke="#b9d4c3" stroke-opacity="0.38" stroke-width="2"/>
    <text x="102" y="706" fill="#b9d4c3" font-size="20" font-weight="650">Für die reine Zuckerfrage:</text><text x="102" y="756" fill="#f5f8f2" font-size="35" font-weight="750">meist niedriger.</text>
    <rect x="660" y="158" width="356" height="846" rx="30" fill="#f8faf4" stroke="#17201d" stroke-opacity="0.12" stroke-width="2"/>
    <text x="698" y="230" fill="#597165" font-size="18" font-weight="750" letter-spacing="1">WAS DER WERT SAGT</text>
    <text x="698" y="326" font-size="57" font-weight="750" letter-spacing="-3">Zucker</text><text x="698" y="370" fill="#597165" font-size="24" font-weight="700">pro 100 ml</text>
    <line x1="698" y1="414" x2="978" y2="414" stroke="#17201d" stroke-opacity="0.16" stroke-width="2"/>
    <text x="698" y="478" font-size="23" font-weight="650">0 g beantwortet die</text><text x="698" y="512" font-size="23" font-weight="650">Zuckerfrage. Mehr nicht.</text>
    <text x="698" y="586" fill="#597165" font-size="20" font-weight="650">Süßstoffe, Koffein und</text><text x="698" y="616" fill="#597165" font-size="20" font-weight="650">Gewohnheit bleiben</text><text x="698" y="646" fill="#597165" font-size="20" font-weight="650">eigene Themen.</text>
    <rect x="698" y="720" width="280" height="180" rx="20" fill="#d8f36a"/><text x="726" y="770" font-size="17" font-weight="750" letter-spacing="1">DARUM</text><text x="726" y="820" font-size="27" font-weight="750" letter-spacing="-1">Werte getrennt</text><text x="726" y="854" font-size="27" font-weight="750" letter-spacing="-1">lesen.</text>
  `, post.source);
}

function render100Ml(post: InfoPost) {
  return frame(`
    <text x="64" y="226" fill="#597165" font-size="18" font-weight="750" letter-spacing="1.2">VERGLEICHEN LERNEN</text>
    <text x="64" y="334" font-size="72" font-weight="750" letter-spacing="-4">Warum pro 100 ml?</text>
    <text x="64" y="380" fill="#597165" font-size="23" font-weight="650">Weil Dose und Literflasche sonst nicht fair vergleichbar sind.</text>
    <rect x="64" y="430" width="952" height="162" rx="28" fill="#1f4539"/><text x="104" y="489" fill="#b9d4c3" font-size="18" font-weight="750" letter-spacing="1">SCHRITT 1</text><text x="104" y="557" fill="#d8f36a" font-size="72" font-weight="750" letter-spacing="-4">100 ml</text><text x="500" y="523" fill="#f5f8f2" font-size="32" font-weight="700">zeigt die Rezeptur</text><path d="M912 514 H962 M938 490 L962 514 L938 538" fill="none" stroke="#d8f36a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="64" y="620" width="952" height="318" rx="28" fill="#f8faf4" stroke="#17201d" stroke-opacity="0.12" stroke-width="2"/>
    <text x="104" y="682" fill="#597165" font-size="18" font-weight="750" letter-spacing="1">WAS DANACH KOMMT</text>
    <text x="104" y="748" font-size="31" font-weight="700" letter-spacing="-1.4">Der 100-ml-Wert vergleicht die Rezeptur.</text>
    <text x="104" y="796" fill="#597165" font-size="24" font-weight="650">Erst die Packungsgröße zeigt, welche Menge in Dose oder</text><text x="104" y="830" fill="#597165" font-size="24" font-weight="650">Flasche zusammenkommt. Beide Werte gehören zusammen.</text>
    <rect x="104" y="858" width="872" height="48" rx="24" fill="#d8f36a"/><text x="540" y="890" text-anchor="middle" font-size="19" font-weight="750">100 ml vergleichen. Packung mitdenken.</text>
  `, post.source);
}

function renderSources(post: InfoPost) {
  return frame(`
    <rect x="64" y="158" width="952" height="846" rx="30" fill="#1f4539"/>
    <text x="102" y="238" fill="#b9d4c3" font-size="18" font-weight="750" letter-spacing="1.2">DATEN STATT RATEN</text><text x="102" y="352" fill="#f5f8f2" font-size="78" font-weight="750" letter-spacing="-4">Woher kommen</text><text x="102" y="438" fill="#f5f8f2" font-size="78" font-weight="750" letter-spacing="-4">Zuckerwerte?</text>
    <text x="102" y="504" fill="#b9d4c3" font-size="24" font-weight="650">Jeder Drink-Eintrag führt einen Quellenhinweis.</text>
    <rect x="102" y="564" width="812" height="306" rx="24" fill="#f8faf4"/>
    <text x="136" y="630" fill="#597165" font-size="18" font-weight="750" letter-spacing="1">WORAUF WIR SCHAUEN</text>
    <text x="136" y="696" font-size="29" font-weight="700">Werte sollten aus Verpackungen, Herstellerseiten</text><text x="136" y="734" font-size="29" font-weight="700">oder verlässlichen Produktdaten stammen.</text>
    <text x="136" y="792" fill="#597165" font-size="22" font-weight="650">Weil Rezepturen sich ändern können, lohnt der Blick auf</text><text x="136" y="824" fill="#597165" font-size="22" font-weight="650">die aktuelle Verpackung und das Prüfdatum.</text>
    <rect x="102" y="900" width="812" height="54" rx="18" fill="#d8f36a"/><text x="508" y="935" text-anchor="middle" font-size="19" font-weight="750">Quelle lesen. Datum prüfen. Wert einordnen.</text>
  `, post.source);
}

function mark(x: number, y: number) {
  return `<g transform="translate(${x} ${y})"><rect width="40" height="40" rx="11" fill="#1f4539"/><rect x="9" y="9" width="9" height="9" rx="2" fill="#d8f36a"/><rect x="22" y="9" width="9" height="9" rx="2" fill="#d8f36a"/><rect x="9" y="22" width="9" height="9" rx="2" fill="#d8f36a"/><rect x="22" y="22" width="9" height="9" rx="2" fill="#f5f8f2"/></g>`;
}

function escape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function clean(out: string) {
  const files = await readdir(out);
  await Promise.all(files.filter((file) => file !== "buffer-posts.json").map((file) => rm(path.join(out, file), { recursive: true, force: true })));
}

async function assertPng(filePath: string) {
  const metadata = await sharp(filePath).metadata();
  if (metadata.width !== width || metadata.height !== height) throw new Error(`${filePath}: falsche Bildgröße`);
}

function today() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
