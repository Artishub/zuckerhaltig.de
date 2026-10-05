import { Config } from "@remotion/cli/config";

// Uses the preinstalled Chromium in this environment; locally Remotion falls back to its own browser.
if (process.env.REMOTION_CHROMIUM) Config.setBrowserExecutable(process.env.REMOTION_CHROMIUM);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
