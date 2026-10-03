#!/usr/bin/env node
// Token-friendly lookup for lib/data/drinks.seed.json.
// Usage:
//   npm run drink -- <suchbegriff>     one line per match (id, name, brand, size, sugar)
//   npm run drink -- --full <drink-id> one drink as JSON, without the generated faq
//   npm run drink -- --brand <brand-id> | --category <category-id>
import { readFileSync } from "node:fs";

const seed = JSON.parse(readFileSync(new URL("../lib/data/drinks.seed.json", import.meta.url), "utf8"));
const [flag, ...rest] = process.argv.slice(2);
const term = (flag?.startsWith("--") ? rest.join(" ") : [flag, ...rest].join(" ")).trim().toLowerCase();

if (!flag) {
  console.log("Usage: npm run drink -- <term> | --full <id> | --brand <id> | --category <id>");
  process.exit(1);
}

if (flag === "--full") {
  const drink = seed.drinks.find((item) => item.id === term);
  if (!drink) {
    console.error(`No drink with id "${term}"`);
    process.exit(1);
  }
  const { faq, ...rest } = drink;
  console.log(JSON.stringify({ ...rest, faqCount: faq?.length ?? 0 }, null, 2));
  process.exit(0);
}

const matches = seed.drinks.filter((drink) => {
  if (flag === "--brand") return drink.brandId === term;
  if (flag === "--category") return drink.categoryId === term;
  return [drink.id, drink.name, drink.brandId].some((value) => value.toLowerCase().includes(term));
});

for (const drink of matches) {
  console.log([
    drink.id,
    drink.name,
    drink.brandId,
    drink.categoryId,
    `${drink.sizeMl ?? "-"} ml`,
    `${drink.sugarPer100Ml} g/100ml`,
    drink.verificationStatus ?? "-",
    drink.lastCheckedAt ?? "-",
  ].join(" | "));
}
console.log(`${matches.length} match(es)`);
