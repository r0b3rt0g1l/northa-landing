"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { AskNortButton } from "@/components/chat/AskNortButton";
import { CerroMark } from "@/components/brand/CerroMark";
import { StarGlyph } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export type PortfolioCategory = "gobierno" | "empresas" | "producto";

/** Proyecto ya traducido y con rutas resueltas (serializable desde el servidor). */
export interface PortfolioCard {
  id: string;
  category: PortfolioCategory;
  title: string;
  summary: string;
  tags: string[];
  url?: string;
  href?: string;
  action?: "open-chat";
  screenshot?: string;
  logo?: string;
}

export interface PortfolioLabels {
  filterLabel: string;
  all: string;
  categories: Record<PortfolioCategory, string>;
  count: string;
  countOne: string;
  live: string;
  open: string;
  screenshotAlt: string;
  tagsLabel: string;
  newTab: string;
  tryNort: string;
}

/**
 * Grid filtrable del portafolio. Los filtros son botones con `aria-pressed` y el
 * número de proyectos se anuncia con aria-live. Una categoría sin proyectos no se muestra.
 */
export function PortfolioGrid({ items, labels }: { items: PortfolioCard[]; labels: PortfolioLabels }) {
  const [filter, setFilter] = useState<PortfolioCategory | "all">("all");
  const categories = useMemo(
    () => (["gobierno", "producto", "empresas"] as const).filter((c) => items.some((i) => i.category === c)),
    [items],
  );
  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);
  const countText = visible.length === 1 ? labels.countOne : labels.count.replace("{n}", String(visible.length));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2">
          {(["all", ...categories] as const).map((c) => {
            const active = filter === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(c)}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line-2 text-dim hover:border-accent-line hover:text-ink",
                )}
              >
                {c === "all" ? labels.all : labels.categories[c]}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
          {countText}
        </p>
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.id}>
            <ProjectCard item={item} labels={labels} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ item, labels }: { item: PortfolioCard; labels: PortfolioLabels }) {
  const host = item.url ? new URL(item.url).host.replace(/^www\./, "") : null;
  const linkClass =
    "group/cta inline-flex h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft";

  let cta: React.ReactNode = null;
  if (item.url) {
    cta = (
      <TrackedLink
        href={item.url}
        event="portfolio_click"
        eventProps={{ project: item.id }}
        newTabLabel={labels.newTab}
        className={linkClass}
      >
        {labels.live}
        <ArrowUpRight className="size-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" aria-hidden />
      </TrackedLink>
    );
  } else if (item.action === "open-chat") {
    cta = <AskNortButton label={labels.tryNort} className={linkClass} />;
  } else if (item.href) {
    cta = (
      <Link href={item.href} className={linkClass}>
        {labels.open}
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface/70 transition-colors duration-300 hover:border-accent-line focus-within:border-accent-line">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg-2">
        {item.screenshot ? (
          <>
            <picture>
              <source type="image/avif" srcSet={`${item.screenshot}.avif`} />
              <img
                src={`${item.screenshot}.webp`}
                alt={labels.screenshotAlt.replace("{name}", item.title)}
                width={800}
                height={1500}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover object-top transition-[object-position] duration-[5s] ease-in-out group-hover:object-bottom group-focus-within:object-bottom motion-reduce:transition-none"
              />
            </picture>
            {item.logo && (
              <span className="absolute bottom-3 left-3 grid size-14 place-items-center rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element -- escudo decorativo junto al nombre */}
                <img src={item.logo} alt="" width={48} height={48} loading="lazy" className="size-full object-contain" />
              </span>
            )}
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(90%_90%_at_50%_0%,var(--navy-2),var(--bg-2)_70%)]">
            {item.id === "nort" ? (
              <span className="grid size-24 place-items-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#2a3d72,#0a1124)] shadow-[0_0_60px_-10px_var(--accent)]">
                <StarGlyph className="size-11 text-white" />
              </span>
            ) : (
              <CerroMark id={`pf-${item.id}`} size={112} />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">{labels.categories[item.category]}</p>
        <h3 className="mt-3 text-xl text-ink">{item.title}</h3>
        {host && <p className="mt-1 font-mono text-xs text-faint">{host}</p>}
        <p className="mt-3 text-[0.95rem] text-dim">{item.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={labels.tagsLabel}>
          {item.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-dim">
              {t}
            </li>
          ))}
        </ul>
        {cta && <div className="mt-auto pt-6">{cta}</div>}
      </div>
      {item.action === "open-chat" && <Sparkles className="absolute right-5 top-5 size-4 text-northa-2" aria-hidden />}
    </article>
  );
}
