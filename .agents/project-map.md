# Project Map

Use `rg --files` first. This repo is small; avoid deep reads unless changing the area.

Core files:
- `package.json` - scripts and dependencies.
- `lib/data/drinks.seed.json` - static source data for brands, categories, drinks.
- `lib/data/drinks.ts` - drink types, data export, computed helpers, grouping.
- `lib/data/brands.ts` - brand metadata derived from seed.
- `lib/data/categories.ts` - category metadata derived from seed.
- `scripts/validate-drinks-data.mjs` - data integrity checks.
- `lib/site.ts` - site URL, locales, navigation, and shared site metadata.
- `lib/seo-drinks.ts` - SEO drink selection and related-drink helpers.
- `lib/content/` - German homepage, FAQ, and knowledge-article content.
- `app/[locale]/getraenke/page.tsx` - drink listing route.
- `app/[locale]/getraenke/[drinkId]/page.tsx` - SEO detail route.
- `components/drink-explorer.tsx` - client-side filters, compare UI, cards.
- `app/globals.css` - Tailwind base and CSS variables.

Route groups:
- `app/[locale]/page.tsx` - localized homepage.
- `app/[locale]/marken/` and `app/[locale]/kategorien/` - brand and category indexes.
- `app/[locale]/wissen/` - knowledge index and dynamic article pages.
- `app/[locale]/rankings/` - sugar-free and highest-sugar rankings.
- `app/[locale]/vergleiche/` - fixed drink comparison landing pages.
- `app/[locale]/*-zucker/` - category-focused SEO landing pages.
- `app/[locale]/faq/`, `ueber/`, `impressum/`, `datenschutz/`, `nutzungsbedingungen/` - informational and legal pages.
- `app/[locale]/test/` - editorial drink-test pages and their local CSS modules.
- `app/api/health/route.ts` - health endpoint.
- `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` - global search and sharing metadata.

Shared UI:
- `components/header-search.tsx`, `mobile-nav.tsx`, `theme-toggle.tsx` - global navigation controls.
- `components/seo-drink-list.tsx`, `sortable-drink-list.tsx` - reusable server/client drink lists.
- `components/brand-search-grid.tsx`, `faq-nav.tsx` - focused index navigation.
- `lib/design-tokens.ts` and `tailwind.config.ts` - shared design values.

Social tooling:
- `scripts/social-generate.ts` - generate scheduled drink posts.
- `scripts/social-info-generate.ts` - generate informational posts.
- `scripts/social-upload-r2.ts` - upload generated assets to R2.
- `scripts/social-buffer.ts` - Buffer publishing and channel lookup.

Useful searches:
- Drink by id/name: `rg '"drink-id"|Drink Name' lib/data/drinks.seed.json`
- Computed sugar usage: `rg 'totalSugarGrams|sugarCubes|packageEnergyKcal'`
- SEO metadata/schema: `rg 'metadata|jsonLd|FAQ|structured' app lib components`
- Content by route/topic: `rg 'keyword|heading|title' lib/content app/'[locale]'`
- Shared site configuration: `rg 'siteConfig|locales|baseUrl' lib app`
- Social pipeline: `rg 'social:|Buffer|R2' package.json scripts`
- Locale routes: quote paths containing brackets, e.g. `sed -n '1,160p' 'app/[locale]/getraenke/page.tsx'`
