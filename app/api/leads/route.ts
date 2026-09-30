import { leadSchema } from "@/lib/leads/schema";
import { deliverLead } from "@/lib/leads/deliver";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { whatsappUrl } from "@/lib/whatsapp";

export const maxDuration = 15;

/** Turnstile (opcional): si hay TURNSTILE_SECRET_KEY, el token es obligatorio. */
async function turnstileOk(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);
  if (!res?.ok) return false;
  const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
  return !!data?.success;
}

/**
 * POST /api/leads — recibe leads del formulario de contacto y de "Arma tu proyecto".
 * (Los leads del chat entran por la herramienta `saveLead` de /api/chat.)
 *
 * Respuesta: { ok, delivered, whatsappUrl }. Si ningún destino está configurado
 * o todos fallan, `delivered` es false y la interfaz ofrece enviarlo por WhatsApp
 * con el mensaje ya escrito: el lead nunca se pierde en silencio.
 */
export async function POST(req: Request) {
  const limit = rateLimit(`lead:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const json = await req.json().catch(() => null);
  const ip = clientIp(req);
  const token = json && typeof json === "object" ? (json as { turnstileToken?: unknown }).turnstileToken : undefined;
  if (!(await turnstileOk(token, ip))) {
    return Response.json({ ok: false, error: "captcha" }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    // Honeypot lleno: respondemos "ok" para no darle pistas al bot.
    if (json && typeof json === "object" && "website" in json && (json as { website?: string }).website) {
      return Response.json({ ok: true, delivered: false });
    }
    return Response.json(
      { ok: false, error: "invalid", issues: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 400 },
    );
  }

  const lead = parsed.data;
  const result = await deliverLead(lead);
  const intro = lead.locale === "es" ? "Hola Northa 👋 Soy" : "Hi Northa 👋 I'm";
  const text = `${intro} ${lead.name}${lead.company ? ` (${lead.company})` : ""}.\n${lead.service ? `${lead.service}: ` : ""}${lead.message}`;

  return Response.json({ ok: true, delivered: result.delivered, whatsappUrl: whatsappUrl(text) });
}
