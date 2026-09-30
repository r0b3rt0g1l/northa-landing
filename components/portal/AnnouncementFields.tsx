import { PortalField, portalInput } from "./forms";
import type { Announcement } from "@/lib/portal/types";

/** Campos del formulario de comunicado (nuevo o edición). */
export function AnnouncementFields({ item, idPrefix }: { item?: Announcement; idPrefix: string }) {
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <PortalField label="Título" htmlFor={`${idPrefix}-title`}>
        <input id={`${idPrefix}-title`} name="title" required maxLength={140} defaultValue={item?.title} className={portalInput} />
      </PortalField>
      <PortalField label="Comunicado" htmlFor={`${idPrefix}-body`}>
        <textarea
          id={`${idPrefix}-body`}
          name="body"
          required
          rows={6}
          maxLength={8000}
          defaultValue={item?.body}
          className={portalInput}
        />
      </PortalField>
      <label className="flex items-center gap-3 text-sm text-dim">
        <input type="checkbox" name="pinned" defaultChecked={item?.pinned} className="size-5 accent-[var(--accent-strong)]" />
        Fijar arriba (aparece primero en el inicio)
      </label>
    </>
  );
}
