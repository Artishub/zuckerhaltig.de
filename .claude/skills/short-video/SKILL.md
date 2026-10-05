---
name: short-video
description: Create, render and prepare short vertical videos (Reels, TikTok, Shorts) in the zuckerhaltig.de style from the drink data. Use when asked for new social videos, video ideas, captions or a posting schedule.
---

# Kurzvideos im zuckerhaltig-Stil

Code in `video/` (Remotion, eigenes Paket), Ausgabe in `social/video/` (gitignored). Technik und Befehle: `video/README.md`.

## Stil (festgelegt, nicht ändern ohne Rückfrage)
- 1080 × 1920, 30 fps, **30 Sekunden**. Jeder Text mindestens 3 s sichtbar, ruhige Federanimationen.
- Moosgrüner Verlauf, Lime `#d8f36a` als Akzent, Text `#f5f8f2`, Inter 750–800 mit enger Laufweite.
- Isometrische Würfel wie auf der Website, Logo am Ende, Quellen mit Stand.
- Keine Emojis, keine Großbuchstaben-Labels, keine Effekte, kein Ton im Video (Musik setzt man in der App).
- Sichere Ränder: oben 250 px, unten 350 px.
- Ablauf immer: Frage als Hook → „Rate mal.“ mit Countdown → Auflösung in 1–2 Runden → ein Satz Einordnung → Logo.

## Vorlagen
| Vorlage | Wofür | Eintrag in `video/src/videos.ts` |
|---|---|---|
| `duel` | zwei Getränke, pro 100 ml und pro Packung | `a`, `b` (je `id`, kurzes `label`, optional `kind`) |
| `cubes` | ein Getränk: Würfel, Anteil an 50 g, zuckerärmere Alternative | `drink` |
| `ranking` | 5–6 Getränke einer Sorte | `question`, `subject`, `items`, `metric` |

`kind` ist `can`, `bottle` oder `pouch`. Ohne Angabe gilt ≤ 355 ml als Dose.

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
5. Prüfen: `ffprobe` zeigt 30 s, einen Frame bei 24 s ansehen.
6. Dateien an den Nutzer schicken (Upload-Limit 30 MB, also einzeln statt ZIP). Code committen; `social/` bleibt ungetrackt.

## Posting und Planung
- Takt: 3–4 Videos pro Woche je Kanal, nicht alle auf einmal. Formate abwechseln (Duell, Würfel, Ranking).
- Dasselbe Video auf Instagram Reels, TikTok und YouTube Shorts. Die Bildunterschrift aus der `.txt` passt überall. Bei YouTube den ersten Satz als Titel nehmen (max. 100 Zeichen).
- Ein Plan als Tabelle hilft: Datum, Uhrzeit, Video-ID, Kanäle. Gute Zeiten: werktags 17–20 Uhr, am Wochenende 11–13 Uhr.
- Bestehende Skripte: `npm run social:upload-r2` und `social:buffer` (brauchen Zugangsdaten). Ein anderer Scheduler (z. B. Postiz) braucht eine neue Anbindung; nicht ohne Rückfrage umbauen.
