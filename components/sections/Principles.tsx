import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { principles } from "@/content/principles";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Principles({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pr = dict.sections.principles;
  return (
    <Section id="como-trabajamos" labelledBy="principles-title" className="bg-bg-2" defer={[2130, 1430]}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-line-2 opacity-25 [mask:url(/brand/contours.svg)_right_-20rem_center/70rem_no-repeat]"
      />
      <div className="container-x relative">
        <SectionHeading
          id="principles-title"
          eyebrow={pr.eyebrow}
          title={pr.title}
          lead={pr.lead}
        />
        {/* Misión y visión */}
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {[
            { label: pr.missionLabel, text: pr.mission },
            { label: pr.visionLabel, text: pr.vision },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08} className="rounded-[1.75rem] border border-line bg-surface/60 p-7 md:p-9">
              <p className="eyebrow">{item.label}</p>
              <p className="mt-4 font-display text-[clamp(1.35rem,1.1rem+0.9vw,1.9rem)] font-semibold leading-snug tracking-[-0.02em] text-ink">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>

        <h3 className="eyebrow mt-14">{pr.valuesLabel}</h3>
        <RevealGroup as="ol" className="mt-5 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line md:grid-cols-2">
          {principles.map((p, i) => (
            <RevealItem as="li" key={i} className="bg-bg-2 p-8 md:p-10">
              {/* Número decorativo (solo contorno). Va como contenido CSS para que las
                  auditorías de contraste no lo confundan con texto: el relleno es
                  transparente y el contorno rosa sí contrasta. */}
              <span
                aria-hidden
                data-n={String(i + 1).padStart(2, "0")}
                className="block font-display text-6xl font-extrabold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.2px_var(--accent)] before:content-[attr(data-n)]"
              />
              <h4 className="mt-6 text-[length:var(--text-h3)] text-ink">{p.title[locale]}</h4>
              <p className="mt-3 text-dim">{p.body[locale]}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
