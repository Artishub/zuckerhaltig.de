// Checks every URL from a Search Console "Seiten" export against the local build:
// each one must answer 200 or redirect exactly once to a page that answers 200.
// Usage: npm run build && npm run seo:check-urls -- path/to/Seiten.csv
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import process from "node:process";

const csvPath = process.argv[2];
if (!csvPath || !fs.existsSync(csvPath)) throw new Error("Pfad zur Seiten.csv aus der Search Console angeben.");

const port = process.env.SEO_CHECK_PORT ?? "3211";
const serverPath = ".next/standalone/server.js";
if (!fs.existsSync(serverPath)) throw new Error(`Missing ${serverPath}; run npm run build first.`);

const urls = fs.readFileSync(csvPath, "utf8")
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split(",")[0]?.trim())
  .filter((value) => value?.startsWith("http"));

const server = spawn(process.execPath, [serverPath], {
  env: { ...process.env, HOSTNAME: "127.0.0.1", PORT: port },
  stdio: ["ignore", "pipe", "pipe"],
});

// Plain http.request so the Host header reaches the middleware unchanged (apex vs. www).
function request(host, path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path, method: "GET", headers: { host, "user-agent": "zuckerhaltig-export-check" } }, (res) => {
      res.resume();
      res.on("end", () => resolve({ status: res.statusCode, location: res.headers.location ?? null }));
    });
    req.on("error", reject);
    req.end();
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      await request("www.zuckerhaltig.de", "/robots.txt");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("Server did not start");
}

async function check(url) {
  const parsed = new URL(url);
  const first = await request(parsed.host, `${parsed.pathname}${parsed.search}`);
  if (first.status === 200) return { url, ok: true, note: "200" };
  if (![301, 302, 307, 308].includes(first.status) || !first.location) return { url, ok: false, note: `Status ${first.status}` };

  const target = new URL(first.location, url);
  if (target.host !== "www.zuckerhaltig.de" || target.protocol !== "https:") return { url, ok: false, note: `Ziel nicht kanonisch: ${target.href}` };
  const second = await request(target.host, `${target.pathname}${target.search}`);
  if (second.status !== 200) return { url, ok: false, note: `Ziel ${target.pathname} antwortet ${second.status}${second.location ? ` -> ${second.location}` : ""}` };
  return { url, ok: true, note: `${first.status} -> ${target.pathname}${target.hash}` };
}

try {
  await waitForServer();
  const results = [];
  for (const url of urls) results.push(await check(url));
  const failures = results.filter((result) => !result.ok);
  const redirects = results.filter((result) => result.ok && result.note !== "200");
  for (const result of redirects) console.log(`ok  ${result.url}  ${result.note}`);
  for (const result of failures) console.error(`FEHLER  ${result.url}  ${result.note}`);
  console.log(`${results.length} URLs geprüft: ${results.length - failures.length} ok (${redirects.length} mit genau einer Weiterleitung), ${failures.length} Fehler`);
  process.exitCode = failures.length ? 1 : 0;
} finally {
  server.kill();
}
