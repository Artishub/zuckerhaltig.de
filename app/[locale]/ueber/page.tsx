import Link from "next/link";
import { ArrowRight, Calculator, Database, MessageCircle } from "lucide-react";
import { pageMetadata } from "@/lib/site";
import styles from "./about.module.css";

export const metadata = pageMetadata("Über Zuckerhaltig.de", "Wie Zuckerhaltig.de Getränkedaten sammelt, Quellen nutzt und Zucker pro Packung berechnet. Erfahre, wie Quellen geprüft und Packungswerte aus Angaben pro 100 ml berechnet werden.", "/de/ueber");

const principles = [
  {
    icon: Database,
    title: "Quellen statt Schätzung",
    text: "Werte stammen aus Herstellerseiten, Händlerangaben oder Produktetiketten. Rezepturen können sich ändern.",
  },
  {
    icon: Calculator,
    title: "Packungen verständlich rechnen",
    text: "Zucker pro Packung ergibt sich aus dem 100-ml-Wert und der Füllmenge. Ein Zuckerwürfel steht für 3 g.",
  },
  {
    icon: MessageCircle,
    title: "Hinweise sind willkommen",
    text: "Ist ein Wert veraltet, helfen ein aktueller Link oder ein Foto vom Etikett.",
  },
];

const methodology = [
  {
    title: "Aufnahme",
    text: "Ein Getränk braucht eine nachvollziehbare Hersteller-, Händler- oder Etikettquelle. Fehlen wichtige Angaben, wird die Variante nicht als hervorgehobene Produktseite veröffentlicht.",
  },
  {
    title: "Prüfung",
    text: "Auf der Detailseite stehen Quelle, Prüfstatus und – sofern vorhanden – das Datum der letzten Kontrolle. Nährwerte werden nicht aus ähnlichen Sorten abgeleitet.",
  },
  {
    title: "Aktualisierung",
    text: "Rezepturen und Verpackungen können sich ändern. Ein Prüfdatum wird deshalb nur bei einer echten Kontrolle erneuert; aktuelle Hinweise mit Quelle oder Etikettfoto sind willkommen.",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Über das Projekt</p>
        <h1>Zuckerwerte. <span className={styles.heroLine}>Klar belegt.</span></h1>
        <p>Zuckerhaltig.de sammelt Nährwertangaben zu Getränken und macht die Menge pro Packung lesbar.</p>
      </section>

      <section className={styles.principles}>
        {principles.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className={styles.note}>
        <div>
          <p className={styles.kicker}>Worum es geht</p>
          <h2>Weniger raten.<br />Besser vergleichen.</h2>
        </div>
        <p>Der Wert pro 100 ml macht Getränke vergleichbar. Zucker pro Packung zeigt, was in der ganzen Dose oder Flasche steckt.</p>
      </section>

      <section className={styles.methodology}>
        <div className={styles.methodologyHeader}>
          <p className={styles.kicker}>Arbeitsweise</p>
          <h2>Wie die Getränkedaten ausgewählt werden.</h2>
          <p>Die Datenbank darf umfangreich sein. Als eigene Suchseiten stellen wir aber nur ausgewählte, belegte Kernprodukte in den Vordergrund.</p>
        </div>
        <div className={styles.methodologyGrid}>
          {methodology.map(({ title, text }) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.links}>
        <Link href="/de/getraenke">Getränke ansehen <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
        <Link href="/de/faq">Fragen lesen <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
        <Link href="/de/impressum">Kontakt <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
