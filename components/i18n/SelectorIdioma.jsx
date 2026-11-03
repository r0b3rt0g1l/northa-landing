"use client";

import { Languages } from "lucide-react";
import { cn } from "@/lib/cn";
import { otroIdioma, rutaInicio } from "@/lib/i18n/config";
import { useUi } from "./LocaleProvider";

/**
 * Enlace al mismo sitio en el otro idioma («EN» desde el español, «ES» desde
 * el inglés). Es un enlace normal, así que funciona sin JavaScript y los
 * buscadores lo siguen; con JavaScript conserva la sección en la que estás
 * (el ancla de la URL). Su nombre accesible está en el idioma al que lleva.
 * `completo` muestra el nombre del idioma («Español», «English») con un
 * ícono, para el menú móvil y el pie; sin él, solo «ES» / «EN» (barra).
 */
export function SelectorIdioma({ className, onClick, completo = false }) {
  const { locale, ui } = useUi();
  const destino = otroIdioma(locale);
  const base = rutaInicio(destino);

  return (
    <a
      href={base}
      hrefLang={destino}
      lang={destino}
      aria-label={ui.idioma.aria}
      title={ui.idioma.nombre}
      onClick={(e) => {
        // Mantiene la sección actual: «/#servicios» ↔ «/en#servicios».
        if (window.location.hash) e.currentTarget.href = `${base}${window.location.hash}`;
        onClick?.(e);
      }}
      className={cn(
        "inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line-strong px-3 font-mono text-[12.5px] font-medium tracking-[0.06em] text-text-2 transition-colors hover:border-white/25 hover:text-text",
        completo && "gap-2 px-4 font-sans text-sm tracking-normal",
        className,
      )}
    >
      {completo ? (
        <>
          <Languages className="h-4 w-4" aria-hidden="true" />
          {ui.idioma.nombre}
        </>
      ) : (
        ui.idioma.corto
      )}
    </a>
  );
}

export default SelectorIdioma;
