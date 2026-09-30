import Link from "next/link";
import { ArrowUpRight, Landmark } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { services, type Service } from "@/content/services";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SpotlightCard } from "@/components/ui/Spotlight";
import { serviceIcons } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function Services({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Section id="servicios" labelledBy="servicios-title" defer={[2650, 1660]}>
      <div className="container-x">
        <SectionHeading
          id="servicios-title"
          eyebrow={dict.sections.services.eyebrow}
          title={dict.sections.services.title}
          lead={dict.sections.services.lead}
        />
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal
              as="li"
              key={service.slug}
              delay={Math.min(i, 3) * 0.06}
              className={cn(i === 0 && "md:col-span-2 lg:row-span-2")}
            >
              <ServiceCard service={service} index={i} locale={locale} cta={dict.sections.services.cardCta} featured={i === 0} />
            </Reveal>
          ))}
          <Reveal as="li" className="md:col-span-2 lg:col-span-3">
            <Link
              href={href(locale, "/gobierno")}
              className="group flex flex-col gap-4 rounded-3xl border border-dashed border-line-2 p-6 transition-colors hover:border-accent-line hover:bg-accent-soft sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="flex items-center gap-4">
                <span className="grid size-11 place-items-center rounded-2xl border border-line bg-surface text-accent-ink">
                  <Landmark className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-ink">{dict.sections.gov.title}</span>
                  <span className="block text-sm text-dim">{dict.sections.gov.lead}</span>
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-ink">
                {dict.sections.gov.cta}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </Reveal>
        </ul>
      </div>
    </Section>
  );
}

function ServiceCard({
  service,
  index,
  locale,
  cta,
  featured,
}: {
  service: Service;
  index: number;
  locale: Locale;
  cta: string;
  featured: boolean;
}) {
  const Icon = serviceIcons[service.icon];
  return (
    <SpotlightCard
      as="article"
      className={cn(
        "group relative flex h-full flex-col overflow-hidden p-7 transition-colors duration-300 hover:border-accent-line",
        featured && "lg:p-9",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-2xl border border-line bg-bg/60 text-accent-ink transition-colors group-hover:border-accent-line">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="font-mono text-xs tracking-[0.2em] text-faint">{String(index + 1).padStart(2, "0")}</span>
      </div>

      {featured && <WebsiteSketch />}

      <h3 className={cn("mt-8 text-ink", featured ? "text-[clamp(1.6rem,1.2rem+1.2vw,2.3rem)]" : "text-[length:var(--text-h3)]")}>
        <Link
          href={href(locale, `/servicios/${service.slug}`)}
          className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent-2"
        >
          {service.name[locale]}
        </Link>
      </h3>
      <p className="mt-3 text-dim">{service.short[locale]}</p>

      {featured && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {service.includes[locale].slice(0, 4).map((item) => (
            <li key={item} className="rounded-full border border-line px-3 py-1 text-xs text-dim">
              {item}
            </li>
          ))}
        </ul>
      )}

      <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold text-accent-ink">
        {cta}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </SpotlightCard>
  );
}

/** Boceto abstracto de un sitio (ilustración, no captura de pantalla). */
function WebsiteSketch() {
  return (
    <div aria-hidden className="mt-8 hidden overflow-hidden rounded-2xl border border-line bg-bg/70 md:block">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-line-2" />
        <span className="size-2.5 rounded-full bg-line-2" />
        <span className="size-2.5 rounded-full bg-line-2" />
        <span className="ml-4 h-5 flex-1 rounded-full bg-surface-2" />
      </div>
      <div className="relative grid grid-cols-5 gap-4 p-5">
        <div className="col-span-3 space-y-2.5">
          <span className="block h-2 w-20 rounded-full bg-accent/70" />
          <span className="block h-5 w-11/12 rounded-md bg-line-2" />
          <span className="block h-5 w-8/12 rounded-md bg-line-2" />
          <span className="block h-2 w-10/12 rounded-full bg-line" />
          <span className="block h-2 w-9/12 rounded-full bg-line" />
          <span className="mt-4 block h-8 w-28 rounded-full bg-accent-strong/90" />
        </div>
        <div className="col-span-2 grid place-items-center rounded-xl bg-[linear-gradient(180deg,#1d1233,#060a16)]">
          <svg viewBox="0 0 64 40" className="w-4/5">
            <path d="M2 38L11 35.6L14.5 32.2L19.5 25L23.5 19.2L27.5 16.1L32 15.2L36.5 16.1L40.5 19.2L44.5 25L49.5 32.2L53 35.6L62 38Z" fill="#cfcfd9" />
            <path d="M20.2 24Q32 27.2 43.8 24" fill="none" stroke="#ff2e7e" strokeWidth="1.2" />
            <path d="M32 2.5L33.9 7.9L38.1 9.8L33.9 11.7L32 17.1L30.1 11.7L25.9 9.8L30.1 7.9Z" fill="#f5f5f7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
