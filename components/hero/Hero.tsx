import { ArrowDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { AskNortButton } from "@/components/chat/AskNortButton";
import { HeroVideo } from "./HeroVideo";

/** Palabra resaltada con el degradado de marca en el titular. */
const highlight: Record<Locale, string> = { es: "norte", en: "north." };

export function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const words = dict.hero.title.split(" ");

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#060a16] text-white"
    >
      {/* Capa 1: póster (LCP) — mismo cuadro con el que arranca el video */}
      <picture className="absolute inset-0 -z-20">
        <source media="(max-aspect-ratio: 4/5)" type="image/avif" srcSet="/video/cerro-720x1280-poster.avif" />
        <source media="(max-aspect-ratio: 4/5)" type="image/webp" srcSet="/video/cerro-720x1280-poster.webp" />
        <source type="image/avif" srcSet="/video/cerro-1920x1080-poster.avif" />
        <source type="image/webp" srcSet="/video/cerro-1920x1080-poster.webp" />
        <img
          src="/video/cerro-1920x1080-poster.jpg"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover"
        />
      </picture>

      {/* Capa 2: video en loop (se carga después del primer pintado) */}
      <HeroVideo
        label={dict.hero.videoLabel}
        pauseLabel={dict.a11y.pauseVideo}
        playLabel={dict.a11y.playVideo}
        caption={locale === "es" ? "Cerro de la Campana · render 3D de Northa" : "Cerro de la Campana · 3D render by Northa"}
      />

      {/* Capa 3: velos para legibilidad */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(6_10_22/0.82)_0%,rgb(6_10_22/0.45)_42%,rgb(6_10_22/0)_70%)] max-md:bg-[linear-gradient(180deg,rgb(6_10_22/0.2)_0%,rgb(6_10_22/0)_30%,rgb(6_10_22/0.55)_62%,rgb(6_10_22/0.92)_100%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-12 bg-gradient-to-b from-transparent to-bg md:h-40" />

      <div className="container-x relative flex flex-1 flex-col justify-end pb-24 pt-36 md:justify-center md:pb-28">
        <div className="max-w-[46rem]">
          <p className="hero-fade font-mono text-[0.72rem] uppercase tracking-[0.26em] text-northa-2 [--d:0ms]">
            {dict.hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-6 font-display text-[length:var(--text-display)] font-extrabold leading-[0.94] tracking-[-0.045em]"
          >
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <span
                  className={`hero-word inline-block ${word === highlight[locale] ? "text-gradient" : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {word}
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-6 font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold tracking-[-0.02em] text-white [--d:420ms]">
            {dict.hero.subtitle}
          </p>
          <p className="hero-fade mt-4 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-white/75 [--d:520ms]">
            {dict.hero.lead}
          </p>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-3 [--d:640ms]">
            <TrackedLink
              href={whatsappUrl(whatsappMessages.general[locale])}
              event="whatsapp_click"
              eventProps={{ location: "hero" }}
              newTabLabel={dict.a11y.newTab}
              className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast shadow-[0_14px_50px_-12px_var(--accent)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="size-5" />
              {dict.cta.whatsapp}
            </TrackedLink>
            <AskNortButton
              label={dict.cta.askNort}
              className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/25 bg-white/5 px-6 font-semibold text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/10"
            />
          </div>
        </div>
      </div>

      <a
        href="#servicios"
        className="hero-fade absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-white md:flex [--d:900ms]"
      >
        {dict.hero.scrollCue}
        <ArrowDown className="size-4 animate-float" aria-hidden />
      </a>
    </section>
  );
}
