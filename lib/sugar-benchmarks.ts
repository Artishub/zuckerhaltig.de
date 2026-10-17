import { calculatePackageSugar, drinks, uniqueProductRepresentatives } from "@/lib/data/drinks";
import { whoDailyLimitGrams } from "@/lib/sugar-context";

// Answers "Ist X g Zucker pro 100 ml viel?" from the drink data: what X means for a 500-ml bottle,
// its share of the 50 g WHO orientation and how many drinks in the database have less.
export const searchedPer100Values = [4, 5, 6, 8, 11];

export function per100Benchmarks(values = searchedPer100Values) {
  const products = uniqueProductRepresentatives(drinks);
  return values.map((value) => {
    const per500 = calculatePackageSugar(value, 500);
    return {
      value,
      per500,
      dailyShare: Math.round((per500 / whoDailyLimitGrams) * 100),
      lessShare: Math.round((products.filter((drink) => drink.sugarPer100Ml < value).length / products.length) * 100),
    };
  });
}
