import "server-only";
import type { Lead, SinkStatus } from "../schema";

const API = "https://api.hubapi.com";

/**
 * Crea (o actualiza) el contacto en HubSpot y le cuelga una nota con el mensaje.
 * Requiere una "Private App" con permisos crm.objects.contacts.write y
 * crm.objects.notes.write (o equivalentes). Solo API de servidor: no se
 * inyecta ningún script de rastreo de HubSpot en el sitio.
 */
export async function pushToHubSpot(lead: Lead, signal: AbortSignal): Promise<SinkStatus> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return "skipped";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [firstname, ...rest] = lead.name.split(" ");
  const properties: Record<string, string> = {
    firstname,
    lastname: rest.join(" "),
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
  };
  if (lead.email) properties.email = lead.email;
  if (lead.phone) properties.phone = lead.phone;
  if (lead.company) properties.company = lead.company;

  let contactId: string | null = null;
  const created = await fetch(`${API}/crm/v3/objects/contacts`, {
    method: "POST",
    headers,
    signal,
    body: JSON.stringify({ properties }),
  });
  if (created.ok) {
    contactId = ((await created.json()) as { id: string }).id;
  } else if (created.status === 409) {
    // "Contact already exists. Existing ID: 123"
    const body = await created.text();
    contactId = body.match(/Existing ID:\s*(\d+)/)?.[1] ?? null;
    if (contactId) {
      await fetch(`${API}/crm/v3/objects/contacts/${contactId}`, {
        method: "PATCH",
        headers,
        signal,
        body: JSON.stringify({ properties: { ...properties, lifecyclestage: undefined } }),
      }).catch(() => undefined);
    }
  } else {
    console.error("[leads] HubSpot contacto", created.status, await created.text().catch(() => ""));
    return "error";
  }
  if (!contactId) return "error";

  const note = await fetch(`${API}/crm/v3/objects/notes`, {
    method: "POST",
    headers,
    signal,
    body: JSON.stringify({
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: `[${lead.source} · ${lead.locale}] ${lead.service ? `${lead.service} — ` : ""}${lead.message}`,
      },
      // 202 = asociación nota → contacto (definida por HubSpot)
      associations: [{ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] }],
    }),
  });
  if (!note.ok) console.error("[leads] HubSpot nota", note.status, await note.text().catch(() => ""));
  return "ok";
}
