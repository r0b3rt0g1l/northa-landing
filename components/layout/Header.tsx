import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/href";
import { t } from "@/lib/l10n";
import { primaryNav } from "@/content/nav";
import { services } from "@/content/services";
import { blogPathAlternates } from "@/content/blog/posts";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { HeaderClient, type HeaderData } from "./HeaderClient";

export function Header({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const data: HeaderData = {
    locale,
    alternates: blogPathAlternates,
    homeHref: href(locale, "/"),
    nav: primaryNav.map((item) => ({
      key: item.key,
      label: dict.nav[item.key],
      href: href(locale, item.path),
      path: item.path,
    })),
    services: services.map((s) => ({
      slug: s.slug,
      icon: s.icon,
      name: t(s.name, locale),
      short: t(s.short, locale),
      href: href(locale, `/servicios/${s.slug}`),
    })),
    servicesIndexHref: href(locale, "/servicios"),
    govHref: href(locale, "/gobierno"),
    whatsappHref: whatsappUrl(whatsappMessages.general[locale]),
    labels: {
      services: dict.nav.services,
      allServices: dict.nav.allServices,
      gov: dict.nav.gov,
      govLead: dict.sections.gov.title,
      whatsapp: dict.cta.whatsappShort,
      whatsappLong: dict.cta.whatsapp,
      askNort: dict.cta.askNort,
      openMenu: dict.a11y.openMenu,
      closeMenu: dict.a11y.closeMenu,
      primaryNav: dict.a11y.primaryNav,
      brandSwitch: dict.a11y.brandSwitch,
      language: dict.a11y.changeLanguage,
      toLight: dict.a11y.themeToLight,
      toDark: dict.a11y.themeToDark,
      home: dict.nav.home,
      newTab: dict.a11y.newTab,
    },
  };
  return <HeaderClient data={data} />;
}
