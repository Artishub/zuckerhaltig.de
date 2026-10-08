# Kurzvideos (Remotion)

Hochformat 1080 × 1920, 30 fps. Standard ist die helle Vorlage `fill` (23,5 s) im Design der Website; `duel`, `cubes` und `ranking` (30 s, dunkel) sind der alte Stil. Alle Zahlen und Bildunterschriften kommen aus `lib/data/drinks.ts` und den Helfern der Website. Nichts wird abgetippt.

## Vorlagen

- `Duel`: zwei Getränke, Runde 1 pro 100 ml, Runde 2 pro Packung mit fallenden Würfeln. Der Auflösungstext ergibt sich aus den Zahlen: Dreh zwischen den Runden, Gleichstand oder klarer Sieger.
- `Cubes`: ein Getränk, Würfel in der Packung, Anteil an 50 g und eine zuckerärmere Alternative aus `lowerSugarAlternative`.
- `Ranking`: Rangliste nach Zucker pro 100 ml oder pro Packung. Die Reihenfolge kommt aus den Daten.

Ein neues Video ist ein Eintrag in `src/videos.ts`, mit Drink-IDs, kurzen Namen und Hashtags.

## Befehle

```bash
cd video && npm install
npm run studio                         # Vorschau im Browser
npm run stills [-- <id> ...]           # Vorschaubilder nach ../social/video/preview/
npm run render:all [-- <id> ...]       # MP4, Cover und Bildunterschrift nach ../social/video/
```

In dieser Cloud-Umgebung braucht Remotion den vorinstallierten Headless-Browser:
`REMOTION_CHROMIUM=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

Stil: Farben, Würfel und Logo wie auf der Website, ruhige Federanimationen, jeder Text mindestens 3 Sekunden sichtbar, keine Emojis, keine Großbuchstaben-Labels. Sichere Ränder: oben 250 px, unten 350 px.
