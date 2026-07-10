import { existsSync } from "node:fs";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

type Options = {
  date: string;
  out: string;
  bucket?: string;
  publicBaseUrl?: string;
  dryRun: boolean;
};

type UploadedAsset = {
  filename: string;
  key: string;
  url: string;
  bytes: number;
};

async function main() {
  await loadEnvFiles();

  const options = parseArgs(process.argv.slice(2));
  const bucket = requireValue(options.bucket, "SOCIAL_R2_BUCKET oder --bucket fehlt.");
  const publicBaseUrl = requireValue(options.publicBaseUrl, "SOCIAL_PUBLIC_BASE_URL oder --public-base-url fehlt.")
    .replace("{date}", options.date);

  if (!existsSync(options.out)) {
    throw new Error(`${options.out} fehlt. Erst npm run social:generate ausführen.`);
  }

  const files = (await readdir(options.out))
    .filter((name) => name.endsWith(".png"))
    .sort();

  if (!files.length) {
    throw new Error(`${options.out} enthält keine PNGs.`);
  }

  const assets: UploadedAsset[] = [];

  for (const filename of files) {
    const filePath = path.join(options.out, filename);
    const key = `${options.date}/${filename}`;
    const url = joinUrl(publicBaseUrl, filename);
    const bytes = (await stat(filePath)).size;

    if (options.dryRun) {
      console.log(`[dry-run] ${bucket}/${key} -> ${url}`);
    } else {
      run("npx", [
        "wrangler",
        "r2",
        "object",
        "put",
        `${bucket}/${key}`,
        "--file",
        filePath,
        "--content-type",
        "image/png",
        "--cache-control",
        "public, max-age=31536000, immutable",
        "--remote",
      ]);
    }

    assets.push({ filename, key, url, bytes });
  }

  if (!options.dryRun) {
    await writeFile(path.join(options.out, "r2-assets.json"), `${JSON.stringify({
      bucket,
      publicBaseUrl,
      uploadedAt: new Date().toISOString(),
      assets,
    }, null, 2)}\n`, "utf8");
  }
}

function parseArgs(args: string[]): Options {
  const date = today();
  const options: Options = {
    date,
    out: path.resolve("social", date),
    bucket: process.env.SOCIAL_R2_BUCKET,
    publicBaseUrl: process.env.SOCIAL_PUBLIC_BASE_URL,
    dryRun: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Fehlender Wert für ${arg}`);
    }

    if (arg === "--date") {
      options.date = value;
      options.out = path.resolve("social", value);
    } else if (arg === "--out") options.out = path.resolve(value);
    else if (arg === "--bucket") options.bucket = value;
    else if (arg === "--public-base-url") options.publicBaseUrl = value;
    else throw new Error(`Unbekannte Option: ${arg}`);

    index += 1;
  }

  return options;
}

async function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const filePath = path.resolve(file);
    if (!existsSync(filePath)) continue;

    const content = await readFile(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} fehlgeschlagen.`);
  }
}

function joinUrl(base: string, filename: string) {
  return `${base.replace(/\/+$/, "")}/${encodeURIComponent(filename)}`;
}

function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function requireValue(value: string | undefined, message: string) {
  if (!value) throw new Error(message);
  return value;
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
