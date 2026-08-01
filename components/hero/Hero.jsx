import { ArrowRight, MonitorPlay } from "lucide-react";
import { Starfield } from "./Starfield";
import { HeroStar } from "./HeroStar";
import { Button } from "@/components/ui/Button";
import { GlowBadge } from "@/components/ui/GlowBadge";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-6 pb-24 pt-28"
    >
      {/* Capa de aurora estática (pintura instantánea, base del canvas) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_50%_at_78%_12%,rgba(255,46,126,0.16),transparent_60%),radial-gradient(45%_40%_at_12%_92%,rgba(255,122,179,0.10),transparent_60%)]"
      />
      <Starfield className="absolute inset-0 -z-10 h-full w-full" />
      {/* Viñeta inferior que funde con el fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[var(--color-bg)]"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          <HeroStar className="mb-9 h-24 w-24 sm:h-28 sm:w-28" />
        </Reveal>

        <Reveal delay={0.05}>
          <GlowBadge>Gobierno municipal de Sonora</GlowBadge>
        </Reveal>

        <Reveal delay={0.1} as="h1">
          <span
            id="hero-title"
            className="mt-6 block text-[length:var(--text-h1)] font-semibold"
          >
            Portales municipales de última generación, con{" "}
            <span className="text-gradient">inteligencia artificial</span>.
          </span>
        </Reveal>

        <Reveal delay={0.16} as="p">
          <span className="mt-6 block max-w-2xl text-[length:var(--text-lead)] text-[var(--color-muted)]">
            Diseñamos y construimos sitios institucionales rápidos, seguros y
            accesibles para el gobierno municipal de Sonora —y los llevamos más
            allá con servicios de IA al servicio del ciudadano.
          </span>
        </Reveal>

        <Reveal
          delay={0.22}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button href="#contacto">
            Solicitar propuesta
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button href="#casos" variant="secondary">
            <MonitorPlay className="h-4 w-4" aria-hidden="true" />
            Ver demo en vivo
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;
