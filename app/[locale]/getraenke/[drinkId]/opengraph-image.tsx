import { ImageResponse } from "next/og";
import { brandById } from "@/lib/data/brands";
import { canonicalPackageDrinkId, drinks, sugarCubes, totalSugarGrams } from "@/lib/data/drinks";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Zuckermenge pro Packung mit Zuckerwürfeln";

const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

// Per-drink preview image: sugar per package and drawn cubes (3 g each).
export default async function Image({ params }: { params: Promise<{ drinkId: string }> }) {
  const { drinkId } = await params;
  const drink = drinks.find((item) => item.id === drinkId);
  const canonical = drink ? drinks.find((item) => item.id === canonicalPackageDrinkId(drink)) ?? drink : null;
  const total = canonical ? totalSugarGrams(canonical) : null;
  const cubes = canonical ? sugarCubes(canonical) : null;
  const cubeCount = Math.min(Math.round(cubes ?? 0), 40);
  const brand = canonical ? brandById[canonical.brandId]?.name ?? "" : "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1f4539", color: "#f5f8f2", padding: 64, fontFamily: "Arial" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#b9d4c3", fontWeight: 700 }}>
            <span>zuckerhaltig.de</span>
            <span>{canonical?.sizeMl ? `${canonical.sizeMl} ml` : ""}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, color: "#b9d4c3", fontWeight: 700 }}>{brand}</div>
            <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, maxWidth: 1000 }}>{canonical?.name ?? "Getränk"}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 18 }}>
              <span style={{ fontSize: 170, fontWeight: 800, lineHeight: 1, letterSpacing: -8 }}>{total === null ? "?" : numberFormat.format(total)}</span>
              <span style={{ fontSize: 40, fontWeight: 700, color: "#d1e3d7" }}>g Zucker</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 1060 }}>
              {Array.from({ length: cubeCount }).map((_, index) => (
                <div key={index} style={{ width: 34, height: 34, borderRadius: 6, background: "#d8f36a", boxShadow: "inset 5px 5px 0 rgba(255,255,255,0.35)" }} />
              ))}
            </div>
            <div style={{ fontSize: 28, color: "#d1e3d7" }}>
              {cubes === null ? "Zuckerwerte mit Quelle" : `${numberFormat.format(cubes)} Zuckerwürfel · ${numberFormat.format(canonical?.sugarPer100Ml ?? 0)} g pro 100 ml`}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
