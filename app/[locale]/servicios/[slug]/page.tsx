import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, serviceJsonLd } from "@/lib/jsonld";
import { getService, services } from "@/content/services";
import { serviceWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import { PageHero } from "@/components/layout/PageHero";
import { WhatsAppIcon, serviceIcons } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { AskNortButton } from "@/components/chat/AskNortButton";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { deferRender } from "@/lib/utils";

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export const dynamicParams = false;

const copy = {
  es: { includes: "Qué incluye", forWho: "Para quién es", how: "Cómo lo hacemos", stack: "Tecnología", related: "También te puede interesar", faq: "Preguntas frecuentes", ask: "Pregúntale a Nort" },
  en: { includes: "What's included", forWho: "Who it's for", how: "How we do it", stack: "Technology", related: "You might also need", faq: "Frequently asked questions", ask: "Ask Nort" },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/servicios/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) return {};
  return {
    ...pageMetadata({
      locale,
      path: `/servicios/${slug}`,
      title: service.seoTitle[locale],
      description: service.seoDescription[locale],
      ogSubtitle: service.short[locale],
    }),
    keywords: service.keywords[locale],
  };
}

export default async function ServicePage({ params }: PageProps<"/[locale]/servicios/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const service = getService(slug);
  if (!service) notFound();
  const dict = getDictionary(locale);
  const c = copy[locale];
  const Icon = serviceIcons[service.icon];
  const name = service.name[locale];
  const related = service.related.map((r) => getService(r)).filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <>
      <JsonLd data={serviceJsonLd(service, locale)} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: dict.nav.services, path: "/servicios" },
          { name, path: `/servicios/${slug}` },
        ]}
        eyebrow={name}
        title={service.seoTitle[locale]}
        lead={service.intro[locale]}
        aside={
          <div className="rounded-[1.75rem] border border-line bg-surface/70 p-7">
            <span className="grid size-12 place-items-center rounded-2xl border border-line bg-bg/60 text-accent-ink">
              <Icon className="size-5" aria-hidden />
            </span>
            <h2 className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-faint">{c.forWho}</h2>
            <p className="mt-3 text-ink">{service.forWho[locale]}</p>
          </div>
        }
      >
        <TrackedLink
          href={whatsappUrl(serviceWhatsappMessage(name, locale))}
          event="whatsapp_click"
          eventProps={{ location: `service_${slug}` }}
          newTabLabel={dict.a11y.newTab}
          className="inline-flex h-13 items-center gap-2.5 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast shadow-[0_14px_50px_-12px_var(--accent)] transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="size-5" />
          {dict.cta.whatsapp}
        </TrackedLink>
        <AskNortButton
          label={c.ask}
          prompt={locale === "es" ? `Quiero saber más sobre: ${name}` : `I'd like to know more about: ${name}`}
          className="inline-flex h-13 items-center gap-2.5 rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
        />
      </PageHero>

      <section aria-labelledby="incluye" className="py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <h2 id="incluye" className="text-[length:var(--text-h2)] text-ink">
              {c.includes}
            </h2>
          </Reveal>
          <RevealGroup as="ul" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {service.includes[locale].map((item) => (
              <RevealItem as="li" key={item} className="flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink">
                  <Check className="size-4" aria-hidden />
                </span>
                <span className="text-ink">{item}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="como" className="border-y border-line bg-bg-2 py-16 md:py-24" {...deferRender(1016, 718)}>
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 id="como" className="text-[length:var(--text-h2)] text-ink">
              {c.how}
            </h2>
            <h3 className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-faint">{c.stack}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {service.stack.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-dim">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <RevealGroup as="ol" className="grid gap-4">
            {service.steps.map((step, i) => (
              <RevealItem as="li" key={i} className="flex gap-5 rounded-3xl border border-line bg-surface/70 p-6">
                <span className="font-display text-3xl font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">{step.title[locale]}</h3>
                  <p className="mt-1.5 text-dim">{step.body[locale]}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Faq items={service.faq} locale={locale} eyebrow={name} title={c.faq} id="preguntas-servicio" />

      <section aria-labelledby="relacionados" className="pb-8" {...deferRender(674, 280)}>
        <div className="container-x">
          <h2 id="relacionados" className="font-display text-2xl font-bold text-ink">
            {c.related}
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((r) => {
              const RIcon = serviceIcons[r.icon];
              return (
                <li key={r.slug}>
                  <Link
                    href={href(locale, `/servicios/${r.slug}`)}
                    className="group flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-6 transition-colors hover:border-accent-line"
                  >
                    <RIcon className="size-5 text-accent-ink" aria-hidden />
                    <span className="mt-5 font-display text-lg font-semibold text-ink">{r.name[locale]}</span>
                    <span className="mt-2 text-sm text-dim">{r.short[locale]}</span>
                    <ArrowUpRight className="mt-auto size-4 self-end text-accent-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand locale={locale} message={serviceWhatsappMessage(name, locale)} location={`service_${slug}_band`} />
    </>
  );
}
