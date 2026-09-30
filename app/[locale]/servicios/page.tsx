import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Landmark } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { PageHero } from "@/components/layout/PageHero";
import { SpotlightCard } from "@/components/ui/Spotlight";
import { serviceIcons } from "@/components/ui/Icons";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";

const copy = {
  es: {
    title: "Servicios de desarrollo web, software e IA en Hermosillo",
    lead: "Páginas web, sistemas a la medida, apps, inteligencia artificial, mantenimiento y consultoría. Todo construido para quedarse en producción.",
    metaTitle: "Servicios",
    metaDescription:
      "Servicios de Northa Digital en Hermosillo, Sonora: páginas web, sistemas y paneles a la medida, apps, chatbots con IA, mantenimiento web y consultoría tecnológica.",
  },
  en: {
    title: "Web development, software & AI services in Hermosillo",
    lead: "Websites, custom systems, apps, artificial intelligence, maintenance and consulting. All built to stay in production.",
    metaTitle: "Services",
    metaDescription:
      "Northa Digital services in Hermosillo, Sonora: websites, custom systems and admin panels, apps, AI chatbots, website maintenance and technology consulting.",
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/servicios">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/servicios", title: copy[locale].metaTitle, description: copy[locale].metaDescription });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/servicios">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  const c = copy[locale];

  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: dict.nav.services, path: "/servicios" }]} eyebrow={dict.sections.services.eyebrow} title={c.title} lead={c.lead} />
      <section className="pb-12">
        <div className="container-x">
          <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2">
            {services.map((s, i) => {
              const Icon = serviceIcons[s.icon];
              return (
                <RevealItem as="li" key={s.slug}>
                  <SpotlightCard as="article" className="group relative flex h-full flex-col p-8 hover:border-accent-line md:p-10">
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl border border-line bg-bg/60 text-accent-ink">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="font-mono text-xs tracking-[0.2em] text-faint">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h2 className="mt-8 text-[length:var(--text-h3)] text-ink">
                      <Link href={href(locale, `/servicios/${s.slug}`)} className="after:absolute after:inset-0 after:rounded-3xl">
                        {s.name[locale]}
                      </Link>
                    </h2>
                    <p className="mt-3 text-dim">{s.short[locale]}</p>
                    <ul className="mt-6 grid gap-2.5">
                      {s.includes[locale].slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-dim">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold text-accent-ink">
                      {dict.sections.services.cardCta}
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </SpotlightCard>
                </RevealItem>
              );
            })}
            <RevealItem as="li" className="md:col-span-2">
              <Link
                href={href(locale, "/gobierno")}
                className="group flex flex-col gap-4 rounded-3xl border border-dashed border-line-2 p-8 transition-colors hover:border-accent-line hover:bg-accent-soft sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl border border-line bg-surface text-accent-ink">
                    <Landmark className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold text-ink">{dict.sections.gov.title}</span>
                    <span className="block text-dim">{dict.sections.gov.lead}</span>
                  </span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-accent-ink" aria-hidden />
              </Link>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
      <CtaBand locale={locale} location="services_index" />
    </>
  );
}
