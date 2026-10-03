# Task Routing

Data changes:
- Follow `.claude/skills/drink-data/SKILL.md` (source rules, lookup, validation).

Indexing / sitemap / robots:
- Follow `.claude/skills/seo-wave/SKILL.md`. Indexing waves stay small; see SEO context in `CLAUDE.md`.

SEO/content:
- German first. Keep wording direct and search-intent based. No filler, no generated paragraphs at scale.
- Detail pages need concrete values, source context, similar drinks, and structured data. Only allowlisted drinks get FAQ and editorial text (`lib/content/featured-drinks.ts`, written by hand).

UI:
- Keep the design quiet, modern, SaaS-like, and bright in default light mode.
- Use subtle grey page surfaces, compact mobile cards, and no horizontal mobile scroll.
- Mobile navigation should be a menu, not a scroll row.
- Use lucide icons where useful.
- Do not use brand logo images unless legal usage is confirmed.

Verification:
- Follow `.claude/skills/verify/SKILL.md`.

Architecture:
- Static JSON is acceptable now.
- Future source of truth should be Postgres with import/admin validation and source history.
- Do not add SQLite for production.
