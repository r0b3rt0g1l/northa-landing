import type { Metadata } from "next";
import { createPortalClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/portal/session";
import type { Member } from "@/lib/portal/types";
import { createMemberAccount, updateMember } from "../../actions";
import { ActionForm, PortalField, portalInput } from "@/components/portal/forms";
import { Card, Disclosure, PageHeader } from "@/components/portal/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Usuarios" };

export default async function UsersPage() {
  const me = await requireAdmin();
  const supabase = await createPortalClient();
  const { data } = await supabase
    .from("amplia_members")
    .select("id, full_name, email, role, active")
    .order("active", { ascending: false })
    .order("full_name")
    .overrideTypes<Member[], { merge: false }>();
  const members = data ?? [];

  return (
    <div className="grid gap-8">
      <PageHeader title="Usuarios" lead="Quién tiene acceso al portal y con qué rol. Solo la administración ve esta sección." />

      <Disclosure summary="Nueva cuenta">
        <ActionForm action={createMemberAccount} submitLabel="Crear cuenta">
          <div className="grid gap-4 sm:grid-cols-2">
            <PortalField label="Nombre completo" htmlFor="u-name">
              <input id="u-name" name="full_name" required maxLength={80} autoComplete="off" className={portalInput} />
            </PortalField>
            <PortalField label="Correo" htmlFor="u-email">
              <input id="u-email" name="email" type="email" required maxLength={120} autoComplete="off" className={portalInput} />
            </PortalField>
            <PortalField label="Rol" htmlFor="u-role">
              <select id="u-role" name="role" defaultValue="staff" className={portalInput}>
                <option value="staff">Personal (consulta y envía solicitudes)</option>
                <option value="admin">Administración (edita todo)</option>
              </select>
            </PortalField>
            <PortalField label="Contraseña temporal" htmlFor="u-pass" hint="mín. 10 caracteres">
              <input id="u-pass" name="password" type="text" required minLength={10} maxLength={200} autoComplete="new-password" className={portalInput} />
            </PortalField>
          </div>
          <p className="text-sm text-faint">
            Comparte la contraseña temporal por un medio seguro (en persona o por teléfono). La persona la cambia en “Mi cuenta”.
          </p>
        </ActionForm>
      </Disclosure>

      <Card className="p-0 md:p-0">
        <ul className="divide-y divide-line">
          {members.map((m) => (
            <li key={m.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className={cn("font-semibold", m.active ? "text-ink" : "text-faint line-through")}>
                    {m.full_name} {m.id === me.id && <span className="text-sm font-normal text-faint">(tú)</span>}
                  </p>
                  <p className="text-sm text-dim">{m.email}</p>
                </div>
                <span className="rounded-full border border-line-2 px-2.5 py-0.5 text-xs font-semibold text-dim">
                  {m.role === "admin" ? "Administración" : "Personal"}
                  {!m.active && " · inactiva"}
                </span>
              </div>
              <Disclosure summary="Cambiar rol o acceso" className="mt-3">
                <ActionForm action={updateMember} submitLabel="Guardar" keepValues>
                  <input type="hidden" name="id" value={m.id} />
                  <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                    <PortalField label="Rol" htmlFor={`role-${m.id}`}>
                      <select id={`role-${m.id}`} name="role" defaultValue={m.role} className={portalInput}>
                        <option value="staff">Personal</option>
                        <option value="admin">Administración</option>
                      </select>
                    </PortalField>
                    <label className="flex min-h-11 items-center gap-3 text-sm text-dim">
                      <input type="checkbox" name="active" defaultChecked={m.active} className="size-5 accent-[var(--accent-strong)]" />
                      Acceso activo
                    </label>
                  </div>
                </ActionForm>
              </Disclosure>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
