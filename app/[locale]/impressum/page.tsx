import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Impressum", "Impressum von Zuckerhaltig.de mit Angaben zum Betreiber, Kontaktmöglichkeit und Hinweisen zur Haftung für die veröffentlichten Inhalte.", "/de/impressum");

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 md:pt-16">
      <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-[750] leading-[1.02] tracking-[-0.04em] [text-wrap:balance]">Impressum</h1>
      <section className="mt-6 space-y-6 leading-7 text-slate">
        <div>
          <h2 className="text-lg font-semibold text-ink">Angaben gemäß § 5 DDG</h2>
          <p className="mt-2">
            Artjom Gasarov
            <br />
            Wingertshecke 1
            <br />
            35392 Gießen
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">Kontakt</h2>
          <p className="mt-2">
            E-Mail:{" "}
            <span>artjomgasarov [at] gmail.com</span>
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">Haftung für Inhalte</h2>
          <p className="mt-2">
            Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Angaben übernehmen wir jedoch keine Gewähr.
          </p>
        </div>
      </section>
    </main>
  );
}
