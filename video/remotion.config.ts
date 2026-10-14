import path from "node:path";
import { Config } from "@remotion/cli/config";

// Uses the preinstalled Chromium in this environment; locally Remotion falls back to its own browser.
if (process.env.REMOTION_CHROMIUM) Config.setBrowserExecutable(process.env.REMOTION_CHROMIUM);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);

// The site code imports through "@/…"; point it at the repository root.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.resolve(process.cwd(), "..") } },
}));
