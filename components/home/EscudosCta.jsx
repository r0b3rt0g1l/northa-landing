import { flota } from "@/lib/content/flota";
import { site } from "@/lib/site";

// Tres de ejemplo, no los catorce — la dirección C es minimalista.
const EJEMPLO_SLUGS = ["sahuaripa", "rayon", "sanjavier"];
const ejemplos = EJEMPLO_SLUGS.map((slug) => flota.find((m) => m.slug === slug)).filter(
  Boolean,
);

/**
 * Escudos + CTA: tres municipios de muestra (misma fuente que la flota
 * completa, lib/content/flota.js) y el enlace que abre WhatsApp. Estructura
 * y valores exactos de la dirección C.
 */
export function EscudosCta() {
  return (
    <div className="flex flex-wrap items-center gap-6 px-6 py-8 sm:flex-nowrap sm:gap-[26px] sm:px-[60px] sm:py-[42px]">
      <div className="flex gap-[12px]">
        {ejemplos.map((m) => (
          <span
            key={m.slug}
            className="grid h-[78px] w-[78px] place-items-center rounded-[10px] bg-[#F7F7F4] p-[10px]"
          >
            <img
              src={`/escudos/${m.slug}.png`}
              alt={`Escudo de ${m.nombre}`}
              loading="lazy"
              decoding="async"
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
          </span>
        ))}
      </div>
      <span className="text-[15px] font-light text-[#7A7A88]">
        Sahuaripa, Rayón y San Javier, entre otros once.
      </span>
      <a
        href={site.contact.whatsappHref}
        target="_blank"
        rel="noopener"
        className="ml-auto rounded-full bg-[linear-gradient(96deg,var(--color-primary),#FF5A99)] px-[26px] py-[13px] text-[14.5px] font-medium text-white"
      >
        Hablemos de tu municipio
      </a>
    </div>
  );
}

export default EscudosCta;
