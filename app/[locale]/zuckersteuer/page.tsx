import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";
import { SugarTaxCalculator } from "@/components/sugar-tax-calculator";
import { Section, cardClass, textLinkClass } from "@/components/ui/section";
import { formatDate, formatNumber } from "@/lib/drink-summary";
import { pageMetadata, siteUrl } from "@/lib/site";
import { formatCents, sugarTax, sugarTaxPerPackageCents } from "@/lib/sugar-tax";
import { calculatorItems, categoryTaxShares, nearThreshold, popularTaxRows, tierCounts, type TaxRow } from "@/lib/sugar-tax-data";

const [high, low] = sugarTax.tiers;
const start = formatDate(sugarTax.startDate);

const faq = [
  {
    question: "Ab wann gilt die Zuckersteuer?",
    answer: `Geplant ist der ${start}. Beschlossen ist das noch nicht: Das Kabinett hat den Vorschlag am 14. Oktober 2026 an die Koalitionsfraktionen gegeben, jetzt entscheidet der Bundestag.`,
  },
  {
    question: "Wie hoch ist die Zuckersteuer?",
    answer: `${low.centsPerLiter} Cent pro Liter ab ${low.minPer100Ml} g Zucker pro 100 ml und ${high.centsPerLiter} Cent pro Liter ab ${high.minPer100Ml} g. Unter ${low.minPer100Ml} g fällt keine Steuer an.`,
  },
  {
    question: "Sind Zero- und Light-Getränke betroffen?",
    answer: "Nein. Getränke, die mit Süßungsmitteln statt Zucker gesüßt sind, sollen nach dem aktuellen Stand nicht besteuert werden.",
  },
  {
    question: "Wird Saft besteuert?",
    answer: "Reine Frucht- und Obstsäfte sind ausgenommen. Fruchtnektar und Fruchtsaftgetränke mit Zuckerzusatz fallen nach dem Kabinettsbeschluss unter die Steuer.",
  },
  {
    question: "Wer zahlt die Zuckersteuer?",
    answer: "Erhoben werden soll sie bei den Herstellern. Ob und wie stark sie die Preise im Laden erhöhen, ist offen.",
  },
];

export const metadata = pageMetadata(
  "Zuckersteuer 2027: Welche Getränke betroffen sind, mit Rechner",
  `Die geplante Zuckersteuer: ${low.centsPerLiter} ct pro Liter ab ${low.minPer100Ml} g, ${high.centsPerLiter} ct ab ${high.minPer100Ml} g Zucker pro 100 ml. Rechner und Liste, welche Getränke betroffen wären.`,
  "/de/zuckersteuer",
);

export default function SugarTaxPage() {
  const counts = tierCounts();
  const popular = popularTaxRows();
  const near = nearThreshold();
  const shares = categoryTaxShares();
  const taxedShare = Math.round(((counts.low + counts.high) / counts.total) * 100);

  return (
    <main className="pb-24">
      <PageHero title="Zuckersteuer auf Getränke" text="Was geplant ist, welche Getränke betroffen wären und wie viel Steuer auf eine Flasche käme." />

      <div className="mx-auto max-w-page px-5">
        <div className={`${cardClass} p-5 md:p-6`}>
          <p className="text-sm font-semibold">Stand {formatDate(sugarTax.statusDate)}</p>
          <p className="mt-2 max-w-3xl leading-7 text-slate">{sugarTax.status} Die Zahlen auf dieser Seite folgen den Berichten über den Kompromiss und werden angepasst, sobald sich etwas ändert.</p>
        </div>
      </div>

      <Section id="regeln" title="Die geplanten Regeln">
        <div className="grid gap-3 md:grid-cols-3">
          <TierCard label={`unter ${low.minPer100Ml} g`} rate={0} note="keine Steuer" />
          <TierCard label={`${low.minPer100Ml} bis unter ${high.minPer100Ml} g`} rate={low.centsPerLiter} note={`${formatCents(sugarTaxPerPackageCents(low.minPer100Ml, 330))} auf eine 0,33-l-Dose`} />
          <TierCard label={`ab ${high.minPer100Ml} g`} rate={high.centsPerLiter} note={`${formatCents(sugarTaxPerPackageCents(high.minPer100Ml, 500))} auf eine 0,5-l-Flasche`} strong />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate">Zucker jeweils pro 100 ml. Start: {start}. Erwartete Einnahmen: {sugarTax.revenueEuro.map((item) => `${formatNumber(item.amount / 1_000_000)} Mio. € (${item.year})`).join(", ")}.</p>

        <h3 className="mt-10 text-xl font-[750] tracking-[-0.02em]">Ausgenommen</h3>
        <ul className="mt-3 grid gap-2 leading-7 text-slate">
          {sugarTax.exemptions.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true">–</span>{item}</li>)}
        </ul>
      </Section>

      <Section id="rechner" title="Zuckersteuer berechnen" lead="Wähle ein Getränk aus unserer Datenbank oder trag die Werte vom Etikett ein.">
        <SugarTaxCalculator items={calculatorItems()} />
      </Section>

      <Section id="betroffen" title="Welche Getränke betroffen wären" lead={`Von ${counts.total} Getränken in unserer Datenbank (ohne Saft und Milchgetränke) lägen ${taxedShare}\u00a0% über der Grenze.`}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat value={counts.none} label={`unter ${low.minPer100Ml} g, keine Steuer`} />
          <Stat value={counts.low} label={`${low.centsPerLiter} ct pro Liter`} />
          <Stat value={counts.high} label={`${high.centsPerLiter} ct pro Liter`} strong />
        </div>

        <h3 className="mt-10 text-xl font-[750] tracking-[-0.02em]">Bekannte Getränke</h3>
        <TaxTable rows={popular} />
      </Section>

      <Section id="knapp" title="Knapp unter der Grenze" lead="Diese Getränke liegen höchstens 0,5 g unter einer Grenze. Schon kleine Rezepturänderungen entscheiden hier über den Steuersatz.">
        <div className="grid gap-6 lg:grid-cols-2">
          {near.map((group) => (
            <div key={group.threshold} className="min-w-0">
              <h3 className="text-lg font-[750]">Knapp unter {group.threshold} g</h3>
              {group.rows.length ? <TaxTable rows={group.rows} compact /> : <p className="mt-3 text-slate">Kein Getränk in diesem Bereich.</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section id="kategorien" title="Anteil besteuerter Getränke je Kategorie">
        <ul className="grid gap-3">
          {shares.map((category) => (
            <li key={category.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[13rem_1fr_auto]">
              <Link href={`/de/kategorien/${category.id}`} className="order-1 truncate font-semibold hover:underline">{category.name}</Link>
              <span className="order-3 col-span-2 h-3 overflow-hidden rounded-full bg-hair sm:order-2 sm:col-span-1" aria-hidden="true">
                <span className="block h-full rounded-full bg-moss dark:bg-lime" style={{ width: `${category.share * 100}%` }} />
              </span>
              <span className="order-2 text-sm tabular-nums text-slate sm:order-3">{Math.round(category.share * 100)} % · {category.taxed} von {category.count}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-6 text-slate">Saft fehlt hier: Reiner Saft ist ausgenommen, Nektar nicht, und unsere Kategorie unterscheidet das nicht. Kleine Hersteller wären ausgenommen; ihre Mengen kennen wir nicht.</p>
      </Section>

      <Section id="fragen" title="Fragen zur Zuckersteuer">
        <div className="grid gap-3 md:grid-cols-2">
          {faq.map((item) => (
            <details key={item.question} className={`${cardClass} p-6`}>
              <summary className="focus-ring cursor-pointer rounded-md font-semibold">{item.question}</summary>
              <p className="mt-3 leading-7 text-slate">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section id="methodik" title="So rechnen wir">
        <div className="max-w-3xl space-y-4 leading-7 text-slate">
          <p>Grundlage ist der Zucker pro 100 ml aus der Nährwerttabelle, wie auf allen Seiten von zuckerhaltig.de. Auch die Steuer soll am Gesamtzucker pro 100 ml ansetzen. Die Steuer pro Packung ist Steuersatz × Füllmenge, gerundet auf 0,1 Cent.</p>
          <p>
            Quellen:{" "}
            {sugarTax.sources.map((source, index) => (
              <span key={source.url}>{index > 0 && "; "}<a href={source.url} className={textLinkClass} rel="noopener">{source.label}</a></span>
            ))}
            . Zucker pro Flasche ohne Steuer rechnet der <Link href="/de/zuckerrechner" className={textLinkClass}>Zuckerrechner</Link>.
          </p>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Zuckersteuer-Rechner für Getränke",
              url: `${siteUrl}/de/zuckersteuer`,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              description: "Berechnet die geplante Zuckersteuer pro Packung aus Zucker pro 100 ml und Füllmenge.",
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
            },
          ]),
        }}
      />
    </main>
  );
}

function TierCard({ label, rate, note, strong = false }: { label: string; rate: number; note: string; strong?: boolean }) {
  return (
    <div className={`rounded-lg border p-5 ${strong ? "border-moss bg-moss text-white" : "border-hair bg-mist"}`}>
      <p className={`text-sm font-semibold ${strong ? "" : "text-slate"}`}>{label}</p>
      <p className="mt-2 text-4xl font-[750] tracking-[-0.04em] tabular-nums">{rate}&nbsp;ct<span className="text-lg font-semibold"> / Liter</span></p>
      <p className={`mt-2 text-sm ${strong ? "" : "text-slate"}`}>{note}</p>
    </div>
  );
}

function Stat({ value, label, strong = false }: { value: number; label: string; strong?: boolean }) {
  return (
    <div className={`rounded-lg p-5 ${strong ? "bg-cream" : "border border-hair bg-mist"}`}>
      <p className="text-4xl font-[750] tracking-[-0.04em] tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-slate">{label}</p>
    </div>
  );
}

function TaxTable({ rows, compact = false }: { rows: TaxRow[]; compact?: boolean }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-hair">
      <table className="w-full min-w-[30rem] text-left text-sm">
        <thead className="bg-mist text-slate">
          <tr>
            <th className="px-4 py-3 font-semibold">Getränk</th>
            <th className="px-4 py-3 text-right font-semibold">Zucker/100 ml</th>
            {!compact && <th className="px-4 py-3 text-right font-semibold">Satz</th>}
            <th className="px-4 py-3 text-right font-semibold">Steuer pro Packung</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-hair">
              <td className="px-4 py-3">
                <Link href={row.href} className="font-semibold hover:underline">{row.name}</Link>
                <span className="block text-slate">{row.brand} · {row.sizeMl}&nbsp;ml</span>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{formatNumber(row.per100)}&nbsp;g</td>
              {!compact && <td className="px-4 py-3 text-right tabular-nums">{row.centsPerLiter}&nbsp;ct/l</td>}
              <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCents(row.perPackage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
