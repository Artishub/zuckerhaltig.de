import fs from "node:fs";

const data = JSON.parse(fs.readFileSync(new URL("../lib/data/drinks.seed.json", import.meta.url), "utf8"));
const errors = [];

const brandIds = new Set(data.brands.map((brand) => brand.id));
const categoryIds = new Set(data.categories.map((category) => category.id));
const drinkIds = new Set();
const verificationStatuses = new Set([
  "manufacturer_verified",
  "retailer_verified",
  "manufacturer_or_retailer_verified",
  "manufacturer_verified_needs_field_check",
  "needs_label_check",
  "open_database_import",
]);
const requiredTextFields = ["id", "name", "brandId", "categoryId", "source", "note"];
const nutritionFields = ["energyKj", "energyKcal", "carbohydrates", "sugar", "fat", "protein", "salt"];
const sourceSugarPattern = /(\d+(?:[,.]\d+)?)\s*g\s+Zucker\s+pro\s+(\d+)\s*ml/gi;

for (const drink of data.drinks) {
  for (const field of requiredTextFields) {
    if (typeof drink[field] !== "string" || !drink[field].trim()) errors.push(`${drink.id ?? "unknown"}: missing ${field}`);
  }

  if (drinkIds.has(drink.id)) errors.push(`${drink.id}: duplicate drink id`);
  drinkIds.add(drink.id);

  if (!brandIds.has(drink.brandId)) errors.push(`${drink.id}: unknown brandId ${drink.brandId}`);
  if (!categoryIds.has(drink.categoryId)) errors.push(`${drink.id}: unknown categoryId ${drink.categoryId}`);
  if (!verificationStatuses.has(drink.verificationStatus)) {
    errors.push(`${drink.id}: unknown verificationStatus ${drink.verificationStatus}`);
  }
  if (!isIsoDate(drink.lastCheckedAt)) errors.push(`${drink.id}: invalid lastCheckedAt ${drink.lastCheckedAt}`);
  if (drink.sourceUrl && !isHttpUrl(drink.sourceUrl)) errors.push(`${drink.id}: invalid sourceUrl ${drink.sourceUrl}`);
  if (!Number.isFinite(drink.sugarPer100Ml) || drink.sugarPer100Ml < 0) {
    errors.push(`${drink.id}: invalid sugarPer100Ml ${drink.sugarPer100Ml}`);
  }
  if (drink.sizeMl !== null && (!Number.isInteger(drink.sizeMl) || drink.sizeMl <= 0)) {
    errors.push(`${drink.id}: invalid sizeMl ${drink.sizeMl}`);
  }

  if (drink.nutritionPer100Ml) {
    for (const field of nutritionFields) {
      if (!Number.isFinite(drink.nutritionPer100Ml[field]) || drink.nutritionPer100Ml[field] < 0) {
        errors.push(`${drink.id}: invalid nutritionPer100Ml.${field} ${drink.nutritionPer100Ml[field]}`);
      }
    }
  }

  const hasSize = typeof drink.sizeMl === "number";
  const calculatedSugar = hasSize ? round1(drink.sugarPer100Ml * (drink.sizeMl / 100)) : null;
  const calculatedCubes = calculatedSugar === null ? null : round1(calculatedSugar / 3);
  const calculatedEnergy = drink.nutritionPer100Ml && hasSize ? round1(drink.nutritionPer100Ml.energyKcal * (drink.sizeMl / 100)) : null;

  if (drink.nutritionPer100Ml && !close(drink.nutritionPer100Ml.sugar, drink.sugarPer100Ml)) {
    errors.push(`${drink.id}: nutritionPer100Ml.sugar ${drink.nutritionPer100Ml.sugar} != sugarPer100Ml ${drink.sugarPer100Ml}`);
  }

  if (drink.computed && calculatedSugar !== null && calculatedCubes !== null) {
    if (!close(drink.computed.sugarPerPackage, calculatedSugar)) {
      errors.push(`${drink.id}: computed.sugarPerPackage ${drink.computed.sugarPerPackage} != calculated ${calculatedSugar}`);
    }
    if (!close(drink.computed.sugarCubesPerPackage, calculatedCubes)) {
      errors.push(`${drink.id}: computed.sugarCubesPerPackage ${drink.computed.sugarCubesPerPackage} != calculated ${calculatedCubes}`);
    }
    if (calculatedEnergy !== null && !close(drink.computed.energyKcalPerPackage, calculatedEnergy)) {
      errors.push(`${drink.id}: computed.energyKcalPerPackage ${drink.computed.energyKcalPerPackage} != calculated ${calculatedEnergy}`);
    }
  }

  const sourceText = [drink.source, drink.note].filter(Boolean).join(" ");
  for (const match of sourceText.matchAll(sourceSugarPattern)) {
    const sourceSugar = Number(match[1].replace(",", "."));
    const sourceMl = Number(match[2]);
    if (hasSize && sourceMl === drink.sizeMl && !close(sourceSugar, calculatedSugar)) {
      errors.push(`${drink.id}: source says ${sourceSugar} g sugar per ${sourceMl} ml, calculated ${calculatedSugar} g`);
    }
  }
}

if (errors.length) {
  console.error(`Drink data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Drink data validation passed: ${data.drinks.length} drinks`);

function round1(value) {
  return Math.round(value * 10) / 10;
}

function close(a, b) {
  return Math.abs(a - b) <= 0.05;
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
