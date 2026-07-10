import path from "node:path";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { brandById } from "../lib/data/brands";
import { categoryById } from "../lib/data/categories";
import {
  drinks,
  packageEnergyKcal,
  sugarCubes,
  totalSugarGrams,
  uniqueProductRepresentatives,
  type Drink,
} from "../lib/data/drinks";

const width = 1080;
const height = 1350;
const templates = ["zucker-check", "einzelwert", "zuckerwuerfel", "vergleich", "ranking", "zero-low"] as const;
type TemplateId = (typeof templates)[number];

type Options = {
  date: string;
  count: number;
  template?: TemplateId;
  category?: string;
  drinkIds: string[];
  seed: string;
  out: string;
  dryRun: boolean;
  allowRepeats: boolean;
};

type CardPlan = {
  template: TemplateId;
  drinks: Drink[];
  filename: string;
};

type SocialPostRecord = {
  filename: string;
  template: TemplateId;
  drinkIds: string[];
  caption: string;
  values: Array<{
    drinkId: string;
    drinkName: string;
    sizeMl: number;
    sugarPer100Ml: number;
    sugarPerPackage: number;
    sugarCubes: number;
    roundedSugarCubes: number;
    kcalPer100Ml: number | null;
    kcalPerPackage: number | null;
    sourceUrl: string;
    lastCheckedAt: string;
  }>;
};

type PickContext = {
  pool: Drink[];
  used: Set<string>;
  rng: () => number;
  allowRepeats: boolean;
};

const socialAccents: Record<string, string> = {
  "bio-limo": "#16a34a",
  "cola": "#2f3a44",
  "cola-mix": "#7c2d12",
  "energy": "#f97316",
  "fassbrause": "#b45309",
  "iced-tea": "#0f766e",
  "juice": "#f59e0b",
  "juice-drink": "#e11d48",
  "lemon-lime": "#65a30d",
  "mate": "#059669",
  "milk-drink": "#7c3aed",
  "orange-limo": "#f97316",
  "schorle": "#db7c26",
  "softdrink": "#2563eb",
};
const brandBackgrounds: Record<string, string> = {
  "28-black": "#151515",
  "7up": "#1f8f3a",
  "afri": "#121212",
  "almdudler": "#d08a22",
  "arizona": "#1f9d8a",
  "bionade": "#2f8f4f",
  "capri-sun": "#f28c18",
  "club-mate": "#c18b2b",
  "coca-cola": "#b00000",
  "deit": "#e33b7a",
  "durstloescher": "#00a0df",
  "effect": "#121212",
  "fanta": "#f26a00",
  "freeway": "#24313d",
  "fritz-kola": "#15110f",
  "fuze-tea": "#0f766e",
  "gerolsteiner": "#2f9e44",
  "goenrgy": "#111827",
  "granini": "#f59e0b",
  "hohes-c": "#f97316",
  "ja": "#26343f",
  "lipton": "#f5b400",
  "monster": "#050505",
  "orangina": "#ef7d00",
  "paulaner": "#0050a4",
  "pepsi": "#004b93",
  "pfanner": "#0f766e",
  "red-bull": "#143e9f",
  "river": "#26343f",
  "rockstar": "#111111",
  "schweppes": "#d4a017",
  "sinalco": "#d0001f",
  "sprite": "#11883a",
  "valensina": "#f97316",
  "vita-cola": "#1f2937",
};

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const pool = eligibleDrinks(options);

  if (!pool.length) {
    throw new Error("Keine passenden Getränke mit Größe, Zuckerwert, sourceUrl und lastCheckedAt gefunden.");
  }

  const plans = createPlans(pool, options);

  if (options.dryRun) {
    console.log(`Dry run: ${plans.length} Posts -> ${options.out}`);
    for (const plan of plans) {
      console.log(`${plan.filename}: ${plan.template} | ${plan.drinks.map((drink) => drink.id).join(", ")}`);
    }
    return;
  }

  await mkdir(options.out, { recursive: true });
  await cleanOutputDir(options.out);

  const readmeRows: string[] = [];
  const postRecords: SocialPostRecord[] = [];

  for (let index = 0; index < plans.length; index += 1) {
    const plan = plans[index];
    const svg = renderCard(plan, index + 1, plans.length);

    assertRenderable(svg, plan.filename);

    const filePath = path.join(options.out, plan.filename);
    await sharp(Buffer.from(svg)).png().toFile(filePath);
    await validatePng(filePath);
    readmeRows.push(readmeRow(plan));
    postRecords.push(postRecord(plan));
  }

  await writeFile(path.join(options.out, "README.md"), renderReadme(options, plans, readmeRows), "utf8");
  await writeFile(path.join(options.out, "posts.json"), `${JSON.stringify(postRecords, null, 2)}\n`, "utf8");
  console.log(`Generated ${plans.length} PNGs in ${options.out}`);
}

function parseArgs(args: string[]): Options {
  const options: Options = {
    date: today(),
    count: 10,
    drinkIds: [],
    seed: "",
    out: "",
    dryRun: false,
    allowRepeats: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--allow-repeats") {
      options.allowRepeats = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Fehlender Wert für ${arg}`);
    }

    if (arg === "--date") options.date = value;
    else if (arg === "--count") options.count = parsePositiveInt(value, "--count");
    else if (arg === "--template") options.template = parseTemplate(value);
    else if (arg === "--category") options.category = value;
    else if (arg === "--drink") options.drinkIds.push(...value.split(",").map((item) => item.trim()).filter(Boolean));
    else if (arg === "--seed") options.seed = value;
    else if (arg === "--out") options.out = path.resolve(value);
    else throw new Error(`Unbekannte Option: ${arg}`);

    index += 1;
  }

  options.seed ||= `${options.date}:${options.template ?? "all"}:${options.category ?? "all"}:${options.drinkIds.join(",")}`;
  options.out ||= path.resolve("social", options.date);

  return options;
}

function parsePositiveInt(value: string, flag: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${flag} muss eine positive Zahl sein.`);
  }
  return parsed;
}

function parseTemplate(value: string): TemplateId {
  if (!templates.includes(value as TemplateId)) {
    throw new Error(`--template muss einer dieser Werte sein: ${templates.join(", ")}`);
  }
  return value as TemplateId;
}

function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function eligibleDrinks(options: Options) {
  const source = options.drinkIds.length
    ? drinks.filter((drink) => options.drinkIds.includes(drink.id))
    : uniqueProductRepresentatives(drinks);

  const eligible = source.filter((drink) => {
    if (options.category && drink.categoryId !== options.category) return false;
    return Boolean(
      drink.sizeMl &&
        drink.sourceUrl &&
        drink.lastCheckedAt &&
        Number.isFinite(drink.sugarPer100Ml),
    );
  });

  return eligible.sort((a, b) => {
    if (Boolean(b.nutritionPer100Ml) !== Boolean(a.nutritionPer100Ml)) {
      return Number(Boolean(b.nutritionPer100Ml)) - Number(Boolean(a.nutritionPer100Ml));
    }
    return a.id.localeCompare(b.id);
  });
}

function createPlans(pool: Drink[], options: Options): CardPlan[] {
  if (options.drinkIds.length) {
    const template = options.template ?? "zucker-check";
    const byId = new Map(pool.map((drink) => [drink.id, drink]));
    const ordered = options.drinkIds.map((id) => byId.get(id)).filter((drink): drink is Drink => Boolean(drink));
    const count = options.allowRepeats ? options.count : Math.min(options.count, ordered.length);

    if (!ordered.length) {
      throw new Error("Keine passenden --drink IDs gefunden.");
    }

    return Array.from({ length: count }, (_, index) => {
      const drink = ordered[index % ordered.length];
      return createManualPlan(template, drink, index + 1);
    });
  }

  const ctx: PickContext = {
    pool: shuffle(pool, createRng(options.seed)),
    used: new Set<string>(),
    rng: createRng(`${options.seed}:pick`),
    allowRepeats: options.allowRepeats,
  };

  const plans: CardPlan[] = [];

  for (let index = 0; index < options.count; index += 1) {
    const template = options.template ?? "zucker-check";
    const plan = createPlan(template, ctx, index + 1);
    plans.push(plan);
  }

  return reindexPlans(orderPlansForFeed(plans));
}

function createPlan(template: TemplateId, ctx: PickContext, index: number): CardPlan {
  const drinksForCard = selectDrinks(template, ctx);
  const ids = drinksForCard.map((drink) => drink.id).join("-");
  const filename = `${String(index).padStart(2, "0")}_${template}_${slug(ids).slice(0, 72)}.png`;

  return { template, drinks: drinksForCard, filename };
}

function createManualPlan(template: TemplateId, drink: Drink, index: number): CardPlan {
  return {
    template,
    drinks: [drink],
    filename: `${String(index).padStart(2, "0")}_${template}_${slug(drink.id)}.png`,
  };
}

function orderPlansForFeed(plans: CardPlan[]) {
  const remaining = [...plans];
  const ordered: CardPlan[] = [];

  while (remaining.length) {
    const previous = ordered.at(-1);
    const bestIndex = bestNextPlanIndex(remaining, previous);
    const [next] = remaining.splice(bestIndex, 1);
    ordered.push(next);
  }

  return ordered;
}

function bestNextPlanIndex(candidates: CardPlan[], previous: CardPlan | undefined) {
  let bestIndex = 0;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let index = 0; index < candidates.length; index += 1) {
    const score = feedPenalty(candidates[index], previous) + index / 1000;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  return bestIndex;
}

function feedPenalty(plan: CardPlan, previous: CardPlan | undefined) {
  if (!previous) return 0;

  const drink = plan.drinks[0];
  const previousDrink = previous.drinks[0];
  let penalty = 0;

  if (drink.brandId === previousDrink.brandId) penalty += 100;
  if (drink.categoryId === previousDrink.categoryId) penalty += 35;
  if (backgroundFor(drink) === backgroundFor(previousDrink)) penalty += 60;

  return penalty;
}

function reindexPlans(plans: CardPlan[]) {
  return plans.map((plan, index) => {
    const ids = plan.drinks.map((drink) => drink.id).join("-");
    return {
      ...plan,
      filename: `${String(index + 1).padStart(2, "0")}_${plan.template}_${slug(ids).slice(0, 72)}.png`,
    };
  });
}

function selectDrinks(template: TemplateId, ctx: PickContext) {
  if (template === "zuckerwuerfel") {
    return [pickDrink(ctx, (drink) => (totalSugarGrams(drink) ?? 0) > 0, byPackageSugarDesc)];
  }

  if (template === "zero-low") {
    return [tryPickDrink(ctx, (drink) => drink.sugarPer100Ml <= 1, bySugarAsc) ?? pickDrink(ctx, () => true, bySugarAsc)];
  }

  return [pickDrink(ctx, () => true, randomScore(ctx))];
}

function pickDrink(
  ctx: PickContext,
  predicate: (drink: Drink) => boolean,
  sort: (a: Drink, b: Drink) => number,
) {
  const selected = tryPickDrink(ctx, predicate, sort) ?? tryPickDrink(ctx, () => true, sort);
  if (!selected) throw new Error("Kein Getränk für Social-Post gefunden.");
  return selected;
}

function tryPickDrink(
  ctx: PickContext,
  predicate: (drink: Drink) => boolean,
  sort: (a: Drink, b: Drink) => number,
) {
  const strict = ctx.pool.filter((drink) => predicate(drink) && (ctx.allowRepeats || !ctx.used.has(drink.id)));
  const candidates = strict.length ? strict : ctx.pool.filter(predicate);
  const selected = [...candidates].sort(sort)[0];

  if (!selected) return undefined;

  ctx.used.add(selected.id);
  return selected;
}

function byPackageSugarDesc(a: Drink, b: Drink) {
  return (totalSugarGrams(b) ?? 0) - (totalSugarGrams(a) ?? 0) || a.id.localeCompare(b.id);
}

function bySugarAsc(a: Drink, b: Drink) {
  return a.sugarPer100Ml - b.sugarPer100Ml || (totalSugarGrams(a) ?? 0) - (totalSugarGrams(b) ?? 0);
}

function randomScore(ctx: PickContext) {
  const scores = new Map<string, number>();
  return (a: Drink, b: Drink) => score(a, scores, ctx.rng) - score(b, scores, ctx.rng);
}

function score(drink: Drink, scores: Map<string, number>, rng: () => number) {
  const existing = scores.get(drink.id);
  if (existing !== undefined) return existing;

  const value = (drink.nutritionPer100Ml ? 0 : 0.2) + rng();
  scores.set(drink.id, value);
  return value;
}

function createRng(seed: string) {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: () => number) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function renderCard(plan: CardPlan, index: number, total: number) {
  return renderPremiumCheckCard(plan.drinks[0], index, total);
}

function renderPremiumCheckCard(drink: Drink, index: number, total: number) {
  const product = productParts(drink);
  const packageSugar = totalSugarGrams(drink) ?? 0;
  const cubes = sugarCubes(drink) ?? 0;
  const roundedCubes = Math.round(cubes);
  const kcal100 = drink.nutritionPer100Ml ? `${formatDecimal(drink.nutritionPer100Ml.energyKcal)} kcal` : "n/a";
  const kcalPackage = packageEnergyKcal(drink);
  const category = categoryName(drink);
  const titleLines = wrapText(product.variant.replace(/-/g, "- "), 18, 3);
  const longestTitleLine = Math.max(...titleLines.map((line) => line.length));
  const titleSize = Math.min(
    titleLines.length === 3 ? 56 : 78,
    Math.max(52, Math.floor(520 / (longestTitleLine * 0.56))),
  );
  const metricLabelY = Math.max(522, Math.min(550, Math.round(398 + (titleLines.length - 1) * titleSize * 0.96 + 42)));
  const accent = categoryById[drink.categoryId]?.color ?? "#d8f36a";
  const cubeSummary = `${formatInteger(roundedCubes)} Würfel · 1 Würfel = 3 g Zucker (gerundet)`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M 38 0 L 0 0 0 38" fill="none" stroke="#1f4539" stroke-opacity="0.055" stroke-width="1"/></pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="#edf0e8"/>
    <rect width="${width}" height="${height}" fill="url(#grid)"/>
    <g font-family="Inter, Arial, Helvetica, sans-serif" fill="#17201d">
      ${socialMark(64, 58)}
      <text x="118" y="87" font-size="30" font-weight="750" letter-spacing="-1.8">zuckerhaltig<tspan fill="#597165" font-weight="650">.de</tspan></text>
      <text x="1016" y="87" text-anchor="end" font-size="18" font-weight="750" letter-spacing="1.7">ZUCKER-CHECK</text>
      <line x1="64" y1="118" x2="1016" y2="118" stroke="#17201d" stroke-opacity="0.16" stroke-width="2"/>
      <rect x="64" y="158" width="952" height="614" rx="30" fill="#1f4539"/>
      <circle cx="925" cy="640" r="220" fill="none" stroke="#d8f36a" stroke-opacity="0.23" stroke-width="2"/>
      <circle cx="925" cy="640" r="158" fill="none" stroke="#d8f36a" stroke-opacity="0.15" stroke-width="2"/>
      <rect x="102" y="198" width="${Math.max(category.length * 13 + 54, 172)}" height="42" rx="21" fill="#d8f36a"/>
      <circle cx="126" cy="219" r="6" fill="${accent}"/>
      <text x="144" y="225" font-size="17" font-weight="750" letter-spacing="1.2">${escapeXml(category.toUpperCase())}</text>
      <text x="102" y="306" fill="#b9d4c3" font-size="24" font-weight="700">${escapeXml(product.drink)}</text>
      ${textLines(titleLines, 102, 398, titleSize, titleSize * 0.96, "#f5f8f2", 700, "start", "Inter, Arial, Helvetica, sans-serif")}
      <text x="102" y="${metricLabelY}" fill="#b9d4c3" font-size="20" font-weight="700">Zucker pro Packung</text>
      <text x="96" y="680" fill="#d8f36a" font-size="166" font-weight="750" letter-spacing="-12">${escapeXml(formatDecimal(packageSugar))}<tspan font-size="66" letter-spacing="-4"> g</tspan></text>
      <text x="104" y="726" fill="#d5e3da" font-size="19" font-weight="650">${escapeXml(`auf ${drink.sizeMl} ml`)}</text>
      <g transform="translate(686 286)">${socialCubeField(roundedCubes)}</g>
      <text x="952" y="726" text-anchor="end" fill="#d5e3da" font-size="17" font-weight="650">${escapeXml(cubeSummary)}</text>
      <g transform="translate(64 826)">
        ${socialFact("Zucker", `${formatDecimal(drink.sugarPer100Ml)} g`, "pro 100 ml", 0, 0, false)}
        ${socialFact("Packung", `${drink.sizeMl} ml`, "Füllmenge", 238, 0, false)}
        ${socialFact("Kalorien", kcalPackage === null ? "n/a" : `${formatDecimal(kcalPackage)} kcal`, "pro Packung", 476, 0, true)}
        ${socialFact("Kalorien", kcal100, "pro 100 ml", 714, 0, false)}
      </g>
      <line x1="64" y1="1074" x2="1016" y2="1074" stroke="#17201d" stroke-opacity="0.16" stroke-width="2"/>
      <text x="64" y="1130" font-size="21" font-weight="750">Werte aus Quelle. Packung sauber gerechnet.</text>
      <text x="64" y="1164" fill="#597165" font-size="17" font-weight="650">Ein Zuckerwürfel entspricht 3 g. Abweichung durch Rundung möglich.</text>
      <rect x="64" y="1206" width="952" height="80" rx="18" fill="#f8faf4" stroke="#17201d" stroke-opacity="0.14" stroke-width="2"/>
      <text x="92" y="1255" font-size="16" font-weight="700" letter-spacing="0.7">QUELLE: ${escapeXml(sourceLabel(drink).toUpperCase())} · STAND: ${escapeXml(drink.lastCheckedAt ?? "n/a")} · ${String(index).padStart(2, "0")}/${String(total).padStart(2, "0")}</text>
      <text x="988" y="1255" text-anchor="end" font-size="17" font-weight="750">zuckerhaltig.de</text>
    </g>
  </svg>`;
}

function socialMark(x: number, y: number) {
  return `<g transform="translate(${x} ${y})"><rect width="40" height="40" rx="11" fill="#1f4539"/><rect x="9" y="9" width="9" height="9" rx="2" fill="#d8f36a"/><rect x="22" y="9" width="9" height="9" rx="2" fill="#d8f36a"/><rect x="9" y="22" width="9" height="9" rx="2" fill="#d8f36a"/><rect x="22" y="22" width="9" height="9" rx="2" fill="#f5f8f2"/></g>`;
}

function socialCubeField(cubes: number) {
  const count = Math.min(Math.max(cubes, 0), 36);
  if (count === 0) return "";

  const fieldWidth = 266;
  const fieldHeight = 254;
  const gap = 12;
  const columns = count <= 1 ? 1 : count <= 4 ? 2 : count <= 9 ? 3 : count <= 16 ? 4 : count <= 25 ? 5 : 6;
  const rows = Math.ceil(count / columns);
  const cubeSize = Math.min(
    86,
    Math.floor((fieldWidth - gap * (columns - 1)) / columns),
    Math.floor((fieldHeight - gap * (rows - 1)) / rows),
  );
  const gridWidth = columns * cubeSize + (columns - 1) * gap;
  const gridHeight = rows * cubeSize + (rows - 1) * gap;
  const offsetX = Math.floor((fieldWidth - gridWidth) / 2);
  const offsetY = Math.floor((fieldHeight - gridHeight) / 2);
  const inset = Math.max(6, Math.round(cubeSize * 0.18));
  const corner = Math.max(7, Math.round(cubeSize * 0.16));

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = offsetX + column * (cubeSize + gap);
    const y = offsetY + row * (cubeSize + gap);
    const innerSize = cubeSize - inset * 2;
    return `<rect x="${x}" y="${y}" width="${cubeSize}" height="${cubeSize}" rx="${corner}" fill="#d8f36a"/><rect x="${x + inset}" y="${y + inset}" width="${innerSize}" height="${innerSize}" rx="${Math.max(3, Math.round(corner * 0.45))}" fill="none" stroke="#f5f8f2" stroke-opacity="0.48" stroke-width="${Math.max(2, Math.round(cubeSize * 0.07))}"/>`;
  }).join("");
}

function socialFact(label: string, value: string, detail: string, x: number, y: number, lime: boolean) {
  return `<g transform="translate(${x} ${y})"><rect width="224" height="182" rx="20" fill="${lime ? "#d8f36a" : "#f8faf4"}" stroke="#17201d" stroke-opacity="0.14" stroke-width="2"/><text x="24" y="47" fill="#597165" font-size="16" font-weight="700" letter-spacing="0.5">${escapeXml(label.toUpperCase())}</text><text x="24" y="112" font-size="39" font-weight="750" letter-spacing="-2.2">${escapeXml(value)}</text><text x="24" y="145" fill="#597165" font-size="16" font-weight="650">${escapeXml(detail)}</text></g>`;
}

function productParts(drink: Drink) {
  const brand = brandById[drink.brandId]?.name ?? drink.name;
  const lowerBrand = brand.toLowerCase();
  let variant = drink.name.trim();

  if (variant.toLowerCase().startsWith(lowerBrand)) {
    variant = variant.slice(brand.length).replace(/^[-\s]+/, "").trim();
  }

  if (!variant || variant.toLowerCase() === lowerBrand) {
    variant = categoryName(drink);
  }

  return { drink: brand, variant };
}

function backgroundFor(drink: Drink) {
  return brandBackgrounds[drink.brandId] ?? socialAccents[drink.categoryId] ?? categoryById[drink.categoryId]?.color ?? "#b00000";
}

function highlightFor(hex: string) {
  return luminance(hex) < 0.18 ? "#ffffff" : shadeHex(hex, 0.34);
}

function luminance(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}

function sourceLabel(drink: Drink) {
  if (!drink.sourceUrl) return drink.source;
  try {
    return new URL(drink.sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return drink.source;
  }
}

function textLines(
  lines: string[],
  x: number,
  y: number,
  size: number,
  lineHeight: number,
  color: string,
  weight: number,
  anchor = "start",
  font = "Arial, Helvetica, sans-serif",
  filter?: string,
) {
  const filterAttr = filter ? ` filter="${filter}"` : "";
  return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" font-family="${font}"${filterAttr}>
    ${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`).join("")}
  </text>`;
}

function wrapText(value: string, maxChars: number, maxLines: number) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;

  const trimmed = lines.slice(0, maxLines);
  trimmed[maxLines - 1] = `${trimmed[maxLines - 1].replace(/[.,;:!?]$/, "")}...`;
  return trimmed;
}

function drinkLabel(drink: Drink) {
  const brand = brandById[drink.brandId]?.name;
  return brand && !drink.name.toLowerCase().includes(brand.toLowerCase()) ? `${brand} ${drink.name}` : drink.name;
}

function categoryName(drink: Drink) {
  return categoryById[drink.categoryId]?.name ?? "Getränk";
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(value);
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shadeHex(hex: string, amount: number) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => {
    const target = amount >= 0 ? 255 : 0;
    return Math.round(channel + (target - channel) * Math.abs(amount));
  });

  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function escapeXml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function assertRenderable(svg: string, filename: string) {
  if (svg.includes("undefined") || svg.includes("NaN") || svg.includes("null")) {
    throw new Error(`${filename}: SVG enthält ungültige Werte.`);
  }
}

async function validatePng(filePath: string) {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  if (metadata.width !== width || metadata.height !== height) {
    throw new Error(`${filePath}: falsche Größe ${metadata.width}x${metadata.height}`);
  }

  const stats = await image.stats();
  const blank = stats.channels.every((channel) => channel.min === channel.max);
  if (blank) {
    throw new Error(`${filePath}: PNG wirkt leer.`);
  }
}

async function cleanOutputDir(outDir: string) {
  const entries = await readdir(outDir, { withFileTypes: true });
  await Promise.all(entries
    .filter((entry) => entry.isFile() && (entry.name.endsWith(".png") || entry.name === "README.md" || entry.name === "posts.json"))
    .map((entry) => rm(path.join(outDir, entry.name))));
}

function renderReadme(options: Options, plans: CardPlan[], rows: string[]) {
  return `# Social Batch ${options.date}

Generated by \`npm run social:generate\`.

- Output: \`${options.out}\`
- Posts: ${plans.length}
- Format: 1080x1350 PNG
- Product visuals: text only, no logos, no product images
- Cube rule: 1 Zuckerwürfel = 3 g Zucker

| Datei | Template | Getränke | Werte | Quellen |
| --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function readmeRow(plan: CardPlan) {
  const drinksText = plan.drinks.map((drink) => `${drink.id} (${drinkLabel(drink)})`).join("<br>");
  const values = plan.drinks.map((drink) => {
    const kcal = packageEnergyKcal(drink);
    const kcalText = kcal === null ? "kcal: n/a" : `kcal/Gebinde: ${formatDecimal(kcal)}`;
    return `${formatDecimal(drink.sugarPer100Ml)} g/100 ml; ${formatDecimal(totalSugarGrams(drink) ?? 0)} g/${drink.sizeMl} ml; ${formatDecimal(sugarCubes(drink) ?? 0)} Würfel; ${kcalText}; checked: ${drink.lastCheckedAt}`;
  }).join("<br>");
  const sources = plan.drinks.map((drink) => drink.sourceUrl ?? drink.source).join("<br>");

  return `| ${plan.filename} | ${plan.template} | ${escapeMarkdown(drinksText)} | ${escapeMarkdown(values)} | ${escapeMarkdown(sources)} |`;
}

function postRecord(plan: CardPlan): SocialPostRecord {
  return {
    filename: plan.filename,
    template: plan.template,
    drinkIds: plan.drinks.map((drink) => drink.id),
    caption: captionFor(plan.drinks[0]),
    values: plan.drinks.map((drink) => {
      const kcalPackage = packageEnergyKcal(drink);
      const sizeMl = requireSizeMl(drink);
      return {
        drinkId: drink.id,
        drinkName: drinkLabel(drink),
        sizeMl,
        sugarPer100Ml: drink.sugarPer100Ml,
        sugarPerPackage: totalSugarGrams(drink) ?? 0,
        sugarCubes: sugarCubes(drink) ?? 0,
        roundedSugarCubes: Math.round(sugarCubes(drink) ?? 0),
        kcalPer100Ml: drink.nutritionPer100Ml?.energyKcal ?? null,
        kcalPerPackage: kcalPackage,
        sourceUrl: drink.sourceUrl ?? drink.source,
        lastCheckedAt: drink.lastCheckedAt ?? "n/a",
      };
    }),
  };
}

function requireSizeMl(drink: Drink) {
  if (drink.sizeMl === null) {
    throw new Error(`${drink.id}: sizeMl fehlt für Social-Post.`);
  }
  return drink.sizeMl;
}

function captionFor(drink: Drink) {
  const packageSugar = totalSugarGrams(drink) ?? 0;
  const cubes = sugarCubes(drink) ?? 0;
  const kcalPackage = packageEnergyKcal(drink);
  const kcalText = kcalPackage === null ? "" : `\nKalorien: ${formatDecimal(kcalPackage)} kcal pro Gebinde.`;

  return [
    `${drinkLabel(drink)} im Zucker-Check.`,
    `${formatDecimal(drink.sugarPer100Ml)} g Zucker pro 100 ml. ${formatDecimal(packageSugar)} g pro ${drink.sizeMl} ml, also rund ${formatInteger(Math.round(cubes))} Zuckerwürfel.${kcalText}`,
    "Mehr Werte, Quelle, weitere Nährwertangaben und Produktvergleich auf zuckerhaltig.de",
    hashtagsFor(drink).map((tag) => `#${tag}`).join(" "),
  ].join("\n\n");
}

function hashtagsFor(drink: Drink) {
  const brand = brandById[drink.brandId]?.name ?? drink.brandId;
  const label = drinkLabel(drink);
  const product = drink.name;
  const category = categoryName(drink);
  const productTags = [
    hashtag(label),
    hashtag(brand),
    hashtag(product),
    hashtag(category),
  ];
  const contentTags = [
    "zuckercheck",
    "zuckerhaltig",
    "zuckerwissen",
    "getraenkecheck",
    "naehrwerte",
    "produktvergleich",
    "zuckerwuerfel",
    "kaloriencheck",
    "healthyliving",
    "bewussttrinken",
    "ernaehrung",
    "softdrinks",
    "zuckerfrei",
    "versteckterzucker",
  ];

  return uniqueTags([...productTags, ...contentTags]).slice(0, 12);
}

function hashtag(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function uniqueTags(tags: string[]) {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    if (!tag || tag.length < 2 || seen.has(tag)) return false;
    seen.add(tag);
    return true;
  });
}

function escapeMarkdown(value: string) {
  return value.replace(/\|/g, "\\|");
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
