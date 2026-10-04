# Redesign- und SEO-Playbook

Stand: Oktober 2026. Erstellt für zuckerhaltig.de und gedacht als Vorlage für proteinhaltig.de, das denselben Aufbau und dasselbe Design nutzt.

Das Dokument fasst zusammen, was analysiert, entschieden und gebaut wurde, und wie man es überträgt. Code-Pfade beziehen sich auf dieses Repo.

---

## 1. Ausgangslage und Learnings

### Search-Console-Daten (Export 6 Monate, Stand 02.10.2026)

| Zeitraum | Impressionen/Tag | Ø Position |
|---|---|---|
| Mitte Juni – 26.07. | 300–430 | 11–14 |
| 27.07. – 25.09. | 0–30 | 50–80 |
| ab 26.09. | 380–435 | 6,4 |

- **Absturz über Nacht** am 27.07.: von 332 auf 13 Impressionen, Position von 12,7 auf 66. Das betraf die ganze Domain und passt zu einem Spam-Update, nicht zu einem schleichenden Qualitätsverlust. In der Search Console war keine manuelle Maßnahme eingetragen.
- **Wahrscheinliche Ursachen:**
  - Hunderte gleich gebauter Getränkeseiten mit generierten Absätzen und FAQs, die dieselben Zahlen 3–4-mal wiederholten.
  - Am 21.07. kamen Footer-Links zu den Schwesterprojekten dazu (aivergleich.de, proteinhaltig.de). Mehrere Domains mit gleichem Aufbau und Querlinks sind das typische Muster für „scaled content abuse“.
- **Erholung über Nacht** am 26.09., etwa 9 Tage nachdem fast alle Getränkeseiten auf `noindex` gesetzt wurden. Die Position war danach besser als vorher.
- **Impressionen sind kaum Traffic.** In 6 Monaten kamen 48 Klicks zusammen, die Klickrate lag bei 0,3 %.
  - Die Suchanfragen sind Kurzfragen („cola zucker pro 100ml“), die Google selbst beantwortet.
  - Klicks gibt es fast nur auf Platz 1–3 oder im Antwort-Snippet.
- **Die noindex-Seiten waren nicht wertlos.** Die 171 abgeschalteten URLs brachten 22 Klicks, die 39 indexierten 18.
  - Die Nachfrage liegt bei eigenständigen Produkten (Coca-Cola Zero, Mezzo Mix, Monster Mango Loco, Coca-Cola Light, Spezi …).
  - Größenvarianten (330 ml neben 500 ml) brachten nichts.
- **Mobil dominiert:** 11.817 von 16.318 Impressionen kamen vom Handy.

### Regeln, die daraus folgen (gelten für beide Projekte)

1. **Kein generierter Fließtext in Masse.** Seiten tragen sich über belegte Zahlen und daraus berechnete Vergleiche, nicht über umformulierte Absätze.
2. **Keine seitenweiten Links zwischen den Schwesterprojekten,** solange sie gleich gebaut sind.
3. **Indexierung nur in Wellen:**
   - höchstens 15–20 Seiten pro Welle, 2–3 Wochen Abstand
   - nur Produkte mit belegter Nachfrage laut Search Console
   - ablaufen lassen über `lib/seo-index.ts` und den Skill `.claude/skills/seo-wave`
4. **Eine Seite pro Produkt:** Größenvarianten bleiben `noindex`, die kanonische Seite zeigt alle Größen.
5. **Antwort zuerst:** Der erste Satz beantwortet die Suchanfrage wörtlich. Packungsgrößen stehen als echte Tabelle, damit Google sie als Snippet übernehmen kann.
6. **Niemals Werte oder Quellen erfinden.** Jede Zahl hat Quelle, Prüfdatum und Status.

---

## 2. Was auf der Live-Seite schon geändert ist

| Änderung | Dateien |
|---|---|
| 404-Seiten geben nur noch `noindex` aus (globales `robots` aus dem Root-Layout entfernt) | `app/layout.tsx` |
| Nicht indexierte Detailseiten verlinken ähnliche Getränke, Kategorie und Marke, statt in einer Sackgasse zu enden | `app/[locale]/getraenke/[drinkId]/page.tsx` |
| Antwortsatz oben auf jeder Detailseite | ebenda, `answerText()` |
| Block „Wie viel ist das?“: Kategorie-Durchschnitt und Platz, zuckerärmere Alternative, WHO-Bezug | ebenda, `SugarContext`; Logik in `lib/sugar-context.ts` |
| kcal pro Packungsgröße, kcal einheitlich gerundet | ebenda |
| Mobile Liste: nur die Suche sichtbar, übrige Filter hinter „Alle Filter“; Zeile antippen öffnet die Detailseite | `components/drink-explorer.tsx` |
| Startseiten-H1 „Wie viel“ statt „Wieviel“ | `app/[locale]/test/page.tsx` |
| Seed-Datei enthält nur Quelldaten; `faq` und `computed` entfernt (541 → 328 KB), Prüfung verbietet sie | `lib/data/drinks.seed.json`, `scripts/validate-drinks-data.mjs` |

---

## 3. Redesign: Prinzipien

Ziel: **hochwertig und designt, aber die Antwort steht ganz oben.** Der Entwurf liegt noindex unter `/de/test/redesign`.

1. **Antwort vor Atmosphäre.** Name, Zahl und Antwortsatz stehen im ersten Bildschirm, auch mobil.
2. **Zahlen sind die Bilder.** Große Ziffern, Zuckerwürfel, Skalen und Balken ersetzen Text.
3. **Einordnen statt erklären.** Jede Zahl bekommt einen Vergleich: Kategorie, Alternative, Tagesempfehlung.
4. **Ruhige Flächen, weiche Karten, viel Luft.** Keine harten Trennlinien. Dunkle Bühnen nur für die Hauptgrafik.
5. **Eine Farblogik überall.** Lime für zuckerfrei, Hellgrün für zuckerarm, Moosgrün für „mit Zucker“. Die Farbe steht nie allein, es gibt immer ein Textlabel.
6. **Echte Tabellen** für tabellarische Daten (Packungsgrößen, Kategorien, Produktlisten). Das ist gut lesbar und gut für Snippets.
7. **Quelle sichtbar, nicht versteckt.** Quelle, Status, Prüfdatum und Rechenweg stehen in einer eigenen Box.

---

## 4. Design-Tokens

Die Seitenvariablen kommen aus `app/globals.css`. Dark Mode läuft über die Klasse `.dark` auf `<html>`. Die Entwurfs-Tokens sind in `app/[locale]/test/redesign/redesign.module.css` unter `.page` definiert.

### Farben

| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--ink` | `#17201d` | `#f3f7ef` | Text, starke Linien |
| `--paper` | `#edf0e8` | `#14221d` | Seitenhintergrund |
| `--mist` | `#f8faf4` | `#1c3028` | Kartenfläche |
| `--ash` | `#d4dbd2` | `#30463b` | Haarlinien (`--hair`) |
| `--slate` | `#526158` | `#cad6cc` | Sekundärtext |
| `--graphite` | `#748278` | `#a7b8ac` | Achsen, Zähler |
| `--moss` | `#1f4539` | gleich | Faktenkarte, „mit Zucker“ |
| `--moss-deep` | `#163328` | gleich | Verlaufsende, Bühne |
| `--lime` | `#d8f36a` | gleich | Akzent, Würfel, zuckerfrei |
| `--level-low` | `#a9d27e` | gleich | zuckerarm |
| `--dot` | `#1f4539` | `#d8f36a` | Punkte und Balken in Grafiken |
| `--band-free` | Lime 50 % | Lime 20 % | Bereich zuckerfrei, aktive Zeile |
| `--band-low` | Hellgrün 30 % | 12 % | Bereich zuckerarm |

Verläufe für Faktenkarte und Showcase: `radial-gradient(120% 90% at 100% 0%, #2c5a4a 0%, #1f4539 45%, #163328 100%)`.

### Typografie

Systemschrift, Ziffern mit `font-variant-numeric: tabular-nums`.

| Element | Größe | Gewicht | Laufweite |
|---|---|---|---|
| H1 | `clamp(2.6rem, 6vw, 4.6rem)`, Zeilenhöhe 0.98 | 750 | -0.04em |
| H2 | `clamp(1.7rem, 3.2vw, 2.4rem)` | 750 | -0.03em |
| Eyebrow | 0.74rem, Großbuchstaben | 700 | +0.12em |
| Lead / Antwort | 1.12–1.2rem, Zeilenhöhe 1.55 | 400 (Zahl fett) | 0 |
| Heldenzahl | `clamp(5rem, 11vw, 8rem)`, Zeilenhöhe 0.85 | 800 | -0.06em |
| Kartenzahl | 2.2–2.6rem | 800 | -0.05em |

### Formen und Tiefe

- **Radien:** Karten 20–24px, Hero-Karten 28px, Pills und Badges 999px, Nährwert-Etikett bewusst 6px.
- **Kartenschatten** `--card-shadow`: `0 1px 0 rgba(23,32,29,.04), 0 24px 60px -36px rgba(23,32,29,.35)`.
- **Hero-Karten:** `0 40px 80px -40px rgba(22,51,40,.65)`. Die Showcase-Karte ist um -1.5° gedreht und richtet sich beim Hover gerade aus.
- **Dekor:** ein dünner Lime-Kreis (`border: 1px solid rgba(216,243,106,.3)`) an der Kartenecke.
- **Abstände:** Seitenbreite 1180px, 1.25rem Rand, Sektionen 5rem auseinander (mobil 3.5rem).

---

## 5. Komponenten

Live seit dem Redesign-Release (Oktober 2026). Gemeinsame Bausteine liegen in `components/ui/`, die Tokens in `app/globals.css` und `tailwind.config.ts` (`hair`, `moss`, `lime`, `shadow-card`, Radien `sm` 6px, `md` 10px, `lg` 18px).

| Komponente | Datei / Klasse | Zweck und Regeln |
|---|---|---|
| Seitenstil | `ui.module.css` (`.page`, `.section`, `.sectionHead`, `.card`) | Container 1180px, Abschnitte mit 5rem Abstand, H2 ohne Eyebrow darüber. |
| Tailwind-Abschnitt | `section.tsx` (`Section`, `cardClass`, `textLinkClass`) | Gleiche Optik für Seiten, die mit Tailwind gebaut sind. |
| Seitenkopf | `PageHero` in `components/seo-drink-list.tsx` | H1 plus ein Satz. Kein Kicker. |
| Suchfeld mit Sofort-Treffern | `home-search.tsx` | Suche über Marke, Name und Kategorie, normalisiert, höchstens 8 Treffer. |
| Einstufungs-Badge | `level-badge.tsx` | Nur zeigen, wenn es unterscheidet (Tabellen blenden die Spalte aus, wenn alle Zeilen gleich sind; Klassiker-Karten zeigen nur „zuckerfrei“/„zuckerarm“). |
| Showcase-Karte | `.showcase` | „Heute im Blick“, tägliche Rotation über Produkte mit Nachfrage. |
| Klassiker-Karten | `.popularGrid` / `.popularCard` | Kategorie oben, Name, Gesamtzucker, Balken, Wert pro 100 ml. |
| Zuckerskala (alle Produkte) | `sugar-strip-plot.tsx` | Punktdiagramm auf dunkler Bühne (`.stage`). |
| Skala für ein Produkt | `sugar-scale.tsx` | Wert, Kategorie-Durchschnitt, EU-Bereiche. |
| Faktenkarte | `.factCard` | Gesamtzucker, gezeichnete Würfel (`sugar-cubes-graphic.tsx`), pro 100 ml, Würfel, kcal, Anteil an 50 g. |
| Kontext-Karten | `.contextList` | Fakten aus `lib/drink-facts.ts`, je eine Karte. |
| Sortierbare Tabelle | `category-table.tsx` (über `SortableDrinkRows`) | Kategorie-, Marken-, Ranking- und Vergleichsseiten. `compact` für zweispaltige Layouts. |
| Kopf-an-Kopf-Tabelle | `head-to-head.tsx` | Hauptprodukte einer Vergleichsseite: pro 100 ml, Packung, Würfel, kcal. |
| Nährwert-Etikett | `.label` | Etikett-Stil, „davon Zucker“ hervorgehoben. |
| Quellenbox | `.source` | Quelle, Status, Prüfdatum, Rechenweg, Korrektur-Link. |
| Kennzahl-Karten | `.statGrid` / `.statCard` | Kategorie- und Markenseiten. |
| Kacheln | `.tileGrid` / `.tile` | Kategorie-Übersicht mit Durchschnitt und Spannen-Balken. |
| Rechenbeispiel | `.formula` | Startseite: 100-ml-Wert × Füllmenge = Packung ÷ 3 g = Würfel, mit echtem Produkt. Ersetzt die „01/02/03“-Schrittkarten. |
| Artikel-Karten | `.articleGrid` / `.articleCard` | Bild, Lesezeit, Titel. Keine Beschreibung. |
| Chips | `.chipList` | Querverweise am Seitenende. |

---

## 6. Seitenaufbau

**Startseite:** H1, Lead, Suche, Meta-Zeile (Anzahl, Quelle, Prüfdatum), Showcase. Dann Klassiker, Zuckerskala, Kategorientabelle mit Spannen-Balken, drei Grundlagen-Artikel, Rechenbeispiel.

**Produktseite:** Brotkrumen, Meta (Marke · Kategorie · Größe), H1 als Frage, Antwortsatz, Badge und Quelle, Faktenkarte. Dann Tausch-Rechner, „Ist das viel?“ (Skala + Fakten), Packungsgrößen mit Ankern, nur bei hervorgehobenen Produkten „Hinweise zum Wert“ und Sortenvergleich, Etikett und Quelle, ähnliche Produkte, FAQ, Chips.

**Kategorieseite:** H1, Intro, vier Kennzahl-Karten, sortierbare Tabelle, ein Absatz mit kategoriespezifischem Fakt, Chips zu anderen Kategorien.

**Markenseite:** wie Kategorie, dazu Sortenvergleich (Kopf-an-Kopf-Tabelle) und bei Red Bull die Editionen-Tabelle mit Ankern.

**Rankings und Vergleiche:** PageHero mit der datenbasierten Antwort, eine Zeile Hinweis mit Link, Tabelle(n).

### Was als Rauschen entfernt wurde (gilt auch für proteinhaltig.de)

- Großgeschriebene Eyebrows über jeder Überschrift („MEISTGESUCHT“, „EINORDNUNG“, „DATENQUELLE“).
- Überschriften mit Punkt am Ende („Zuckerwerte vergleichen.“, „Nachprüfbar.“) und Slogan-Paare („Weniger raten. Besser vergleichen.“).
- Nummerierte Schrittkarten „01 02 03“.
- Badges, die überall dasselbe sagen (14-mal „mit Zucker“).
- Textbausteine, die auf jeder Seite die Zahl oder das Prinzip wiederholen („Der Wert je 100 ml macht die Produkte vergleichbar …“, „… werden als eigene Datensätze geführt“, „Mango Loco bleibt Mango Loco“). Kategorien behalten einen Absatz mit eigenem Fakt, Marken nur noch Tabellen.
- Absicherungs-Sätze unter Tabellen („Eine Bewertung von Geschmack ist nicht enthalten“).
- FAQ-Fragen ohne echte Suchabsicht („Ist Coca-Cola Zero in den 53 g enthalten?“).
- Keyword-Linklisten („Häufig gesucht“ mit viermal derselben URL) und Meta-Texte über Suchanfragen auf der Seite selbst.
- Doppelte Marken in Namen („Paulaner / Paulaner Spezi“).

---

## 7. Datenlogik

Gemeinsame Logik liegt in `lib/sugar-context.ts`. Live-Seite und Entwurf nutzen sie beide.

- `sugarLevel()`: zuckerfrei ≤ 0,5 g/100 ml, zuckerarm ≤ 2,5 g/100 ml (EU-Verordnung 1924/2006, Angaben für Getränke)
- `categoryPeers()`, `averageSugarPer100Ml()`, `sugarRank()`: Vergleich innerhalb der Kategorie, je Produkt nur ein Vertreter
- `lowerSugarAlternative()`: mindestens 2 g/100 ml weniger, dieselbe Marke bevorzugt
- WHO-Bezug: höchstens 10 % der Energie aus freiem Zucker, idealerweise unter 5 %. Bei 2.000 kcal sind das 50 bzw. 25 g pro Tag (WHO-Leitlinie 2015).

### Übertragung auf Protein (proteinhaltig.de)

Die Struktur bleibt gleich, nur die Kennzahlen ändern sich. **Alle Werte vor dem Einbau an der Originalquelle prüfen.**

| Zuckerhaltig | Proteinhaltig (Vorschlag) |
|---|---|
| zuckerfrei / zuckerarm (g pro 100 ml) | „Proteinquelle“ ab 12 % und „hoher Proteingehalt“ ab 20 % der Energie aus Protein (EU-Verordnung 1924/2006). Das ist ein Energieanteil: Protein (g) × 4 kcal ÷ kcal gesamt. |
| WHO 50 g Zucker pro Tag | Referenzmenge Eiweiß 50 g pro Tag (EU-Verordnung 1169/2011, Anhang XIII) |
| zuckerärmere Alternative | proteinreichere Alternative derselben Kategorie, oder mehr Protein pro 100 kcal |
| Zuckerwürfel (3 g) | eine anschauliche Einheit nur dann, wenn sie sauber belegbar ist. Sonst weglassen. |
| Farblogik: mehr Zucker = dunkler | mehr Protein = kräftiger. Eigene Akzentfarbe statt Lime (siehe unten). |

---

## 8. Token- und Workflow-Setup

So bleiben Claude-Sitzungen günstig und treffsicher:

- **`CLAUDE.md`:** kurze Projektübersicht mit Datenfluss, Indexierungslogik, SEO-Vorgeschichte, Token-Hinweisen und Stolperfallen.
- **Skills** in `.claude/skills/`. Geladen wird nur die Beschreibung, der Inhalt erst bei Bedarf:
  - `drink-data`: Datenpflege, Quellenregeln, Prüfung
  - `seo-wave`: Indexierungswellen
  - `verify`: Typecheck, Build, `seo:check`, Testserver, Screenshots
- **`npm run drink -- <begriff>`:** kompakte Suche in der Seed-Datei, damit niemand die ganze Datei liest.
- **Seed-Datei nur mit Quelldaten.** Abgeleitetes (Packungszucker, Würfel, kcal, FAQ) wird zur Build-Zeit berechnet.
- **Stolperfalle:** Nicht neu bauen, solange `next start` auf demselben `.next` läuft, sonst gibt es veraltete Seiten mit kaputtem CSS. Server per PID beenden (`pkill -f next` trifft auch die eigene Shell), dann `rm -rf .next`.
- **Screenshots** nur von einzelnen Abschnitten machen, nicht von ganzen Seiten. Das spart Tokens und bleibt lesbar.

---

## 9. Checkliste für proteinhaltig.de

**Vorab**
- [ ] Search-Console-Export holen (Seiten, Suchanfragen, Verlauf). Prüfen, ob dort derselbe Absturz am 27.07. zu sehen ist.
- [ ] Footer- und Querlinks zu den Schwesterprojekten entfernen, falls noch vorhanden.
- [ ] Anzahl indexierter Seiten und generierter Texte prüfen. Wenn viele gleich gebaute Seiten indexiert sind, das Allowlist-Prinzip (`seo-index.ts`) übernehmen.

**Technik**
- [ ] `CLAUDE.md`, die Skills und das Suchskript übertragen und an die Protein-Daten anpassen.
- [ ] `faq` und `computed` aus der Seed-Datei entfernen, falls vorhanden. Die Prüfung soll sie verbieten.
- [ ] Die 404-Robots-Korrektur übernehmen (kein globales `robots` im Root-Layout).
- [ ] `lib/sugar-context.ts` als `lib/protein-context.ts` nachbauen, mit den Kennzahlen aus Abschnitt 7.

**Design**
- [ ] Den Entwurf erst unter `/de/test/redesign` aufbauen (noindex), dann Seitentyp für Seitentyp live schalten.
- [ ] **Bewusst nicht pixelgleich zu zuckerhaltig.de.** Zwei Domains mit identischem Template sind ein Erkennungsmerkmal. Mindestens unterscheiden sollten sich:
  - Akzentfarbe und Hero-Verlauf
  - Form der Showcase-Karte
  - die Hauptgrafik (bei Protein z. B. Protein pro 100 kcal statt pro 100 ml)
- [ ] Mit 5 Personen testen: 3–4 Aufgaben am Handy, alte gegen neue Seite.

**SEO danach**
- [ ] Antwortsatz und Packungstabelle auf allen Produktseiten
- [ ] Indexierungswellen von je 15–20 Produkten mit belegter Nachfrage
- [ ] Vertrauensseiten: Über-Seite mit Person, Methodik, Korrekturhinweis, „Zuletzt geprüft“

---

## 10. Offene Punkte (zuckerhaltig.de)

- Indexierungswelle 1 live am 04.10.2026, Release 05.10.2026 mit 10 weiteren URLs, siehe `lib/seo-index.ts`. Nächste Welle frühestens 3 Wochen nach dem Deploy und nur bei stabilen Impressionen.
- Cookie-Banner und Datenschutzerklärung sind live. Offen: Hosting-Anbieter in der Datenschutzerklärung nennen, Aufbewahrungsfrist in Google Analytics prüfen.
- Strukturierte Daten `NutritionInformation` auf den indexierten Produktseiten.
- In der Zuckerskala liegen die Punkte bei 10–11 g sehr dicht.
- Eigene Etikettenfotos der Top-30-Produkte als Echtheitsnachweis.
