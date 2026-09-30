"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { Moon, Pause, Play, Sun } from "lucide-react";
import { localeLabel, locales, type Locale } from "@/lib/i18n/config";
import { href, splitLocale, switchLocaleHref, type PathAlternates } from "@/lib/i18n/href";
import { setMotionPaused, useCalmMotion } from "@/lib/hooks";
import { StarGlyph } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tema                                                                */
/* ------------------------------------------------------------------ */

const THEME_EVENT = "northa:theme";

function readTheme(): "dark" | "light" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const theme = useSyncExternalStore(
    (cb) => {
      window.addEventListener(THEME_EVENT, cb);
      return () => window.removeEventListener(THEME_EVENT, cb);
    },
    readTheme,
    () => "dark" as const,
  );
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("northa-theme", next);
        } catch {
          /* sin almacenamiento */
        }
        window.dispatchEvent(new Event(THEME_EVENT));
      }}
      className="grid size-10 place-items-center rounded-full text-dim transition-colors hover:bg-accent-soft hover:text-ink"
      aria-label={theme === "dark" ? labels.toLight : labels.toDark}
      title={theme === "dark" ? labels.toLight : labels.toDark}
    >
      {theme === "dark" ? <Sun className="size-[1.1rem]" aria-hidden /> : <Moon className="size-[1.1rem]" aria-hidden />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Idioma                                                              */
/* ------------------------------------------------------------------ */

export function LocaleSwitch({
  locale,
  label,
  alternates,
}: {
  locale: Locale;
  label: string;
  alternates?: PathAlternates;
}) {
  const pathname = usePathname();
  return (
    <div className="flex items-center rounded-full border border-line p-0.5 font-mono text-[0.7rem]">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={switchLocaleHref(pathname, l, alternates)}
            // Cambiar de idioma es poco frecuente: sin prefetch (y sin pedir páginas que no existan).
            prefetch={false}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            aria-label={active ? localeLabel[l].long : `${label} ${localeLabel[l].long}`}
            className={cn(
              "grid h-8 min-w-9 place-items-center rounded-full px-2 tracking-[0.12em] transition-colors",
              active ? "bg-surface-2 text-ink" : "text-faint hover:text-ink",
            )}
          >
            {localeLabel[l].short}
          </Link>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pausa global de animaciones (WCAG 2.2.2)                            */
/* ------------------------------------------------------------------ */

export function MotionToggle({ labels, className }: { labels: { pause: string; play: string }; className?: string }) {
  const calm = useCalmMotion();
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!calm)}
      aria-pressed={calm}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:border-accent-line hover:text-ink",
        className,
      )}
    >
      {calm ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
      {calm ? labels.play : labels.pause}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Northa ⇄ Amplía                                                     */
/* ------------------------------------------------------------------ */

export function isAmpliaPath(pathname: string) {
  return splitLocale(pathname).path.startsWith("/amplia");
}

/** Mantiene `data-brand` en <html> sincronizado con la ruta (el script inline cubre la primera carga). */
export function BrandSync() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    if (isAmpliaPath(pathname)) root.dataset.brand = "amplia";
    else delete root.dataset.brand;
  }, [pathname]);
  return null;
}

export function BrandSwitch({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  const pathname = usePathname();
  const amplia = isAmpliaPath(pathname);
  const items = [
    { key: "northa", text: "Northa", to: href(locale, "/"), active: !amplia },
    { key: "amplia", text: "Amplía", to: href(locale, "/amplia"), active: amplia },
  ];
  return (
    <nav
      aria-label={label}
      className={cn("relative grid grid-cols-2 items-center rounded-full border border-line bg-surface/60 p-1", className)}
    >
      {/* Pastilla que se desliza al cambiar de marca (CSS, sin JS de animación) */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-surface-2 shadow-[inset_0_0_0_1px_var(--accent-line)] transition-transform duration-500 ease-out-expo",
          amplia && "translate-x-full",
        )}
      />
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.to}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "relative z-10 inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-[0.8rem] font-semibold transition-colors",
            item.active ? "text-ink" : "text-faint hover:text-ink",
          )}
        >
          {item.key === "northa" ? (
            <StarGlyph className="size-3 text-northa" />
          ) : (
            <span aria-hidden className="block size-2.5 rounded-full border-2 border-amplia" />
          )}
          {item.text}
        </Link>
      ))}
    </nav>
  );
}
