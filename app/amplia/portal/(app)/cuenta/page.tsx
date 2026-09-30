import type { Metadata } from "next";
import { requireMember } from "@/lib/portal/session";
import { updateMyName, updateMyPassword } from "../../actions";
import { ActionForm, PortalField, portalInput } from "@/components/portal/forms";
import { Card, PageHeader } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function AccountPage() {
  const me = await requireMember();
  return (
    <div className="grid gap-8">
      <PageHeader title="Mi cuenta" lead={`${me.email} · ${me.role === "admin" ? "Administración" : "Personal"}`} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl text-ink">Nombre</h2>
          <ActionForm action={updateMyName} submitLabel="Guardar nombre" className="mt-4" keepValues>
            <PortalField label="Nombre completo" htmlFor="me-name">
              <input id="me-name" name="full_name" required maxLength={80} defaultValue={me.full_name} autoComplete="name" className={portalInput} />
            </PortalField>
          </ActionForm>
        </Card>
        <Card>
          <h2 className="text-xl text-ink">Contraseña</h2>
          <ActionForm action={updateMyPassword} submitLabel="Cambiar contraseña" className="mt-4">
            <PortalField label="Nueva contraseña" htmlFor="me-pass" hint="mín. 10 caracteres">
              <input id="me-pass" name="password" type="password" required minLength={10} autoComplete="new-password" className={portalInput} />
            </PortalField>
            <PortalField label="Confírmala" htmlFor="me-pass2">
              <input id="me-pass2" name="confirm" type="password" required minLength={10} autoComplete="new-password" className={portalInput} />
            </PortalField>
          </ActionForm>
        </Card>
      </div>
    </div>
  );
}
