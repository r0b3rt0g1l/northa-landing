import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { HeroVideo } from "./HeroVideo";

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
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)]"
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
      <div aria-hidden="true" className="hero-veil hero-veil--center" />

      {/* Contenido centrado: un titular, un botón. Nada más. */}
      <Reveal className="relative flex w-full max-w-5xl flex-col items-center gap-8 px-6 text-center">
        <h1
          id="hero-title"
          className="max-w-[20ch] text-[length:var(--text-h1)] font-bold leading-[1.02] tracking-[-0.035em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
        >
          Transformamos ideas en plataformas digitales.
        </h1>
        <Button href="#contacto" className="px-8 py-3.5 text-[0.95rem]">
          Agenda una demo
        </Button>
      </Reveal>

      {/* Indicador de scroll */}
      <a
        href="#servicios"
        aria-label="Ir a servicios"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-full"
      >
        <span className="block h-12 w-px overflow-hidden bg-white/10">
          <span className="hero-scroll-cue block h-full w-full bg-white/60" />
        </span>
      </a>
    </section>
  );
}

export default Hero;
