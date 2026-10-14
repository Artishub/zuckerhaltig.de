import { ImageResponse } from "next/og";
import { sugarTax } from "@/lib/sugar-tax";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Zuckersteuer: 26 und 32 Cent pro Liter je nach Zucker pro 100 ml";

// Preview image for the sugar tax page; rates and start date come from lib/sugar-tax.ts.
export default function Image() {
  const [high, low] = sugarTax.tiers;
  const start = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(sugarTax.startDate));
  const tiers = [
    { label: `unter ${low.minPer100Ml} g`, rate: 0, strong: false },
    { label: `ab ${low.minPer100Ml} g`, rate: low.centsPerLiter, strong: false },
    { label: `ab ${high.minPer100Ml} g`, rate: high.centsPerLiter, strong: true },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#edf0e8", color: "#17201d", padding: 64, fontFamily: "Arial" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 700 }}>
          <span>zuckerhaltig.de</span>
          <span style={{ color: "#526158" }}>geplant ab {start}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>Zuckersteuer</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#526158", marginTop: 14 }}>Steuer pro Liter nach Zucker pro 100 ml, mit Rechner</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {tiers.map((tier) => (
            <div key={tier.label} style={{ display: "flex", flexDirection: "column", flex: 1, padding: "26px 30px", borderRadius: 22, background: tier.strong ? "#1f4539" : "#f8faf4", color: tier.strong ? "#ffffff" : "#17201d", border: tier.strong ? "2px solid #1f4539" : "2px solid #d4dbd2" }}>
              <span style={{ fontSize: 28, fontWeight: 700, opacity: 0.8 }}>{tier.label} Zucker</span>
              <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2, marginTop: 8 }}>{tier.rate} ct / l</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
