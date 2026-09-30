"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile (anti-spam sin captcha visual), OPCIONAL.
 * Se activa solo si existen NEXT_PUBLIC_TURNSTILE_SITE_KEY (aquí) y
 * TURNSTILE_SECRET_KEY (verificación en /api/leads). Sin llaves no carga nada.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const turnstileEnabled = !!SITE_KEY;

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
}

let loader: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  loader ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loader = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(script);
  });
  return loader;
}

/** `onToken` debe ser estable (p. ej. el setter de un useState). */
export function Turnstile({ onToken, locale }: { onToken: (token: string | null) => void; locale: "es" | "en" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!SITE_KEY || !el) return;
    let widgetId: string | undefined;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        const api = (window as Window & { turnstile?: TurnstileApi }).turnstile;
        if (cancelled || !api) return;
        widgetId = api.render(el, {
          sitekey: SITE_KEY,
          language: locale,
          theme: "auto",
          appearance: "interaction-only",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      })
      .catch(() => onToken(null));
    return () => {
      cancelled = true;
      const api = (window as Window & { turnstile?: TurnstileApi }).turnstile;
      if (widgetId && api) api.remove(widgetId);
    };
  }, [locale, onToken]);

  if (!SITE_KEY) return null;
  return <div ref={ref} />;
}
