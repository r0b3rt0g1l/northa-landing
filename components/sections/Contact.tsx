import { CalendarDays, Mail, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { site } from "@/lib/site";
import { services } from "@/content/services";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { deferRender } from "@/lib/utils";

export function Contact({
  locale,
  headingLevel = "h2",
  defer = false,
}: {
  locale: Locale;
  headingLevel?: "h1" | "h2";
  /** true cuando la sección va al final de una página larga (home). */
  defer?: boolean;
}) {
  const dict = getDictionary(locale);
  const c = dict.sections.contact;
  const Heading = headingLevel;
  const wa = whatsappUrl(whatsappMessages.general[locale]);
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="relative overflow-hidden py-24 md:py-32"
      {...(defer ? deferRender(1710, 980) : {})}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 size-[50rem] bg-[radial-gradient(closest-side,var(--color-accent),transparent)] opacity-[0.07]"
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-5">{c.eyebrow}</p>
          <Heading id="contacto-title" className="text-[length:var(--text-h1)] text-ink">
            {c.title}
          </Heading>
          <p className="mt-5 max-w-md text-[length:var(--text-lead)] text-dim">{c.lead}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <TrackedLink
              href={wa}
              event="whatsapp_click"
              eventProps={{ location: "contact" }}
              newTabLabel={dict.a11y.newTab}
              className="inline-flex h-13 items-center gap-2.5 rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast shadow-[0_14px_50px_-12px_var(--accent)] transition-transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="size-5" />
              {dict.cta.whatsapp}
            </TrackedLink>
            {site.calUrl && (
              <TrackedLink
                href={site.calUrl}
                event="call_booking_click"
                eventProps={{ location: "contact" }}
                newTabLabel={dict.a11y.newTab}
                className="inline-flex h-13 items-center gap-2.5 rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
              >
                <CalendarDays className="size-4 text-accent-ink" aria-hidden />
                {dict.cta.book}
              </TrackedLink>
            )}
          </div>
          <dl className="mt-12 grid gap-5 border-t border-line pt-8">
            <div className="flex items-center gap-4">
              <dt className="grid size-10 place-items-center rounded-full border border-line text-accent-ink">
                <WhatsAppIcon className="size-4" />
                <span className="sr-only">{c.whatsappLabel}</span>
              </dt>
              <dd>
                <TrackedLink href={wa} event="whatsapp_click" eventProps={{ location: "contact_list" }} newTabLabel={dict.a11y.newTab} className="text-ink hover:text-accent-ink">
                  {site.contact.phoneDisplay}
                </TrackedLink>
              </dd>
            </div>
            <div className="flex items-center gap-4">
              <dt className="grid size-10 place-items-center rounded-full border border-line text-accent-ink">
                <Mail className="size-4" aria-hidden />
                <span className="sr-only">{c.emailLabel}</span>
              </dt>
              <dd>
                <TrackedLink href={`mailto:${site.contact.email}`} event="email_click" className="break-all text-ink hover:text-accent-ink">
                  {site.contact.email}
                </TrackedLink>
              </dd>
            </div>
            <div className="flex items-center gap-4">
              <dt className="grid size-10 place-items-center rounded-full border border-line text-accent-ink">
                <MapPin className="size-4" aria-hidden />
                <span className="sr-only">{c.locationLabel}</span>
              </dt>
              <dd className="text-ink">{c.location}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="self-start rounded-[2rem] border border-line bg-surface/70 p-6 md:p-10">
          <h3 className="mb-8 font-display text-2xl font-bold text-ink">{c.formTitle}</h3>
          <ContactForm
            dict={dict.form}
            locale={locale}
            services={[...services.map((s) => s.name[locale]), dict.nav.gov]}
            privacyHref={href(locale, "/privacidad")}
            newTabLabel={dict.a11y.newTab}
            fallbackWhatsapp={wa}
          />
        </Reveal>
      </div>
    </section>
  );
}
