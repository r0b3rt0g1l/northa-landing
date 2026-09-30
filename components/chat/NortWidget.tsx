"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { OPEN_CHAT_EVENT } from "@/lib/chat-events";
import { track } from "@/lib/analytics";
import { StarGlyph } from "@/components/ui/Icons";
import { isAmpliaPath } from "@/components/layout/Preferences";
import { splitLocale } from "@/lib/i18n/href";
import { cn } from "@/lib/utils";
import type { NortShellProps } from "./types";

// El panel (y el SDK de IA) se descargan hasta que alguien abre el chat.
const NortPanel = dynamic(() => import("./NortPanel"), { ssr: false });

const TEASER_KEY = "nort-teaser-shown";

// ¿Sigue a la vista el hero del inicio (el Cerro)?
function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}
const heroInView = () => window.scrollY < window.innerHeight * 0.5;

export function NortWidget(props: NortShellProps) {
  const { dict } = props;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState<string | undefined>();
  const [teaser, setTeaser] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const openChat = useCallback((source: string, initialPrompt?: string) => {
    setPrompt(initialPrompt);
    setMounted(true);
    setOpen(true);
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* sin almacenamiento */
    }
    track("chat_opened", { source });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Abrir desde cualquier botón del sitio.
  useEffect(() => {
    const onOpen = (e: Event) => openChat("button", (e as CustomEvent<{ prompt?: string }>).detail?.prompt);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [openChat]);

  // Precarga el panel (y el SDK de IA) cuando hay intención: cursor, foco o toque
  // sobre el botón. No se descarga "por si acaso": así no pesa en la carga inicial.
  const preload = useCallback(() => void import("./NortPanel"), []);

  // En el inicio, mientras se ve el Cerro, el botón se esconde en celular (tapaba
  // la barra de hora y clima) y la sugerencia espera a que la persona baje.
  // Ojo: usePathname puede traer la ruta interna reescrita ("/es").
  const isHome = splitLocale(pathname).path === "/";
  const overHero = useSyncExternalStore(subscribeScroll, heroInView, () => true) && isHome;

  // La sugerencia se va sola a los 9 s (no se queda tapando el contenido).
  useEffect(() => {
    if (!teaser) return;
    const t = window.setTimeout(() => setTeaser(false), 9000);
    return () => window.clearTimeout(t);
  }, [teaser]);

  // Sugerencia discreta: una vez por sesión, a los 25 s o al 55 % de la página.
  useEffect(() => {
    if (isAmpliaPath(pathname)) return;
    try {
      if (sessionStorage.getItem(TEASER_KEY)) return;
    } catch {
      return;
    }
    let done = false;
    let due = false;
    const show = () => {
      if (done) return;
      if (isHome && heroInView()) {
        due = true;
        return;
      }
      done = true;
      setTeaser(true);
      try {
        sessionStorage.setItem(TEASER_KEY, "1");
      } catch {
        /* sin almacenamiento */
      }
    };
    const timer = window.setTimeout(show, 25000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (due || (max > 0 && window.scrollY / max > 0.55)) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, isHome]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 flex flex-col items-end gap-3 md:bottom-6 md:right-6",
        open ? "z-[70]" : "z-40",
      )}
    >
      {teaser && !open && (
        <div
          className="glass flex max-w-[16rem] animate-[pop-in_0.35s_var(--ease-out-expo)_both] items-start gap-2 rounded-2xl border border-line py-3 pl-4 pr-2 text-sm text-ink shadow-[var(--shadow)]"
          role="status"
        >
          <button type="button" onClick={() => openChat("teaser")} className="text-left">
            {dict.teaser}
          </button>
          <button
            type="button"
            onClick={() => setTeaser(false)}
            aria-label={dict.dismissTeaser}
            className="grid size-6 shrink-0 place-items-center rounded-full text-faint hover:text-ink"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
      )}

      {mounted && (
        <NortPanel
          {...props}
          open={open}
          onClose={close}
          initialPrompt={prompt}
          onPromptUsed={() => setPrompt(undefined)}
        />
      )}

      <button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls="nort-panel"
        // Cerrado, el nombre accesible es el texto visible (WCAG 2.5.3); abierto solo hay una X.
        aria-label={open ? dict.close : undefined}
        onClick={() => (open ? close() : openChat("launcher"))}
        onPointerEnter={preload}
        onFocus={preload}
        onTouchStart={preload}
        className={cn(
          "group relative inline-flex h-14 items-center gap-3 rounded-full border border-line-2 bg-surface/90 pl-2 pr-5 text-ink shadow-[0_18px_50px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-[transform,border-color,opacity,visibility] duration-300 hover:-translate-y-0.5 hover:border-accent-line",
          open && "pr-2 max-md:hidden",
          overHero && !open && "max-md:invisible max-md:translate-y-6 max-md:opacity-0",
        )}
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#2a3d72,#0a1124)]">
          <span
            aria-hidden
            className="absolute inset-0 animate-pulse-soft rounded-full shadow-[0_0_24px_2px_var(--accent)] [animation-duration:4s]"
          />
          {open ? (
            <X className="relative size-4 text-white" aria-hidden />
          ) : (
            <StarGlyph className="relative size-5 text-white transition-transform duration-700 group-hover:rotate-90" />
          )}
        </span>
        {!open && (
          <span className="text-[0.92rem] font-semibold">
            <span className="hidden sm:inline">{dict.launcher}</span>
            <span className="sm:hidden">{dict.launcherShort}</span>
          </span>
        )}
      </button>
    </div>
  );
}
