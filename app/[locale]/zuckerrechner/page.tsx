import { PageHero } from "@/components/seo-drink-list";
import { SugarCalculator } from "@/components/sugar-calculator";
import { pageMetadata, siteUrl } from "@/lib/site";

const faq = [
  {
    question: "Wie berechnet man Zucker pro Flasche?",
    answer: "Multipliziere Zucker pro 100 ml mit der Füllmenge in Millilitern und teile das Ergebnis durch 100.",
  },
  {
    question: "Wie werden Zuckerwürfel berechnet?",
    answer: "Zuckerhaltig.de rechnet mit 3 g Zucker pro Würfel. Der Wert dient als leicht lesbare Rechenhilfe.",
  },
];

export const metadata = pageMetadata(
  "Zuckerrechner: Zucker pro Flasche berechnen",
  "Berechne Zucker pro Flasche oder Dose aus Zucker pro 100 ml und der Füllmenge. Mit Gesamtzucker, Zuckerwürfeln und teilbarem Ergebnis.",
  "/de/zuckerrechner",
);

export default function SugarCalculatorPage() {
  return (
    <main className="pb-24">
      <PageHero title="Zucker pro Flasche berechnen" text="Zwei Angaben vom Etikett reichen für Gesamtzucker und Zuckerwürfel." />

      <div className="mx-auto max-w-page px-5 pt-4">
        <SugarCalculator />

        <section className="mt-16">
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-[750] leading-tight tracking-[-0.03em]">Die Formel</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate">Zucker pro 100 ml × Füllmenge ÷ 100 ergibt den Zucker in der ganzen Packung. Der Rechner rundet auf eine Nachkommastelle.</p>
        </section>

        <section className="mt-16">
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-[750] leading-tight tracking-[-0.03em]">Fragen zum Zuckerrechner</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {faq.map((item) => (
              <details key={item.question} className="rounded-lg border border-hair bg-mist p-6 shadow-card">
                <summary className="focus-ring cursor-pointer rounded-md font-semibold">{item.question}</summary>
                <p className="mt-3 leading-7 text-slate">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Zuckerrechner für Getränke",
              url: `${siteUrl}/de/zuckerrechner`,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              description: "Berechnet Gesamtzucker und Zuckerwürfel aus Zucker pro 100 ml und Füllmenge.",
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]),
        }}
      />
    </main>
  );
}
