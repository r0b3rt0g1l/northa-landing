import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { portalConfigured, supabasePublishableKey, supabaseUrl } from "./config";

/**
 * Renueva la sesión del portal en cada petición a /amplia/portal (patrón de @supabase/ssr).
 * Las respuestas que escriben cookies de sesión llevan cabeceras "no-store".
 */
export async function updatePortalSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!portalConfigured()) return response;

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list, headers) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Valida y, si hace falta, refresca el token antes de renderizar.
  await supabase.auth.getClaims();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
