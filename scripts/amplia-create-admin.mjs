#!/usr/bin/env node
/**
 * Crea una cuenta del portal de Amplía desde la terminal. Úsalo para el PRIMER
 * admin (después, las cuentas se crean desde /amplia/portal/usuarios).
 *
 *   npm run amplia:admin -- --email=persona@correo.com --name="Nombre Apellido"
 *   npm run amplia:admin -- --email=... --name="..." --role=staff
 *
 * Lee NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SECRET_KEY de .env.local.
 * Genera una contraseña temporal y la imprime UNA sola vez: compártela en persona.
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const SHARED_MUNICIPAL_PROJECT = "qpilnqzgsndymktgodoq";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.join("=") || "true"];
  }),
);

function die(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) die("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local.");
if (url.includes(SHARED_MUNICIPAL_PROJECT)) die("Esa URL es la base de los municipios. El portal de Amplía va en el proyecto NUEVO de la landing.");

const email = String(args.email ?? "").trim().toLowerCase();
const name = String(args.name ?? "").trim();
const role = args.role === "staff" ? "staff" : "admin";
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) die('Pasa un correo válido: --email=persona@correo.com');
if (name.length < 2) die('Pasa el nombre: --name="Nombre Apellido"');

const password = randomBytes(12).toString("base64url"); // 16 caracteres
const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: name },
});
if (error || !data.user) die(`No se pudo crear la cuenta: ${error?.message ?? "sin detalle"}`);

const { error: memberError } = await supabase
  .from("amplia_members")
  .insert({ id: data.user.id, full_name: name, email, role, active: true });
if (memberError) {
  await supabase.auth.admin.deleteUser(data.user.id);
  die(`No se pudo registrar en amplia_members (¿aplicaste la migración 0002?): ${memberError.message}`);
}

console.log(`
✔ Cuenta creada en el portal de Amplía
  Nombre:     ${name}
  Correo:     ${email}
  Rol:        ${role === "admin" ? "Administración" : "Personal"}
  Contraseña: ${password}   ← temporal: compártela en persona y pide que la cambie en "Mi cuenta"
  Entrar en:  /amplia/portal/entrar
`);
