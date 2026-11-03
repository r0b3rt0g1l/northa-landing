"use client";

import { Button } from "./Button";
import { abrirAsistente } from "@/lib/acciones";
import { useUi } from "@/components/i18n/LocaleProvider";

/** Botón que abre el asistente del sitio; con `servicio`, ya en la consulta de ese servicio. */
export function BotonAsistente({ children, servicio, variant = "secondary", ...props }) {
  const { ui } = useUi();
  return (
    <Button variant={variant} onClick={() => abrirAsistente(servicio ? { modo: "consulta", servicio } : undefined)} aria-haspopup="dialog" {...props}>
      {children ?? ui.botonAsistente}
    </Button>
  );
}

export default BotonAsistente;
