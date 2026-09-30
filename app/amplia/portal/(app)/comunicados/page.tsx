import type { Metadata } from "next";
import Link from "next/link";
import { Pin } from "lucide-react";
import { createPortalClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/portal/session";
import type { Announcement } from "@/lib/portal/types";
import { deleteAnnouncement, saveAnnouncement, toggleAnnouncementPin } from "../../actions";
import { ActionForm, DeleteButton, SubmitButton } from "@/components/portal/forms";
import { AnnouncementFields } from "@/components/portal/AnnouncementFields";
import { Disclosure, EmptyState, PageHeader, shortDate } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Comunicados" };

export default async function AnnouncementsPage() {
  const me = await requireMember();
  const isAdmin = me.role === "admin";
  const supabase = await createPortalClient();
  const { data } = await supabase
    .from("amplia_announcements")
    .select("id, title, body, pinned, published_at, author:amplia_members(full_name)")
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(200)
    .overrideTypes<Announcement[], { merge: false }>();
  const items = data ?? [];

  return (
    <div className="grid gap-8">
      <PageHeader title="Comunicados" lead="Avisos para todo el equipo. Los fijados aparecen primero." />

      {isAdmin && (
        <Disclosure summary="Nuevo comunicado" open={items.length === 0}>
          <ActionForm action={saveAnnouncement} submitLabel="Publicar">
            <AnnouncementFields idPrefix="new" />
          </ActionForm>
        </Disclosure>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Aún no hay comunicados."
          body={isAdmin ? "Usa “Nuevo comunicado” para publicar el primero." : "Aquí aparecerán los comunicados del equipo."}
        />
      ) : (
        <ul className="grid gap-4">
          {items.map((a) => (
            <li key={a.id} className="rounded-[1.5rem] border border-line bg-surface/70 p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-2 text-xl text-ink">
                    {a.pinned && <Pin className="size-4 shrink-0 text-accent-ink" aria-label="Fijado" />}
                    <Link href={`/amplia/portal/comunicados/${a.id}`} className="hover:underline">
                      {a.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs text-faint">
                    {shortDate(a.published_at)}
                    {a.author?.full_name ? ` · ${a.author.full_name}` : ""}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={toggleAnnouncementPin}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="pinned" value={String(a.pinned)} />
                      <SubmitButton label={a.pinned ? "Desfijar" : "Fijar"} className="h-9 border border-line-2 bg-transparent px-3.5 text-dim hover:text-ink" />
                    </form>
                    <DeleteButton action={deleteAnnouncement} id={a.id} />
                  </div>
                )}
              </div>
              <p className="mt-3 line-clamp-3 whitespace-pre-line text-dim">{a.body}</p>
              {isAdmin && (
                <Disclosure summary="Editar" className="mt-4">
                  <ActionForm action={saveAnnouncement} submitLabel="Guardar cambios" keepValues>
                    <AnnouncementFields item={a} idPrefix={`edit-${a.id}`} />
                  </ActionForm>
                </Disclosure>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
