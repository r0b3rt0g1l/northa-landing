"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Tarjeta con reflector que sigue al cursor (clase `spotlight` en globals.css).
 * Solo actualiza dos variables CSS: sin re-renders de React.
 */
export function SpotlightCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag
      ref={ref as React.Ref<never>}
      onPointerMove={onMove}
      className={cn("spotlight rounded-3xl border border-line bg-surface/70", className)}
    >
      {children}
    </Tag>
  );
}
