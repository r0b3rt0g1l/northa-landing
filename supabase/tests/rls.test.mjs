// Prueba las migraciones en un Postgres real embebido (PGlite) con "stubs" mínimos
// de Supabase (auth.users, auth.uid(), roles, storage) y verifica las reglas RLS.
// No toca ninguna base real.   npm run test:db
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const db = new PGlite();
const M = new URL("../migrations/", import.meta.url).pathname;

await db.exec(`

  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create or replace function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  create role anon; create role authenticated; create role service_role;
  grant usage on schema auth to authenticated, anon, service_role;
  grant execute on function auth.uid() to authenticated, anon, service_role;
  create schema storage;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant usage on schema storage to authenticated;
  grant select, insert, update, delete on storage.objects to authenticated;
`);

for (const f of ["0001_leads.sql", "0002_amplia_portal.sql"]) {
  await db.exec(readFileSync(M + f, "utf8"));
  console.log("✔ migración aplicada:", f);
}
// Re-aplicar debe ser idempotente
await db.exec(readFileSync(M + "0002_amplia_portal.sql", "utf8"));
console.log("✔ 0002 es idempotente (se puede correr dos veces)");

await db.exec(`
  grant usage on schema public to authenticated, anon;
  grant select, insert, update, delete on all tables in schema public to authenticated;
`);

const A = "00000000-0000-0000-0000-00000000000a"; // admin
const B = "00000000-0000-0000-0000-00000000000b"; // staff
const C = "00000000-0000-0000-0000-00000000000c"; // sin acceso
await db.exec(`
  insert into auth.users values ('${A}','a@x.mx'), ('${B}','b@x.mx'), ('${C}','c@x.mx');
  insert into public.amplia_members (id, full_name, email, role) values ('${A}','Admin A','a@x.mx','admin'), ('${B}','Staff B','b@x.mx','staff');
`);

let pass = 0, failN = 0;
async function as(user, sql) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${user ?? ""}', false); set role authenticated;`);
  try {
    const r = await db.query(sql);
    return { ok: true, rows: r.rows, affected: r.affectedRows };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    await db.exec("reset role;");
  }
}
function expect(name, cond, detail) {
  if (cond) { pass++; console.log("  ✔", name); } else { failN++; console.log("  ✖", name, detail ?? ""); }
}

// ---- Leads: nadie desde el navegador
let r = await as(A, `insert into public.leads (source, locale, name, email, message) values ('form','es','Ana','ana@x.mx','hola hola hola')`);
expect("leads: ni un admin del portal inserta desde el navegador", !r.ok, r);
r = await as(A, `select * from public.leads`);
expect("leads: no se pueden leer desde el navegador", r.ok && r.rows.length === 0);

// ---- Miembros
r = await as(B, `update public.amplia_members set role = 'admin' where id = '${B}'`);
expect("staff NO puede hacerse admin", !r.ok, r);
r = await as(B, `update public.amplia_members set full_name = 'Staff Bee' where id = '${B}'`);
expect("staff SÍ cambia su nombre", r.ok && r.affected === 1, r);
r = await as(B, `update public.amplia_members set full_name = 'X' || full_name where id = '${A}'`);
expect("staff NO edita a otros", r.ok && r.affected === 0, r);
r = await as(C, `select * from public.amplia_members`);
expect("sin acceso: no ve miembros", r.ok && r.rows.length === 0, r);
r = await as(A, `update public.amplia_members set role = 'admin' where id = '${B}'`);
expect("admin SÍ cambia roles", r.ok && r.affected === 1, r);
await as(A, `update public.amplia_members set role = 'staff' where id = '${B}'`);

// ---- Contenido: leen miembros, escriben admins
r = await as(B, `insert into public.amplia_contacts (full_name) values ('Contacto de B')`);
expect("staff NO agrega contactos", !r.ok, r);
r = await as(A, `insert into public.amplia_contacts (full_name, phone) values ('Recepción', '662 000 0000')`);
expect("admin SÍ agrega contactos", r.ok, r);
r = await as(B, `select * from public.amplia_contacts`);
expect("staff SÍ lee el directorio", r.ok && r.rows.length === 1, r);
r = await as(C, `select * from public.amplia_contacts`);
expect("sin acceso: directorio invisible", r.ok && r.rows.length === 0, r);
r = await as(A, `insert into public.amplia_announcements (title, body, author_id) values ('Aviso', 'Texto', '${A}')`);
expect("admin SÍ publica comunicados", r.ok, r);
r = await as(B, `delete from public.amplia_announcements`);
expect("staff NO borra comunicados", r.ok && r.affected === 0, r);
r = await as(A, `insert into public.amplia_resources (title) values ('Sin origen')`);
expect("recurso sin enlace ni archivo se rechaza", !r.ok, r);
r = await as(A, `insert into public.amplia_resources (title, url) values ('Manual', 'javascript:alert(1)')`);
expect("recurso con enlace no-http se rechaza", !r.ok, r);

// ---- Solicitudes
r = await as(B, `insert into public.amplia_request_types (name) values ('Tipo de B')`);
expect("staff NO crea tipos de solicitud", !r.ok, r);
r = await as(A, `insert into public.amplia_request_types (name) values ('Tipo 1') returning id`);
const typeId = r.rows?.[0]?.id;
expect("admin SÍ crea tipos de solicitud", r.ok && !!typeId, r);
r = await as(B, `insert into public.amplia_requests (type_id, requester_id, title) values ('${typeId}', '${B}', 'Mi solicitud') returning id`);
const reqId = r.rows?.[0]?.id;
expect("staff SÍ crea su solicitud", r.ok && !!reqId, r);
r = await as(B, `insert into public.amplia_requests (type_id, requester_id, title) values ('${typeId}', '${A}', 'A nombre de otro')`);
expect("staff NO crea solicitudes a nombre de otro", !r.ok, r);
r = await as(B, `insert into public.amplia_requests (type_id, requester_id, title, status) values ('${typeId}', '${B}', 'Auto-aprobada', 'aprobada')`);
expect("staff NO crea solicitudes ya aprobadas", !r.ok, r);
r = await as(B, `update public.amplia_requests set status = 'aprobada' where id = '${reqId}'`);
expect("staff NO aprueba su solicitud", r.ok && r.affected === 0, r);
r = await as(C, `insert into public.amplia_requests (type_id, requester_id, title) values ('${typeId}', '${C}', 'Intruso')`);
expect("sin acceso NO crea solicitudes", !r.ok, r);
r = await as(A, `update public.amplia_requests set status = 'aprobada', admin_note = 'ok' where id = '${reqId}'`);
expect("admin SÍ aprueba", r.ok && r.affected === 1, r);
r = await as(B, `delete from public.amplia_requests where id = '${reqId}'`);
expect("staff NO borra una solicitud ya aprobada", r.ok && r.affected === 0, r);
r = await as(A, `insert into public.amplia_requests (type_id, requester_id, title) values ('${typeId}', '${A}', 'De A')`);
r = await as(B, `select title from public.amplia_requests`);
expect("staff solo ve sus solicitudes", r.ok && r.rows.length === 1 && r.rows[0].title === "Mi solicitud", r);
r = await as(A, `select title from public.amplia_requests`);
expect("admin ve todas las solicitudes", r.ok && r.rows.length === 2, r);
r = await as(A, `insert into public.amplia_requests (type_id, requester_id, title, starts_on, ends_on) values ('${typeId}', '${A}', 'Fechas', '2026-10-10', '2026-10-01')`);
expect("fechas invertidas se rechazan", !r.ok, r);

// ---- Proyectos
r = await as(A, `insert into public.amplia_projects (name, owner_id) values ('Proyecto 1', '${B}')`);
expect("admin SÍ crea proyectos", r.ok, r);
r = await as(B, `update public.amplia_projects set status = 'terminado'`);
expect("staff NO mueve proyectos", r.ok && r.affected === 0, r);

// ---- Almacenamiento
r = await as(A, `insert into storage.objects (bucket_id, name) values ('amplia-recursos', 'x/doc.pdf')`);
expect("admin SÍ sube archivos al bucket", r.ok, r);
r = await as(B, `insert into storage.objects (bucket_id, name) values ('amplia-recursos', 'x/otro.pdf')`);
expect("staff NO sube archivos", !r.ok, r);
r = await as(B, `select name from storage.objects where bucket_id = 'amplia-recursos'`);
expect("staff SÍ descarga (lee) archivos", r.ok && r.rows.length === 1, r);
r = await as(C, `select name from storage.objects where bucket_id = 'amplia-recursos'`);
expect("sin acceso NO ve archivos", r.ok && r.rows.length === 0, r);

// ---- Miembro desactivado pierde acceso
await as(A, `update public.amplia_members set active = false where id = '${B}'`);
r = await as(B, `select * from public.amplia_contacts`);
expect("miembro desactivado ya no ve nada", r.ok && r.rows.length === 0, r);

console.log(`\n${pass} pruebas OK, ${failN} fallas`);
process.exit(failN ? 1 : 0);
