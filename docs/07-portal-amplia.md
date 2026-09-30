# 07 · Intranet de Amplía (`/amplia/portal`)

Portal interno para el equipo de Amplía Consultoría: comunicados, directorio, recursos, solicitudes, proyectos y cuentas. Solo en español, fuera de Google (`noindex`, bloqueado en `robots.txt`, sin caché compartida) y con sesión obligatoria.

Todo arranca **vacío**: no hay datos de ejemplo. Lo que se ve lo captura Amplía.

## 1. Qué puede hacer cada rol

| Sección | Personal (`staff`) | Admin (`admin`) |
|---|---|---|
| Inicio | Comunicados fijados, sus solicitudes y proyectos activos | Lo mismo, con los conteos de todo |
| Comunicados | Leer | Crear, editar, fijar y borrar |
| Directorio | Buscar y llamar o escribir (tel/mailto) | Además, dar de alta, editar y borrar contactos |
| Recursos | Abrir enlaces y descargar archivos | Subir archivos (hasta 4 MB) o enlaces, por categoría |
| Solicitudes | Crear las suyas y borrarlas mientras estén pendientes | Ver todas, atender (estado y nota) y definir los **tipos** de solicitud |
| Proyectos | Ver el tablero | Crear, mover entre columnas, editar y borrar |
| Usuarios | — | Dar de alta cuentas, cambiar rol y activar o desactivar |
| Mi cuenta | Cambiar su nombre y contraseña (mínimo 10 caracteres) | Igual |

Las reglas no dependen de la interfaz: están en la base de datos (RLS). Aunque alguien manipule una petición, un `staff` no puede escribir donde no le toca ni volverse admin.

## 2. Puesta en marcha (una sola vez)

> ⚠️ **Proyecto NUEVO de Supabase.** Nunca el de los municipios (`qpilnqzgsndymktgodoq`): el código y el script de alta se niegan a usarlo.

1. **Crear el proyecto** en Supabase (organización de Northa). Región cercana a las funciones de Vercel (por defecto `iad1`, Washington): "East US (North Virginia)".
2. **Autenticación** (Authentication → Sign In / Providers → Email):
   - Desactiva **"Allow new users to sign up"**: las cuentas solo las crean los admins.
   - Longitud mínima de contraseña: **10** (igual que el portal).
3. **Migraciones** (SQL Editor). Revisa cada archivo antes de correrlo y córrelos en orden:
   1. `supabase/migrations/0001_leads.sql`: tabla `leads` del sitio.
   2. `supabase/migrations/0002_amplia_portal.sql`: tablas del portal, reglas RLS, funciones y el bucket privado `amplia-recursos`.

   Son idempotentes: correrlas dos veces no duplica nada.
4. **Llaves** (Project Settings → API Keys) en Vercel y en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_…`)
   - `SUPABASE_SECRET_KEY` (`sb_secret_…`). Es secreta: solo en el servidor, nunca con `NEXT_PUBLIC_`.
5. **Primer admin** desde tu Mac (lee `.env.local`):

   ```bash
   npm run amplia:admin -- --email=correo@dominio.com --name="Nombre Apellido"
   ```

   Imprime **una sola vez** una contraseña temporal de 16 caracteres. Compártela en persona y pide que la cambien en "Mi cuenta" al entrar.
6. Entra en `https://northadigital.com/amplia/portal/entrar`. Desde **Usuarios**, el admin da de alta al resto del equipo.

## 3. Operación diaria

- **Alta de una persona:** Usuarios → nombre, correo, rol y contraseña temporal. Se crea la cuenta y su ficha de miembro; si algo falla a medias, se deshace solo.
- **Baja:** desactívala (no se borra). Pierde el acceso de inmediato y su historial se conserva.
- **Siempre queda un admin:** el portal no deja desactivar ni degradar al último admin activo.
- **Tipos de solicitud:** Solicitudes → Tipos. Amplía define los suyos (por ejemplo "Vacaciones", "Viáticos", "Revisión de documento"). Se pueden desactivar sin perder las solicitudes viejas.
- **Archivos:** van al bucket privado `amplia-recursos`. Se descargan con un enlace firmado que caduca en 60 segundos, así que un enlace copiado no sirve después.
- **Fechas:** una solicitud no acepta una fecha de fin anterior a la de inicio.

## 4. Seguridad

| Capa | Qué hace |
|---|---|
| RLS en todas las tablas | Los miembros activos leen; los admins escriben; cada quien ve y crea sus propias solicitudes |
| Funciones `amplia_is_member()` / `amplia_is_admin()` | Deciden los permisos dentro de la base de datos |
| Disparador `amplia_members_guard` | Impide que alguien que no es admin cambie su rol, su estado o su correo |
| Sesión | Cookies seguras de Supabase, renovadas en `proxy.ts` en cada visita al portal |
| Inicio de sesión | Máximo 8 intentos cada 10 minutos por IP; error genérico (no revela si el correo existe) |
| Llave secreta | Solo en el servidor, para dar de alta cuentas y después de comprobar que quien lo pide es admin |
| Encabezados | `X-Robots-Tag: noindex, nofollow` y `Cache-Control: private, no-store` |

### Pruebas de las reglas

```bash
npm run test:db
```

Levanta un Postgres en memoria (PGlite) con las mismas migraciones y comprueba 34 casos: quién lee, quién escribe, que el personal no puede volverse admin, solicitudes propias contra ajenas, archivos, etcétera. Córrelo después de cualquier cambio a las migraciones; el CI lo corre en cada Pull Request y en cada push a `main`.

## 5. Respaldos y plan de Supabase

- **Plan gratuito:** Supabase pausa el proyecto tras 7 días de poca actividad. Los datos se conservan y se reanuda desde el panel ("Resume project"), pero mientras esté pausado el portal no deja entrar y los leads no se guardan en la base (el correo y WhatsApp siguen funcionando). Si el equipo va a usar el portal a diario, o para no depender de eso, conviene el plan **Pro**, que no se pausa.
- **Respaldo mensual** (ver `08-mantenimiento.md`): exporta la base con `supabase db dump` (CLI enlazada al proyecto nuevo) y descarga el bucket `amplia-recursos` desde Storage. Guárdalo cifrado en Bitwarden o en una unidad privada.
- Antes de cualquier cambio de esquema: respaldo, revisión del SQL y aprobación explícita. Nunca comandos destructivos.
