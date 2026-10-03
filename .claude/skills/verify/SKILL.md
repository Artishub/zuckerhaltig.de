---
name: verify
description: Verify code, data or UI changes in this repo - typecheck, build, SEO smoke test, local server and screenshots. Use before reporting work as done or when asked to check the site.
---

# Verify changes

## Checks
- Code or data: `npm run typecheck` and `npm run build` (both run `validate:data`).
- Indexing, sitemap or metadata: also `npm run seo:check`. It needs the build and starts its own standalone server on :3210.
- The live site is usually unreachable from cloud sessions (egress policy). Verify against a local build instead.

## Local server
- Never rebuild while `next start` runs on the same `.next`. The old server writes stale on-demand pages (old HTML, broken CSS).
- Stop the server by PID. `pkill -f next` also matches your own shell.

```bash
ps aux | grep '[n]ext-server'   # find the PID, then kill <pid>
rm -rf .next && npm run build
npx next start -p 3000          # run in background
until curl -s -o /dev/null localhost:3000/de; do :; done
```

- To check all drink routes, fetch `/de/getraenke/<id>` for every seed ID. Expect 200 or 308. The IDs in `importOnlyDrinkIds` return 404 by design.

## Screenshots (token cost)
- Chromium is at `/opt/pw-browsers/chromium`. Use `playwright-core` from the scratchpad with `executablePath`.
- Screenshot single elements (`page.$(selector).screenshot()`) or the viewport, not full pages. Full-page captures are large and get downscaled until they are unreadable.
- Check mobile at 390×844 and desktop at 1440×900.
