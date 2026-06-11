import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "Wissen",
  description: "Kurze Artikel über Zuckerwerte, Berechnung und Getränkekategorien.",
};

export default function KnowledgePage() {
  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Wissen</h1>
      <div className="mt-6 grid gap-8 border-y border-ash py-8 md:grid-cols-[0.9fr_1.1fr]">
        <p className="text-2xl font-semibold leading-9 tracking-tight">
          Zucker ist schnell getrunken, aber oft schwer einzuschätzen.
        </p>
        <div className="space-y-4 leading-7 text-slate">
          <p>
            Viele Getränke wirken im Alltag harmlos: Eistee, Saft, Milchkaffee, Sportdrink oder aromatisiertes Wasser. Trotzdem können sie relevante Mengen Zucker enthalten. Besonders flüssige Kalorien fallen leicht unter den Tisch, weil eine Flasche nebenbei getrunken wird und nicht wie eine Mahlzeit wirkt.
          </p>
          <p>
            Ein dauerhaft hoher Konsum von zuckerhaltigen Getränken kann laut öffentlichen Gesundheitsstellen unter anderem die Energieaufnahme erhöhen und steht mit Risiken wie Gewichtszunahme, Karies und Stoffwechselproblemen in Verbindung. Entscheidend ist nicht ein einzelnes Getränk, sondern Menge, Häufigkeit und der gesamte Ernährungsstil.
          </p>
          <p>
            Zuckerhaltig.de hilft dabei, Verpackungsangaben nüchtern zu lesen: pro 100 ml, pro Gebinde und als grobe Zuckerwürfel. So werden Produkte vergleichbar, ohne sie pauschal als gut oder schlecht einzuordnen.
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
