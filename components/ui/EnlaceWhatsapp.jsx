"use client";

import { abrirWhatsapp, enlaceWhatsapp } from "@/lib/whatsapp";
import { useUi } from "@/components/i18n/LocaleProvider";
import { usePestanaNueva } from "@/hooks/usePestanaNueva";

/**
 * Enlace que abre WhatsApp directo en el chat con Northa (ver lib/whatsapp.js).
 * Sin JavaScript sigue funcionando: es un enlace wa.me normal. En computadora,
 * el nombre accesible avisa que se abre en una pestaña nueva.
 */
export function EnlaceWhatsapp({ texto, onClick, children, ...props }) {
  const pestana = usePestanaNueva();
  const { ui } = useUi();
  texto ??= ui.whatsapp.mensaje;
  return (
    <a
      href={enlaceWhatsapp(texto)}
      data-whatsapp=""
      onClick={(e) => {
        onClick?.(e);
        abrirWhatsapp(e, texto);
      }}
      {...props}
    >
      {children}
      {pestana ? <span className="sr-only">{ui.whatsapp.pestana}</span> : null}
    </a>
  );
}

export default EnlaceWhatsapp;
