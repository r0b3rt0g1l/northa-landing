import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { HeroTimeline } from "@/components/cerro/HeroTimeline";

/** Palabra resaltada con el degradado de marca en el titular. */
const highlight: Record<Locale, string> = { es: "norte", en: "north." };

/**
 * Hero del inicio. El fondo es el Cerro de la Campana en vivo (CerroBackdrop,
 * fijo detrás de toda la página); aquí solo van el titular, las acciones y la
 * barra de hora y clima de Hermosillo.
 */
export function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const h = dict.hero;
  const words = h.title.split(" ");

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col text-white"
    >
      <div className="container-x relative flex flex-1 flex-col pb-5 pt-28 md:pb-10 md:pt-36">
        <div className="flex max-w-[44rem] flex-1 flex-col justify-start md:justify-center">
          <p className="hero-fade font-mono text-[0.72rem] uppercase tracking-[0.26em] text-accent-2 [--d:0ms]">{h.eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-5 font-display text-[length:var(--text-display)] font-extrabold leading-[0.94] tracking-[-0.045em]"
          >
            {words.map((word, i) => (
              // El espacio va FUERA del inline-block: dentro, al final de la
              // caja, el navegador lo colapsa y las palabras se pegan.
              <Fragment key={`${word}-${i}`}>
                <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span
                    className={`hero-word inline-block ${word === highlight[locale] ? "text-gradient" : ""}`}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    {word}
                  </span>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>
          <p className="hero-fade mt-5 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-white/80 [--d:420ms]">{h.lead}</p>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-3 [--d:560ms]">
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
            <a
              href="#arma-tu-proyecto"
              className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/25 bg-white/5 px-6 font-semibold text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/10"
            >
              {h.secondaryCta}
            </a>
          </div>
        </div>

        <div className="mt-10 flex">
          <HeroTimeline
            locale={locale}
            labels={{
              city: h.timeline.city,
              live: h.timeline.live,
              backToNow: h.timeline.backToNow,
              group: h.timeline.group,
              phases: h.timeline.phases,
            }}
          />
        </div>
      </div>
    </section>
  );
}
