import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { proceso } from "@/lib/content/proceso";

export function Proceso() {
  return (
    <Section id="proceso" labelledBy="proceso-title">
      <SectionHeader
        eyebrow="Cómo trabajamos"
        titleId="proceso-title"
        title="De la conversación al lanzamiento."
      />
      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {proceso.map((step, i) => (
          <Reveal as="li" key={step.title} delay={(i % 4) * 0.08}>
            <span
              aria-hidden="true"
              className="font-mono text-xs text-[var(--color-bright)]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="hairline mt-4 block" />
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {step.description}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

export default Proceso;
