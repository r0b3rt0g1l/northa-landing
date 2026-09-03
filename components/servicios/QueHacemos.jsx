import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { queHacemos } from "@/lib/content/queHacemos";

/**
 * Qué hacemos — lista de seis renglones separados por hairlines. Sin tarjetas,
 * sin tilt: el lujo aquí es el espacio y la tipografía.
 */
export function QueHacemos() {
  return (
    <Section id="servicios" labelledBy="servicios-title">
      <SectionHeader
        eyebrow="Qué hacemos"
        titleId="servicios-title"
        title="Software que se queda en producción."
      />
      <ul className="mt-14 border-t border-[var(--color-line)]">
        {queHacemos.map((item, i) => (
          <Reveal
            as="li"
            key={item.title}
            delay={(i % 6) * 0.04}
            className="group grid gap-3 border-b border-[var(--color-line)] py-6 sm:grid-cols-[3rem_1fr_1fr] sm:items-baseline sm:gap-8 sm:py-7"
          >
            <span className="flex items-center gap-4 sm:contents">
              <span className="font-mono text-xs text-[var(--color-muted)] sm:self-center">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="flex items-center gap-3 text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                <item.Icon
                  className="hidden h-5 w-5 shrink-0 text-[var(--color-bright)] transition-transform duration-300 group-hover:-translate-y-0.5 sm:block"
                  aria-hidden="true"
                />
                {item.title}
              </h3>
            </span>
            <p className="text-[var(--color-muted)] sm:pl-0">{item.description}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export default QueHacemos;
