import Link from "next/link";
import { FaqNav } from "@/components/faq-nav";
import { faq, faqCategories } from "@/lib/content/faq";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("FAQ: Zucker in Getränken, Cola und Energy Drinks", "Antworten zu Zucker pro 100 ml, Zucker pro Flasche, Zuckerwürfeln, Cola, Eistee, Energy Drinks, Saft, Zero und Light. Kurz und nachvollziehbar erklärt.", "/de/faq");

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="mx-auto max-w-page px-5 pb-24 pt-12 md:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <FaqNav categories={faqCategories} />
        <div>
          <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-[750] leading-[1.02] tracking-[-0.04em] [text-wrap:balance]">FAQ: Zucker in Getränken</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">
            Kurze Antworten zu Zucker pro 100 ml und pro Flasche, Zuckerwürfeln, Zero-Getränken und den Quellen der Werte.
          </p>
          <div className="mt-8 space-y-12">
            {faqCategories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-28">
                <div className="border-b border-hair pb-4">
                  <h2 className="text-[1.6rem] font-[750] leading-tight tracking-[-0.03em]">{category.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate">{category.intro}</p>
                </div>
                <div className="divide-y divide-hair">
                  {category.items.map((item) => (
                    <article key={item.question} className="py-5">
                      <h3 className="font-semibold">{item.question}</h3>
                      <p className="mt-2 leading-7 text-slate">{item.answer}</p>
                    </article>
                  ))}
                </div>
                {category.id === "gesundheit" && (
                  <Link href="/de/wissen/suessstoffe-aspartam-zuckerfreie-getraenke" className="mt-4 inline-flex text-sm font-medium underline decoration-ash underline-offset-4 hover:decoration-ink">
                    Aspartam und Süßstoffe ausführlich einordnen
                  </Link>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
