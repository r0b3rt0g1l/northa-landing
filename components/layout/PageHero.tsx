import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href, absoluteUrl } from "@/lib/i18n/href";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Encabezado de páginas internas: migas, H1, entradilla y acciones. */
export function PageHero({
  locale,
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
  className,
}: {
  locale: Locale;
  /** Sin incluir "Inicio": se agrega solo. `path` interno. */
  crumbs: { name: string; path: string }[];
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const all = [{ name: dict.breadcrumbs.home, path: "/" }, ...crumbs];
  return (
    <section className={cn("relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44", className)}>
      <JsonLd data={breadcrumbJsonLd(all.map((c) => ({ name: c.name, url: absoluteUrl(site.url, locale, c.path) })))} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-24 size-[56rem] bg-accent opacity-20 light:opacity-10 [mask:url(/brand/contours.svg)_center/contain_no-repeat]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 size-[40rem] bg-[radial-gradient(closest-side,var(--color-accent),transparent)] opacity-[0.09]"
      />
      <div className="container-x relative">
        <nav aria-label={dict.a11y.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-faint">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
                {i < all.length - 1 ? (
                  <Link href={href(locale, c.path)} className="hover:text-ink">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-dim">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={cn("mt-10 grid gap-12", aside && "lg:grid-cols-[1.2fr_0.8fr] lg:items-end")}>
          <Reveal>
            {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
            <h1 className="max-w-4xl text-[length:var(--text-h1)] text-ink">{title}</h1>
            {lead && <p className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-dim">{lead}</p>}
            {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
          </Reveal>
          {aside && <Reveal delay={0.1}>{aside}</Reveal>}
        </div>
      </div>
    </section>
  );
}
