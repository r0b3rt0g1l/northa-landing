"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Contenedor que, solo cuando su contenido se desplaza de lado, se vuelve una
 * región enfocable con nombre (para recorrerla con las flechas del teclado).
 * Si todo cabe, no añade una parada de tabulación vacía.
 */
export function DesplazableAccesible({ etiqueta, className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const desplaza = el.scrollWidth > el.clientWidth + 1;
      if (desplaza) {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "region");
        el.setAttribute("aria-label", etiqueta);
      } else {
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
      }
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [etiqueta]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

export default DesplazableAccesible;
