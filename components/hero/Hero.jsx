import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { HeroVideo } from "./HeroVideo";
import { site } from "@/lib/site";

/**
 * Archivos del video (generados con Higgsfield a partir de assets/hero-plates/).
 * Mientras no existan en public/hero/, el hero muestra la imagen fija nocturna.
 */
const HERO_VIDEO_SOURCES = [
  { src: "/hero/hero.webm", type: "video/webm" },
  { src: "/hero/hero.mp4", type: "video/mp4" },
];

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[var(--color-bg)]"
    >
      {/* Capa 1: imagen fija (estado de reposo y fallback) */}
      <picture>
        <source srcSet="/hero/noche.webp" type="image/webp" />
        <img
          src="/hero/noche.jpg"
          alt=""
          width={1500}
          height={600}
          fetchPriority="high"
          decoding="async"
          className="hero-media"
        />
      </picture>

      {/* Capa 2: video (día → noche), aparece con fundido cuando ya reproduce */}
      <HeroVideo sources={HERO_VIDEO_SOURCES} />

      {/* Capa 3: velo para legibilidad y fusión con el fondo */}
      <div aria-hidden="true" className="hero-veil" />

      {/* Contenido */}
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-40 sm:pb-24">
        <Reveal className="flex max-w-[720px] flex-col gap-6">
          <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.28em] text-[var(--color-glow)]">
            {site.location}
          </p>
          <h1
            id="hero-title"
            className="text-[length:var(--text-h1)] font-bold leading-[0.98] tracking-[-0.035em] text-white"
          >
            El norte de tu gobierno digital.
          </h1>
          <p className="max-w-[46ch] text-[length:var(--text-lead)] font-light leading-snug text-white/75">
            Software e inteligencia artificial para ayuntamientos. Catorce
            portales en producción.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button href="#contacto">Hablemos</Button>
            <Button href="#flota" variant="secondary">
              Ver la flota
            </Button>
          </div>
        </Reveal>

        {/* Indicador de scroll */}
        <div
          aria-hidden="true"
          className="absolute bottom-16 right-6 hidden flex-col items-center gap-3 sm:flex"
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45 [writing-mode:vertical-rl]">
            Desliza
          </span>
          <span className="block h-14 w-px overflow-hidden bg-white/10">
            <span className="hero-scroll-cue block h-full w-full bg-white/60" />
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
