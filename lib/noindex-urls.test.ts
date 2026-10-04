import { describe, expect, it } from "vitest";
import { isNoindexUrl } from "@/lib/noindex-urls";

describe("isNoindexUrl", () => {
  it("noindexes filter URLs of the drink list", () => {
    expect(isNoindexUrl("/de/getraenke", "?brand=coca-cola")).toBe(true);
    expect(isNoindexUrl("/de/getraenke", "?q=fanta")).toBe(true);
  });

  it("keeps the plain drink list indexable", () => {
    expect(isNoindexUrl("/de/getraenke", "")).toBe(false);
  });

  it("noindexes every comparison URL", () => {
    expect(isNoindexUrl("/de/getraenke/vergleich", "")).toBe(true);
    expect(isNoindexUrl("/de/getraenke/vergleich", "?drinks=a,b")).toBe(true);
  });

  it("leaves product pages alone", () => {
    expect(isNoindexUrl("/de/getraenke/coca-cola-classic-500", "")).toBe(false);
  });
});
