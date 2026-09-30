import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Landmark } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Services } from "@/components/sections/Services";

const copy = {
  es: {
    title: "Desarrollo web, apps, IA y más en Hermosillo",
    lead: "Todo lo digital que tu negocio necesita, en un solo equipo.",
    metaTitle: "Servicios",
    metaDescription:
      "Servicios de Northa Digital en Hermosillo, Sonora: páginas web, desarrollo web, apps, portales administradores, chatbots e IA, digitalización, seguridad y VPN, mantenimiento y capacitaciones.",
  },
  en: {
    title: "Web development, apps, AI and more in Hermosillo",
    lead: "Everything digital your business needs, from one team.",
    metaTitle: "Services",
    metaDescription:
      "Northa Digital services in Hermosillo, Sonora: websites, web development, apps, admin portals, AI chatbots and solutions, digitization, security and VPN, maintenance and training.",
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
      <PageHero
        locale={locale}
        crumbs={[{ name: dict.nav.services, path: "/servicios" }]}
        eyebrow={dict.sections.services.eyebrow}
        title={c.title}
        lead={c.lead}
        className="pb-0 md:pb-0"
      />
      <Services locale={locale} showHeading={false} reveal={false} className="pt-14 md:pt-16" />
      <section className="pb-24">
        <div className="container-x">
          <Link
            href={href(locale, "/gobierno")}
            className="group flex flex-col gap-4 rounded-3xl border border-dashed border-line-2 p-7 transition-colors hover:border-accent-line hover:bg-accent-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex items-center gap-4">
              <span className="grid size-11 place-items-center rounded-2xl border border-line bg-surface text-accent-ink">
                <Landmark className="size-5" aria-hidden />
              </span>
              <span className="font-display text-lg font-semibold text-ink">{dict.sections.gov.title}</span>
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-accent-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
