# Kurzvideos (Remotion)

Hochformat 1080 × 1920, 30 fps. Die Zahlen kommen direkt aus `lib/data/drinks.ts`, nichts wird abgetippt.

```bash
cd video && npm install
npm run studio   # Vorschau im Browser
npm run render   # MP4 nach ../social/video/
npm run still    # Cover-Bild
```

In dieser Cloud-Umgebung braucht Remotion den vorinstallierten Headless-Browser:
`REMOTION_CHROMIUM=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

Stil: Farben, Würfel und Logo wie auf der Website, ruhige Federanimationen, keine Emojis, keine Großbuchstaben-Labels. Sichere Ränder: oben 250 px, unten 350 px.
