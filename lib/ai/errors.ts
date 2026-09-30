/**
 * Traduce un error del modelo a un código corto que la interfaz entiende,
 * sin filtrar detalles internos al navegador:
 *   - "ai_unavailable" → no hay llave/créditos del AI Gateway: el widget pasa a modo guiado.
 *   - "rate_limited"   → límite de peticiones: el widget sugiere esperar o ir a WhatsApp.
 *   - "error"          → cualquier otra falla: mensaje amable + WhatsApp con la pregunta.
 * El detalle completo queda en los logs de Vercel.
 */
export function chatErrorCode(error: unknown): "ai_unavailable" | "rate_limited" | "error" {
  // RetryError envuelve el último intento.
  const inner = (error as { lastError?: unknown } | null)?.lastError ?? error;
  const name = inner instanceof Error ? inner.name : "";
  const status = (inner as { statusCode?: number } | null)?.statusCode;
  console.error("[nort]", name || "error", status ?? "", inner instanceof Error ? inner.message : inner);

  if (/GatewayAuthentication|GatewayForbidden|LoadAPIKey/.test(name) || status === 401 || status === 402 || status === 403) {
    return "ai_unavailable";
  }
  if (/GatewayRateLimit/.test(name) || status === 429) return "rate_limited";
  return "error";
}
