import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { AskNortButton } from "@/components/chat/AskNortButton";
import { Reveal } from "@/components/ui/Reveal";
import { CerroMark } from "@/components/brand/CerroMark";
import { deferRender } from "@/lib/utils";

const copy = {
  es: {
    title: "¿Listo para tomar rumbo?",
    lead: "Cuéntanos qué necesitas. Te respondemos con una propuesta clara: alcance, tiempos y costo.",
  },
  en: {
    title: "Ready to set your heading?",
    lead: "Tell us what you need. We'll reply with a clear proposal: scope, timeline and cost.",
  },
};

export function CtaBand({
  locale,
  message,
  prompt,
  location = "cta_band",
}: {
  locale: Locale;
  /** Mensaje pre-llenado de WhatsApp. */
  message?: string;
  /** Pregunta inicial para Nort. */
  prompt?: string;
  location?: string;
}) {
  const dict = getDictionary(locale);
  const c = copy[locale];
  return (
    <section className="py-20 md:py-28" {...deferRender(630, 560)}>
      <div className="container-x">
        <Reveal className="overflow-hidden rounded-[2.25rem]">
          <div
            data-theme="dark"
            className="relative overflow-hidden rounded-[2.25rem] border border-accent-line bg-[radial-gradient(120%_120%_at_100%_0%,rgb(255_46_126/0.18),transparent_55%),linear-gradient(160deg,var(--navy)_0%,#07112b_70%)] p-8 text-ink md:p-14"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-24 size-[36rem] bg-accent opacity-20 light:opacity-10 [mask:url(/brand/contours.svg)_center/contain_no-repeat]"
            />
            <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <CerroMark id={`cta-${location}`} size={56} />
                <h2 className="mt-6 text-[clamp(2rem,1.4rem+2.2vw,3.2rem)] text-ink">{c.title}</h2>
                <p className="mt-4 text-[length:var(--text-lead)] text-dim">{c.lead}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <TrackedLink
                  href={whatsappUrl(message ?? whatsappMessages.general[locale])}
                  event="whatsapp_click"
                  eventProps={{ location }}
                  newTabLabel={dict.a11y.newTab}
                  className="inline-flex h-13 items-center gap-2.5 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast shadow-[0_14px_50px_-12px_var(--accent)] transition-transform hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="size-5" />
                  {dict.cta.whatsapp}
                </TrackedLink>
                <AskNortButton
                  label={dict.cta.askNort}
                  prompt={prompt}
                  className="inline-flex h-13 items-center gap-2.5 rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
