import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { portalConfigured } from "@/lib/supabase/config";
import { createPortalClient } from "@/lib/supabase/server";
import type { Member } from "./types";

export const PORTAL = "/amplia/portal";
export const LOGIN = `${PORTAL}/entrar`;

/**
 * Persona con sesión en el portal. `null` si no hay sesión válida.
 * `inactive` si tiene cuenta pero no es miembro activo de Amplía.
 * Se memoriza por petición (React cache).
 */
export const getMember = cache(async (): Promise<Member | "inactive" | null> => {
  // Siempre dinámico (depende de la sesión), aunque falten las variables en el build.
  await connection();
  if (!portalConfigured()) return null;
  const supabase = await createPortalClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return null;
  const { data: member } = await supabase
    .from("amplia_members")
    .select("id, full_name, email, role, active")
    .eq("id", userId)
    .maybeSingle<Member>();
  if (!member || !member.active) return "inactive";
  return member;
});

export async function requireMember(): Promise<Member> {
  const member = await getMember();
  if (!member || member === "inactive") redirect(LOGIN);
  return member;
}

export async function requireAdmin(): Promise<Member> {
  const member = await requireMember();
  if (member.role !== "admin") redirect(PORTAL);
  return member;
}
