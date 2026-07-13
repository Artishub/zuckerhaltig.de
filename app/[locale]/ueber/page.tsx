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

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Über das Projekt</p>
        <h1>Zuckerwerte. Klar belegt.</h1>
        <p>Zuckerhaltig.de sammelt Nährwertangaben zu Getränken und macht die Menge pro Packung lesbar.</p>
      </section>

      <section className={styles.principles}>
        {principles.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
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

      <section className={styles.links}>
        <Link href="/de/getraenke">Getränke ansehen <ArrowRight size={17} /></Link>
        <Link href="/de/faq">Fragen lesen <ArrowRight size={17} /></Link>
        <Link href="/de/impressum">Kontakt <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}
