import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Mail, Phone } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, ampliaJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/i18n/href";
import { amplia, site } from "@/lib/site";
import {
  acciones,
  alianza,
  ampliaHero,
  ampliaStats,
  ayuntamientosAmplia,
  colaboracionesQuote,
  controlInterno,
  enfoque,
  metodologia,
  mision,
  objetivos,
  pasos,
  quienesSomos,
  resultados,
  retos,
  valores,
  vision,
} from "@/content/amplia";
import { flotaAmplia, flotaSinAmplia } from "@/content/gov";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { InView } from "@/components/ui/InView";
import { MetodologiaDiagram } from "@/components/amplia/Metodologia";
import { CerroMark } from "@/components/brand/CerroMark";
import { deferRender } from "@/lib/utils";

const copy = {
  es: {
    crumb: "Amplía Consultoría",
    sister: "Sitio hermano de Northa Digital",
    call: "Llamar a Amplía",
    write: "Escribir un correo",
    who: "¿Quiénes somos?",
    mission: "Misión",
    vision: "Visión",
    focusEyebrow: "Nuestro enfoque",
    focusTitle: "Asesoría y consultoría en cada etapa de la gestión.",
    methodEyebrow: "Metodología del trabajo",
    methodTitle: "Tres etapas y un eje que las atraviesa.",
    stepsEyebrow: "Pasos a seguir",
    stepsTitle: "Cómo empieza el trabajo con un ayuntamiento.",
    controlEyebrow: "Control interno",
    controlTitle: "Auditoría integral.",
    goals: "Objetivos",
    values: "Valores",
    actions: "Acciones",
    results: "Resultados",
    challenges: "Retos de los municipios",
    townsEyebrow: "Ayuntamientos que respaldan su labor",
    townsTitle: "Dieciséis ayuntamientos, varias administraciones.",
    contactEyebrow: "Contacto",
    contactTitle: "Habla con Amplía.",
    coverage: "Cobertura",
    coverageValue: "Ayuntamientos del Estado de Sonora",
    northaSide: "Northa · el portal",
    ampliaSide: "Amplía · la gestión",
    backNortha: "Volver a Northa Digital",
    metaTitle: "Amplía Consultoría · Gestión pública municipal en Sonora",
    metaDescription:
      "Amplía Consultoría: acompañamiento y fortalecimiento de la gestión pública municipal en Sonora. Entrega-recepción, Plan Municipal de Desarrollo, normatividad, auditorías y transparencia.",
  },
  en: {
    crumb: "Amplía Consultoría",
    sister: "Northa Digital's sister site",
    call: "Call Amplía",
    write: "Send an email",
    who: "Who we are",
    mission: "Mission",
    vision: "Vision",
    focusEyebrow: "Our focus",
    focusTitle: "Advisory and consulting at every stage of public management.",
    methodEyebrow: "Work methodology",
    methodTitle: "Three stages and an axis that runs through them.",
    stepsEyebrow: "Next steps",
    stepsTitle: "How work with a municipality begins.",
    controlEyebrow: "Internal control",
    controlTitle: "Comprehensive audit.",
    goals: "Goals",
    values: "Values",
    actions: "Actions",
    results: "Results",
    challenges: "Municipal challenges",
    townsEyebrow: "Municipalities that endorse their work",
    townsTitle: "Sixteen municipalities, several administrations.",
    contactEyebrow: "Contact",
    contactTitle: "Talk to Amplía.",
    coverage: "Coverage",
    coverageValue: "Municipalities of the State of Sonora",
    northaSide: "Northa · the portal",
    ampliaSide: "Amplía · the management",
    backNortha: "Back to Northa Digital",
    metaTitle: "Amplía Consultoría · Municipal public management in Sonora",
    metaDescription:
      "Amplía Consultoría: supporting and strengthening municipal public management in Sonora, Mexico. Administration handover, Municipal Development Plan, regulations, audits and transparency.",
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

export default async function AmpliaPage({ params }: PageProps<"/[locale]/amplia">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  const c = copy[locale];
  const tel = `tel:${amplia.contact.phoneE164}`;
  const mail = `mailto:${amplia.contact.email}`;

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

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_78%_20%,rgb(63_184_172/0.18),transparent_65%),linear-gradient(180deg,#08100f_0%,transparent_70%)]"
        />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="flex items-center gap-4">
              <Image src="/amplia/enso.png" alt="" width={56} height={54} className="h-auto w-12" priority />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold tracking-[0.01em] text-ink">AMPLÍA</span>
                <span className="mt-1 font-mono text-[0.62rem] tracking-[0.34em] text-accent-2">CONSULTORÍA</span>
              </span>
            </div>
            <p className="eyebrow mt-10">{ampliaHero.eyebrow[locale]}</p>
            <h1 className="mt-5 text-[length:var(--text-h1)] text-ink">{ampliaHero.title[locale]}</h1>
            <p className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-dim">{ampliaHero.lead[locale]}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={tel}
                className="inline-flex h-13 items-center gap-2.5 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast shadow-[0_14px_50px_-14px_var(--accent)] transition-transform hover:-translate-y-0.5"
              >
                <Phone className="size-4" aria-hidden />
                {c.call}
              </a>
              <a
                href={mail}
                className="inline-flex h-13 items-center gap-2.5 rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
              >
                <Mail className="size-4 text-accent-ink" aria-hidden />
                {c.write}
              </a>
            </div>
            <p className="mt-8 text-sm text-faint">
              {c.sister} ·{" "}
              <Link href={href(locale, "/")} className="underline underline-offset-4 hover:text-ink">
                {c.backNortha}
              </Link>
            </p>
          </Reveal>
          <Reveal variant="scale" className="relative mx-auto grid aspect-square w-full max-w-md place-items-center">
            <div aria-hidden className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(63_184_172/0.22),transparent_72%)]" />
            <Image src="/amplia/enso.png" alt="Amplía Consultoría" width={352} height={336} className="enso-draw relative h-auto w-[78%]" priority />
          </Reveal>
        </div>
      </section>

      {/* Cifras */}
      <section aria-label={c.results} className="border-y border-line bg-bg-2">
        <RevealGroup as="ul" className="container-x grid gap-px md:grid-cols-3">
          {ampliaStats.map((s) => (
            <RevealItem as="li" key={s.value} className="py-9 md:px-8 md:first:pl-0 md:[&+&]:border-l md:[&+&]:border-line">
              <p className="font-display text-5xl font-bold leading-none tracking-[-0.04em] text-ink">{s.value}</p>
              <p className="mt-3 max-w-xs text-sm text-dim">{s.label[locale]}</p>
              {s.note && <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-faint">{s.note[locale]}</p>}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Quiénes somos, misión, visión */}
      <section aria-labelledby="quienes" className="py-24 md:py-32" {...deferRender(1770, 940)}>
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">{c.who}</p>
            <h2 id="quienes" className="mt-5 text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] font-semibold leading-snug tracking-[-0.02em] text-ink">
              {quienesSomos[locale]}
            </h2>
          </Reveal>
          <div className="grid gap-4">
            {[
              { t: c.mission, b: mision[locale] },
              { t: c.vision, b: vision[locale] },
            ].map((x) => (
              <Reveal key={x.t} className="rounded-3xl border border-line bg-surface/60 p-8">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">{x.t}</h3>
                <p className="mt-4 text-dim">{x.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enfoque */}
      <section aria-labelledby="enfoque" className="border-y border-line bg-bg-2 py-24 md:py-32" {...deferRender(1550, 860)}>
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{c.focusEyebrow}</p>
            <h2 id="enfoque" className="mt-5 text-[length:var(--text-h2)] text-ink">
              {c.focusTitle}
            </h2>
          </Reveal>
          <RevealGroup as="ul" className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enfoque.map((e, i) => (
              <RevealItem as="li" key={e.title.es} className="rounded-3xl border border-accent-line/60 bg-surface/60 p-7">
                <span className="font-mono text-[0.7rem] tracking-[0.18em] text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{e.title[locale]}</h3>
                <p className="mt-2 text-sm text-dim">{e.body[locale]}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Metodología */}
      <section aria-labelledby="metodologia" className="py-24 md:py-32" {...deferRender(1460, 1030)}>
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
                  className={
                    m.transversal
                      ? "rounded-2xl border border-accent-line bg-accent-soft p-5"
                      : "rounded-2xl border border-line bg-surface/60 p-5"
                  }
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

      {/* Pasos + control interno */}
      <section aria-labelledby="pasos" className="border-y border-line bg-bg-2 py-24 md:py-32" {...deferRender(1360, 780)}>
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="eyebrow">{c.stepsEyebrow}</p>
              <h2 id="pasos" className="mt-5 text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)] text-ink">
                {c.stepsTitle}
              </h2>
            </Reveal>
            <RevealGroup as="ol" className="mt-10 grid gap-3">
              {pasos[locale].map((p, i) => (
                <RevealItem as="li" key={p} className="flex items-start gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-accent-line bg-accent-soft font-mono text-xs text-accent-ink">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-dim">{p}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <div>
            <Reveal>
              <p className="eyebrow">{c.controlEyebrow}</p>
              <h2 className="mt-5 text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)] text-ink">{c.controlTitle}</h2>
            </Reveal>
            <RevealGroup as="ul" className="mt-10 grid gap-3">
              {controlInterno.map((ci) => (
                <RevealItem as="li" key={ci.title.es} className="rounded-2xl border border-line bg-surface/60 p-5">
                  <h3 className="font-display font-semibold text-ink">{ci.title[locale]}</h3>
                  <ul className="mt-3 grid gap-1.5">
                    {ci.items[locale].map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-sm text-dim">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Colaboraciones */}
      <section aria-label={c.results} className="py-24 md:py-32" {...deferRender(2450, 1350)}>
        <div className="container-x">
          <Reveal>
            <blockquote className="rounded-r-3xl border-l-2 border-accent bg-accent-soft px-8 py-8 md:px-12">
              <p className="max-w-4xl font-display text-[clamp(1.35rem,1.1rem+1vw,2rem)] font-semibold leading-snug tracking-[-0.02em] text-ink">
                {colaboracionesQuote[locale]}
              </p>
              <footer className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent-ink">
                {amplia.name} · {amplia.presenta}
              </footer>
            </blockquote>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { t: c.goals, list: objetivos[locale] },
              { t: c.values, list: valores[locale] },
              { t: c.actions, list: acciones[locale] },
              { t: c.results, list: resultados[locale] },
            ].map((block) => (
              <Reveal key={block.t} className="rounded-3xl border border-line bg-surface/60 p-7">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">{block.t}</h3>
                <ul className="mt-5 grid gap-2.5">
                  {block.list.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-dim">
                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-4 rounded-3xl border border-line bg-surface/60 p-8">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">{c.challenges}</h3>
            <p className="mt-4 max-w-4xl text-dim">{retos[locale]}</p>
          </Reveal>
        </div>
      </section>

      {/* Ayuntamientos */}
      <section aria-labelledby="ayuntamientos" className="border-y border-line bg-bg-2 py-24 md:py-32" {...deferRender(2150, 900)}>
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{c.townsEyebrow}</p>
            <h2 id="ayuntamientos" className="mt-5 text-[length:var(--text-h2)] text-ink">
              {c.townsTitle}
            </h2>
          </Reveal>
          <RevealGroup as="ul" stagger={0.03} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ayuntamientosAmplia.map((a) => (
              <RevealItem as="li" key={a.nombre} className="rounded-2xl border border-line bg-surface/60 p-5">
                <p className="font-display font-semibold text-ink">{a.nombre}</p>
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {a.administraciones.map((ad) => (
                    <span key={ad} className="rounded-full border border-accent-line px-2 py-0.5 font-mono text-[0.65rem] text-accent-ink">
                      {ad}
                    </span>
                  ))}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Alianza */}
      <section aria-labelledby="alianza" className="py-24 md:py-32" {...deferRender(1015, 910)}>
        <div className="container-x">
          <Reveal className="mx-auto flex max-w-xl items-center justify-center gap-6">
            <div className="text-center">
              <CerroMark id="amplia-ally" size={56} className="mx-auto" />
              <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">{c.northaSide}</p>
            </div>
            <span className="font-display text-3xl text-faint" aria-hidden>
              +
            </span>
            <div className="text-center">
              <Image src="/amplia/enso.png" alt="" width={56} height={54} className="mx-auto h-auto w-14" />
              <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">{c.ampliaSide}</p>
            </div>
          </Reveal>
          <Reveal className="mx-auto mt-10 max-w-3xl text-center">
            <p className="eyebrow">{alianza.eyebrow[locale]}</p>
            <h2 id="alianza" className="mt-5 text-[length:var(--text-h2)] text-ink">
              {alianza.title[locale]}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[length:var(--text-lead)] text-dim">{alianza.lead[locale]}</p>
          </Reveal>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {flotaAmplia.map((m) => (
              <li key={m.slug} className="rounded-full border border-line-2 bg-surface px-4 py-2 text-sm text-ink">
                <span aria-hidden className="mr-2 text-[0.65rem] text-accent">
                  ◍
                </span>
                {m.nombre}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-faint">
            {alianza.note[locale]}
            <span className="sr-only"> ({flotaSinAmplia.map((m) => m.nombre).join(", ")})</span>
          </p>
          <p className="mt-6 text-center font-display text-xl font-semibold text-accent-ink">{alianza.motto[locale]}</p>
        </div>
      </section>

      {/* Contacto */}
      <section aria-labelledby="amplia-contacto" className="pb-24 md:pb-32" {...deferRender(655, 485)}>
        <div className="container-x">
          <Reveal className="relative overflow-hidden rounded-[2.25rem] border border-accent-line bg-[radial-gradient(120%_120%_at_100%_0%,var(--accent-soft),transparent_55%),var(--surface)] p-8 md:p-14">
            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow">{c.contactEyebrow}</p>
                <h2 id="amplia-contacto" className="mt-4 text-[clamp(2rem,1.4rem+2.2vw,3.2rem)] text-ink">
                  {c.contactTitle}
                </h2>
                <dl className="mt-8 grid gap-3 text-dim">
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                      {locale === "es" ? "Presenta" : "Presented by"}
                    </dt>
                    <dd className="text-ink">{amplia.presenta}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">{c.coverage}</dt>
                    <dd>{c.coverageValue}</dd>
                  </div>
                </dl>
              </div>
              <div className="grid gap-3">
                <a
                  href={tel}
                  className="inline-flex h-13 items-center gap-2.5 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast transition-transform hover:-translate-y-0.5"
                >
                  <Phone className="size-4" aria-hidden />
                  {amplia.contact.phoneDisplay}
                </a>
                <a
                  href={mail}
                  className="inline-flex h-13 items-center gap-2.5 rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
                >
                  <Mail className="size-4 text-accent-ink" aria-hidden />
                  {amplia.contact.email}
                </a>
                <Link
                  href={href(locale, "/gobierno")}
                  className="inline-flex items-center justify-center gap-1.5 pt-2 text-sm text-faint hover:text-ink"
                >
                  {locale === "es" ? "Ver los portales de Northa" : "See Northa's portals"}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              </div>
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
