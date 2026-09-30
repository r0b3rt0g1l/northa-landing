"use client";

import { useRef } from "react";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Agrega `data-in-view="true"` cuando el bloque entra en pantalla (una sola vez). Útil para animaciones CSS. */
export function InView({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, rootMargin: "0px 0px -15% 0px" });
  return (
    <div ref={ref} className={cn(className)} data-in-view={inView ? "true" : "false"}>
      {children}
    </div>
  );
}
