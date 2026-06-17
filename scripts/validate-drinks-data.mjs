import fs from "node:fs";

const data = JSON.parse(fs.readFileSync(new URL("../lib/data/drinks.seed.json", import.meta.url), "utf8"));
const errors = [];

const brandIds = new Set(data.brands.map((brand) => brand.id));
const categoryIds = new Set(data.categories.map((category) => category.id));
const drinkIds = new Set();
const sourceSugarPattern = /(\d+(?:[,.]\d+)?)\s*g\s+Zucker\s+pro\s+(\d+)\s*ml/gi;

for (const drink of data.drinks) {
  if (drinkIds.has(drink.id)) errors.push(`${drink.id}: duplicate drink id`);
  drinkIds.add(drink.id);

  if (!brandIds.has(drink.brandId)) errors.push(`${drink.id}: unknown brandId ${drink.brandId}`);
  if (!categoryIds.has(drink.categoryId)) errors.push(`${drink.id}: unknown categoryId ${drink.categoryId}`);

  const calculatedSugar = round1(drink.sugarPer100Ml * (drink.sizeMl / 100));
  const calculatedCubes = round1(calculatedSugar / 3);
  const calculatedEnergy = drink.nutritionPer100Ml ? round1(drink.nutritionPer100Ml.energyKcal * (drink.sizeMl / 100)) : null;

  if (drink.nutritionPer100Ml && !close(drink.nutritionPer100Ml.sugar, drink.sugarPer100Ml)) {
    errors.push(`${drink.id}: nutritionPer100Ml.sugar ${drink.nutritionPer100Ml.sugar} != sugarPer100Ml ${drink.sugarPer100Ml}`);
  }

  if (drink.computed) {
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
    if (sourceMl === drink.sizeMl && !close(sourceSugar, calculatedSugar)) {
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
