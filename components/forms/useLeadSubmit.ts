"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export type LeadStatus =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "success"; delivered: boolean; whatsappUrl?: string }
  | { state: "error"; kind: "invalid" | "rate" | "network" | "captcha" };

export interface LeadPayload {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  locale: "es" | "en";
  source: "form" | "scope";
  consent: boolean;
  website?: string;
  /** Solo si Turnstile está activo. */
  turnstileToken?: string | null;
}

export function useLeadSubmit() {
  const [status, setStatus] = useState<LeadStatus>({ state: "idle" });

  async function submit(payload: LeadPayload) {
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, page: window.location.pathname }),
      });
      if (res.status === 429) return setStatus({ state: "error", kind: "rate" });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        if (err.error === "captcha") return setStatus({ state: "error", kind: "captcha" });
        return setStatus({ state: "error", kind: res.status === 400 ? "invalid" : "network" });
      }
      const data = (await res.json()) as { delivered?: boolean; whatsappUrl?: string };
      track("lead_submitted", { source: payload.source, delivered: !!data.delivered });
      setStatus({ state: "success", delivered: !!data.delivered, whatsappUrl: data.whatsappUrl });
    } catch {
      setStatus({ state: "error", kind: "network" });
    }
  }

  return { status, submit, reset: () => setStatus({ state: "idle" }) };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[+()\d\s.-]{7,25}$/;
