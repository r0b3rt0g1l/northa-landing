import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { bricolageGrotesque, karla, jetbrainsMono } from "@/lib/fonts";
import { buildMetadata, defaultViewport } from "@/lib/seo";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

export const metadata = buildMetadata();
export const viewport = defaultViewport;

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${bricolageGrotesque.variable} ${karla.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido principal
        </a>
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
