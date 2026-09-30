import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { plans } from "@/content/plans";
import { whatsappUrl } from "@/lib/whatsapp";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { cn } from "@/lib/utils";

const mxn = (n: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

export function Plans({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const p = dict.sections.plans;
  return (
    <Section id="planes" labelledBy="planes-title" defer={[1910, 1060]}>
      <div className="container-x">
        <SectionHeading id="planes-title" eyebrow={p.eyebrow} title={p.title} lead={p.lead} align="center" />
        <RevealGroup as="ul" className="mx-auto mt-14 grid max-w-6xl gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <RevealItem
              as="li"
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-[2rem] border p-8",
                plan.featured
                  ? "border-accent-line bg-surface shadow-[0_30px_80px_-40px_var(--accent)]"
                  : "border-line bg-surface/60",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-accent-strong px-3 py-1 text-xs font-semibold text-accent-contrast">
                  {p.featured}
                </span>
              )}
              <h3 className="font-display text-2xl font-bold text-ink">{plan.name}</h3>
              <p className="mt-2 text-dim">{plan.tagline[locale]}</p>
              <p className="mt-6 border-y border-line py-4 font-display text-lg font-semibold text-ink">
                {plan.priceFrom ? (
                  <>
                    <span className="text-sm font-normal text-faint">{p.priceFrom} </span>
                    {mxn(plan.priceFrom, locale)}
                    <span className="text-sm font-normal text-faint"> {p.perMonth}</span>
                  </>
                ) : (
                  p.priceOnRequest
                )}
              </p>
              <ul className="mt-6 grid gap-3">
                {plan.features[locale].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-dim">
                    <Check className="mt-1 size-4 shrink-0 text-accent-ink" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <TrackedLink
                href={whatsappUrl(
                  locale === "es"
                    ? `Hola Northa 👋 Me interesa el plan ${plan.name}. ¿Me pueden cotizar?`
                    : `Hi Northa 👋 I'm interested in the ${plan.name} plan. Could you send me a quote?`,
                )}
                event="whatsapp_click"
                eventProps={{ location: `plan_${plan.id}` }}
                newTabLabel={dict.a11y.newTab}
                className={cn(
                  "mt-8 inline-flex h-12 items-center justify-center rounded-full font-semibold transition-[transform,background-color] hover:-translate-y-0.5",
                  plan.featured ? "bg-accent-strong text-accent-contrast" : "border border-line-2 text-ink hover:bg-accent-soft",
                )}
              >
                {dict.cta.quote}
              </TrackedLink>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
