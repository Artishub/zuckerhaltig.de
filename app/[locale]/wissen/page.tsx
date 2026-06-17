import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "Wie viel Zucker ist in Getränken?",
  description: "Wissenswertes zu Zucker in Cola, Eistee, Saft, Energy Drinks und Limonade: Zucker pro 100 ml, Zuckerwürfel und Gesamtzucker einfach erklärt.",
};

export default function KnowledgePage() {
  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Wie viel Zucker ist in Getränken?</h1>
      <div className="mt-6 grid gap-8 border-y border-ash py-8 md:grid-cols-[0.9fr_1.1fr]">
        <p className="text-2xl font-semibold leading-9 tracking-tight">
          Zucker in Cola, Eistee, Saft und Energy Drinks ist schnell getrunken, aber oft schwer einzuschätzen.
        </p>
        <div className="space-y-4 leading-7 text-slate">
          <p>
            Viele Menschen suchen nach Fragen wie „Wie viel Zucker hat Cola?“, „Wie viele Zuckerwürfel hat Red Bull?“ oder „Wie viel Zucker steckt in Eistee?“. Viele Getränke wirken im Alltag harmlos: Eistee, Saft, Milchkaffee, Sportdrink oder aromatisiertes Wasser. Trotzdem können sie relevante Mengen Zucker enthalten.
          </p>
          <p>
            Ein dauerhaft hoher Konsum von zuckerhaltigen Getränken kann laut öffentlichen Gesundheitsstellen unter anderem die Energieaufnahme erhöhen und steht mit Risiken wie Gewichtszunahme, Karies und Stoffwechselproblemen in Verbindung. Entscheidend ist nicht ein einzelnes Getränk, sondern Menge, Häufigkeit und der gesamte Ernährungsstil.
          </p>
          <p>
            Zuckerhaltig.de hilft dabei, Verpackungsangaben nüchtern zu lesen: Zucker pro 100 ml, Zucker pro Flasche oder Dose und Zuckerwürfel als Orientierung. So werden Produkte vergleichbar, ohne sie pauschal als gut oder schlecht einzuordnen.
          </p>
        </div>
      </div>
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">Weiter informieren</h2>
      <div className="mt-4 divide-y divide-ash border-y border-ash">
        {articles.map((article) => (
          <Link key={article.slug} href={`/de/wissen/${article.slug}`} className="grid gap-4 py-5 hover:bg-mist md:grid-cols-[1fr_auto] md:px-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{article.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate">{article.description}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-slate">
              {article.minutes} Min. <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
