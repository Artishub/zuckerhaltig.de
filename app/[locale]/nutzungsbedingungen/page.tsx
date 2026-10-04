import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Nutzungsbedingungen", "Nutzungsbedingungen für Zuckerhaltig.de: Hinweise zur Verwendung der Getränkedaten, zu möglichen Rezepturänderungen und zur Prüfung aktueller Verpackungsangaben.", "/de/nutzungsbedingungen");

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 md:pt-16">
      <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-[750] leading-[1.02] tracking-[-0.04em] [text-wrap:balance]">Nutzungsbedingungen</h1>
      <p className="mt-6 leading-7 text-slate">Die Inhalte dienen der allgemeinen Information. Nährwerte können sich ändern; maßgeblich ist die Angabe auf dem jeweiligen Produkt.</p>
    </main>
  );
}
