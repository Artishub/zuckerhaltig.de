import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Nutzungsbedingungen", "Nutzungsbedingungen für Zuckerhaltig.de: Hinweise zur Verwendung der Getränkedaten, zu möglichen Rezepturänderungen und zur Prüfung aktueller Verpackungsangaben.", "/de/nutzungsbedingungen");

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Nutzungsbedingungen</h1>
      <p className="mt-6 leading-7 text-slate">Die Inhalte dienen der allgemeinen Information. Nährwerte können sich ändern; maßgeblich ist die Angabe auf dem jeweiligen Produkt.</p>
    </main>
  );
}
