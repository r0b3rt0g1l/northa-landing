import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { work, type WorkItem } from "@/content/portfolio";
import { escudoAlt, flota } from "@/content/gov";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CerroMark } from "@/components/brand/CerroMark";
import { AskNortButton } from "@/components/chat/AskNortButton";
import { cn } from "@/lib/utils";

export function Work({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = work.filter((w) => w.published);
  return (
    <Section id="trabajo" labelledBy="trabajo-title" className="bg-bg-2" defer={[2750, 1830]}>
      <div className="container-x">
        <SectionHeading
          id="trabajo-title"
          eyebrow={dict.sections.work.eyebrow}
          title={dict.sections.work.title}
          lead={dict.sections.work.lead}
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08} className={cn(item.size === "wide" && "lg:col-span-2")}>
              <WorkCard item={item} locale={locale} ctaLabel={dict.sections.work[item.ctaKey]} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href={href(locale, "/portfolio")}
            className="group/all inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-bg transition-opacity hover:opacity-90"
          >
            {dict.sections.work.seeAll}
            <ArrowUpRight className="size-4 transition-transform group-hover/all:-translate-y-0.5 group-hover/all:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </Section>
  );
}

function WorkCard({ item, locale, ctaLabel }: { item: WorkItem; locale: Locale; ctaLabel: string }) {
  const wide = item.size === "wide";
  const cta =
    item.action === "open-chat" ? (
      <AskNortButton
        label={ctaLabel}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
      />
    ) : (
      <Link
        href={href(locale, item.href ?? "/")}
        className="group/cta inline-flex h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
      >
        {ctaLabel}
        <ArrowUpRight className="size-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" aria-hidden />
      </Link>
    );

  return (
    <article
      className={cn(
        "group relative grid h-full overflow-hidden rounded-[2rem] border border-line bg-surface/70",
        wide && "lg:grid-cols-[1fr_1.1fr]",
      )}
    >
      <div className="flex flex-col p-7 md:p-10">
        <p className="eyebrow">{item.kicker[locale]}</p>
        <h3 className="mt-4 text-[clamp(1.6rem,1.2rem+1.3vw,2.4rem)] text-ink">{item.title[locale]}</h3>
        <p className="mt-4 max-w-prose text-dim">{item.body[locale]}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {item.facts[locale].map((fact) => (
            <li key={fact} className="rounded-full border border-line bg-bg/50 px-3 py-1 text-xs text-dim">
              {fact}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-8">{cta}</div>
      </div>
      <div className={cn("relative min-h-64 overflow-hidden border-line", wide ? "border-t lg:border-l lg:border-t-0" : "border-t")}>
        {item.visual === "fleet" && <FleetVisual locale={locale} />}
        {item.visual === "chat" && <ChatVisual locale={locale} />}
        {item.visual === "cerro" && <CerroVisual />}
      </div>
    </article>
  );
}

function FleetVisual({ locale }: { locale: Locale }) {
  return (
    <div className="grid h-full grid-cols-4 content-center gap-2.5 p-6 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5">
      {flota.map((m, i) => (
        <div
          key={m.slug}
          className="relative aspect-square rounded-xl bg-paper shadow-[0_8px_24px_-16px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:-translate-y-0.5"
          style={{ transitionDelay: `${i * 25}ms` }}
        >
          <Image src={`/escudos/${m.slug}.png`} alt={escudoAlt(m.nombre, locale)} fill sizes="96px" className="object-contain p-2" />
        </div>
      ))}
    </div>
  );
}

/** Ilustración de la interfaz de Nort (no es una conversación real). */
function ChatVisual({ locale }: { locale: Locale }) {
  const lines =
    locale === "es"
      ? ["Necesito una página para mi despacho", "¡Va! ¿Para quién es y para cuándo la necesitas?", "Para el próximo mes"]
      : ["I need a website for my firm", "Sure! Who is it for, and when do you need it?", "Next month"];
  return (
    <div aria-hidden className="flex h-full flex-col justify-center gap-3 bg-[radial-gradient(120%_80%_at_80%_0%,var(--accent-soft),transparent_60%)] p-7">
      <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-accent-strong px-4 py-2.5 text-sm text-accent-contrast">{lines[0]}</p>
      <div className="flex max-w-[88%] gap-2">
        <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#1a3270,#060a16)]">
          <Sparkles className="size-3.5 text-white" />
        </span>
        <p className="rounded-2xl rounded-bl-md border border-line bg-surface-2 px-4 py-2.5 text-sm text-ink">{lines[1]}</p>
      </div>
      <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-accent-strong/80 px-4 py-2.5 text-sm text-accent-contrast">{lines[2]}</p>
    </div>
  );
}

function CerroVisual() {
  return (
    <div className="relative grid h-full min-h-64 place-items-center bg-[linear-gradient(180deg,#140f24,#060a16)]">
      <div
        aria-hidden
        className="absolute inset-0 bg-northa opacity-40 [mask:url(/brand/contours.svg)_center/140%_no-repeat] transition-transform duration-[2s] ease-out group-hover:scale-110"
      />
      <CerroMark id="work-cerro" size={120} className="relative drop-shadow-[0_20px_40px_rgba(255,46,126,0.35)]" />
    </div>
  );
}
