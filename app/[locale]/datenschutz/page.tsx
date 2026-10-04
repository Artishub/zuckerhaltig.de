import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Datenschutz", "Datenschutzhinweise von Zuckerhaltig.de zu technischen Server-Logs, eingebundenen Diensten und der Verarbeitung von Zugriffsdaten beim Besuch der Website.", "/de/datenschutz");

export default function DatenschutzPage() {
  return <LegalPage title="Datenschutz" text="Dieses MVP speichert keine Nutzerkonten, setzt keine eigenen Tracking-Cookies und verarbeitet keine Formulare. Server-Logs des Hostings können technisch notwendige Zugriffsdaten enthalten." />;
}

function LegalPage({ title, text }: { title: string; text: string }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 md:pt-16">
      <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-[750] leading-[1.02] tracking-[-0.04em] [text-wrap:balance]">{title}</h1>
      <p className="mt-6 leading-7 text-slate">{text}</p>
    </main>
  );
}
