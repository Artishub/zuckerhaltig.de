import { spawn } from "node:child_process";
import fs from "node:fs";
import process from "node:process";

const port = process.env.SEO_CHECK_PORT ?? "3210";
const baseUrl = `http://127.0.0.1:${port}`;
const serverPath = ".next/standalone/server.js";
const requestHeaders = { "user-agent": "zuckerhaltig-seo-smoke-test" };

if (!fs.existsSync(serverPath)) {
  throw new Error(`Missing ${serverPath}; run npm run build first.`);
}

const server = spawn(process.execPath, [serverPath], {
  env: {
    ...process.env,
    HOSTNAME: "127.0.0.1",
    PORT: port,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
let passed = false;
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

try {
  await waitForServer();

  const robots = await getText("/robots.txt");
  assert(robots.includes("Sitemap: https://www.zuckerhaltig.de/sitemap.xml"), "robots.txt points to the wrong sitemap");
  assert(robots.includes("Allow: /"), "robots.txt does not allow crawling");

  const sitemapXml = await getText("/sitemap.xml");
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert(sitemapUrls.length > 0, "sitemap.xml contains no URLs");

  for (const sitemapUrl of sitemapUrls) {
    const parsed = new URL(sitemapUrl);
    assert(parsed.protocol === "https:" && parsed.hostname === "www.zuckerhaltig.de", `non-canonical sitemap URL: ${sitemapUrl}`);
  }

  const results = await mapWithLimit(sitemapUrls, 8, async (sitemapUrl) => {
    const parsed = new URL(sitemapUrl);
    const response = await fetch(`${baseUrl}${parsed.pathname}${parsed.search}`, {
      headers: requestHeaders,
      redirect: "manual",
    });
    const html = await response.text();

    assert(response.status === 200, `${sitemapUrl} returned ${response.status}`);
    assert(!response.headers.get("location"), `${sitemapUrl} redirects instead of returning 200`);

    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    assert(canonical === sitemapUrl, `${sitemapUrl} has canonical ${canonical ?? "none"}`);

    const robotsMeta = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? "";
    assert(!/noindex/i.test(robotsMeta), `${sitemapUrl} is listed in the sitemap but has noindex`);

    return sitemapUrl;
  });

  const explorerHtml = await getText("/de/getraenke");
  const productLinks = new Set(
    [...explorerHtml.matchAll(/href="(\/de\/getraenke\/[^"?]+)"/g)]
      .map((match) => match[1])
      .filter((href) => href !== "/de/getraenke/vergleich"),
  );
  assert(productLinks.size >= 6, `drink explorer exposes only ${productLinks.size} crawlable product links`);

  const rootResponse = await fetch(`${baseUrl}/`, { headers: requestHeaders, redirect: "manual" });
  assert([301, 308].includes(rootResponse.status), `root route returned ${rootResponse.status} instead of a permanent redirect`);
  assert(rootResponse.headers.get("location")?.endsWith("/de"), "root route does not redirect to /de");

  passed = true;
  console.log(`SEO smoke test passed: ${results.length} sitemap URLs, ${productLinks.size} crawlable explorer product links`);
} finally {
  await stopServer();
  if (!passed && serverOutput) console.error(serverOutput);
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`, { headers: requestHeaders });
      if (response.status === 200) return;
    } catch {
      // The standalone server may need a moment to start.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Production server did not become ready within 15 seconds.");
}

async function getText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, { headers: requestHeaders });
  const text = await response.text();
  assert(response.status === 200, `${pathname} returned ${response.status}`);
  return text;
}

async function stopServer() {
  if (server.exitCode !== null || server.signalCode !== null) return;
  await new Promise((resolve) => {
    server.once("exit", resolve);
    server.kill("SIGTERM");
  });
}

async function mapWithLimit(items, limit, callback) {
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await callback(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
