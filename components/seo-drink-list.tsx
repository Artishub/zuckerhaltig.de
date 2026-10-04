import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brandName, drinkHref, formatNumber, sizeLabel } from "@/lib/seo-drinks";
import { totalSugarGrams, type Drink } from "@/lib/data/drinks";

export function DrinkRows({ drinks }: { drinks: Drink[] }) {
  return (
    <ul className="divide-y divide-hair rounded-lg border border-hair bg-mist px-5 shadow-card">
      {drinks.map((drink) => {
        const total = totalSugarGrams(drink);
        return (
          <li key={drink.id}>
            <Link href={drinkHref(drink)} className="group flex items-center justify-between gap-4 py-3.5">
              <span className="min-w-0">
                <span className="block font-semibold group-hover:underline">{drink.name}</span>
                <span className="block text-xs text-slate">{brandName(drink)} · {sizeLabel(drink)}</span>
              </span>
              <span className="shrink-0 text-right text-sm tabular-nums">
                <span className="block font-semibold">{formatNumber(drink.sugarPer100Ml)} g / 100 ml</span>
                {total !== null && <span className="block text-xs text-slate">{formatNumber(total)} g pro Packung</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PageHero({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-page px-5 pb-6 pt-12 md:pt-16">
      {children}
      <h1 className="max-w-4xl text-[clamp(2.4rem,5vw,3.8rem)] font-[750] leading-[1.02] tracking-[-0.04em] [text-wrap:balance]">{title}</h1>
      {text && <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">{text}</p>}
    </section>
  );
}

export function LinkCard({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="group flex flex-col rounded-lg border border-hair bg-mist p-5 shadow-card transition hover:-translate-y-0.5 hover:border-ink">
      <span className="font-semibold">{title}</span>
      <span className="mt-1.5 text-sm leading-6 text-slate">{text}</span>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
        Ansehen <ArrowRight size={15} aria-hidden="true" />
      </span>
    </Link>
  );
}
