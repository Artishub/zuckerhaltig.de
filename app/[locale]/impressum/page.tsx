import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Impressum</h1>
      <p className="mt-6 leading-7 text-slate">Platzhalter für Anbieterkennzeichnung nach § 5 DDG. Vor Veröffentlichung bitte durch echte Angaben ersetzen.</p>
    </main>
  );
}
