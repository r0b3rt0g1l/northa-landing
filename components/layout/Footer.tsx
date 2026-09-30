import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/href";
import { t } from "@/lib/l10n";
import { site } from "@/lib/site";
import { deferRender } from "@/lib/utils";
import { services } from "@/content/services";
import { blogPathAlternates } from "@/content/blog/posts";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { NorthaLogo } from "@/components/brand/CerroMark";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { LocaleSwitch, MotionToggle, ThemeToggle } from "./Preferences";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();
  const company = [
    { label: dict.nav.work, to: "/portfolio" },
    { label: dict.nav.process, to: "/#proceso" },
    { label: dict.nav.gov, to: "/gobierno" },
    { label: dict.nav.blog, to: "/blog" },
    { label: "Amplía Consultoría", to: "/amplia" },
    { label: dict.nav.contact, to: "/contacto" },
  ];

  return (
    <footer
      {...deferRender(1380, 840)}
      data-theme="dark"
      className="relative overflow-hidden border-t border-white/10 bg-[linear-gradient(180deg,var(--navy)_0%,#07112b_55%,#060a16_100%)] text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[44rem] bg-line-2 opacity-40 [mask:url(/brand/contours.svg)_center/contain_no-repeat]"
      />
      <div className="container-x relative py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href={href(locale, "/")} className="inline-block rounded-full" aria-label="Northa Digital">
              <NorthaLogo id="ftr" size={44} />
            </Link>
            <p className="mt-6 max-w-xs text-dim">{dict.footer.tagline}</p>
            <p className="mt-3 max-w-xs text-sm text-faint">{dict.footer.madeIn}</p>
          </div>

          <nav aria-label={dict.a11y.footerNav} className="grid gap-10 sm:grid-cols-3 md:col-span-8">
            <div>
              <h2 className="eyebrow mb-4 !text-faint">{dict.footer.services}</h2>
              <ul className="grid gap-2.5">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={href(locale, `/servicios/${s.slug}`)} className="text-dim transition-colors hover:text-ink">
                      {t(s.name, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-4 !text-faint">{dict.footer.company}</h2>
              <ul className="grid gap-2.5">
                {company.map((c) => (
                  <li key={c.to}>
                    <Link href={href(locale, c.to)} className="text-dim transition-colors hover:text-ink">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-4 !text-faint">{dict.footer.contact}</h2>
              <ul className="grid gap-3">
                <li>
                  <TrackedLink
                    href={whatsappUrl(whatsappMessages.general[locale])}
                    event="whatsapp_click"
                    eventProps={{ location: "footer" }}
                    newTabLabel={dict.a11y.newTab}
                    className="inline-flex items-center gap-2 text-dim transition-colors hover:text-ink"
                  >
                    <WhatsAppIcon className="size-4 text-accent-ink" />
                    {site.contact.phoneDisplay}
                  </TrackedLink>
                </li>
                <li>
                  <TrackedLink
                    href={`mailto:${site.contact.email}`}
                    event="email_click"
                    className="inline-flex items-center gap-2 break-all text-dim transition-colors hover:text-ink"
                  >
                    <Mail className="size-4 shrink-0 text-accent-ink" aria-hidden />
                    {site.contact.email}
                  </TrackedLink>
                </li>
                <li className="inline-flex items-center gap-2 text-dim">
                  <MapPin className="size-4 text-accent-ink" aria-hidden />
                  {dict.sections.contact.location}
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-faint">
            <span>
              © {year} Northa Digital. {dict.footer.rights}
            </span>
            <Link href={href(locale, "/privacidad")} className="underline-offset-4 hover:text-ink hover:underline">
              {dict.nav.privacy}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3" aria-label={dict.footer.preferences} role="group">
            <MotionToggle labels={{ pause: dict.a11y.pauseMotion, play: dict.a11y.playMotion }} />
            <LocaleSwitch locale={locale} label={dict.a11y.changeLanguage} alternates={blogPathAlternates} />
            <ThemeToggle labels={{ toLight: dict.a11y.themeToLight, toDark: dict.a11y.themeToDark }} />
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none select-none text-center font-display text-[clamp(5rem,18vw,17rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--line-2)]"
      >
        Northa
      </p>
    </footer>
  );
}
