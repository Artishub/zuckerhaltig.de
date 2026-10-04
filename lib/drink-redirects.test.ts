import { describe, expect, it } from "vitest";
import { drinkRedirectFor } from "@/lib/drink-redirects";
import { removedDrinkRedirects } from "@/lib/page-routing";

describe("drinkRedirectFor", () => {
  it("sends removed drinks to their replacement page", () => {
    const [id, target] = Object.entries(removedDrinkRedirects)[0];
    expect(drinkRedirectFor(`/de/getraenke/${id}`)).toBe(target);
  });

  it("keeps recipe pages and ignores other paths", () => {
    expect(drinkRedirectFor("/de/getraenke/coca-cola-classic-500")).toBeNull();
    expect(drinkRedirectFor("/de/getraenke")).toBeNull();
    expect(drinkRedirectFor("/de/getraenke/vergleich")).toBeNull();
  });

  it("sends other sizes to the recipe page anchor", () => {
    expect(drinkRedirectFor("/de/getraenke/coca-cola-classic-1000")).toBe("/de/getraenke/coca-cola-classic-500#groesse-1000-ml");
  });
});
