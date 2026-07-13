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
    <main>
      <section className="border-b border-ash bg-mist">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <h1 className="max-w-3xl text-5xl font-semibold leading-[.94] tracking-[-0.06em] md:text-6xl">Zucker pro Flasche berechnen</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">Zwei Angaben vom Etikett reichen für Gesamtzucker und Zuckerwürfel.</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <SugarCalculator />

        <section className="mt-12 border-t border-ash pt-9">
          <h2 className="text-3xl font-semibold tracking-tight">Die Formel</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate">Zucker pro 100 ml × Füllmenge ÷ 100 ergibt den Zucker in der ganzen Packung. Der Rechner rundet auf eine Nachkommastelle.</p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-semibold tracking-tight">Fragen zum Zuckerrechner</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {faq.map((item) => (
              <details key={item.question} className="rounded-lg border border-ash bg-mist p-5">
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
