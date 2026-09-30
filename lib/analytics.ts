"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Eventos de conversión. Se mandan a Vercel Analytics (sin cookies) y, si
 * GA4 está configurado (NEXT_PUBLIC_GA_ID), también a Google Analytics.
 */
export type ConversionEvent =
  | "whatsapp_click"
  | "lead_submitted"
  | "chat_opened"
  | "chat_message"
  | "call_booking_click"
  | "scope_completed"
  | "email_click"
  | "portfolio_click";

type Props = Record<string, string | number | boolean | null>;

export function track(event: ConversionEvent, props: Props = {}) {
  try {
    // Vercel guarda hasta 2 propiedades por evento en Pro (8 con Web Analytics
    // Plus; en Hobby no hay eventos personalizados). Van las 2 primeras; GA4 recibe todas.
    vercelTrack(event, Object.fromEntries(Object.entries(props).slice(0, 2)));
  } catch {
    /* sin analítica en desarrollo */
  }
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", event, props);
  }
}
