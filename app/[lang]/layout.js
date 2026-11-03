import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { sora, manrope, jetbrainsMono } from "@/lib/fonts";
import { buildMetadata, defaultViewport } from "@/lib/seo";
import { locales } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Starfield } from "@/components/fondo/Starfield";
import { GlassPointer } from "@/components/fondo/GlassPointer";
import { Cursor } from "@/components/cursor/Cursor";
import { Asistente } from "@/components/asistente/Asistente";
import { AnclasInternas } from "@/components/ui/AnclasInternas";
import "../globals.css";

export const viewport = defaultViewport;

// Solo «es» y «en»: el proxy (proxy.js) manda cualquier otra ruta a «es».
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return buildMetadata(lang);
}

// Analítica de Vercel solo donde existe (evita 404 en local).
const enVercel = Boolean(process.env.VERCEL);

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const ui = getUi(lang);

  return (
    <html lang={lang} className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh text-text antialiased">
        <LocaleProvider locale={lang}>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-text focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg focus:outline-2 focus:outline-offset-4 focus:outline-accent"
          >
            {ui.skip}
          </a>
          <Starfield />
          <GlassPointer />
          <Cursor />
          <AnclasInternas />
          <Nav />
          <main id="contenido" className="relative z-10">
            {children}
          </main>
          <Footer locale={lang} />
          <Asistente />
          {enVercel ? (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          ) : null}
        </LocaleProvider>
      </body>
    </html>
  );
}
