import type { Metadata, Viewport } from "next";
import "../../globals.css";
import { fontVariables } from "@/lib/fonts";

/**
 * Layout raíz del portal interno de Amplía (/amplia/portal).
 * Es independiente del sitio público: solo español, sin header de marketing,
 * sin Nort y sin analítica. Nunca se indexa.
 */
export const metadata: Metadata = {
  title: { default: "Portal del equipo · Amplía Consultoría", template: "%s · Portal Amplía" },
  description: "Portal interno de Amplía Consultoría.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: "/amplia/enso.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a1124" },
    { media: "(prefers-color-scheme: light)", color: "#faf7f3" },
  ],
  colorScheme: "dark light",
};

const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("northa-theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(localStorage.getItem("northa-motion")==="paused")d.dataset.motion="paused";}catch(e){}})();`;

export default function PortalRootLayout({ children }: LayoutProps<"/amplia/portal">) {
  return (
    <html lang="es-MX" data-theme="dark" data-brand="amplia" suppressHydrationWarning className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#contenido"
          className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-accent-strong px-5 py-3 font-semibold text-accent-contrast transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
