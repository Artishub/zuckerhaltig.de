import Link from "next/link";
import { Database } from "lucide-react";
import { HeaderSearch } from "@/components/header-search";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/de/getraenke", label: "Getränke" },
  { href: "/de/marken", label: "Alle Marken" },
  { href: "/de/kategorien", label: "Getränke nach Kategorie" },
  { href: "/de/wissen", label: "Wissenswertes" },
  { href: "/de/faq", label: "FAQ" },
];

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "de" }];
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 bg-paper/80 px-3 py-3 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-page items-center justify-between gap-3 rounded-lg bg-paper px-3">
          <Link href="/de" className="focus-ring flex shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight">
            <Database size={18} strokeWidth={1.8} />
            zuckerhaltig.de
          </Link>
          <nav className="hidden items-center gap-2 text-sm text-slate lg:flex" aria-label="Hauptnavigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded-md border border-transparent bg-mist px-3 py-1.5 hover:border-marigold hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <HeaderSearch />
            <ThemeToggle />
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-ash">
        <div className="mx-auto grid max-w-page gap-6 px-4 py-10 text-sm text-slate md:grid-cols-[1fr_auto]">
          <p>Zuckerhaltig.de ist ein unabhängiges Informationsprojekt. Angaben ohne Gewähr.</p>
          <div className="flex gap-4">
            <Link href="/de/impressum" className="hover:text-ink">Impressum</Link>
            <Link href="/de/datenschutz" className="hover:text-ink">Datenschutz</Link>
            <Link href="/de/nutzungsbedingungen" className="hover:text-ink">Nutzung</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
