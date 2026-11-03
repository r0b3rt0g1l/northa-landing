"use client";

import { Button } from "./Button";
import { abrirAsistente } from "@/lib/acciones";
import { useUi } from "@/components/i18n/LocaleProvider";

/** Botón que abre el asistente del sitio. */
export function BotonAsistente({ children, variant = "secondary", ...props }) {
  const { ui } = useUi();
  return (
    <Button variant={variant} onClick={() => abrirAsistente()} aria-haspopup="dialog" {...props}>
      {children ?? ui.botonAsistente}
    </Button>
  );
}

export default BotonAsistente;
