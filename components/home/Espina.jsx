import { Reveal } from "@/components/ui/Reveal";

// Contenido único de esta página — no se reutiliza en ningún otro lado,
// por eso vive inline y no en lib/content/.
const PASOS = [
  {
    eyebrow: "01 · AMPLÍA",
    color: "var(--color-amplia)",
    titulo: "Se pone la casa en orden",
    texto:
      "Entrega-recepción, Plan Municipal de Desarrollo, normatividad al día y atención a los entes fiscalizadores. Lo que un ayuntamiento debe tener antes de poder enseñarlo.",
  },
  {
    eyebrow: "02 · LAS DOS",
    color: "#8E8EA8",
    titulo: "Se documenta con fuente",
    texto:
      "Cada dato que llega al portal viene del ayuntamiento y queda con su origen anotado. Escudo, cabildo, cronología, contacto. Lo que no tiene fuente no se publica.",
  },
  {
    eyebrow: "03 · NORTHA",
    color: "var(--color-glow)",
    titulo: "Se abre al ciudadano",
    texto:
      "Portal en dominio propio, con un panel que el personal del municipio opera solo. A partir de ahí el ayuntamiento publica sin pedirle permiso a nadie.",
  },
];

/**
 * La espina: barra vertical con degradado teal→pizarra→rosa y los 3 pasos del
 * recorrido conjunto. Estructura y valores exactos de la dirección C.
 */
export function Espina() {
  return (
    <div className="grid grid-cols-[3px_1fr] gap-6 px-6 pb-8 sm:gap-[40px] sm:px-[60px] sm:pb-[40px]">
      <div
        aria-hidden="true"
        className="rounded-[2px] bg-[linear-gradient(180deg,var(--color-amplia)_0%,#6E7C9E_48%,var(--color-primary)_100%)]"
      />

      <div className="flex flex-col gap-[46px]">
        {PASOS.map((paso) => (
          <Reveal key={paso.eyebrow} className="flex flex-col gap-[12px]">
            <div className="flex items-baseline gap-[16px]">
              <span
                className="font-mono text-[12px] tracking-[0.12em]"
                style={{ color: paso.color }}
              >
                {paso.eyebrow}
              </span>
              <span aria-hidden="true" className="h-px flex-grow bg-[#1E1E26]" />
            </div>
            <h2 className="text-[34px] font-bold leading-[1.1] tracking-[-0.03em]">
              {paso.titulo}
            </h2>
            <p className="max-w-[60ch] text-[16.5px] font-light leading-[1.58] text-[#9A9AA6]">
              {paso.texto}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default Espina;
