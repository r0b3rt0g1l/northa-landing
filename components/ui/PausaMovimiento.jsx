"use client";

import { useEffect } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { fijarMovimientoPausado, restaurarMovimiento } from "@/lib/movimiento";
import { useMovimientoPausado } from "@/hooks/useMovimientoPausado";

/**
 * Pausa o reanuda las animaciones continuas del sitio: el cielo, la señal del
 * hero y el banner de servicios (WCAG 2.2.2). Discreto, en el pie de página;
 * la elección se recuerda en este navegador.
 */
export function PausaMovimiento({ className }) {
  const pausado = useMovimientoPausado();

  useEffect(() => {
    restaurarMovimiento();
  }, []);

  const Icono = pausado ? Play : Pause;
  return (
    <button
      type="button"
      onClick={() => fijarMovimientoPausado(!pausado)}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-[13px] text-faint transition-colors hover:text-text",
        className,
      )}
    >
      <Icono className="h-3.5 w-3.5" aria-hidden="true" />
      {pausado ? "Reanudar animaciones" : "Pausar animaciones"}
    </button>
  );
}

export default PausaMovimiento;
