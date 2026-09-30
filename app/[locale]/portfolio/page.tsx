import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { absoluteUrl, href } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd, portfolioJsonLd } from "@/lib/jsonld";
import { projects } from "@/content/portfolio";
import { flota, govStats } from "@/content/gov";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { PortfolioGrid, type PortfolioCard } from "@/components/portfolio/PortfolioGrid";
import { deferRender } from "@/lib/utils";

const blogSlug = { es: "/blog/como-operamos-catorce-portales", en: "/blog/how-we-run-fourteen-sites" } as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/portfolio">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = getDictionary(locale).sections.portfolio;
  return pageMetadata({ locale, path: "/portfolio", title: p.eyebrow, description: `${p.title} ${p.lead}`, ogSubtitle: p.title });
}

export default async function PortfolioPage({ params }: PageProps<"/[locale]/portfolio">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  const p = dict.sections.portfolio;

  const cards: PortfolioCard[] = projects.map((pr) => ({
    id: pr.id,
    category: pr.category,
    title: pr.title[locale],
    summary: pr.summary[locale],
    tags: pr.tags[locale],
    url: pr.url,
    href: pr.href ? href(locale, pr.href) : undefined,
    action: pr.action,
    screenshot: pr.screenshot,
    logo: pr.logo,
  }));

  return (
    <>
      <JsonLd
        data={portfolioJsonLd({
          locale,
          name: `${p.eyebrow} · ${site.name}`,
          description: p.lead,
          items: cards
            .filter((c) => c.url || c.href)
            .map((c) => ({ name: c.title, description: c.summary, url: c.url ?? absoluteUrl(site.url, locale, projects.find((x) => x.id === c.id)?.href ?? "/") })),
        })}
      />
      <PageHero locale={locale} crumbs={[{ name: dict.nav.work, path: "/portfolio" }]} eyebrow={p.eyebrow} title={p.title} lead={p.lead} />

      {/* Caso destacado: la plataforma */}
      <section aria-labelledby="featured-title" className="pb-16 md:pb-24">
        <div className="container-x">
          <Reveal className="grid overflow-hidden rounded-[2rem] border border-line bg-surface/70 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 md:p-12">
              <p className="eyebrow">{p.featuredEyebrow}</p>
              <h2 id="featured-title" className="mt-4 text-[clamp(1.9rem,1.3rem+2vw,3rem)] text-ink">
                {p.featuredTitle}
              </h2>
              <p className="mt-4 max-w-xl text-[length:var(--text-lead)] text-dim">{p.featuredBody}</p>
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
                {govStats.map((s) => (
                  <div key={s.label.es} className="bg-surface p-4">
                    <dt className="sr-only">{s.label[locale]}</dt>
                    <dd>
                      <span className="block font-display text-3xl font-extrabold tracking-[-0.04em] text-ink">{s.value}</span>
                      <span className="mt-1 block text-xs text-faint">{s.label[locale]}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={href(locale, blogSlug[locale])}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
                >
                  {p.featuredCta}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href={href(locale, "/gobierno")}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
                >
                  {p.featuredGov}
                </Link>
              </div>
            </div>
            <PlatformDiagram locale={locale} />
          </Reveal>
        </div>
      </section>

      <section aria-label={p.filterLabel} className="pb-8" {...deferRender(9760, 3760)}>
        <div className="container-x">
          <PortfolioGrid
            items={cards}
            labels={{
              filterLabel: p.filterLabel,
              all: p.all,
              categories: p.categories,
              count: p.count,
              countOne: p.countOne,
              live: p.live,
              open: p.open,
              screenshotAlt: p.screenshotAlt,
              tagsLabel: p.tagsLabel,
              newTab: dict.a11y.newTab,
              tryNort: dict.sections.work.tryNort,
            }}
          />
        </div>
      </section>

      <CtaBand locale={locale} location="portfolio" />
    </>
  );
}

/** Diagrama: un backend → un panel → catorce dominios. SVG accesible. */
function PlatformDiagram({ locale }: { locale: "es" | "en" }) {
  const title = locale === "es" ? "Diagrama: un backend y un panel sirven a catorce portales" : "Diagram: one backend and one panel serve fourteen portals";
  const nodes = flota.map((m, i) => {
    const angle = (i / flota.length) * Math.PI * 2 - Math.PI / 2;
    return { x: 200 + Math.cos(angle) * 150, y: 200 + Math.sin(angle) * 150, name: m.nombre };
  });
  return (
    <div className="relative grid place-items-center border-t border-line bg-[radial-gradient(80%_80%_at_50%_50%,var(--navy-glow),transparent_70%)] p-6 lg:border-l lg:border-t-0">
      <svg viewBox="0 0 400 400" className="w-full max-w-[26rem]" role="img" aria-label={title}>
        {nodes.map((n) => (
          <line key={`l-${n.name}`} x1="200" y1="200" x2={n.x} y2={n.y} stroke="var(--line-2)" strokeWidth="1" />
        ))}
        <circle cx="200" cy="200" r="96" fill="none" stroke="var(--line)" strokeDasharray="3 6" />
        {nodes.map((n) => (
          <g key={n.name}>
            <circle cx={n.x} cy={n.y} r="15" fill="var(--surface-2)" stroke="var(--accent-line)" />
            <circle cx={n.x} cy={n.y} r="3.5" fill="var(--accent)" />
          </g>
        ))}
        <circle cx="200" cy="200" r="54" fill="var(--navy)" stroke="var(--accent)" strokeWidth="1.5" />
        <text x="200" y="194" textAnchor="middle" className="fill-white font-mono text-[11px] uppercase tracking-[0.18em]">
          Backend
        </text>
        <text x="200" y="212" textAnchor="middle" className="fill-[var(--accent-2)] font-mono text-[10px] uppercase tracking-[0.18em]">
          + {locale === "es" ? "panel" : "admin"}
        </text>
      </svg>
    </div>
  );
}
