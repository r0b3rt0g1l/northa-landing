import "server-only";
import type { Lead, SinkStatus } from "../schema";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** Aviso por correo con Resend (https://resend.com). Sin SDK: una sola llamada HTTP. */
export async function notifyByEmail(lead: Lead, signal: AbortSignal): Promise<SinkStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_EMAIL;
  if (!apiKey || !to) return "skipped";
  const from = process.env.LEADS_FROM_EMAIL || "Northa Leads <onboarding@resend.dev>";

  const rows: [string, string | undefined][] = [
    ["Nombre", lead.name],
    ["Correo", lead.email],
    ["Teléfono", lead.phone],
    ["Empresa", lead.company],
    ["Servicio", lead.service],
    ["Origen", `${lead.source} · ${lead.locale}${lead.page ? ` · ${lead.page}` : ""}`],
  ];
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">Nuevo lead desde ${esc(new URL(site.url).host)}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap">${k}</td><td style="padding:6px 0">${esc(v!)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:8px">${esc(lead.message)}</p>
    </div>`;
  const text = `${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")}\n\n${lead.message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: lead.email || undefined,
      subject: `Lead: ${lead.name}${lead.service ? ` · ${lead.service}` : ""}`,
      html,
      text,
    }),
  });
  if (!res.ok) {
    console.error("[leads] Resend", res.status, await res.text().catch(() => ""));
    return "error";
  }
  return "ok";
}

/**
 * Confirmación automática a quien dejó sus datos (opcional).
 * Actívala con LEADS_CONFIRMATION=true SOLO cuando LEADS_FROM_EMAIL use un dominio
 * verificado en Resend: con el remitente de pruebas (onboarding@resend.dev) Resend
 * solo entrega a tu propio correo.
 */
export async function sendConfirmation(lead: Lead, signal: AbortSignal): Promise<SinkStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM_EMAIL;
  if (process.env.LEADS_CONFIRMATION !== "true" || !apiKey || !from || !lead.email) return "skipped";
  if (from.includes("resend.dev")) return "skipped";

  // Por seguridad NO se repite el nombre ni el mensaje que escribió la persona:
  // así nadie puede usar el formulario para mandar texto arbitrario a terceros.
  const es = lead.locale === "es";
  const wa = whatsappUrl(es ? "Hola Northa 👋 Les dejé mis datos en su sitio." : "Hi Northa 👋 I left my details on your site.");
  const subject = es ? "Recibimos tu mensaje · Northa Digital" : "We got your message · Northa Digital";
  const intro = es
    ? "Hola, gracias por escribirnos. Ya tenemos tu mensaje y te contactamos pronto."
    : "Hi, thanks for reaching out. We have your message and will get back to you soon.";
  const waLine = es ? "¿Es urgente? Escríbenos por WhatsApp:" : "Urgent? Message us on WhatsApp:";
  const ignore = es
    ? "Si tú no enviaste este mensaje, ignora este correo."
    : "If you didn't send this message, please ignore this email.";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;color:#0b1633">
      <p>${intro}</p>
      <p>${waLine} <a href="${wa}">WhatsApp</a></p>
      <p style="color:#56607a;font-size:13px">${ignore}<br>Northa Digital · Hermosillo, Sonora · ${esc(new URL(site.url).host)}</p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      from,
      to: [lead.email],
      reply_to: process.env.LEADS_NOTIFY_EMAIL?.split(",")[0]?.trim() || undefined,
      subject,
      html,
      text: `${intro}\n\n${waLine} ${wa}\n\n${ignore}`,
    }),
  });
  if (!res.ok) {
    console.error("[leads] Resend (confirmación)", res.status, await res.text().catch(() => ""));
    return "error";
  }
  return "ok";
}
