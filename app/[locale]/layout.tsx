import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderNav, type HeaderNavItem } from "@/components/header-nav";
import { HeaderSearch } from "@/components/header-search";
import { MobileNav } from "@/components/mobile-nav";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const nav: HeaderNavItem[] = [
  { href: "/de/getraenke", label: "Getränke" },
  { href: "/de/kategorien", label: "Kategorien" },
  { href: "/de/marken", label: "Marken" },
  { href: "/de/getraenke/vergleich", label: "Vergleichen" },
  { href: "/de/wissen", label: "Wissen" },
];

const footerColumns = [
  {
    title: "Getränke",
    links: [
      { href: "/de/getraenke", label: "Alle Getränke" },
      { href: "/de/kategorien", label: "Kategorien" },
      { href: "/de/marken", label: "Marken" },
      { href: "/de/getraenke/vergleich", label: "Vergleichen" },
      { href: "/de/zuckerrechner", label: "Zuckerrechner" },
    ],
  },
  {
    title: "Themen",
    links: [
      { href: "/de/wissen/cola-zucker-pro-100ml", label: "Zucker in Cola" },
      { href: "/de/wissen/energy-drinks-zucker-vergleichen", label: "Zucker in Energy Drinks" },
      { href: "/de/wissen/eistee-zucker-im-alltag", label: "Zucker in Eistee" },
      { href: "/de/rankings/zuckerreichste-getraenke", label: "Zuckerreichste Getränke" },
      { href: "/de/rankings/kalorien-getraenke", label: "Kalorien in Getränken" },
    ],
  },
  {
    title: "Projekt",
    links: [
      { href: "/de/ueber", label: "Über & Methodik" },
      { href: "/de/faq", label: "FAQ" },
      { href: "/de/impressum", label: "Impressum" },
      { href: "/de/datenschutz", label: "Datenschutz" },
      { href: "/de/nutzungsbedingungen", label: "Nutzungsbedingungen" },
    ],
  },
];

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ locale: "de" }];
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "de") notFound();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-hair/70 bg-paper/85 px-3 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-3">
          <Link href="/de" className="focus-ring flex shrink-0 rounded-md" aria-label="Zuckerhaltig.de Startseite">
            <SiteLogo />
          </Link>
          <HeaderNav items={nav} />
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <HeaderSearch />
            <ThemeToggle />
            <MobileNav items={nav} />
          </div>
        </div>
      </header>
      {children}
      <footer className="mt-8 border-t border-hair bg-mist">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 text-sm md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 max-w-xs md:col-span-1">
            <SiteLogo />
            <p className="mt-4 leading-6 text-slate">Zucker in Getränken pro 100 ml und pro Packung. Jeder Wert mit Quelle und Prüfdatum.</p>
          </div>
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-semibold">{column.title}</p>
              <ul className="mt-3 grid gap-2 text-slate">
                {column.links.map((link) => (
                  <li key={link.href}><Link href={link.href} className="hover:text-ink">{link.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-hair">
          <p className="mx-auto max-w-[1180px] px-5 py-5 text-xs text-slate">Unabhängiges Informationsprojekt. Angaben ohne Gewähr, maßgeblich ist das Etikett.</p>
        </div>
      </footer>
    </div>
  );
}
