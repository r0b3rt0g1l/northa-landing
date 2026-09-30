"use client";

import { Children, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Filtro por tema del índice del blog. Las tarjetas llegan ya renderizadas desde
 * el servidor (children, en el mismo orden que `itemTags`); aquí solo se filtran.
 */
export function BlogFilter({
  tags,
  itemTags,
  labels,
  children,
}: {
  tags: string[];
  itemTags: string[][];
  labels: { filter: string; all: string; count: string; countOne: string };
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const cards = Children.toArray(children);
  const visible = cards.filter((_, i) => !active || itemTags[i]?.includes(active));
  const countText = visible.length === 1 ? labels.countOne : labels.count.replace("{n}", String(visible.length));

  return (
    <>
      {tags.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
            {[null, ...tags].map((tag) => {
              const on = active === tag;
              return (
                <button
                  key={tag ?? "all"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(tag)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    on ? "border-accent bg-accent-soft text-ink" : "border-line-2 text-dim hover:border-accent-line hover:text-ink",
                  )}
                >
                  {tag ?? labels.all}
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
            {countText}
          </p>
        </div>
      )}
      <ul className="grid gap-4 md:grid-cols-2">{visible}</ul>
    </>
  );
}
