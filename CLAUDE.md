# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Zuckerhaltig.de: a German, SEO-driven database of sugar in drinks (Next.js 15 App Router, React 19, TypeScript, Tailwind). Rules for all agents live in `AGENTS.md`. Read `.agents/*.md` only when the task needs them.

## Commands

```bash
npm run validate:data   # data integrity (IDs, refs, package sugar vs. source text)
npm run typecheck       # validate:data + tsc --noEmit
npm run build           # validate:data + next build
npm run lint            # ESLint (next/core-web-vitals + typescript)
npm run test            # Vitest unit tests (*.test.ts)
npm run seo:check       # needs a prior build; starts its own server on :3210, checks sitemap/robots/noindex/redirect rules
npm run drink -- <term> # compact drink lookup (see "Token budget")
```

Run `typecheck`, `lint`, `test` and `build` after code or data changes, plus `seo:check` after changes to indexing, redirects, sitemap or metadata. CI (`.github/workflows/docker.yml`) runs `lint` and `test`, then `build && seo:check`, and then builds the Docker image (Next standalone output).

Social scripts (`social:*`) need credentials. Use `social:preview` or `social:check` for dry runs.

## Architecture

**Data flow:** `lib/data/drinks.seed.json` → `lib/data/drinks.ts` → pages.
- `drinks.ts` drops `importOnlyDrinkIds`; those IDs return 404 on purpose. It also maps every drink to a canonical package ID (non-canonical IDs 308-redirect), groups product families (same product, different sizes) and exports the computed helpers (`totalSugarGrams`, `sugarCubes`, `packageEnergyKcal`, `uniqueProductRepresentatives`). Always use these helpers; never recompute sugar inline.
- `lib/data/brands.ts` and `categories.ts` derive their metadata from the seed.

**Indexing is allowlist-based:** `lib/seo-index.ts`.
- Its drink and brand ID lists control robots `noindex,follow`, sitemap entries and `generateStaticParams` together.
- Everything not on the list is rendered on demand (`dynamicParams = true`) with `noindex, follow`.
- `scripts/seo-smoke-test.mjs` asserts this. Adding IDs means re-indexing pages; do it in small waves (see "SEO context").

**One page per recipe:** `lib/page-routing.ts`.
- Sizes of a recipe share one page (`recipePageDrink`: allowlisted first, then most Search Console impressions, then 500 ml). Other sizes 301 (Next sends 308) to it with `#groesse-<ml>-ml`.
- Flavor lines with identical values (`flavorLines`, currently Red Bull Editionen) are listed on the brand page; editions 301 to `/de/marken/red-bull#<id>`.
- A size or flavor URL keeps its own page if it had impressions in `lib/data/search-console-pages.json` (export 2026-10-02). Removed drink URLs with impressions redirect via `removedDrinkRedirects`.
- Build internal product links with `drinkPageHref()` so they never point at a redirect.
- Filter URLs (`/de/getraenke?…`) and all `/de/getraenke/vergleich` URLs get `X-Robots-Tag: noindex, follow` from `middleware.ts` (`lib/noindex-urls.ts`).
- `/de/eistee-zucker` and `/de/energy-drinks-zucker` redirect to their Wissen articles, which include the category product list.

**Drink detail page:** `app/[locale]/getraenke/[drinkId]/page.tsx`.
- Allowlisted drinks additionally get hand-written notes, a variant comparison and FAQ from `lib/content/featured-drinks.ts`, plus Product JSON-LD. Notes only state facts the page does not already show.
- The seed holds source data only. Derived values (package sugar, cubes, kcal, calculation text) and FAQ are computed at build time; `validate:data` rejects `computed`/`faq` fields in the seed.
- Under the main number: drawn cubes (`components/sugar-cubes-graphic.tsx`), the share of the DGE 50 g orientation (`dgeSugarConsensusUrl` in `lib/sugar-context.ts`), and the block "Weniger Zucker, gleicher Geschmack" (`swapAlternatives` + `components/swap-calculator.tsx`). Each swap card has a `data-buy-slot` for a later, labelled purchase link.
- Per-drink OpenGraph image: `app/[locale]/getraenke/[drinkId]/opengraph-image.tsx`.
- All pages show an answer sentence and data-only facts from `lib/drink-facts.ts` (category rank and distance to average, brand rank, lower-sugar alternative or sugared original for zero drinks, size range, WHO 50 g share). A fact only renders when its data is complete. Do not add template sentences or generic FAQs to product pages; link to a Wissen article instead. The internal `note` field is not shown on pages.

**Other routing details:**
- Shared UI lives in `components/ui/` (`ui.module.css`, tables, scales, `Section`) with tokens in `app/globals.css` and `tailwind.config.ts`; `lib/drink-summary.ts` builds the compact drink view model. Design rules, the list of removed noise patterns and the porting checklist for proteinhaltig.de are in `docs/redesign-playbook.md`.
- The old drafts under `/de/test` are gone; `/de/test/*` 308-redirects to `/de` (`next.config.ts`).
- No uppercase eyebrows, no headline periods, no repeated template sentences; see the noise list in the playbook.
- Shared sugar context logic (category rank, lower-sugar alternative, EU zuckerfrei/zuckerarm thresholds, WHO 50 g) lives in `lib/sugar-context.ts`.
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

- `lib/data/drinks.seed.json` is about 330 KB (~90k tokens). Never Read it whole. Use `npm run drink -- <term>`, `--full <id>`, `--brand <id>` or `--category <id>`, or a targeted `rg -n '"id": "…"'`.
- Other large files: `lib/content/articles.ts` (40 KB), the drink detail page (28 KB), `components/drink-explorer.tsx` (23 KB), `scripts/social-*.ts`, and CSS modules that are minified onto single lines. Read them by line range after `rg -n`.
- Skip `node_modules/`, `.next/`, `package-lock.json`, `public/` media and `social/` output.

## Gotchas

- Do not rebuild while `next start` is running against the same `.next`; see the `verify` skill.
- Production URLs use `www.`. Search Console data mixes apex and www URLs.
