import type { Metadata } from "next";
import Link from "next/link";
import { createPortalClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/portal/session";
import { requestStatusLabel, type PortalRequest, type RequestStatus, type RequestType } from "@/lib/portal/types";
import { createRequest, deleteRequest, saveRequestType, toggleRequestType, updateRequestStatus } from "../../actions";
import { ActionForm, DeleteButton, PortalField, SubmitButton, portalInput } from "@/components/portal/forms";
import { Card, Disclosure, EmptyState, PageHeader, StatusBadge, shortDate } from "@/components/portal/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Solicitudes" };

const STATUSES: RequestStatus[] = ["pendiente", "aprobada", "rechazada", "completada"];

export default async function RequestsPage({ searchParams }: PageProps<"/amplia/portal/solicitudes">) {
  const me = await requireMember();
  const isAdmin = me.role === "admin";
  const sp = await searchParams;
  const filter = STATUSES.includes(sp.estado as RequestStatus) ? (sp.estado as RequestStatus) : null;

  const supabase = await createPortalClient();
  let query = supabase
    .from("amplia_requests")
    .select(
      "id, title, details, starts_on, ends_on, status, admin_note, created_at, requester_id, type:amplia_request_types(name), requester:amplia_members(full_name)",
    )
    .order("created_at", { ascending: false })
    .limit(300);
  if (filter) query = query.eq("status", filter);
  const [{ data: requestsData }, { data: typesData }] = await Promise.all([
    query.overrideTypes<PortalRequest[], { merge: false }>(),
    supabase
      .from("amplia_request_types")
      .select("id, name, description, active")
      .order("name")
      .overrideTypes<RequestType[], { merge: false }>(),
  ]);
  const requests = requestsData ?? [];
  const types = typesData ?? [];
  const activeTypes = types.filter((t) => t.active);

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Solicitudes"
        lead={isAdmin ? "Todas las solicitudes del equipo. Cambia su estado y deja una nota." : "Envía una solicitud y consulta su estado."}
      />

      {activeTypes.length > 0 ? (
        <Disclosure summary="Nueva solicitud">
          <ActionForm action={createRequest} submitLabel="Enviar solicitud">
            <div className="grid gap-4 sm:grid-cols-2">
              <PortalField label="Tipo" htmlFor="q-type">
                <select id="q-type" name="type_id" required defaultValue="" className={portalInput}>
                  <option value="" disabled>
                    Elige una opción
                  </option>
                  {activeTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </PortalField>
              <PortalField label="Título" htmlFor="q-title">
                <input id="q-title" name="title" required maxLength={140} className={portalInput} />
              </PortalField>
            </div>
            <PortalField label="Detalle" htmlFor="q-details" hint="opcional">
              <textarea id="q-details" name="details" rows={3} maxLength={2000} className={portalInput} />
            </PortalField>
            <div className="grid gap-4 sm:grid-cols-2">
              <PortalField label="Desde" htmlFor="q-start" hint="opcional">
                <input id="q-start" name="starts_on" type="date" className={portalInput} />
              </PortalField>
              <PortalField label="Hasta" htmlFor="q-end" hint="opcional">
                <input id="q-end" name="ends_on" type="date" className={portalInput} />
              </PortalField>
            </div>
          </ActionForm>
        </Disclosure>
      ) : (
        <EmptyState
          title="Todavía no hay tipos de solicitud."
          body={isAdmin ? "Define abajo los tipos que usa Amplía (por ejemplo, los trámites internos reales del equipo)." : "Cuando la administración defina los tipos, podrás enviar solicitudes aquí."}
        />
      )}

      <section aria-labelledby="req-list-title" className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="req-list-title" className="text-xl text-ink">
            {isAdmin ? "Todas las solicitudes" : "Mis solicitudes"}
          </h2>
          <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
            {[null, ...STATUSES].map((s) => (
              <Link
                key={s ?? "todas"}
                href={s ? `/amplia/portal/solicitudes?estado=${s}` : "/amplia/portal/solicitudes"}
                aria-current={filter === s ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm transition-colors",
                  filter === s ? "border-accent bg-accent-soft text-ink" : "border-line-2 text-dim hover:text-ink",
                )}
              >
                {s ? requestStatusLabel[s] : "Todas"}
              </Link>
            ))}
          </nav>
        </div>

        {requests.length === 0 ? (
          <p className="text-sm text-dim">No hay solicitudes {filter ? `con estado “${requestStatusLabel[filter]}”` : "todavía"}.</p>
        ) : (
          <ul className="grid gap-3">
            {requests.map((r) => (
              <li key={r.id} className="rounded-[1.25rem] border border-line bg-surface/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{r.title}</p>
                    <p className="text-xs text-faint">
                      {r.type?.name ?? "Sin tipo"} · {shortDate(r.created_at)}
                      {isAdmin && r.requester?.full_name ? ` · ${r.requester.full_name}` : ""}
                      {r.starts_on ? ` · ${shortDate(r.starts_on)}${r.ends_on ? ` → ${shortDate(r.ends_on)}` : ""}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={r.status} label={requestStatusLabel[r.status]} />
                </div>
                {r.details && <p className="mt-3 whitespace-pre-line text-sm text-dim">{r.details}</p>}
                {r.admin_note && (
                  <p className="mt-3 rounded-xl border border-line bg-bg/40 p-3 text-sm text-ink">
                    <span className="font-semibold">Nota de administración:</span> {r.admin_note}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {(r.requester_id === me.id && r.status === "pendiente") || isAdmin ? (
                    <DeleteButton action={deleteRequest} id={r.id} label={isAdmin ? "Eliminar" : "Cancelar solicitud"} confirmLabel="Sí, eliminar" />
                  ) : null}
                </div>
                {isAdmin && (
                  <Disclosure summary="Atender" className="mt-4">
                    <ActionForm action={updateRequestStatus} submitLabel="Guardar" keepValues>
                      <input type="hidden" name="id" value={r.id} />
                      <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
                        <PortalField label="Estado" htmlFor={`st-${r.id}`}>
                          <select id={`st-${r.id}`} name="status" defaultValue={r.status} className={portalInput}>
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {requestStatusLabel[s]}
                              </option>
                            ))}
                          </select>
                        </PortalField>
                        <PortalField label="Nota para quien la envió" htmlFor={`note-${r.id}`} hint="opcional">
                          <input id={`note-${r.id}`} name="admin_note" maxLength={1000} defaultValue={r.admin_note ?? ""} className={portalInput} />
                        </PortalField>
                      </div>
                    </ActionForm>
                  </Disclosure>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {isAdmin && (
        <Card>
          <h2 className="text-xl text-ink">Tipos de solicitud</h2>
          <p className="mt-1 text-sm text-dim">Solo los activos aparecen en “Nueva solicitud”. Desactivar no borra el historial.</p>
          {types.length > 0 && (
            <ul className="mt-4 grid gap-2">
              {types.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-bg/40 px-4 py-3">
                  <span>
                    <span className={cn("font-semibold", t.active ? "text-ink" : "text-faint line-through")}>{t.name}</span>
                    {t.description && <span className="block text-sm text-dim">{t.description}</span>}
                  </span>
                  <form action={toggleRequestType}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="active" value={String(t.active)} />
                    <SubmitButton label={t.active ? "Desactivar" : "Activar"} className="h-9 border border-line-2 bg-transparent px-3.5 text-dim hover:text-ink" />
                  </form>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5">
            <ActionForm action={saveRequestType} submitLabel="Agregar tipo">
              <div className="grid gap-4 sm:grid-cols-2">
                <PortalField label="Nombre" htmlFor="t-name">
                  <input id="t-name" name="name" required maxLength={60} className={portalInput} />
                </PortalField>
                <PortalField label="Descripción" htmlFor="t-desc" hint="opcional">
                  <input id="t-desc" name="description" maxLength={300} className={portalInput} />
                </PortalField>
              </div>
            </ActionForm>
          </div>
        </Card>
      )}
    </div>
  );
}
