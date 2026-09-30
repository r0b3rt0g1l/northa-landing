import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookUser, FolderOpen, Pin } from "lucide-react";
import { createPortalClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/portal/session";
import { projectStatusLabel, requestStatusLabel, type Announcement, type PortalProject, type PortalRequest } from "@/lib/portal/types";
import { Card, EmptyState, PageHeader, StatusBadge, shortDate } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Inicio" };

export default async function PortalHome() {
  const me = await requireMember();
  const supabase = await createPortalClient();
  const [announcements, requests, projects, contacts, resources] = await Promise.all([
    supabase
      .from("amplia_announcements")
      .select("id, title, body, pinned, published_at, author:amplia_members(full_name)")
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(3)
      .overrideTypes<Announcement[], { merge: false }>(),
    supabase
      .from("amplia_requests")
      .select("id, title, status, created_at, requester_id, details, starts_on, ends_on, admin_note, type:amplia_request_types(name), requester:amplia_members(full_name)")
      .eq("requester_id", me.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .overrideTypes<PortalRequest[], { merge: false }>(),
    supabase
      .from("amplia_projects")
      .select("id, name, client, status, owner_id, due_on, notes, owner:amplia_members(full_name)")
      .in("status", ["en_curso", "en_revision"])
      .order("due_on", { ascending: true, nullsFirst: false })
      .limit(6)
      .overrideTypes<PortalProject[], { merge: false }>(),
    supabase.from("amplia_contacts").select("id", { count: "exact", head: true }),
    supabase.from("amplia_resources").select("id", { count: "exact", head: true }),
  ]);

  const firstName = me.full_name.split(" ")[0];
  const isAdmin = me.role === "admin";

  return (
    <div className="grid gap-8">
      <PageHeader title={`Hola, ${firstName}`} lead="Lo más reciente del equipo de Amplía." />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl text-ink">Comunicados</h2>
            <Link href="/amplia/portal/comunicados" className="inline-flex items-center gap-1 text-sm text-accent-ink hover:underline">
              Ver todos <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          {announcements.data?.length ? (
            <ul className="mt-4 grid gap-3">
              {announcements.data.map((a) => (
                <li key={a.id} className="rounded-xl border border-line bg-bg/40 p-4">
                  <Link href={`/amplia/portal/comunicados/${a.id}`} className="group block">
                    <p className="flex items-center gap-2 font-semibold text-ink group-hover:underline">
                      {a.pinned && <Pin className="size-3.5 text-accent-ink" aria-label="Fijado" />}
                      {a.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-dim">{a.body}</p>
                    <p className="mt-2 text-xs text-faint">
                      {shortDate(a.published_at)}
                      {a.author?.full_name ? ` · ${a.author.full_name}` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="Aún no hay comunicados."
                body={isAdmin ? "Publica el primero para todo el equipo." : "Aquí aparecerán los comunicados del equipo."}
              >
                {isAdmin && (
                  <Link href="/amplia/portal/comunicados" className="inline-flex h-10 items-center rounded-full bg-accent-strong px-4 text-sm font-semibold text-accent-contrast">
                    Crear comunicado
                  </Link>
                )}
              </EmptyState>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl text-ink">Mis solicitudes</h2>
            <Link href="/amplia/portal/solicitudes" className="inline-flex items-center gap-1 text-sm text-accent-ink hover:underline">
              Nueva <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          {requests.data?.length ? (
            <ul className="mt-4 grid gap-2.5">
              {requests.data.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-3 rounded-xl border border-line bg-bg/40 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{r.title}</p>
                    <p className="text-xs text-faint">
                      {r.type?.name} · {shortDate(r.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} label={requestStatusLabel[r.status]} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-dim">No tienes solicitudes. Cuando envíes una, aquí verás su estado.</p>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl text-ink">Proyectos en curso</h2>
          <Link href="/amplia/portal/proyectos" className="inline-flex items-center gap-1 text-sm text-accent-ink hover:underline">
            Tablero <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        {projects.data?.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.data.map((p) => (
              <li key={p.id} className="rounded-xl border border-line bg-bg/40 p-4">
                <p className="font-semibold text-ink">{p.name}</p>
                {p.client && <p className="text-sm text-dim">{p.client}</p>}
                <p className="mt-2 text-xs text-faint">
                  {projectStatusLabel[p.status]}
                  {p.owner?.full_name ? ` · ${p.owner.full_name}` : ""}
                  {p.due_on ? ` · entrega ${shortDate(p.due_on)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-dim">No hay proyectos en curso.</p>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/amplia/portal/directorio" className="group flex items-center gap-4 rounded-[1.5rem] border border-line bg-surface/70 p-5 transition-colors hover:border-accent-line">
          <BookUser className="size-6 text-accent-ink" aria-hidden />
          <span>
            <span className="block font-semibold text-ink">Directorio</span>
            <span className="text-sm text-dim">{contacts.count ?? 0} contactos</span>
          </span>
        </Link>
        <Link href="/amplia/portal/recursos" className="group flex items-center gap-4 rounded-[1.5rem] border border-line bg-surface/70 p-5 transition-colors hover:border-accent-line">
          <FolderOpen className="size-6 text-accent-ink" aria-hidden />
          <span>
            <span className="block font-semibold text-ink">Recursos</span>
            <span className="text-sm text-dim">{resources.count ?? 0} documentos y enlaces</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
