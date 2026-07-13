# AGENTS.md

Zuckerhaltig.de is a German SEO-focused drink sugar database built with Next.js App Router, React, TypeScript, and Tailwind.

Start with:
- `.agents/project-map.md` for orientation
- `.agents/commands.md` for verification
- `.agents/task-routing.md` for task-specific rules
- `.agents/handoff.md` before handing work back

Hard rules:
- Never spawn subagents unless the user explicitly requests them; default to `fork_turns="none"` when requested.
- Keep responses and UI copy short, clear, and German-first.
- Never invent nutrition values or sources.
- Treat `sourceUrl`, `lastCheckedAt`, `sugarPer100Ml`, `sizeMl`, and `nutritionPer100Ml` as source-backed.
- Use helpers from `lib/data/drinks.ts` for package sugar, cubes, and kcal.
- Validate drink data after changing `lib/data/drinks.seed.json`.
- Do not introduce SQLite; keep future Postgres migration easy.
- Do not overwrite user changes. Commit only when asked.

Avoid during orientation:
- `node_modules/`, `.next/`, `dist/`, `build/`, `.git/`, coverage, lockfiles, generated/minified files, large media, old exports.
- Broad reads when `rg --files` or targeted `rg` is enough.
