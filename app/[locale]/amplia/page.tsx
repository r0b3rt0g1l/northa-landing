import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, ampliaJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/i18n/href";
import { amplia, site } from "@/lib/site";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { ampliaHero, enfoque, metodologia, mision, quienesSomos, vision } from "@/content/amplia";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { InView } from "@/components/ui/InView";
import { MetodologiaDiagram } from "@/components/amplia/Metodologia";
import { AmpliaEnso } from "@/components/amplia/AmpliaEnso";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { deferRender } from "@/lib/utils";

const copy = {
  es: {
    crumb: "Amplía Consultoría",
    sister: "Sitio hermano de Northa Digital",
    call: "Llamar",
    whatsapp: "Escríbenos por WhatsApp",
    who: "¿Quiénes somos?",
    mission: "Misión",
    vision: "Visión",
    focusEyebrow: "Nuestro enfoque",
    focusTitle: "Asesoría y consultoría en cada etapa de la gestión.",
    methodEyebrow: "Metodología del trabajo",
    methodTitle: "Tres etapas y un eje que las atraviesa.",
    contactEyebrow: "Contacto",
    contactTitle: "Habla con Amplía.",
    backNortha: "Volver a Northa Digital",
    metaTitle: "Amplía Consultoría · Gestión pública en Sonora",
    metaDescription:
      "Amplía Consultoría: acompañamiento y fortalecimiento de la gestión pública en Sonora. Entrega-recepción, planeación, normatividad, auditorías y transparencia.",
  },
  en: {
    crumb: "Amplía Consultoría",
    sister: "Northa Digital's sister site",
    call: "Call",
    whatsapp: "Message us on WhatsApp",
    who: "Who we are",
    mission: "Mission",
    vision: "Vision",
    focusEyebrow: "Our focus",
    focusTitle: "Advisory and consulting at every stage of public management.",
    methodEyebrow: "Work methodology",
    methodTitle: "Three stages and an axis that runs through them.",
    contactEyebrow: "Contact",
    contactTitle: "Talk to Amplía.",
    backNortha: "Back to Northa Digital",
    metaTitle: "Amplía Consultoría · Public management in Sonora",
    metaDescription:
      "Amplía Consultoría: supporting and strengthening public management in Sonora, Mexico. Administration handover, planning, regulations, audits and transparency.",
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/amplia">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = copy[locale];
  return pageMetadata({
    locale,
    path: "/amplia",
    title: c.metaTitle,
    description: c.metaDescription,
    brand: "amplia",
    ogSubtitle: ampliaHero.title[locale],
  });
}

/**
 * Amplía Consultoría (30-sep-2026): una consultoría, sin listas de municipios.
 * Contacto por el mismo WhatsApp de Northa. El ensō en HD se traza al cargar.
 */
export default async function AmpliaPage({ params }: PageProps<"/[locale]/amplia">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  const c = copy[locale];
  const tel = `tel:${amplia.contact.phoneE164}`;
  const wa = whatsappUrl(whatsappMessages.amplia[locale]);

  const contactButtons = (where: string) => (
    <>
      <TrackedLink
        href={wa}
        event="whatsapp_click"
        eventProps={{ location: `amplia_${where}` }}
        newTabLabel={dict.a11y.newTab}
        className="inline-flex h-13 items-center gap-2.5 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast shadow-[0_14px_50px_-14px_var(--accent)] transition-transform hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="size-5" />
        {c.whatsapp}
      </TrackedLink>
      <a
        href={tel}
        className="inline-flex h-13 items-center gap-2.5 rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
      >
        <Phone className="size-4 text-accent-ink" aria-hidden />
        {c.call} · {amplia.contact.phoneDisplay}
      </a>
    </>
  );

  return (
    <div data-brand="amplia">
      <JsonLd
        data={[
          ampliaJsonLd(locale, quienesSomos[locale]),
          breadcrumbJsonLd([
            { name: dict.breadcrumbs.home, url: absoluteUrl(site.url, locale, "/") },
            { name: c.crumb, url: absoluteUrl(site.url, locale, "/amplia") },
          ]),
        ]}
      />

      {/* Hero con el ensō en HD */}
      <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_55%_at_76%_38%,rgb(63_184_172/0.2),transparent_68%),linear-gradient(180deg,#07110f_0%,transparent_75%)] light:opacity-60"
        />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal className="order-2 lg:order-1">
            <p className="eyebrow">{ampliaHero.eyebrow[locale]}</p>
            <h1 className="mt-5 text-[length:var(--text-h1)] text-ink">{ampliaHero.title[locale]}</h1>
            <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-dim">{ampliaHero.lead[locale]}</p>
            <div className="mt-10 flex flex-wrap gap-3">{contactButtons("hero")}</div>
            <p className="mt-8 text-sm text-faint">
              {c.sister} ·{" "}
              <Link href={href(locale, "/")} className="underline underline-offset-4 hover:text-ink">
                {c.backNortha}
              </Link>
            </p>
          </Reveal>

          <div className="relative order-1 mx-auto grid w-full max-w-[34rem] place-items-center lg:order-2">
            <AmpliaEnso id="amplia-hero" animate title="Amplía Consultoría" className="h-auto w-full drop-shadow-[0_30px_60px_rgb(8_40_37/0.55)]" />
            <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="translate-y-[4%] text-center leading-none">
                <span className="block font-display text-[clamp(3rem,1.6rem+6vw,5.6rem)] font-extrabold tracking-[0.02em] text-ink">
                  {"AMPLÍA".split("").map((ch, i) => (
                    <span key={i} className="enso-word inline-block" style={{ "--i": i } as React.CSSProperties}>
                      {ch}
                    </span>
                  ))}
                </span>
                <span
                  className="enso-word mt-2 block font-display text-[clamp(1rem,0.7rem+1.3vw,1.6rem)] font-semibold tracking-[0.42em] text-accent-2"
                  style={{ "--i": 8 } as React.CSSProperties}
                >
                  CONSULTORÍA
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes somos, misión, visión */}
      <section aria-labelledby="quienes" className="py-16 md:py-24" {...deferRender(1500, 820)}>
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">{c.who}</p>
            <h2 id="quienes" className="mt-5 text-[clamp(1.15rem,1.05rem+0.45vw,1.4rem)] font-semibold leading-snug tracking-[-0.015em] text-ink">
              {quienesSomos[locale]}
            </h2>
          </Reveal>
          <div className="grid gap-4">
            {[
              { t: c.mission, b: mision[locale] },
              { t: c.vision, b: vision[locale] },
            ].map((x) => (
              <Reveal key={x.t} className="border-t border-line pt-6">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">{x.t}</h3>
                <p className="mt-3 text-dim">{x.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enfoque */}
      <section aria-labelledby="enfoque" className="border-y border-line bg-bg-2 py-16 md:py-24" {...deferRender(1250, 700)}>
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{c.focusEyebrow}</p>
            <h2 id="enfoque" className="mt-5 text-[length:var(--text-h2)] text-ink">
              {c.focusTitle}
            </h2>
          </Reveal>
          <RevealGroup as="ul" className="mt-12 grid border-t border-line md:grid-cols-2 lg:grid-cols-3">
            {enfoque.map((e, i) => (
              <RevealItem as="li" key={e.title.es} className="border-b border-line py-6 md:pr-8">
                <span className="font-mono text-[0.7rem] tracking-[0.18em] text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{e.title[locale]}</h3>
                <p className="mt-1.5 text-sm text-dim">{e.body[locale]}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Metodología */}
      <section aria-labelledby="metodologia" className="py-16 md:py-24" {...deferRender(1460, 1030)}>
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="eyebrow">{c.methodEyebrow}</p>
              <h2 id="metodologia" className="mt-5 text-[length:var(--text-h2)] text-ink">
                {c.methodTitle}
              </h2>
            </Reveal>
            <RevealGroup as="ol" className="mt-10 grid gap-3">
              {metodologia.map((m) => (
                <RevealItem
                  as="li"
                  key={m.title.es}
                  className={m.transversal ? "rounded-2xl border border-accent-line bg-accent-soft p-5" : "rounded-2xl border border-line bg-surface/60 p-5"}
                >
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent-ink">{m.tag[locale]}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink">{m.title[locale]}</h3>
                  <p className="mt-1 text-sm text-dim">{m.body[locale]}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <InView>
            <MetodologiaDiagram locale={locale} />
          </InView>
        </div>
      </section>

      {/* Contacto: el mismo WhatsApp de Northa */}
      <section aria-labelledby="amplia-contacto" className="pb-16 md:pb-24" {...deferRender(560, 420)}>
        <div className="container-x">
          <Reveal className="relative overflow-hidden rounded-[2.25rem] border border-accent-line bg-[radial-gradient(120%_120%_at_100%_0%,var(--accent-soft),transparent_55%),var(--surface)] p-8 md:p-14">
            <div className="grid gap-10 md:grid-cols-[auto_1fr_auto] md:items-center">
              {/* Archivo estático (en caché): no repetir el trazo en el HTML. */}
              <Image src="/amplia/enso.svg" alt="" width={88} height={84} unoptimized className="hidden md:block" />
              <div>
                <p className="eyebrow">{c.contactEyebrow}</p>
                <h2 id="amplia-contacto" className="mt-4 text-[clamp(2rem,1.4rem+2.2vw,3.2rem)] text-ink">
                  {c.contactTitle}
                </h2>
              </div>
              <div className="flex flex-col gap-3">{contactButtons("contact")}</div>
            </div>
          </Reveal>
          {/* Acceso discreto al portal interno (solo español, requiere cuenta). */}
          <p className="mt-8 text-center text-sm text-faint">
            {locale === "es" ? "¿Eres parte del equipo de Amplía?" : "Part of the Amplía team?"}{" "}
            <Link href="/amplia/portal" prefetch={false} className="font-semibold text-accent-ink underline underline-offset-4 hover:text-ink">
              {locale === "es" ? "Entrar al portal del equipo" : "Go to the team portal (Spanish)"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
