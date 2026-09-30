import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { htmlLang, isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { href } from "@/lib/i18n/href";
import { site } from "@/lib/site";
import { whatsappMessages, whatsappUrl } from "@/lib/whatsapp";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandSync } from "@/components/layout/Preferences";
import { HashAlign } from "@/components/layout/HashAlign";
import { FaviconAnimator } from "@/components/brand/FaviconAnimator";
import { NortWidget } from "@/components/chat/NortWidget";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    applicationName: site.name,
    authors: [{ name: site.founder }],
    creator: site.name,
    ...pageMetadata({ locale, path: "/" }),
    title: { default: dict.meta.defaultTitle, template: dict.meta.titleTemplate },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060a16" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
  ],
  colorScheme: "dark light",
};

/**
 * Corre antes del primer pintado: aplica tema y pausa guardados, y el acento
 * de Amplía si la URL es /amplia. Sin esto habría un destello al cargar.
 */
const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("northa-theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(localStorage.getItem("northa-motion")==="paused")d.dataset.motion="paused";}catch(e){}if(/^\\/(en\\/)?amplia(\\/|$)/.test(location.pathname))d.dataset.brand="amplia";})();`;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  // Vercel Analytics y Speed Insights solo existen en Vercel (/_vercel/...). Fuera
  // de ahí sus scripts darían 404 y errores en consola (Lighthouse los penaliza).
  const onVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);

  return (
    <html
      lang={htmlLang[locale]}
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={fontVariables}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.venn-circle{animation:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#contenido"
          className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-accent-strong px-5 py-3 font-semibold text-accent-contrast transition-transform focus:translate-y-0"
        >
          {dict.a11y.skip}
        </a>
        <Header locale={locale} />
        <main id="contenido" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer locale={locale} />
        <NortWidget
          locale={locale}
          dict={dict.chat}
          whatsappHref={whatsappUrl(whatsappMessages.general[locale])}
          privacyHref={href(locale, "/privacidad")}
          calUrl={site.calUrl}
          newTabLabel={dict.a11y.newTab}
        />
        <BrandSync />
        <HashAlign />
        <FaviconAnimator />
        {onVercel && <Analytics />}
        {onVercel && <SpeedInsights />}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
