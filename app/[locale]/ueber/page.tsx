import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/seo-drink-list";
import { Section, textLinkClass } from "@/components/ui/section";
import ui from "@/components/ui/ui.module.css";
import { contactEmail, correctionMailto, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Über Zuckerhaltig.de", "Wie Zuckerhaltig.de Getränkedaten sammelt, Quellen nutzt und Zucker pro Packung berechnet. Erfahre, wie Quellen geprüft und Packungswerte aus Angaben pro 100 ml berechnet werden.", "/de/ueber");

const sources = [
  { title: "Quellen", text: "Werte stammen von Herstellerseiten, aus Händlerangaben oder vom Etikett. Jede Produktseite verlinkt ihre Quelle." },
  { title: "Rechnung", text: "Zucker pro Packung ist der Wert pro 100 ml mal Füllmenge geteilt durch 100. Ein Zuckerwürfel steht für 3 g." },
  { title: "Einordnung", text: "Verglichen wird mit der Kategorie und mit 50 g freiem Zucker am Tag, der Orientierung von WHO und DGE." },
];

const methodology = [
  { title: "Aufnahme", text: "Ein Getränk braucht eine nachvollziehbare Hersteller-, Händler- oder Etikettquelle. Nährwerte werden nicht aus ähnlichen Sorten abgeleitet." },
  { title: "Prüfung", text: "Auf der Produktseite stehen Quelle, Prüfstatus und, falls vorhanden, das Datum der letzten Kontrolle." },
  { title: "Aktualisierung", text: "Rezepturen ändern sich. Das Prüfdatum wird nur nach einer echten Kontrolle erneuert." },
];

export default function AboutPage() {
  return (
    <main className="pb-24">
      <PageHero title="Über Zuckerhaltig.de" text="Zuckerhaltig.de sammelt Nährwertangaben zu Getränken aus Deutschland und rechnet sie auf die ganze Packung um. Ein unabhängiges Informationsprojekt." />

      <Section id="method" title="Woher die Zahlen kommen">
        <ul className={ui.contextList}>
          {sources.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}
        </ul>
      </Section>

      <Section id="process" title="Aufnahme, Prüfung, Aktualisierung">
        <ul className={ui.contextList}>
          {methodology.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}
        </ul>
      </Section>

      <Section id="contact" title="Wert veraltet?">
        <p className="max-w-2xl leading-7 text-slate">
          Ein aktueller Link oder ein Foto vom Etikett hilft. Hinweise bitte an{" "}
          <a href={correctionMailto("Hinweis zu Zuckerhaltig.de")} className={textLinkClass}>{contactEmail}</a>.
        </p>
      </Section>

      <nav aria-label="Weiter" className="mx-auto max-w-page px-5 pt-14">
        <ul className={ui.chipList}>
          <li><Link href="/de/getraenke">Alle Getränke <ArrowRight size={14} aria-hidden="true" /></Link></li>
          <li><Link href="/de/faq">FAQ <ArrowRight size={14} aria-hidden="true" /></Link></li>
          <li><Link href="/de/impressum">Impressum <ArrowRight size={14} aria-hidden="true" /></Link></li>
        </ul>
      </nav>
    </main>
  );
}
