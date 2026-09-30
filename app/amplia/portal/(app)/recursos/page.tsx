import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import { createPortalClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/portal/session";
import type { Resource } from "@/lib/portal/types";
import { deleteResource, saveResource } from "../../actions";
import { ActionForm, DeleteButton, PortalField, portalInput } from "@/components/portal/forms";
import { Disclosure, EmptyState, PageHeader, shortDate } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Recursos" };

export default async function ResourcesPage() {
  const me = await requireMember();
  const isAdmin = me.role === "admin";
  const supabase = await createPortalClient();
  const { data } = await supabase
    .from("amplia_resources")
    .select("id, title, description, category, url, file_path, file_name, created_at")
    .order("category")
    .order("title")
    .overrideTypes<Resource[], { merge: false }>();
  const resources = data ?? [];
  const groups = resources.reduce<Record<string, Resource[]>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});
  const categories = Object.keys(groups);

  return (
    <div className="grid gap-8">
      <PageHeader title="Recursos" lead="Formatos, manuales y enlaces que el equipo usa todos los días." />

      {isAdmin && (
        <Disclosure summary="Agregar recurso" open={resources.length === 0}>
          <ActionForm action={saveResource} submitLabel="Agregar">
            <div className="grid gap-4 sm:grid-cols-2">
              <PortalField label="Título" htmlFor="r-title">
                <input id="r-title" name="title" required maxLength={140} className={portalInput} />
              </PortalField>
              <PortalField label="Categoría" htmlFor="r-category" hint="p. ej. Formatos">
                <input id="r-category" name="category" maxLength={60} list="r-categories" className={portalInput} />
                <datalist id="r-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </PortalField>
            </div>
            <PortalField label="Descripción" htmlFor="r-description" hint="opcional">
              <input id="r-description" name="description" maxLength={500} className={portalInput} />
            </PortalField>
            <div className="grid gap-4 sm:grid-cols-2">
              <PortalField label="Enlace" htmlFor="r-url" hint="Drive, sitio, etc.">
                <input id="r-url" name="url" type="url" placeholder="https://" className={portalInput} />
              </PortalField>
              <PortalField label="o archivo" htmlFor="r-file" hint="máx. 4 MB">
                <input id="r-file" name="file" type="file" className="block w-full text-sm text-dim file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink" />
              </PortalField>
            </div>
          </ActionForm>
        </Disclosure>
      )}

      {resources.length === 0 ? (
        <EmptyState
          title="Todavía no hay recursos."
          body={isAdmin ? "Sube formatos o pega enlaces de Drive para tenerlos a la mano." : "Aquí aparecerán los documentos y enlaces del equipo."}
        />
      ) : (
        categories.map((cat) => (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <h2 id={`cat-${cat}`} className="eyebrow">
              {cat}
            </h2>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {groups[cat].map((r) => (
                <li key={r.id} className="flex flex-col gap-3 rounded-[1.25rem] border border-line bg-surface/70 p-5">
                  <div>
                    <p className="font-semibold text-ink">{r.title}</p>
                    {r.description && <p className="mt-1 text-sm text-dim">{r.description}</p>}
                    <p className="mt-1 text-xs text-faint">Agregado el {shortDate(r.created_at)}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-2 px-4 text-sm font-semibold text-ink hover:border-accent-line"
                      >
                        <ExternalLink className="size-4 text-accent-ink" aria-hidden />
                        Abrir enlace <span className="sr-only">(se abre en otra pestaña)</span>
                      </a>
                    )}
                    {r.file_path && (
                      <a
                        href={`/amplia/portal/archivo/${r.id}`}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-2 px-4 text-sm font-semibold text-ink hover:border-accent-line"
                      >
                        <Download className="size-4 text-accent-ink" aria-hidden />
                        Descargar {r.file_name ? <span className="sr-only">{r.file_name}</span> : null}
                      </a>
                    )}
                    {isAdmin && <DeleteButton action={deleteResource} id={r.id} />}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
