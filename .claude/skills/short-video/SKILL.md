---
name: short-video
description: Create, render and prepare short vertical videos (Reels, TikTok, Shorts) in the zuckerhaltig.de style from the drink data. Use when asked for new social videos, video ideas, captions or a posting schedule.
---

# Kurzvideos im zuckerhaltig-Stil

Code in `video/` (Remotion, eigenes Paket), Ausgabe in `social/video/` (gitignored). Technik und Befehle: `video/README.md`.

## Stil (vom Nutzer freigegeben, nicht ändern ohne Rückfrage)
Referenz: Video `12-cola-fill` (Vorlage `fill`, Code `video/src/Fill.tsx` und `video/src/light.tsx`). Neue Videos sehen so aus.
- **Design der Webseite:** heller Papier-Hintergrund `#edf0e8`, weiße Karten mit feiner Linie `#d4dbd2`, Text `#17201d`, Moosgrün `#1f4539` für Linien und Akzente, Lime `#d8f36a` als Füllfläche und Markierung hinter einem Schlüsselwort. Inter 700–800, enge Laufweite. Tokens nur aus `light.tsx`.
- **Eine Zahl, eine Aussage** pro Video, 4 Szenen. Keine Nebeninfos.
- **Ruhiges Tempo:** 20–25 s. Jede Szene mindestens 5 s, der Abspann rund 6 s. Alles gleitet mit `useIn` (Ease-out, kein Federn, kein Wackeln), Szenen blenden 15 Frames über.
- **Visuelle Idee: Füllen statt Würfel.** Der Bildschirm füllt sich mit Lime, die Zahl zählt mit. Erst 100 ml, dann die ganze Packung gegen die gestrichelte 50-g-Linie (WHO).
- **Ton locker, mit Du:** „Rate mal“, „Klingt wenig? Warte.“, „Hättest du’s gewusst?“. Keine Wertung („ungesund“), keine Emojis, keine Großbuchstaben-Labels.
- **Rate-Element:** drei Antwortkarten (A/B/C) und ein ablaufender Balken, kein Countdown mit Ziffern. Später „Antwort C“ als Chip.
- **Ende mit Frage** an die Zuschauer („Schreib deinen Tipp in die Kommentare.“), darunter Logo und Quelle mit Stand.
- **Keine Marken-Optik:** keine Logos, keine Produktfotos, keine Markenfarben. Im Bild ein neutrales Label („Cola“), den Hersteller nur in der Quellenzeile.
- **Kein Ton im Video.** Musik (ruhig, Lo-Fi) oder Trend-Sound setzt der Nutzer in der App. Nur Text, keine Stimme, bis der Nutzer anderes entscheidet.
- Sichere Ränder (`Safe`): oben 230 px, rechts 150 px, unten 400 px, links 84 px.

## Daten-Regeln
- Nur Drink-IDs eintragen, nie Zahlen. Werte, Reihenfolgen, Schlusssätze und Bildunterschriften kommen aus `lib/data/drinks.ts`.
- IDs mit `npm run drink -- <begriff>` suchen. `manufacturer_verified` bevorzugen.
- Stammt ein Wert von einer Händlerseite (`retailer_verified`) und ist auffällig hoch oder niedrig, vor dem Rendern den Nutzer bitten, das Etikett zu prüfen. Virale Videos verbreiten Fehler weit.
- Keine Gesundheitsversprechen, keine Wertung („ungesund“, „schlimm“). Einordnung nur über die 50 g von WHO und DGE, bei Kinderprodukten mit „für Erwachsene“.
- Gute Themen haben einen Dreh: pro 100 ml gewinnt A, pro Packung B; gleich pro 100 ml, aber doppelte Dose; Saft fast wie Cola; Zero bei 0 g.

## Ablauf für neue Videos
1. Ideen mit Daten vorschlagen (Getränke, Dreh, erwartete Zahlen) und Freigabe holen.
2. Einträge in `video/src/videos.ts` ergänzen (fortlaufende Nummer, `NN-kurzer-slug`, 3–4 Hashtags).
3. `cd video && npx tsc -p .`, dann `npm run stills -- <id>`. Die Vorschaubilder ansehen: Grammatik, Umbrüche, Würfel passen in die Packung, Zahlen stimmen.
4. `npm run render:all -- <id>` erzeugt `NN-slug.mp4`, `-cover.png` und `.txt` (Bildunterschrift).
5. Prüfen: `ffprobe` zeigt die erwartete Länge (Vorlage `fill`: 23,5 s), Vorschaubilder jeder Szene ansehen.
6. Dateien an den Nutzer schicken (Upload-Limit 30 MB, also einzeln statt ZIP). Code committen; `social/` bleibt ungetrackt.

## Posting und Planung
- Takt: 3–4 Videos pro Woche je Kanal, nicht alle auf einmal. Getränke und Sorten abwechseln.
- Dasselbe Video auf Instagram Reels, TikTok und YouTube Shorts. Die Bildunterschrift aus der `.txt` passt überall. Bei YouTube den ersten Satz als Titel nehmen (max. 100 Zeichen).
- Ein Plan als Tabelle hilft: Datum, Uhrzeit, Video-ID, Kanäle. Gute Zeiten: werktags 17–20 Uhr, am Wochenende 11–13 Uhr.
- Bestehende Skripte: `npm run social:upload-r2` und `social:buffer` (brauchen Zugangsdaten). Ein anderer Scheduler (z. B. Postiz) braucht eine neue Anbindung; nicht ohne Rückfrage umbauen.
