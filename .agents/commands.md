# Commands

Run from repo root.

- Dev: `npm run dev`
- Data validation: `npm run validate:data`
- Typecheck: `npm run typecheck`
- Build: `npm run build`

Social tooling:
- Generate posts: `npm run social:generate`
- Generate informational posts: `npm run social:generate-info`
- Preview five posts: `npm run social:preview`
- Dry-run check: `npm run social:check`
- Upload assets to R2: `npm run social:upload-r2`
- Publish through Buffer: `npm run social:buffer`
- List Buffer channels: `npm run social:channels`

Social commands may require service credentials. Prefer `social:preview` or `social:check` when verifying generation without publishing.

Notes:
- `typecheck` and `build` both run `validate:data`.
- No lint or test script exists unless `package.json` changes.
- Before finishing code or data edits, run:

```bash
npm run typecheck
npm run build
```

If local dev shows stale Next chunk/runtime errors after a build:

```bash
lsof -tiTCP:3000 -sTCP:LISTEN | xargs -r kill
npm run dev -- --hostname 127.0.0.1 --port 3000
```
