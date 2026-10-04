import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Content section for Tailwind-based pages, matching .section/.sectionHead in ui.module.css.
export function Section({ id, title, lead, action, children, className = "" }: {
  id?: string;
  title?: string;
  lead?: React.ReactNode;
  action?: { href: string; label: string };
  children?: React.ReactNode;
  className?: string;
}) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={`mx-auto max-w-page px-5 pt-14 md:pt-20 ${className}`} aria-labelledby={title ? titleId : undefined}>
      {(title || action) && (
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          {title && <h2 id={titleId} className="text-[clamp(1.6rem,3vw,2.2rem)] font-[750] leading-[1.08] tracking-[-0.03em]">{title}</h2>}
          {action && (
            <Link href={action.href} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-hair px-4 py-2 text-sm font-bold transition hover:border-ink">
              {action.label} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
      {lead && <p className="-mt-2 mb-6 max-w-2xl leading-7 text-slate">{lead}</p>}
      {children}
    </section>
  );
}

export const cardClass = "rounded-lg border border-hair bg-mist shadow-card";
export const textLinkClass = "font-semibold underline decoration-smoke underline-offset-4 hover:decoration-ink";
