---
name: drink-data
description: Add, correct or verify drinks in lib/data/drinks.seed.json (nutrition values, sources, sizes, verification status). Use for any change to drink, brand or category data.
---

# Drink data

## Find before editing
- Never read `lib/data/drinks.seed.json` whole (~540 KB).
- `npm run drink -- <term>` gives one line per match. `--full <id>` shows one record, `--brand <id>` and `--category <id>` filter.
- Edit with a targeted `rg -n '"id": "<id>"' lib/data/drinks.seed.json` and a line-range read.

## Source rules
- Never invent values. `sugarPer100Ml`, `sizeMl`, `nutritionPer100Ml`, `sourceUrl` and `lastCheckedAt` must come from a real source the user gave or you opened.
- Prefer the manufacturer page over a retailer. Use `retailer_verified` for shop data, `manufacturer_verified` for manufacturer data, and `needs_label_check` if the value is unconfirmed.
- `nutritionPer100Ml.sugar` must equal `sugarPer100Ml`.
- If `source` or `note` states a package sugar ("56 g … 500 ml"), it must match `sugarPer100Ml * sizeMl / 100`. The validator checks this.
- If you keep `computed`, it must match the helpers: package sugar, cubes at 3 g each, and kcal.
- A new brand or category needs an entry in `brands` / `categories` in the same file.
- Sizes of one product share `name` + `brandId`; the app groups them into a family and picks a canonical package ID.
- Drinks not sold in Germany belong in `importOnlyDrinkIds` (`lib/data/drinks.ts`). They return 404.

## Indexing
- New drinks are `noindex` by default. Making one indexable is a separate step (skill `seo-wave`).

## Done when
- `npm run validate:data` passes, then `npm run typecheck`.
