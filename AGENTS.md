# AGENTS.md

Project guidance for Codex and other coding agents.

## Product

Zuckerhaltig.de is a German SEO-focused drink sugar database. The main user jobs are:

- compare drinks by sugar per 100 ml and per package
- find drinks by brand, category, size, and search
- open one SEO page per drink with nutrition, source, FAQ, and similar drinks
- understand sugar content in plain German

Keep answers and UI copy clear, direct, and German-first.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS with CSS variables in `app/globals.css`
- Static data currently lives in `lib/data/drinks.seed.json`
- Data helpers live in `lib/data/drinks.ts`
- Data validation lives in `scripts/validate-drinks-data.mjs`

Use existing local patterns before adding new abstractions.

## Commands

Run these before finishing changes that touch code or data:

```bash
npm run typecheck
npm run build
```

`typecheck` and `build` both run `npm run validate:data`.

If local dev has stale chunk/runtime errors after a build, restart it:

```bash
lsof -tiTCP:3000 -sTCP:LISTEN | xargs -r kill
npm run dev -- --hostname 127.0.0.1 --port 3000
```

## Data Rules

Accuracy is critical. Never invent nutrition values.

- Treat `sugarPer100Ml`, `sizeMl`, `source`, `sourceUrl`, `lastCheckedAt`, and `nutritionPer100Ml` as source-backed data.
- Total sugar must be calculated from `sugarPer100Ml * sizeMl / 100`.
- Sugar cubes use 3 g per cube.
- Prefer runtime helpers from `lib/data/drinks.ts` (`totalSugarGrams`, `sugarCubes`, `packageEnergyKcal`) over stored computed values.
- Do not trust stale `computed.formula` if it conflicts with calculated values.
- Every changed drink must pass `scripts/validate-drinks-data.mjs`.
- If source text states package sugar, the data must match it.

Current drink seed format:

```ts
{
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  sizeMl: number;
  sugarPer100Ml: number;
  source: string;
  note: string;
  sourceUrl?: string;
  verificationStatus?: string;
  lastCheckedAt?: string;
  nutritionPer100Ml?: {
    energyKj: number;
    energyKcal: number;
    carbohydrates: number;
    sugar: number;
    fat: number;
    protein: number;
    salt: number;
  };
  computed?: {
    sugarPerPackage: number;
    sugarCubesPerPackage: number;
    energyKcalPerPackage: number;
    formula: string;
  };
  faq?: Array<{ question: string; answer: string }>;
}
```

## UI Rules

- Keep the design modern, quiet, and SaaS-like.
- Default light mode should be bright, not dark.
- Use subtle grey backgrounds, not pure white as the dominant page surface.
- Avoid horizontal scrolling on mobile.
- Mobile navigation uses a menu, not a scroll row.
- Drink cards should stay compact on mobile.
- Do not use brand logo images unless legal usage is confirmed.
- Use lucide icons where possible.
- Keep German labels short and readable.

## SEO Rules

- Every drink should have a detail page under `/de/getraenke/[drinkId]`.
- Detail pages should include nutrition, source, explanatory text, FAQ, structured data, and similar drinks.
- Wissen and FAQ content should target real German search phrases, not placeholder text.
- Metadata descriptions should include concrete values when available.

## Architecture Direction

The current seed JSON is fine for static deployment, but future production data should move to Postgres.

Preferred future direction:

- Postgres as source of truth
- Prisma or Drizzle for typed schema access
- admin/import flow for sourced drink updates
- validation at import time and CI time
- source/version history for nutrition changes
- static or ISR pages generated from database records

Do not introduce SQLite for production.

## Git

- Do not overwrite user changes.
- Commit only when asked.
- Keep commits focused and descriptive.
