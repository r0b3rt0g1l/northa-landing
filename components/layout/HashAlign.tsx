"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Alinea el destino de un ancla (/#contacto, #planes…) cuando las secciones ya
 * tienen su altura real.
 *
 * Las secciones de abajo usan `content-visibility: auto` (ver deferRender): hasta
 * que se acercan a la pantalla miden una altura estimada. Al saltar a un ancla, el
 * navegador calcula la posición con esas estimaciones; cuando las secciones
 * cercanas se pintan, el destino puede quedar corrido. Esto lo corrige sin
 * animación (hasta tres intentos) al cargar, al cambiar de página y en `hashchange`.
 */
export function HashAlign() {
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    let timer: number | undefined;

    const target = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      return id ? document.getElementById(id) : null;
    };

    const align = (tries = 3) => {
      const el = target();
      if (!el) return;
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          const root = getComputedStyle(document.documentElement);
          const expected = (parseFloat(root.scrollPaddingTop) || 0) + (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
          const off = el.getBoundingClientRect().top - expected;
          // Si la página ya no puede bajar más (ancla cerca del final), no hay nada que corregir.
          const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
          if (Math.abs(off) > 4 && !(off > 0 && atBottom)) {
            el.scrollIntoView({ block: "start", behavior: "instant" });
            if (tries > 1) align(tries - 1);
          }
        });
      });
    };

    // Con scroll suave, espera a que termine antes de revisar ("scrollend", o un
    // tiempo fijo en navegadores que no lo tienen).
    const hasScrollEnd = Reflect.has(window, "onscrollend");
    const onHashChange = () => {
      window.clearTimeout(timer);
      if (hasScrollEnd) window.addEventListener("scrollend", () => align(), { once: true });
      timer = window.setTimeout(() => align(), hasScrollEnd ? 1200 : 800);
    };

    // Los <Link> de Next a un ancla de la misma página cambian la URL con
    // pushState (sin "hashchange"): se detectan por el clic.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.hash && url.pathname === window.location.pathname) onHashChange();
    };

    align();
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  return null;
}
