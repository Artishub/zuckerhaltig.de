# PLANS.md

Living project plan for Zuckerhaltig.de.

## Current State

- Static Next.js site with German routes under `/de`.
- 200 drinks in `lib/data/drinks.seed.json`.
- One generated SEO detail page per drink.
- Filters for brand, category, size, variants, sugar-free exclusion, sugar limits, search, sorting, and pagination.
- Wissen and FAQ pages contain SEO-oriented educational content.
- Data validation checks IDs, references, nutrition sugar alignment, computed values, and package sugar claims in source text.

## Near-Term Priorities

1. Data quality
   - Check all high-sugar and popular drinks against official manufacturer or retailer sources.
   - Add missing `sourceUrl` and `lastCheckedAt` where possible.
   - Prefer manufacturer sources over shops when both exist.
   - Remove or mark entries that cannot be verified.

2. Drink detail pages
   - Improve per-drink explanatory text so it is useful without sounding templated.
   - Add stronger internal links to brand, category, and comparable drinks.
   - Add JSON-LD beyond FAQ where appropriate.
   - Ensure source links are visible and consistently placed.

3. Search and filters
   - Keep global search working from every route.
   - Make URL params the source of truth for filter state over time.
   - Add shareable URLs for all active filters.
   - Review variant grouping behavior for edge cases.

4. SEO content
   - Expand Wissen articles around German search intent:
     - "wie viel zucker hat cola"
     - "zucker in energy drinks"
     - "zucker pro 100 ml verstehen"
     - "zuckerfreie getraenke vergleich"
     - "saft zucker fruchtzucker"
   - Add comparison pages for important brands and categories.
   - Keep medical claims careful and non-prescriptive.

5. Mobile UX
   - Keep header width within small phones.
   - Keep cards compact and readable.
   - Test iPhone 12 mini width after header/filter changes.

## Database Migration Plan

Goal: move from seed JSON to Postgres without blocking static SEO.

Suggested phases:

1. Schema design
   - `brands`
   - `categories`
   - `drinks`
   - `nutrition_per_100ml`
   - `sources`
   - `drink_source_checks`
   - optional `drink_variants`

2. ORM
   - Prefer Prisma or Drizzle.
   - Keep generated types strict.
   - Enforce unique drink IDs/slugs.

3. Import pipeline
   - Import current `drinks.seed.json`.
   - Reuse validation rules from `scripts/validate-drinks-data.mjs`.
   - Fail imports when calculated package sugar conflicts with source claims.

4. Rendering
   - Keep public pages static or ISR where possible.
   - Generate sitemap from database-backed drink slugs.
   - Keep build-time validation in CI.

5. Admin workflow
   - Add a protected workflow for editing drinks.
   - Require source URL and check date for published changes.
   - Track history of changed nutrition values.

## Backlog

- Add sitemap sections for brand and category pages.
- Add canonical URLs and richer metadata for filtered pages if needed.
- Add tests for filter helpers and drink calculations.
- Add no-results states with useful suggestions.
- Add source quality badges.
- Add "last checked" visibility to list cards or detail pages.
- Add a dedicated import command for large drink lists.
- Add analytics events for search/filter usage after privacy review.

## Non-Goals For Now

- No brand logos unless usage rights are clear.
- No medical advice.
- No user accounts.
- No SQLite production setup.
- No heavy client-side state framework unless the filter/search surface outgrows local React state.
