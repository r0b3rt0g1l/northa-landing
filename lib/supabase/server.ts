import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { isMunicipalProject, portalConfigured, supabasePublishableKey, supabaseUrl } from "./config";

/**
 * Cliente con la sesión de la persona (cookies). Todas las consultas del portal
 * pasan por aquí, así que las reglas RLS de Supabase se aplican siempre.
 */
export async function createPortalClient() {
  if (!portalConfigured()) throw new Error("Portal de Amplía sin configurar (NEXT_PUBLIC_SUPABASE_*).");
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // En un Server Component no se pueden escribir cookies; proxy.ts renueva la sesión.
        }
      },
    },
  });
}

/**
 * Cliente con la llave SECRETA (ignora RLS). Solo para dar de alta cuentas,
 * y únicamente después de comprobar que quien lo pide es admin.
 */
export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secret) throw new Error("Falta SUPABASE_SECRET_KEY para administrar cuentas.");
  if (isMunicipalProject(supabaseUrl)) throw new Error("Proyecto vetado: es la base de los municipios.");
  return createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });
}
