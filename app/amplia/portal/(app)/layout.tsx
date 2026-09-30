import { requireMember } from "@/lib/portal/session";
import { signOut } from "../actions";
import { PortalNav } from "@/components/portal/PortalNav";

/** Todo lo que está aquí adentro requiere sesión de un miembro activo. */
export default async function PortalAppLayout({ children }: LayoutProps<"/amplia/portal">) {
  const member = await requireMember();
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_1fr]">
      <PortalNav memberName={member.full_name} isAdmin={member.role === "admin"} signOutAction={signOut} />
      <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-6xl px-5 py-8 outline-none md:px-10 md:py-12">
        {children}
      </main>
    </div>
  );
}
