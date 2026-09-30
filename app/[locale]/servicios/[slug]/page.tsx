import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, serviceJsonLd } from "@/lib/jsonld";
import { getService, serviceGroups, services } from "@/content/services";
import { serviceWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import { PageHero } from "@/components/layout/PageHero";
import { WhatsAppIcon, serviceIcons } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { AskNortButton } from "@/components/chat/AskNortButton";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export const dynamicParams = false;

const copy = {
  es: { includes: "Incluye", related: "También hacemos", ask: "Pregúntale a Nort", scope: "Cuéntanos qué necesitas" },
  en: { includes: "Includes", related: "We also do", ask: "Ask Nort", scope: "Tell us what you need" },
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

/** Página breve de un servicio: nombre, una línea, cuatro puntos y contacto. */
export default async function ServicePage({ params }: PageProps<"/[locale]/servicios/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const service = getService(slug);
  if (!service) notFound();
  const dict = getDictionary(locale);
  const c = copy[locale];
  const Icon = serviceIcons[service.icon];
  const name = service.name[locale];
  const group = serviceGroups.find((g) => g.key === service.group)?.name[locale];
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
        eyebrow={group}
        title={service.seoTitle[locale]}
        lead={service.short[locale]}
        aside={
          <div aria-hidden className="relative mx-auto grid size-56 place-items-center lg:size-64">
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,var(--color-accent),transparent)] opacity-25 blur-2xl" />
            <span className="absolute inset-6 rounded-full border border-accent-line" />
            <span className="absolute inset-14 rounded-full border border-line" />
            <Icon className="relative size-16 text-accent-ink" strokeWidth={1.25} />
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

      <section aria-labelledby="incluye" className="pb-20 md:pb-28">
        <div className="container-x">
          <h2 id="incluye" className="eyebrow">
            {c.includes}
          </h2>
          <RevealGroup as="ul" className="mt-6 grid border-t border-line sm:grid-cols-2">
            {service.includes[locale].map((item) => (
              <RevealItem
                as="li"
                key={item}
                className="flex items-center gap-4 border-b border-line py-6 text-lg text-ink sm:odd:pr-8 sm:even:border-l sm:even:pl-8"
              >
                <Check className="size-5 shrink-0 text-accent-ink" aria-hidden />
                {item}
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-dim">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-faint">{c.related}</span>
            {related.map((r) => (
              <Link
                key={r.slug}
                href={href(locale, `/servicios/${r.slug}`)}
                className="group inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
              >
                {r.name[locale]}
                <ArrowRight className="size-4 text-accent-ink transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            ))}
            <Link
              href={`${href(locale, "/")}#arma`}
              className="group inline-flex items-center gap-1.5 font-semibold text-accent-ink underline-offset-4 hover:underline"
            >
              {c.scope}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
