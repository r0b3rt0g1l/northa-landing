"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, Search } from "lucide-react";
import { deleteContact, saveContact } from "@/app/amplia/portal/actions";
import type { Contact } from "@/lib/portal/types";
import { ActionForm, DeleteButton, portalInput } from "./forms";
import { ContactFields } from "./ContactFields";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Directorio con búsqueda instantánea (nombre, puesto, área, correo o teléfono). */
export function DirectoryList({ contacts, isAdmin }: { contacts: Contact[]; isAdmin: boolean }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const term = norm(q.trim());
    if (!term) return contacts;
    return contacts.filter((c) =>
      norm([c.full_name, c.position, c.area, c.email, c.phone, c.extension].filter(Boolean).join(" ")).includes(term),
    );
  }, [q, contacts]);

  return (
    <div className="grid gap-5">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
        <label htmlFor="dir-search" className="sr-only">
          Buscar en el directorio
        </label>
        <input
          id="dir-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, puesto, área…"
          className={`${portalInput} pl-10`}
        />
      </div>
      <p aria-live="polite" className="text-sm text-faint">
        {list.length === 1 ? "1 contacto" : `${list.length} contactos`}
      </p>

      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((c) => (
          <li key={c.id} className="rounded-[1.25rem] border border-line bg-surface/70 p-5">
            <p className="font-semibold text-ink">{c.full_name}</p>
            {(c.position || c.area) && <p className="text-sm text-dim">{[c.position, c.area].filter(Boolean).join(" · ")}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {c.phone && (
                <a
                  href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-2 px-3.5 text-sm text-ink hover:border-accent-line"
                >
                  <Phone className="size-3.5 text-accent-ink" aria-hidden />
                  {c.phone}
                  {c.extension ? ` ext. ${c.extension}` : ""}
                </a>
              )}
              {c.email && (
                <a
                  href={`mailto:${c.email}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-2 px-3.5 text-sm text-ink hover:border-accent-line"
                >
                  <Mail className="size-3.5 text-accent-ink" aria-hidden />
                  {c.email}
                </a>
              )}
            </div>
            {c.notes && <p className="mt-3 text-sm text-faint">{c.notes}</p>}
            {isAdmin && (
              <details className="group mt-4 rounded-xl border border-line">
                <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between px-3.5 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  Editar
                  <span aria-hidden className="text-faint transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="grid gap-4 border-t border-line p-4">
                  <ActionForm action={saveContact} submitLabel="Guardar cambios" keepValues>
                    <ContactFields item={c} idPrefix={`c-${c.id}`} />
                  </ActionForm>
                  <DeleteButton action={deleteContact} id={c.id} />
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
