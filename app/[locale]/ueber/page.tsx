import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/seo-drink-list";

export const metadata: Metadata = {
  title: "Über Zuckerhaltig.de",
  description: "Wie Zuckerhaltig.de Getränkedaten sammelt, Quellen nutzt und Zucker pro Packung berechnet.",
  alternates: { canonical: "/de/ueber" },
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        kicker="Über das Projekt"
        title="Zuckerwerte klar vergleichen."
        text="Zuckerhaltig.de sammelt Nährwertangaben zu Getränken und rechnet sie in 100-ml-Werte, Packungszucker und Zuckerwürfel um."
      />
      <section className="mx-auto grid max-w-page gap-6 px-4 py-10 md:grid-cols-3">
        <div className="rounded-lg border border-ash bg-paper p-5">
          <h2 className="text-lg font-semibold">Quellen</h2>
          <p className="mt-3 text-sm leading-6 text-slate">Werte stammen aus Herstellerseiten, Händlerangaben oder Produktetiketten. Rezepturen können sich ändern.</p>
        </div>
        <div className="rounded-lg border border-ash bg-paper p-5">
          <h2 className="text-lg font-semibold">Rechnung</h2>
          <p className="mt-3 text-sm leading-6 text-slate">Packungszucker = Zucker pro 100 ml mal Füllmenge durch 100. Ein Zuckerwürfel wird mit 3 g gerechnet.</p>
        </div>
        <div className="rounded-lg border border-ash bg-paper p-5">
          <h2 className="text-lg font-semibold">Korrekturen</h2>
          <p className="mt-3 text-sm leading-6 text-slate">Wenn ein Wert veraltet ist, hilft ein aktueller Link oder ein Foto vom Etikett.</p>
        </div>
      </section>
      <section className="border-y border-ash bg-mist">
        <div className="mx-auto max-w-page px-4 py-10">
          <div className="grid gap-2 sm:grid-cols-3">
            <Link href="/de/getraenke" className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">Getränke ansehen</Link>
            <Link href="/de/faq" className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">FAQ lesen</Link>
            <Link href="/de/impressum" className="rounded-lg border border-ash bg-paper p-4 hover:border-marigold">Kontakt</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
