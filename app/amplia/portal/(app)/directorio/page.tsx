import type { Metadata } from "next";
import { createPortalClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/portal/session";
import type { Contact } from "@/lib/portal/types";
import { saveContact } from "../../actions";
import { ActionForm } from "@/components/portal/forms";
import { ContactFields } from "@/components/portal/ContactFields";
import { DirectoryList } from "@/components/portal/DirectoryList";
import { Disclosure, EmptyState, PageHeader } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Directorio" };

export default async function DirectoryPage() {
  const me = await requireMember();
  const isAdmin = me.role === "admin";
  const supabase = await createPortalClient();
  const { data } = await supabase
    .from("amplia_contacts")
    .select("id, full_name, position, area, phone, extension, email, notes")
    .order("full_name")
    .overrideTypes<Contact[], { merge: false }>();
  const contacts = data ?? [];

  return (
    <div className="grid gap-8">
      <PageHeader title="Directorio" lead="Teléfonos, extensiones y correos del equipo y de las dependencias con las que trabajamos." />
      {isAdmin && (
        <Disclosure summary="Agregar contacto" open={contacts.length === 0}>
          <ActionForm action={saveContact} submitLabel="Agregar">
            <ContactFields idPrefix="new" />
          </ActionForm>
        </Disclosure>
      )}
      {contacts.length === 0 ? (
        <EmptyState
          title="El directorio está vacío."
          body={isAdmin ? "Agrega los contactos reales del equipo; nada se precarga." : "Aquí aparecerán los contactos del equipo."}
        />
      ) : (
        <DirectoryList contacts={contacts} isAdmin={isAdmin} />
      )}
    </div>
  );
}
