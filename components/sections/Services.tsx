import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { serviceGroups, services } from "@/content/services";
import { serviceIcons } from "@/components/ui/Icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Los servicios en una sola vista, sin tarjetas: tres columnas (web, IA,
 * operación) con el nombre y un ícono. Cada renglón lleva a su página breve.
 */
export function Services({
  locale,
  headingLevel = "h2",
  showHeading = true,
  reveal = true,
  className,
}: {
  locale: Locale;
  headingLevel?: "h1" | "h2";
  showHeading?: boolean;
  /** Animación al aparecer (en /servicios la lista es el contenido principal: sin animación). */
  reveal?: boolean;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const s = dict.sections.services;
  const Heading = headingLevel;
  // Sin el título de la sección, los grupos son el siguiente nivel después del h1.
  const GroupHeading = showHeading ? "h3" : "h2";
  const List = reveal ? RevealGroup : PlainList;
  const Item = reveal ? RevealItem : PlainItem;
  return (
    <section id="servicios" aria-labelledby={showHeading ? "servicios-title" : undefined} className={cn("relative py-16 md:py-20", className)}>
      <div className="container-x">
        {showHeading && (
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4">{s.eyebrow}</p>
              <Heading id="servicios-title" className="text-[length:var(--text-h2)] text-ink">
                {s.title}
              </Heading>
            </div>
            <p className="max-w-sm text-dim md:text-right">{s.lead}</p>
          </Reveal>
        )}

        <div className={cn("grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3", showHeading && "mt-12")}>
          {serviceGroups.map((group) => (
            <div key={group.key} className="min-w-0">
              <GroupHeading className="border-b border-line-2 pb-3 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-dim">
                {group.name[locale]}
              </GroupHeading>
              <List as="ul">
                {services
                  .filter((sv) => sv.group === group.key)
                  .map((sv) => {
                    const Icon = serviceIcons[sv.icon];
                    return (
                      <Item as="li" key={sv.slug}>
                        <Link
                          href={href(locale, `/servicios/${sv.slug}`)}
                          className="group flex items-center gap-4 border-b border-line py-3.5 transition-colors hover:border-accent-line"
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-ink transition-[background-color,color,transform] duration-300 group-hover:scale-105 group-hover:bg-accent-strong group-hover:text-accent-contrast">
                            <Icon className="size-[1.15rem]" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-[1.15rem] font-semibold tracking-[-0.01em] text-ink">
                              {sv.name[locale]}
                            </span>
                            <span className="mt-0.5 block text-sm leading-snug text-faint">{sv.short[locale]}</span>
                          </span>
                          <ArrowUpRight
                            className="size-4 shrink-0 text-faint transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink"
                            aria-hidden
                          />
                        </Link>
                      </Item>
                    );
                  })}
              </List>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlainList({ children }: { as: "ul"; children: React.ReactNode }) {
  return <ul>{children}</ul>;
}

function PlainItem({ children }: { as: "li"; children: React.ReactNode }) {
  return <li>{children}</li>;
}
