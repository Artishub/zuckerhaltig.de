// Renders every video from src/videos.ts to ../social/video/: MP4, cover PNG and caption TXT.
// Usage: npm run render:all [-- 03-fanta-vs-sprite ...] [--stills]
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { caption, videos } from "../src/videos";

const root = path.resolve(import.meta.dirname, "..");
const out = path.resolve(root, "../social/video");
const args = process.argv.slice(2);
const stillsOnly = args.includes("--stills");
const only = args.filter((arg) => !arg.startsWith("--"));
const browserExecutable = process.env.REMOTION_CHROMIUM ?? null;
// Frames used for the cover and for the preview stills.
const coverFrame = { duel: 630, cubes: 480, ranking: 660, fill: 480, split: 330 } as const;
const previewFrames = { duel: [60, 160, 330, 560, 760, 870], cubes: [60, 160, 330, 560, 760, 870], ranking: [60, 160, 330, 560, 760, 870], fill: [40, 140, 230, 300, 400, 500, 620], split: [40, 140, 230, 330, 460, 620] } as const;

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  webpackOverride: (config) => ({
    ...config,
    resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.resolve(root, "..") } },
  }),
});

await mkdir(path.join(out, "preview"), { recursive: true });

for (const video of videos) {
  if (only.length && !only.includes(video.id)) continue;
  const composition = await selectComposition({ serveUrl, id: `v${video.id}`, browserExecutable });
  if (stillsOnly) {
    for (const frame of previewFrames[video.template]) {
      await renderStill({ serveUrl, composition, frame, scale: 0.4, browserExecutable, output: path.join(out, "preview", `${video.id}-${frame}.png`) });
    }
    console.log(`stills ${video.id}`);
    continue;
  }
  await renderMedia({ serveUrl, composition, codec: "h264", concurrency: 4, imageFormat: "jpeg", jpegQuality: 92, browserExecutable, outputLocation: path.join(out, `${video.id}.mp4`) });
  await renderStill({ serveUrl, composition, frame: coverFrame[video.template], browserExecutable, output: path.join(out, `${video.id}-cover.png`) });
  await writeFile(path.join(out, `${video.id}.txt`), `${caption(video)}\n`);
  console.log(`rendered ${video.id}`);
}
