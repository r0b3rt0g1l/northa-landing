/**
 * Configuración del Supabase PROPIO de la landing (leads + portal de Amplía).
 *
 * Candado: el proyecto compartido de los municipios (qpilnqzgsndymktgodoq) está
 * vetado. Si alguna variable apunta ahí, el portal no arranca y los leads no se guardan.
 */
export const SHARED_MUNICIPAL_PROJECT = "qpilnqzgsndymktgodoq";

// Acceso estático a NEXT_PUBLIC_* (Next las incrusta en el build).
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
export const supabasePublishableKey = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""
).trim();

export function isMunicipalProject(url: string | undefined | null): boolean {
  return !!url && url.includes(SHARED_MUNICIPAL_PROJECT);
}

/** ¿Está listo el portal? (URL + llave publicable, y NO es la base de los municipios) */
export function portalConfigured(): boolean {
  return !!supabaseUrl && !!supabasePublishableKey && !isMunicipalProject(supabaseUrl);
}
