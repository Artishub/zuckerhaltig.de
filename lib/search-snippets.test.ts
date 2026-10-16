import { describe, expect, it } from "vitest";
import { articleSnippet, brandSnippet, comparisonSnippet, drinkSnippet, snippetKeys } from "./search-snippets";

const all = [
  ...snippetKeys.articles.map((key) => [key, articleSnippet(key)] as const),
  ...snippetKeys.brands.map((key) => [key, brandSnippet(key)] as const),
  ...snippetKeys.drinks.map((key) => [key, drinkSnippet(key)] as const),
  ...snippetKeys.comparisons.map((key) => [key, comparisonSnippet(key)] as const),
];

describe("search snippets", () => {
  it.each(all)("%s fits the search result limits", (_, snippet) => {
    expect(snippet).not.toBeNull();
    expect(snippet!.title.length).toBeLessThanOrEqual(60);
    expect(snippet!.description.length).toBeLessThanOrEqual(160);
    expect(snippet!.description.length).toBeGreaterThanOrEqual(100);
  });

  it("answers the Cola Zero question with the data value", () => {
    const snippet = articleSnippet("cola-zero-light-und-klassisch")!;
    expect(snippet.title).toContain("0 g Zucker");
    expect(snippet.description).toContain("Classic 10,6 g");
    expect(snippet.lead).toMatch(/^Coca-Cola Zero und Coca-Cola Light haben 0 g Zucker pro 100 ml/);
  });

  it("answers the cubes-per-litre question for cola", () => {
    const snippet = articleSnippet("cola-zucker-pro-100ml")!;
    expect(snippet.lead).toContain("ein Liter 106 g, das sind rund 35 Zuckerwürfel");
  });

  it("returns null for pages without a snippet", () => {
    expect(articleSnippet("unbekannt")).toBeNull();
  });
});
