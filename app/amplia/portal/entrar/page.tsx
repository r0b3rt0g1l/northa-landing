import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { portalConfigured } from "@/lib/supabase/config";
import { getMember, PORTAL } from "@/lib/portal/session";
import { signIn } from "../actions";
import { ActionForm, PortalField, portalInput } from "@/components/portal/forms";

export const metadata: Metadata = { title: "Entrar" };

export default async function PortalSignIn() {
  const configured = portalConfigured();
  const member = await getMember(); // también marca la página como dinámica
  if (member && member !== "inactive") redirect(PORTAL);

  return (
    <main id="contenido" className="grid min-h-dvh lg:grid-cols-2">
      {/* Panel de marca */}
      <section
        data-theme="dark"
        className="relative hidden overflow-hidden bg-[radial-gradient(120%_120%_at_0%_0%,#0f4f49_0%,var(--navy)_55%,#060a16_100%)] p-12 text-ink lg:flex lg:flex-col lg:justify-between"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- decorativo */}
        <img src="/amplia/enso.png" alt="" width={320} height={320} className="enso-draw size-80 opacity-90" />
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-ink">Amplía Consultoría</p>
          <p className="mt-4 max-w-md font-display text-4xl font-bold leading-tight tracking-[-0.03em]">Portal del equipo</p>
          <p className="mt-3 max-w-sm text-dim">Comunicados, directorio, recursos, solicitudes y proyectos en un solo lugar.</p>
        </div>
      </section>

      {/* Formulario */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Amplía · Portal del equipo</p>
          <h1 className="mt-4 text-4xl text-ink">Entrar</h1>
          {configured ? (
            <>
              <p className="mt-3 text-dim">Usa el correo y la contraseña que te dio tu administrador.</p>
              <ActionForm action={signIn} submitLabel="Entrar" className="mt-8" keepValues submitClassName="w-full">
                <PortalField label="Correo" htmlFor="email">
                  <input id="email" name="email" type="email" autoComplete="email" required className={portalInput} />
                </PortalField>
                <PortalField label="Contraseña" htmlFor="password">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={portalInput}
                  />
                </PortalField>
              </ActionForm>
              <p className="mt-6 text-sm text-faint">¿Sin acceso? Pídelo a la persona que administra el portal.</p>
            </>
          ) : (
            <p role="status" className="mt-6 rounded-xl border border-line-2 bg-surface-2 p-4 text-sm text-dim">
              El portal aún no está configurado. Hace falta conectar el proyecto de Supabase de la landing (variables
              NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY). Ver docs/07-portal-amplia.md.
            </p>
          )}
          <Link href="/amplia" className="mt-10 inline-block text-sm text-dim underline underline-offset-4 hover:text-ink">
            ← Volver a la página de Amplía
          </Link>
        </div>
      </section>
    </main>
  );
}
