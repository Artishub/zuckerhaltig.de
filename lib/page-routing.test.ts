import { describe, expect, it } from "vitest";
import searchConsolePages from "@/lib/data/search-console-pages.json";
import { canonicalPackageDrinkId, drinks, productFamilyDrinks } from "@/lib/data/drinks";
import { searchIndexableDrinkIds } from "@/lib/seo-index";
import { drinkPageHref, drinkPath, drinkRedirectTarget, recipePageDrink, removedDrinkRedirects, searchImpressions } from "@/lib/page-routing";

const byId = (id: string) => {
  const drink = drinks.find((item) => item.id === id);
  if (!drink) throw new Error(`missing drink ${id}`);
  return drink;
};
const canonicalDrinks = drinks.filter((drink) => canonicalPackageDrinkId(drink) === drink.id);

describe("recipe pages", () => {
  it("keeps allowlisted drinks as the recipe page", () => {
    for (const id of searchIndexableDrinkIds) {
      expect(recipePageDrink(byId(id)).id).toBe(id);
      expect(drinkRedirectTarget(byId(id))).toBeNull();
    }
  });

  it("keeps size pages that had search impressions", () => {
    expect(searchImpressions("/de/getraenke/coca-cola-classic-330")).toBeGreaterThan(0);
    expect(drinkRedirectTarget(byId("coca-cola-classic-330"))).toBeNull();
  });

  it("redirects other sizes to the recipe page with a size anchor", () => {
    const family = productFamilyDrinks(byId("coca-cola-classic-500"));
    const quiet = family.find((drink) => drink.id !== "coca-cola-classic-500" && searchImpressions(drinkPath(drink.id)) === 0);
    expect(quiet).toBeDefined();
    expect(drinkRedirectTarget(quiet!)).toBe(`/de/getraenke/coca-cola-classic-500#groesse-${quiet!.sizeMl}-ml`);
  });

  it("never redirects to a page that redirects again", () => {
    for (const drink of canonicalDrinks) {
      const target = drinkRedirectTarget(drink);
      if (!target?.startsWith("/de/getraenke/")) continue;
      const targetId = target.replace("/de/getraenke/", "").split("#")[0];
      expect(drinkRedirectTarget(byId(targetId)), `${drink.id} -> ${target}`).toBeNull();
    }
  });

  it("links internally without hitting a redirect", () => {
    for (const drink of drinks) {
      const href = drinkPageHref(drink);
      const [path] = href.split("#");
      if (!path.startsWith("/de/getraenke/")) continue;
      expect(drinkRedirectTarget(byId(path.replace("/de/getraenke/", "")))).toBeNull();
    }
  });
});

describe("duplicate ids", () => {
  it("send renamed duplicates straight to the final page", () => {
    expect(drinkPageHref(byId("pepsi-original-330"))).toBe("/de/getraenke/pepsi-1500#groesse-330-ml");
    expect(drinkPageHref(byId("almdudler-original-350"))).toBe("/de/getraenke/almdudler-das-original-350");
  });
});

describe("flavor lines", () => {
  it("lists Red Bull editions without impressions on the brand page", () => {
    expect(drinkRedirectTarget(byId("red-bull-peach-edition-250"))).toBe("/de/marken/red-bull#red-bull-peach-edition-250");
  });

  it("keeps editions that had search impressions", () => {
    expect(drinkRedirectTarget(byId("red-bull-white-edition-kokos-blaubeere-250"))).toBeNull();
  });

  it("does not treat the original Red Bull as an edition", () => {
    expect(drinkRedirectTarget(byId("red-bull-energy-drink-250"))).toBeNull();
  });
});

describe("search console pages", () => {
  it("never turns a product URL with impressions into a 404", () => {
    const paths = Object.keys(searchConsolePages.impressionsByPath).filter((path) => path.startsWith("/de/getraenke/") && path !== "/de/getraenke/vergleich");
    for (const path of paths) {
      const id = path.replace("/de/getraenke/", "");
      const exists = drinks.some((drink) => drink.id === id);
      expect(exists || id in removedDrinkRedirects, path).toBe(true);
    }
  });
});
