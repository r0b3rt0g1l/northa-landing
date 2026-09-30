import "server-only";
import type { Lead, SinkStatus } from "../schema";
import { isMunicipalProject } from "@/lib/supabase/config";

/**
 * Guarda el lead en la tabla `leads` de un proyecto de Supabase PROPIO de la
 * landing (ver supabase/migrations/0001_leads.sql).
 *
 * Candado: se niega a escribir en la base compartida de los municipios
 * (proyecto qpilnqzgsndymktgodoq). Esa base no se toca desde aquí, nunca.
 */
export async function saveToSupabase(lead: Lead, signal: AbortSignal): Promise<SinkStatus> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return "skipped";
  if (isMunicipalProject(url)) {
    console.error("[leads] SUPABASE_URL apunta a la base compartida de los municipios. Lead NO guardado ahí.");
    return "error";
  }
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  // Llaves legadas (JWT) también van en Authorization; las nuevas sb_secret_ solo en apikey.
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/leads`, {
    method: "POST",
    headers,
    signal,
    body: JSON.stringify({
      source: lead.source,
      locale: lead.locale,
      name: lead.name,
      email: lead.email || null,
      phone: lead.phone || null,
      company: lead.company || null,
      service: lead.service || null,
      message: lead.message,
      meta: { page: lead.page ?? null },
    }),
  });
  if (!res.ok) {
    console.error("[leads] Supabase", res.status, await res.text().catch(() => ""));
    return "error";
  }
  return "ok";
}
