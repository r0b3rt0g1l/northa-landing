import { ExternalLink, Landmark } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

const features = ["Gobierno", "Transparencia", "Turismo", "Noticias", "Contacto"];

/**
 * Vista previa estilizada del portal en vivo de San Javier.
 * Para usar una captura real, coloca la imagen en /public/showcase/sanjavier.webp
 * y reemplaza este marco por <Image .../> con next/image.
 */
function PortalPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
      {/* Chrome del navegador */}
      <div className="flex items-center gap-2 border-b border-[var(--color-line)] bg-[var(--color-bg)]/60 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
        </span>
        <span className="ml-2 truncate rounded-md bg-white/5 px-3 py-1 text-xs text-[var(--color-muted)]">
          sanjavier-gobierno.vercel.app
        </span>
      </div>
      {/* Lienzo con la identidad institucional real del portal (guinda) */}
      <div className="relative aspect-[16/10] bg-[linear-gradient(135deg,#6B1629_0%,#4A0E1C_100%)] p-7 text-[#F5F0E1]">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            En vivo
          </span>
        </div>
        <p className="mt-6 max-w-sm font-serif text-2xl font-bold leading-tight">
          H. Ayuntamiento de San Javier, Sonora
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {features.map((f) => (
            <span
              key={f}
              className="rounded-full bg-white/10 px-3 py-1 text-xs"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <Section id="casos" labelledBy="casos-title">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Casos"
            titleId="casos-title"
            title="Un portal Northa, en vivo"
            description="San Javier ya cuenta con un portal institucional construido por Northa: rápido, accesible y listo para servir al ciudadano. Compruébalo tú mismo."
          />
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
            <Button
              href={site.demo.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver portal en vivo
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <PortalPreview />
        </Reveal>
      </div>
    </Section>
  );
}

export default Showcase;
