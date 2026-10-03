# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Zuckerhaltig.de: a German, SEO-driven database of sugar in drinks (Next.js 15 App Router, React 19, TypeScript, Tailwind). Rules for all agents live in `AGENTS.md`. Read `.agents/*.md` only when the task needs them.

## Commands

```bash
npm run validate:data   # data integrity (IDs, refs, package sugar vs. source text)
npm run typecheck       # validate:data + tsc --noEmit
npm run build           # validate:data + next build
npm run seo:check       # needs a prior build; starts its own server on :3210, checks sitemap/robots/noindex rules
npm run drink -- <term> # compact drink lookup (see "Token budget")
```

There are no lint or unit-test scripts. Run `typecheck` and `build` after code or data changes, plus `seo:check` after changes to indexing, sitemap or metadata. CI (`.github/workflows/docker.yml`) runs `build && seo:check` and then builds the Docker image (Next standalone output).

Social scripts (`social:*`) need credentials. Use `social:preview` or `social:check` for dry runs.

## Architecture

**Data flow:** `lib/data/drinks.seed.json` → `lib/data/drinks.ts` → pages.
- `drinks.ts` drops `importOnlyDrinkIds`; those IDs return 404 on purpose. It also maps every drink to a canonical package ID (non-canonical IDs 308-redirect), groups product families (same product, different sizes) and exports the computed helpers (`totalSugarGrams`, `sugarCubes`, `packageEnergyKcal`, `uniqueProductRepresentatives`). Always use these helpers; never recompute sugar inline.
- `lib/data/brands.ts` and `categories.ts` derive their metadata from the seed.

**Indexing is allowlist-based:** `lib/seo-index.ts`.
- Its drink and brand ID lists control robots `noindex,follow`, sitemap entries and `generateStaticParams` together.
- Everything not on the list is rendered on demand (`dynamicParams = true`) with `noindex, follow`.
- `scripts/seo-smoke-test.mjs` asserts this. Adding IDs means re-indexing pages; do it in small waves (see "SEO context").

**Drink detail page:** `app/[locale]/getraenke/[drinkId]/page.tsx`.
- Allowlisted drinks additionally get hand-written editorial content and FAQ from `lib/content/featured-drinks.ts`, plus Product JSON-LD.
- The `faq` field in the seed is effectively unused, because editorial FAQ wins for every public drink.
- All pages show an answer sentence, a data-derived context block (category average and rank, lower-sugar alternative, WHO 50 g reference), package sizes and source.

**Other routing details:**
- The homepage `app/[locale]/page.tsx` renders the component from `app/[locale]/test/page.tsx`. The `/de/test` route itself is noindex.
- `middleware.ts` 308-redirects the apex domain to `https://www.zuckerhaltig.de`. Only the `de` locale exists.

**Content:**
- `lib/content/articles.ts` holds the Wissen articles (with FAQ and sources).
- `lib/featured-brand-pages.ts` and `lib/category-landing-pages.ts` hold the curated brand and category landing pages.
- `components/drink-explorer.tsx` is the client-side list and filter UI.

## SEO context

On 2026-07-27 the domain dropped sitewide overnight (likely a spam update after mass, templated pages and cross-links to sister sites). It recovered on 2026-09-26 after most drink pages were set to noindex. Therefore:
- No generated filler text at scale. Pages earn value through source-backed numbers and data-derived comparisons.
- No footer or sitewide links to sister projects.
- Re-index drink pages only in small waves; the procedure is in the `seo-wave` skill.

## Project skills

`.claude/skills/`: `drink-data` (edit or verify drinks), `seo-wave` (indexing changes), `verify` (checks, local server, screenshots).

## Token budget

- `lib/data/drinks.seed.json` is about 540 KB (~150k tokens). Never Read it whole. Use `npm run drink -- <term>`, `--full <id>`, `--brand <id>` or `--category <id>`, or a targeted `rg -n '"id": "…"'`.
- Other large files: `lib/content/articles.ts` (40 KB), the drink detail page (28 KB), `components/drink-explorer.tsx` (23 KB), `scripts/social-*.ts`, and CSS modules that are minified onto single lines. Read them by line range after `rg -n`.
- Skip `node_modules/`, `.next/`, `package-lock.json`, `public/` media and `social/` output.

## Gotchas

- Do not rebuild while `next start` is running against the same `.next`; see the `verify` skill.
- Production URLs use `www.`. Search Console data mixes apex and www URLs.
