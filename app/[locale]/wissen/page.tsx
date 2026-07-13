import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/content/articles";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Zucker in Getränken: Wissen und Vergleiche", "Zucker in Getränken nachschlagen: Cola Zucker pro 100 ml, Zuckerwürfel, Energy Drink Zucker pro Dose, Eistee Zucker und Saft im Vergleich.", "/de/wissen");

export default function KnowledgePage() {
  return (
    <main className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Wie viel Zucker ist in Getränken?</h1>
      <div className="mt-6 grid gap-8 border-y border-ash py-8 md:grid-cols-[0.9fr_1.1fr]">
        <p className="text-2xl font-semibold leading-9 tracking-tight">
          Cola, Eistee, Saft und Energy Drinks sind schnell getrunken. Der Zuckerwert bleibt oft hängen, wenn die Flasche längst leer ist.
        </p>
        <div className="space-y-4 leading-7 text-slate">
          <p>
            Viele Suchanfragen klingen sehr konkret: „Wie viel Zucker hat Cola?“, „Wie viele Zuckerwürfel hat Red Bull?“ oder „Monster Zucker 500 ml“. Genau deshalb trennt Zuckerhaltig.de den Wert pro 100 ml vom Zucker pro Packung.
          </p>
          <p>
            Ein einzelnes Getränk entscheidet nicht über Gesundheit. Aber wer regelmäßig süße Getränke trinkt, sollte die Menge kennen: Zucker pro 100 ml, Gesamtzucker und Zuckerwürfel.
          </p>
          <p>
            Die Seite liest keine Absicht in Produkte hinein. Sie rechnet Verpackungsangaben um und macht Cola, Eistee, Energy Drinks, Saft und Zero-Varianten vergleichbar.
          </p>
        </div>
      </div>
      <section className="mt-10 rounded-lg border border-ash bg-mist p-5">
        <h2 className="text-2xl font-semibold tracking-tight">Häufig gesucht</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { href: "/de/wissen/cola-zucker-pro-100ml", label: "Cola Zucker pro 100 ml" },
            { href: "/de/wissen/cola-zucker-pro-100ml", label: "Wie viel Zucker hat Cola?" },
            { href: "/de/wissen/cola-zucker-pro-100ml", label: "Zuckerwürfel in Cola" },
            { href: "/de/wissen/energy-drinks-zucker-vergleichen", label: "Red Bull Zucker pro Dose" },
            { href: "/de/wissen/energy-drinks-zucker-vergleichen", label: "Monster Energy Zucker 500 ml" },
            { href: "/de/wissen/eistee-zucker-im-alltag", label: "Eistee Pfirsich Zucker" },
            { href: "/de/getraenke?category=cola", label: "Cola-Produkte vergleichen" },
            { href: "/de/getraenke/afri-cola-classic-330", label: "afri cola Zucker" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="focus-ring rounded-md border border-ash bg-paper px-3 py-2 text-sm hover:border-marigold">
              {item.label}
            </Link>
          ))}
        </div>
      </section>
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
