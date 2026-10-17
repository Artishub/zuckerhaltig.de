import { describe, expect, it } from "vitest";
import { apexRedirectTarget, requestHost } from "@/lib/host-redirects";

describe("apexRedirectTarget", () => {
  it("sends the apex root to the German start page", () => {
    expect(apexRedirectTarget("/", "")).toBe("https://www.zuckerhaltig.de/de");
  });

  it("keeps path and query for normal pages", () => {
    expect(apexRedirectTarget("/de/getraenke", "?kategorie=cola")).toBe("https://www.zuckerhaltig.de/de/getraenke?kategorie=cola");
  });

  it("resolves drink redirects in the same hop", () => {
    expect(apexRedirectTarget("/de/getraenke/coca-cola-classic-1000", "")).toBe("https://www.zuckerhaltig.de/de/getraenke/coca-cola-classic-500#groesse-1000-ml");
  });
});

describe("requestHost", () => {
  it("prefers the forwarded host and drops the port", () => {
    expect(requestHost(new Headers({ host: "localhost:3000", "x-forwarded-host": "zuckerhaltig.de" }))).toBe("zuckerhaltig.de");
    expect(requestHost(new Headers({ host: "WWW.zuckerhaltig.de:443" }))).toBe("www.zuckerhaltig.de");
    expect(requestHost(new Headers())).toBe("");
  });
});
