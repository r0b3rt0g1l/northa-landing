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
        title="De la conversación al lanzamiento"
        description="Un camino claro y acompañado, de principio a fin."
      />
      <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {proceso.map((step, i) => (
          <Reveal as="li" key={step.title} delay={(i % 4) * 0.08} className="relative">
            <span
              aria-hidden="true"
              className="text-gradient font-display text-4xl font-bold"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className="mt-4 block h-px w-full bg-gradient-to-r from-[var(--color-bright)]/40 to-transparent"
            />
            <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
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
