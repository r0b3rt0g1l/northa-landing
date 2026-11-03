"use client";

import { Button } from "./Button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { abrirWhatsapp, enlaceWhatsapp } from "@/lib/whatsapp";
import { useUi } from "@/components/i18n/LocaleProvider";
import { usePestanaNueva } from "@/hooks/usePestanaNueva";

/**
 * Llamado a la acción con el ícono de WhatsApp: abre el chat con Northa
 * directamente (app en celular, WhatsApp Web en computadora) con un mensaje
 * listo que el visitante revisa y envía. Sin JavaScript es un enlace wa.me.
 * En computadora, el nombre accesible avisa que se abre en una pestaña nueva.
 */
export function BotonWhatsapp({ texto, children, className, onAbrir, ...props }) {
  const pestana = usePestanaNueva();
  const { ui } = useUi();
  texto ??= ui.whatsapp.mensaje;
  children ??= ui.whatsapp.boton;
  return (
    <Button
      href={enlaceWhatsapp(texto)}
      data-whatsapp=""
      className={className}
      onClick={(e) => {
        onAbrir?.();
        abrirWhatsapp(e, texto);
      }}
      {...props}
    >
      <span className="-ml-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_3px_rgba(37,211,102,0.18)]">
        <WhatsAppIcon className="h-4 w-4" />
      </span>
      {children}
      {/* El ícono es decorativo: el nombre del botón dice a dónde lleva. */}
      {typeof children === "string" && /whatsapp/i.test(children) ? null : <span className="sr-only">{ui.whatsapp.porWhatsapp}</span>}
      {pestana ? <span className="sr-only">{ui.whatsapp.pestana}</span> : null}
    </Button>
  );
}

export default BotonWhatsapp;
