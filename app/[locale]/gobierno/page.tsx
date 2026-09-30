import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { escudoAlt, flota, flotaAmplia, govModules, govPillars, govQuality, govStats } from "@/content/gov";
import { alianza } from "@/content/amplia";
import { PageHero } from "@/components/layout/PageHero";
import { WhatsAppIcon, govIcons } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { CtaBand } from "@/components/sections/CtaBand";
import { deferRender } from "@/lib/utils";

const copy = {
  es: {
    eyebrow: "Gobierno digital",
    title: "Catorce municipios con su gobierno en línea.",
    lead: "Northa Digital construye portales institucionales de transparencia para los ayuntamientos de Sonora: dominio propio, panel de administración y contenido que carga el municipio, no un tercero.",
    seeFleet: "Ver los 14 portales",
    meetAmplia: "Conocer Amplía Consultoría",
    fleetEyebrow: "La flota",
    fleetTitle: "Catorce ayuntamientos, catorce portales.",
    fleetLead: "Cada uno con su escudo, su dominio y su propio panel. Da clic en cualquiera para abrirlo en vivo. Los marcados con ◍ también han trabajado con Amplía Consultoría.",
    ampliaMark: "También acompañado por Amplía Consultoría",
    buildEyebrow: "Qué construye Northa",
    buildTitle: "Un portal no es una página. Es una operación que tiene que sostenerse tres años.",
    modulesEyebrow: "Módulos del portal",
    modulesTitle: "Lo que tu ayuntamiento publica, en orden.",
    qualityEyebrow: "Calidad",
    qualityTitle: "Rápido, seguro, accesible y privado.",
    metaTitle: "Portales de gobierno municipal",
    metaDescription:
      "Portales municipales de transparencia en Sonora: 14 ayuntamientos en línea con dominio propio, panel de administración en español y aislamiento verificado entre municipios.",
    ctaMessage: whatsappMessages.gov.es,
  },
  en: {
    eyebrow: "Digital government",
    title: "Fourteen municipalities with their government online.",
    lead: "Northa Digital builds institutional transparency portals for municipalities in Sonora: their own domain, an admin panel and content loaded by the municipality, not a third party.",
    seeFleet: "See the 14 portals",
    meetAmplia: "Meet Amplía Consultoría",
    fleetEyebrow: "The fleet",
    fleetTitle: "Fourteen municipalities, fourteen portals.",
    fleetLead: "Each with its coat of arms, its domain and its own panel. Click any of them to open it live. Those marked ◍ have also worked with Amplía Consultoría.",
    ampliaMark: "Also supported by Amplía Consultoría",
    buildEyebrow: "What Northa builds",
    buildTitle: "A portal isn't a page. It's an operation that has to hold up for three years.",
    modulesEyebrow: "Portal modules",
    modulesTitle: "What your municipality publishes, in order.",
    qualityEyebrow: "Quality",
    qualityTitle: "Fast, secure, accessible and private.",
    metaTitle: "Municipal government portals",
    metaDescription:
      "Municipal transparency portals in Sonora, Mexico: 14 municipalities online with their own domain, an admin panel in Spanish and verified isolation between municipalities.",
    ctaMessage: whatsappMessages.gov.en,
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/gobierno">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/gobierno", title: copy[locale].metaTitle, description: copy[locale].metaDescription });
}

export default async function GovPage({ params }: PageProps<"/[locale]/gobierno">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  const c = copy[locale];

  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: dict.nav.gov, path: "/gobierno" }]} eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
        <a
          href="#flota"
          className="inline-flex h-13 items-center gap-2 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast shadow-[0_14px_50px_-12px_var(--accent)] transition-transform hover:-translate-y-0.5"
        >
          {c.seeFleet}
        </a>
        <Link
          href={href(locale, "/amplia")}
          className="inline-flex h-13 items-center gap-2 rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-amplia hover:bg-[rgb(63_184_172/0.1)]"
        >
          <span aria-hidden className="block size-2.5 rounded-full border-2 border-amplia" />
          {c.meetAmplia}
        </Link>
      </PageHero>

      {/* Cifras */}
      <section aria-label={c.fleetEyebrow} className="border-y border-line bg-bg-2">
        <RevealGroup as="ul" className="container-x grid grid-cols-2 md:grid-cols-4">
          {govStats.map((s, i) => (
            <RevealItem as="li" key={i} className="border-line py-8 pr-4 max-md:[&:nth-child(-n+2)]:border-b md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0">
              <p className="font-display text-5xl font-bold leading-none tracking-[-0.04em] text-ink">{s.value}</p>
              <p className="mt-2 text-sm text-faint">{s.label[locale]}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Flota */}
      <section id="flota" aria-labelledby="flota-title" className="py-24 md:py-32" {...deferRender(2280, 1350)}>
        <div className="container-x">
          <SectionHeading id="flota-title" eyebrow={c.fleetEyebrow} title={c.fleetTitle} lead={c.fleetLead} />
          <RevealGroup as="ul" stagger={0.04} className="mt-14 grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-3.5">
            {flota.map((m) => (
              <RevealItem as="li" key={m.slug}>
                <a
                  href={`https://${m.dominio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent-line"
                >
                  <span className="relative grid h-36 place-items-center bg-paper p-4">
                    <Image src={`/escudos/${m.slug}.png`} alt={escudoAlt(m.nombre, locale)} fill sizes="200px" className="object-contain p-4" />
                  </span>
                  <span className="flex items-center gap-1.5 px-4 pt-3.5 font-display font-semibold text-ink">
                    {m.nombre}
                    {m.amplia && (
                      <span className="text-xs text-amplia" title={c.ampliaMark}>
                        ◍<span className="sr-only"> ({c.ampliaMark})</span>
                      </span>
                    )}
                    <ArrowUpRight className="ml-auto size-3.5 text-faint transition-colors group-hover:text-accent-ink" aria-hidden />
                  </span>
                  <span className="break-all px-4 pb-4 pt-1 font-mono text-[0.68rem] text-faint">
                    {m.dominio.replace(/^www\./, "")}
                    <span className="sr-only"> {dict.a11y.newTab}</span>
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Qué construye */}
      <section aria-labelledby="construye-title" className="border-y border-line bg-bg-2 py-24 md:py-32" {...deferRender(1320, 800)}>
        <div className="container-x">
          <SectionHeading id="construye-title" eyebrow={c.buildEyebrow} title={c.buildTitle} />
          <RevealGroup as="ul" className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {govPillars.map((p) => (
              <RevealItem as="li" key={p.num} className="rounded-3xl border border-line bg-surface/70 p-7">
                <span className="font-mono text-[0.7rem] tracking-[0.16em] text-accent-ink">{p.num}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{p.title[locale]}</h3>
                <p className="mt-3 text-sm text-dim">{p.body[locale]}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Módulos */}
      <section aria-labelledby="modulos-title" className="py-24 md:py-32" {...deferRender(1970, 1005)}>
        <div className="container-x">
          <SectionHeading id="modulos-title" eyebrow={c.modulesEyebrow} title={c.modulesTitle} />
          <RevealGroup as="ul" className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {govModules.map((mod) => {
              const Icon = govIcons[mod.icon];
              return (
                <RevealItem as="li" key={mod.title.es} className="rounded-3xl border border-line bg-surface/60 p-7">
                  <span className="grid size-11 place-items-center rounded-2xl border border-line bg-bg/60 text-accent-ink">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold text-ink">{mod.title[locale]}</h3>
                  <p className="mt-2 text-dim">{mod.body[locale]}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Calidad */}
      <section aria-labelledby="calidad-title" className="border-y border-line bg-bg-2 py-24 md:py-32" {...deferRender(1600, 960)}>
        <div className="container-x">
          <SectionHeading id="calidad-title" eyebrow={c.qualityEyebrow} title={c.qualityTitle} />
          <RevealGroup as="ul" className="mt-14 grid gap-4 md:grid-cols-2">
            {govQuality.map((q) => {
              const Icon = govIcons[q.icon];
              return (
                <RevealItem as="li" key={q.badge} className="rounded-3xl border border-line bg-surface/70 p-8">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <Icon className="size-5 text-accent-ink" aria-hidden />
                      <h3 className="font-display text-xl font-semibold text-ink">{q.title[locale]}</h3>
                    </span>
                    <span className="rounded-full border border-accent-line px-3 py-1 font-mono text-[0.68rem] text-accent-ink">{q.badge}</span>
                  </div>
                  <ul className="mt-6 grid gap-2.5">
                    {q.points[locale].map((pt) => (
                      <li key={pt} className="flex items-start gap-3 text-dim">
                        <Check className="mt-1 size-4 shrink-0 text-accent-ink" aria-hidden />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Alianza con Amplía */}
      <section aria-labelledby="alianza-title" className="py-24 md:py-32" data-brand="amplia" {...deferRender(900, 820)}>
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{alianza.eyebrow[locale]}</p>
            <h2 id="alianza-title" className="mt-5 text-[length:var(--text-h2)] text-ink">
              {alianza.title[locale]}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[length:var(--text-lead)] text-dim">{alianza.lead[locale]}</p>
          </Reveal>
          <RevealGroup as="ul" stagger={0.04} className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {flotaAmplia.map((m) => (
              <RevealItem as="li" key={m.slug} className="rounded-full border border-line-2 bg-surface px-4 py-2 text-sm text-ink">
                <span aria-hidden className="mr-2 text-[0.65rem] text-amplia">
                  ◍
                </span>
                {m.nombre}
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-faint">{alianza.note[locale]}</p>
          <div className="mt-10 flex justify-center">
            <Link
              href={href(locale, "/amplia")}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent-strong px-6 font-semibold text-accent-contrast transition-transform hover:-translate-y-0.5"
            >
              {c.meetAmplia}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand locale={locale} message={c.ctaMessage} location="gov_band" />
      <div className="container-x -mt-10 pb-16 text-center">
        <TrackedLink
          href={whatsappUrl(c.ctaMessage)}
          event="whatsapp_click"
          eventProps={{ location: "gov_footer" }}
          newTabLabel={dict.a11y.newTab}
          className="inline-flex items-center gap-2 text-sm text-faint hover:text-ink"
        >
          <WhatsAppIcon className="size-4" />
          {locale === "es" ? "¿Eres de un ayuntamiento? Escríbenos directo." : "Are you with a municipality? Message us directly."}
        </TrackedLink>
      </div>
    </>
  );
}
