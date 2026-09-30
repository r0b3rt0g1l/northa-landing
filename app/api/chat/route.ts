import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { chatErrorCode } from "@/lib/ai/errors";
import { buildInstructions } from "@/lib/ai/instructions";
import { nortTools } from "@/lib/ai/tools";
import { isLocale } from "@/lib/i18n/config";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

/**
 * Modelo vía Vercel AI Gateway (una sola llave para Anthropic, OpenAI, Google…).
 * Cámbialo sin tocar código con NORT_MODEL, p. ej. "openai/gpt-6-luna".
 */
const MODEL = process.env.NORT_MODEL || "anthropic/claude-haiku-4.5";

/**
 * ¿Hay IA disponible? En Vercel, el Gateway se autentica con OIDC; fuera de
 * Vercel hace falta AI_GATEWAY_API_KEY. NORT_AI_ENABLED=false la apaga a mano.
 */
function aiEnabled() {
  if (process.env.NORT_AI_ENABLED === "false") return false;
  return !!process.env.AI_GATEWAY_API_KEY || !!process.env.VERCEL;
}

/** El widget pregunta esto al abrirse para decidir entre modo IA y modo guiado. */
export function GET() {
  return Response.json({ enabled: aiEnabled() }, { headers: { "Cache-Control": "no-store" } });
}

const MAX_MESSAGES = 16;
const MAX_CHARS_PER_TEXT = 2000;
const MAX_TOTAL_CHARS = 14000;

export async function POST(req: Request) {
  if (!aiEnabled()) return Response.json({ error: "ai_unavailable" }, { status: 503 });

  const limit = rateLimit(`chat:${clientIp(req)}`, 24, 10 * 60 * 1000);
  if (!limit.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    messages?: UIMessage[];
    locale?: string;
    page?: string;
  } | null;
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const locale = isLocale(body.locale) ? body.locale : "es";
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : undefined;

  // Solo turnos de usuario/asistente (nada de "system" inyectado desde el navegador).
  // Recorta historial y textos: protege costos y evita abusos.
  const messages = body.messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && Array.isArray(m.parts))
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      ...m,
      parts: m.parts
        .filter((p) => p.type !== "text" || typeof p.text === "string")
        .map((p) => (p.type === "text" ? { ...p, text: p.text.slice(0, MAX_CHARS_PER_TEXT) } : p)),
    })) as UIMessage[];
  if (messages.length === 0 || messages.at(-1)?.role !== "user") {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const total = messages.reduce(
    (n, m) => n + m.parts.reduce((k, p) => k + (p.type === "text" ? p.text.length : 0), 0),
    0,
  );
  if (total > MAX_TOTAL_CHARS) return Response.json({ error: "too_long" }, { status: 413 });

  const tools = nortTools(locale, page);
  let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>;
  try {
    modelMessages = await convertToModelMessages(messages, { tools, ignoreIncompleteToolCalls: true });
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const result = streamText({
    model: MODEL,
    instructions: buildInstructions(locale, page),
    messages: modelMessages,
    tools,
    stopWhen: isStepCount(4),
    maxOutputTokens: 700,
    temperature: 0.4,
    // El error se registra una sola vez, en chatErrorCode.
    onError: () => {},
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream, onError: chatErrorCode }),
  });
}
