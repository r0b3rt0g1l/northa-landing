import { NextResponse } from "next/server";

// Español en la raíz y inglés en «/en». Las rutas sin prefijo se reescriben
// por dentro a «/es» (la URL que ve el visitante no cambia), así «/» sigue
// siendo la portada en español y «/en» la portada en inglés.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const conIdioma = /^\/(en|es)(\/|$)/.test(pathname);
  if (conIdioma) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/es" : `/es${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Sin archivos estáticos (llevan punto), ni /_next ni /api.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
