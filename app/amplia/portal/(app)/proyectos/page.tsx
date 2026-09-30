import type { Metadata } from "next";
import { createPortalClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/portal/session";
import { projectStatusLabel, type PortalProject, type ProjectStatus } from "@/lib/portal/types";
import { deleteProject, saveProject, setProjectStatus } from "../../actions";
import { ActionForm, DeleteButton, SubmitButton, portalInput } from "@/components/portal/forms";
import { ProjectFields } from "@/components/portal/ProjectFields";
import { Disclosure, EmptyState, PageHeader, shortDate } from "@/components/portal/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Proyectos" };

const COLUMNS = Object.keys(projectStatusLabel) as ProjectStatus[];

function todayInHermosillo(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Hermosillo" }).format(new Date());
}

export default async function ProjectsPage() {
  const me = await requireMember();
  const isAdmin = me.role === "admin";
  const supabase = await createPortalClient();
  const [{ data: projectsData }, { data: membersData }] = await Promise.all([
    supabase
      .from("amplia_projects")
      .select("id, name, client, status, owner_id, due_on, notes, owner:amplia_members(full_name)")
      .order("due_on", { ascending: true, nullsFirst: false })
      .overrideTypes<PortalProject[], { merge: false }>(),
    supabase
      .from("amplia_members")
      .select("id, full_name")
      .eq("active", true)
      .order("full_name")
      .overrideTypes<{ id: string; full_name: string }[], { merge: false }>(),
  ]);
  const projects = projectsData ?? [];
  const members = membersData ?? [];
  const today = todayInHermosillo();

  return (
    <div className="grid gap-8">
      <PageHeader title="Proyectos" lead="Tablero del trabajo en curso de Amplía." />

      {isAdmin && (
        <Disclosure summary="Nuevo proyecto" open={projects.length === 0}>
          <ActionForm action={saveProject} submitLabel="Crear proyecto">
            <ProjectFields idPrefix="new" members={members} />
          </ActionForm>
        </Disclosure>
      )}

      {projects.length === 0 ? (
        <EmptyState
          title="No hay proyectos todavía."
          body={isAdmin ? "Crea el primero con “Nuevo proyecto”." : "Aquí verás el tablero de proyectos del equipo."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const items = projects.filter((p) => p.status === col);
            return (
              <section key={col} aria-labelledby={`col-${col}`} className="rounded-[1.5rem] border border-line bg-bg-2/60 p-3">
                <h2 id={`col-${col}`} className="flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-ink">
                  {projectStatusLabel[col]}
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-dim">{items.length}</span>
                </h2>
                <ul className="mt-2 grid gap-2.5">
                  {items.map((p) => {
                    const overdue = !!p.due_on && p.due_on < today && p.status !== "terminado";
                    return (
                      <li key={p.id} className="rounded-xl border border-line bg-surface p-4">
                        <p className="font-semibold text-ink">{p.name}</p>
                        {p.client && <p className="text-sm text-dim">{p.client}</p>}
                        <p className="mt-2 text-xs text-faint">
                          {p.owner?.full_name ?? "Sin responsable"}
                          {p.due_on && (
                            <>
                              {" · "}
                              <span className={cn(overdue && "font-semibold text-rose-500 dark:text-rose-300")}>
                                {overdue ? "Vencido: " : "Entrega: "}
                                {shortDate(p.due_on)}
                              </span>
                            </>
                          )}
                        </p>
                        {p.notes && <p className="mt-2 line-clamp-3 text-sm text-dim">{p.notes}</p>}
                        {isAdmin && (
                          <div className="mt-3 grid gap-2">
                            <form action={setProjectStatus} className="flex items-center gap-2">
                              <input type="hidden" name="id" value={p.id} />
                              <label htmlFor={`mv-${p.id}`} className="sr-only">
                                Mover {p.name} a
                              </label>
                              <select id={`mv-${p.id}`} name="status" defaultValue={p.status} className={cn(portalInput, "h-9 py-1 text-sm")}>
                                {COLUMNS.map((s) => (
                                  <option key={s} value={s}>
                                    {projectStatusLabel[s]}
                                  </option>
                                ))}
                              </select>
                              <SubmitButton label="Mover" className="h-9 px-3.5" />
                            </form>
                            <details className="group rounded-lg border border-line">
                              <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between px-3 text-sm text-ink [&::-webkit-details-marker]:hidden">
                                Editar
                                <span aria-hidden className="text-faint transition-transform group-open:rotate-45">
                                  +
                                </span>
                              </summary>
                              <div className="grid gap-3 border-t border-line p-3">
                                <ActionForm action={saveProject} submitLabel="Guardar" keepValues>
                                  <ProjectFields item={p} idPrefix={`p-${p.id}`} members={members} />
                                </ActionForm>
                                <DeleteButton action={deleteProject} id={p.id} />
                              </div>
                            </details>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
