import { describe, expect, it } from "vitest";
import { per100Benchmarks } from "./sugar-benchmarks";

describe("per 100 ml benchmarks", () => {
  it("computes package sugar and the 50 g share", () => {
    const [five] = per100Benchmarks([5]);
    expect(five.per500).toBe(25);
    expect(five.dailyShare).toBe(50);
  });

  it("ranks higher values above more drinks", () => {
    const rows = per100Benchmarks([4, 8, 11]);
    expect(rows[0].lessShare).toBeLessThan(rows[1].lessShare);
    expect(rows[1].lessShare).toBeLessThan(rows[2].lessShare);
    expect(rows[2].lessShare).toBeLessThanOrEqual(100);
  });
});
