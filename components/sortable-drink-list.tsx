import { CategoryTable, type SortKey } from "@/components/ui/category-table";
import { type Drink } from "@/lib/data/drinks";
import { scaleMax, summarize } from "@/lib/drink-summary";

const sortKeys: Record<"sugar100" | "package" | "name" | "brand", SortKey> = {
  sugar100: "per100",
  package: "total",
  name: "name",
  brand: "name",
};

export function SortableDrinkRows({
  drinks,
  defaultSort = "sugar100",
  ascending,
  compact = false,
}: {
  drinks: Drink[];
  defaultSort?: keyof typeof sortKeys;
  ascending?: boolean;
  compact?: boolean;
}) {
  return <CategoryTable items={drinks.map(summarize)} max={scaleMax()} defaultSort={sortKeys[defaultSort]} ascending={ascending} compact={compact} />;
}
