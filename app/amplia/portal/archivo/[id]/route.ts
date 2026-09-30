import { NextResponse } from "next/server";
import { getMember, LOGIN } from "@/lib/portal/session";
import { createPortalClient } from "@/lib/supabase/server";

/**
 * Descarga de un recurso: verifica la sesión y redirige a una liga firmada de
 * 60 segundos. Así las ligas nunca caducan en la página y el bucket sigue privado.
 */
export async function GET(req: Request, { params }: RouteContext<"/amplia/portal/archivo/[id]">) {
  const member = await getMember();
  if (!member || member === "inactive") return NextResponse.redirect(new URL(LOGIN, req.url));
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("No encontrado", { status: 404 });

  const supabase = await createPortalClient();
  const { data } = await supabase
    .from("amplia_resources")
    .select("file_path, file_name")
    .eq("id", id)
    .maybeSingle<{ file_path: string | null; file_name: string | null }>();
  if (!data?.file_path) return new NextResponse("No encontrado", { status: 404 });

  const { data: signed } = await supabase.storage
    .from("amplia-recursos")
    .createSignedUrl(data.file_path, 60, { download: data.file_name ?? true });
  if (!signed?.signedUrl) return new NextResponse("No se pudo generar la descarga", { status: 500 });
  return NextResponse.redirect(signed.signedUrl, { headers: { "Cache-Control": "private, no-store" } });
}
