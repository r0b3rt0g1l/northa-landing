import { Check } from "lucide-react";
import { getServicios } from "@/lib/content/servicios";
import { getUi } from "@/lib/i18n/ui";
import { BotonAsistente } from "@/components/ui/BotonAsistente";

/**
 * Chatbots inteligentes: el servicio con bloque propio dentro de «Lo que
 * construimos». A la izquierda, qué es y un botón que abre el asistente ya
 * en ese servicio; a la derecha, cómo funciona y sus beneficios. Usa el mismo
 * vidrio, íconos y tipografía que el resto de la sección.
 */
export function Chatbots({ locale }) {
  const chatbots = getServicios(locale).find((s) => s.id === "chatbots");
  if (!chatbots) return null;
  const ui = getUi(locale).servicios.chatbots;

  return (
    <article
      id="chatbots"
      aria-labelledby="chatbots-title"
      className="glass grid gap-8 rounded-[32px] p-6 sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-12"
    >
      <div className="flex min-w-0 flex-col gap-6">
        <span className="beneficio-icono" aria-hidden="true">
          <chatbots.Icon className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <div className="flex flex-col gap-3">
          <p className="eyebrow m-0">{ui.eyebrow}</p>
          <h3 id="chatbots-title" className="text-[clamp(1.6rem,1.4vw+1.1rem,2.3rem)] tracking-[-0.03em]">
            {chatbots.title}
          </h3>
          <p className="m-0 max-w-[56ch] text-[16px] leading-relaxed text-text-2">{chatbots.detalle}</p>
        </div>
        <div>
          <BotonAsistente servicio="chatbots">{ui.consultar}</BotonAsistente>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="glass glass-interior rounded-[22px] p-5">
          <h4 className="text-[15.5px] font-semibold tracking-[-0.01em] text-text">{ui.como}</h4>
          <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-muted">{chatbots.como}</p>
        </div>
        <div className="glass glass-interior rounded-[22px] p-5">
          <h4 className="text-[15.5px] font-semibold tracking-[-0.01em] text-text">{ui.beneficios}</h4>
          <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-x-5 gap-y-2.5 p-0 sm:grid-cols-2">
            {chatbots.beneficios.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[14px] leading-snug text-text-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" strokeWidth={2} aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default Chatbots;
