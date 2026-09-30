import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { updatePortalSession } from "@/lib/supabase/proxy";

/**
 * Ruteo de idiomas (Next 16: `proxy.ts` sustituye a `middleware.ts`).
 *
 *   /servicios        → reescribe a /es/servicios (español sin prefijo)
 *   /en/servicios     → pasa directo
 *   /es/servicios     → redirige 308 a /servicios (una sola URL canónica)
 *
 * No hay redirección automática por Accept-Language: el sitio abre en español
 * (mercado principal) y el visitante cambia de idioma con el selector. Así
 * Google indexa ambas versiones sin sorpresas.
 *
 * Excepción: /amplia/portal (intranet de Amplía, solo español) no pasa por el
 * ruteo de idiomas; aquí solo se renueva la sesión de Supabase.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (pathname === "/amplia/portal" || pathname.startsWith("/amplia/portal/")) {
    return updatePortalSession(request);
  }

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Todo menos API, archivos internos de Next, Vercel y archivos con extensión.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
