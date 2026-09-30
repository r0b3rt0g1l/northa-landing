import "server-only";
import type { Lead, SinkStatus } from "./schema";
import { saveToSupabase } from "./sinks/supabase";
import { notifyByEmail, sendConfirmation } from "./sinks/resend";
import { pushToHubSpot } from "./sinks/hubspot";

export interface DeliveryResult {
  /** `true` si al menos un destino recibió el lead. Si es `false`, la UI empuja a WhatsApp. */
  delivered: boolean;
  sinks: { supabase: SinkStatus; email: SinkStatus; hubspot: SinkStatus };
}

const TIMEOUT_MS = 8000;

async function safe(fn: (signal: AbortSignal) => Promise<SinkStatus>): Promise<SinkStatus> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fn(controller.signal);
  } catch (err) {
    console.error("[leads] destino falló:", err instanceof Error ? err.message : err);
    return "error";
  } finally {
    clearTimeout(timer);
  }
}

/** Envía el lead a todos los destinos configurados en paralelo. Cada uno es opcional. */
export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const [supabase, email, hubspot] = await Promise.all([
    safe((s) => saveToSupabase(lead, s)),
    safe((s) => notifyByEmail(lead, s)),
    safe((s) => pushToHubSpot(lead, s)),
  ]);
  const sinks = { supabase, email, hubspot };
  const delivered = Object.values(sinks).includes("ok");
  // Confirmación a la persona: solo si el lead sí llegó a algún lado (opcional, no cambia `delivered`).
  if (delivered) await safe((s) => sendConfirmation(lead, s));
  if (!delivered && Object.values(sinks).every((s) => s === "skipped")) {
    console.warn("[leads] Ningún destino configurado (SUPABASE_*, RESEND_*, HUBSPOT_*). El lead solo se ofrece por WhatsApp.");
  }
  return { delivered, sinks };
}
