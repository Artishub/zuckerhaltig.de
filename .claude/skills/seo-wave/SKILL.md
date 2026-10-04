---
name: seo-wave
description: Make more drink or brand pages indexable (re-indexing wave) or change sitemap/robots/canonical behavior. Use when editing lib/seo-index.ts, app/sitemap.ts or page robots metadata.
---

# SEO indexing wave

Background: the site lost almost all visibility on 2026-07-27 and recovered on 2026-09-26 after most drink pages went `noindex`. Indexing changes must stay small and deliberate.

## Rules
- One wave is at most 15–20 drink IDs, with at least 2–3 weeks between waves.
- Only pick products with Search Console demand (impressions on the old URL or matching queries). Ask the user for a fresh export if none is at hand.
- Only canonical package IDs (`canonicalPackageDrinkId(drink) === drink.id`) whose drink passes `isIndexableDrink`: size, source, nutrition and a verified status.
- One page per recipe (`lib/page-routing.ts`). Only the recipe page (`recipePageDrink`) can be indexed; size and flavor pages either redirect or stay `noindex` because they had impressions.
- Never remove or redirect a URL with impressions in `lib/data/search-console-pages.json` without a 301 target. Refresh that file from a new Search Console export before each wave.
- No generated paragraphs to "fill" pages. Value comes from the data blocks, and the editorial text in `lib/content/featured-drinks.ts` is hand-written and optional.
- No sitewide links to sister projects.

## Steps
1. Add the IDs to `searchIndexableDrinkIds` (or `searchIndexableBrandIds`) in `lib/seo-index.ts`. The same list drives robots, the sitemap and `generateStaticParams`.
2. `npm run build && npm run seo:check`. It checks that sitemap URLs are indexable and other pages stay `noindex, follow`.
3. Spot-check one new page: `<meta name="robots">` is absent or index, and the canonical points to itself.
4. Report the wave (IDs and date) so the next wave can be timed.
