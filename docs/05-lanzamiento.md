# 05 · Lanzamiento

Qué configurar para publicar, cómo se midió el sitio y la lista de verificación antes y después de salir a producción. Marca cada casilla al completarla.

## 1. Estado medido (29-sep-2026)

Build de producción servido en local con **HTTP/2, TLS y Brotli** (como lo sirve Vercel) y Lighthouse 12.8.2 en modo móvil simulado (Moto G Power, 4× CPU, 1.6 Mbps) y escritorio.

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Inicio (móvil) | **97** | 100 | 100 | 100 | 2.4 s | 100 ms | 0 |
| Portafolio (móvil) | **99** | 100 | 100 | 100 | 1.9 s | 100 ms | 0 |
| Servicio: Desarrollo web (móvil) | **97** | 100 | 100 | 100 | 2.6 s | 60 ms | 0 |
| Amplía (móvil) | **96** | 100 | 100 | 100 | 2.3 s | 150 ms | 0 |
| Inicio (escritorio) | **100** | 100 | 100 | 100 | 0.6 s | 0 ms | 0 |

Además, axe-core (WCAG 2.2 A/AA) da **0 violaciones** en 15 páginas × 2 temas × 2 pantallas, sin errores de consola ni desbordamiento horizontal.

**Ojo con una rareza del entorno de prueba.** En la máquina de medición (sin GPU), a veces Chrome retiene el primer cuadro ~1 s: el compositor deja de recibir cuadros por un momento. Cuando pasa, la misma página baja a 86–93 porque Lighthouse cuenta ese segundo. No depende del sitio: se redujo mucho quitando trabajo del primer cuadro (grano en PNG, GSAP y Motion diferidos, `content-visibility`). **La cifra que cuenta es la de PageSpeed Insights sobre el dominio publicado** (paso 4.2).

## 2. Configuración para publicar

### 2.1 Repositorio

- [x] Repo: **`github.com/r0b3rt0g1l/northa-landing`**, la del landing anterior. El sitio nuevo entra por la rama `v2` con un Pull Request a `main`, así el historial anterior se conserva.
- [ ] La repo es **pública**. No lleva secretos (`.env*` y `.vercel/` están en `.gitignore`), pero incluye el código de la intranet de Amplía. Si prefieres que no se vea, hazla privada (Settings → General → Danger Zone); en una cuenta personal, Vercel sigue desplegando repos privadas en Hobby.
- [ ] Commits siempre con rutas explícitas (nunca `git add -A`).

### 2.2 Proyecto en Vercel

- [x] Proyecto **`northa-landing`** en el team **`northa-digital`** (el mismo de los portales), creado el 30-sep-2026 al importar la repo. Dominio de Vercel: `northa-landing-beryl.vercel.app`. El `.vercel/project.json` de tu carpeta ya apunta a él.
- [ ] El proyecto `northa-landing` anterior está en otra cuenta de Vercel (su enlace quedó respaldado en `.vercel/project.anterior-otra-cuenta.json`) y sigue sirviendo el landing viejo en `northa-landing.vercel.app`. Ya no se usa: bórralo desde esa cuenta cuando quieras y no lo vuelvas a enlazar.
- [x] **Git conectado** a `r0b3rt0g1l/northa-landing`. Cada rama sale en preview y cada merge a `main` va a producción; el Action de deploy no hace falta (ver 2.4).
- [ ] Node: Vercel usa 24.x y el CI usa 22 (`.nvmrc`); los dos cumplen `"engines": ">=22"`. Si prefieres el mismo en los dos, fija 22.x en la configuración del proyecto ("Node.js Version").
- [ ] Las previews piden iniciar sesión en Vercel (protección estándar del team). Para revisarlas en el iPhone, entra con tu cuenta en Safari.
- [ ] Project → Settings → **Analytics**: activar **Web Analytics** y **Speed Insights**. Sin esto, sus scripts dan 404 en producción y bajan Buenas prácticas.
- [ ] Project → Settings → Environment Variables: captura las variables **antes del primer build** (tabla 2.3).
- [ ] Project → Settings → General: deja activado "Automatically expose System Environment Variables" (el sitio usa `VERCEL_ENV` para cargar la analítica solo en Vercel).
- [ ] Limitar gasto: Settings → Billing → Spend Management (y presupuesto en AI Gateway).

### 2.3 Variables de entorno

Todas están explicadas en `.env.example`. Mínimo para lanzar:

| Variable | Production | Preview | Nota |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://northadigital.com` | la URL de preview o vacía | canonical, sitemap, OG |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_PHONE_DISPLAY` | ✓ | ✓ | ya tienen default verificado |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` | ✓ | opcional | proyecto **nuevo** (`07-portal-amplia.md`) |
| `RESEND_API_KEY`, `LEADS_NOTIFY_EMAIL`, `LEADS_FROM_EMAIL` | ✓ | opcional | avisos de leads |
| `AI_GATEWAY_API_KEY` | solo fuera de Vercel | — | en Vercel, Nort usa la credencial del proyecto |

Reglas que ya nos costaron caro:
- [ ] Las `NEXT_PUBLIC_*` **nunca** como "Sensitive".
- [ ] Si cambias una `NEXT_PUBLIC_*`, publica con un commit nuevo (el deploy nuevo compila de cero). No uses "Redeploy".
- [ ] Antes de publicar, `vercel env pull` y confirma que cada valor es exacto y legible.

### 2.4 Deploy con `git push`

Hay dos formas; usa **una**.

**A. Git conectado en Vercel (la de esta repo, que es personal).**
- [x] Project → Settings → Git: conectado a `r0b3rt0g1l/northa-landing`, con `main` como rama de producción.
- [ ] Push de una rama → preview automática. Merge a `main` → producción.

**B. GitHub Actions + Vercel CLI** (para cuando la repo sea privada y de una organización: en Hobby, Vercel no despliega solo esas repos).
- [ ] En Vercel, desconecta Git para no desplegar dos veces.
- [ ] En GitHub → Settings → Secrets and variables → Actions:
  - Secretos: `VERCEL_TOKEN` (vercel.com/account/tokens), `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` (de `.vercel/project.json`).
  - Variable: `DEPLOY_WITH_ACTIONS` = `true`. Sin ella, el Action de deploy no corre.
- [ ] Push a `main` → el Action `Deploy a producción` corre lint, tipos y pruebas de base de datos; si pasan, hace `vercel pull`, `vercel build --prod` y `vercel deploy --prebuilt --prod`. La URL queda en el resumen del Action.

En las dos:
- [ ] Los Pull Requests y los push a `main` corren `CI` (lint, tipos, pruebas y build) sin publicar.
- [ ] Alternativa manual (la misma de los portales): `vercel --prod` desde la carpeta enlazada.
- [ ] Antes de mezclar a `main`, revisa la preview en el iPhone.

### 2.5 Dominio

- [ ] Vercel → Domains: agrega `northadigital.com` y `www.northadigital.com` (www redirige a la raíz).
- [ ] En Cloudflare (DNS de `northadigital.com`), crea exactamente los registros que muestra Vercel, con el proxy en **DNS only** (nube gris).
- [ ] **No tocar** los registros de `api.` ni `admin.`.
- [ ] El sitio manda HSTS con `includeSubDomains`: `api.` y `admin.` ya van por HTTPS, así que no hay problema. Si algún día se crea un subdominio sin HTTPS, fallará en navegadores que ya visitaron el sitio.
- [ ] Verifica el certificado y que `http://` redirija a `https://`.

### 2.6 Servicios externos

- [ ] **Supabase (proyecto nuevo):** migraciones, llaves y primer admin → `07-portal-amplia.md`.
- [ ] **Resend:** verifica el dominio (registros SPF/DKIM en Cloudflare), define `LEADS_FROM_EMAIL` y, si quieres acuse para el prospecto, `LEADS_CONFIRMATION=true`.
- [ ] **AI Gateway:** actívalo en el team, carga crédito o conecta la llave del proveedor y pon un presupuesto mensual. Sin crédito, Nort cae a modo guiado (no se rompe). Hoy el Gateway responde 403 "requires a valid credit card on file": hace falta registrar una tarjeta en el team antes de que Nort use IA.
- [ ] **Cloudflare Turnstile** (opcional): crea el widget para `northadigital.com` y captura las dos llaves.
- [ ] **HubSpot** (opcional): Private App con permisos de escritura de contactos y notas → `HUBSPOT_ACCESS_TOKEN`.
- [ ] **Cal.com** (opcional): liga pública → `NEXT_PUBLIC_CAL_URL`.
- [ ] **GA4** (opcional): `NEXT_PUBLIC_GA_ID`. Usa cookies: antes, actualiza la sección de cookies de `/privacidad`.

## 3. Verificación funcional en producción

### 3.1 SEO

- [ ] Cada página tiene su título y descripción, en ES y EN.
- [ ] `https://northadigital.com/sitemap.xml` lista páginas y artículos con sus alternos `hreflang`.
- [ ] `robots.txt` en producción permite el sitio y bloquea `/api/` y `/amplia/portal`. En las previews, bloquea todo.
- [ ] Vista previa al compartir en WhatsApp, LinkedIn y X (imagen `/api/og`): prueba con el depurador de cada red.
- [ ] Datos estructurados sin errores en <https://search.google.com/test/rich-results> (inicio, un servicio, un artículo, FAQ).
- [ ] **Google Search Console:** verifica el dominio con TXT en Cloudflare y envía el sitemap.
- [ ] (Opcional) Bing Webmaster Tools importando desde Search Console.
- [ ] (Opcional) Perfil de empresa en Google con la misma dirección y teléfono del sitio.

### 3.2 Rendimiento

- [ ] PageSpeed Insights (<https://pagespeed.web.dev>) en móvil y escritorio para `/`, `/portfolio`, `/servicios/desarrollo-web` y `/amplia`. Meta: 95+ en las cuatro categorías. Anota los resultados aquí:

| Página | Móvil | Escritorio | Fecha |
|---|---|---|---|
| `/` | | | |
| `/portfolio` | | | |
| `/servicios/desarrollo-web` | | | |
| `/amplia` | | | |

- [ ] Si un resultado sale bajo, vuelve a correrlo: PageSpeed varía de una corrida a otra. Si se repite, revisa en "Diagnóstico" qué cambió.
- [ ] Una semana después, revisa **Speed Insights** en Vercel: son usuarios reales (LCP, INP, CLS).

### 3.3 Analítica

- [ ] Vercel → Analytics muestra visitas.
- [ ] Eventos personalizados: `whatsapp_click`, `lead_submitted`, `chat_opened`, `chat_message`, `call_booking_click`, `scope_completed`, `email_click`, `portfolio_click`. Nota: en el plan Hobby, Vercel cuenta visitas (50,000 eventos al mes) pero **no** eventos personalizados; esos se ven con Pro (hasta 2 propiedades por evento) o en GA4.
- [ ] Si activaste GA4: los mismos eventos aparecen en Tiempo real.

### 3.4 Formularios y leads

- [ ] `/contacto`: envía un lead de prueba y confirma que llega a Supabase (`leads`), al correo y, si aplica, a HubSpot.
- [ ] "Arma tu proyecto" → "Prefiero que me contacten": mismo recorrido.
- [ ] Nort: pide que te contacten y confirma el lead.
- [ ] Respaldo: con Resend y Supabase apagados (en una preview), el formulario ofrece enviar por WhatsApp.
- [ ] Antispam: el campo trampa y el límite de 5 envíos por IP cada 10 minutos. Si activaste Turnstile, el widget aparece y valida.
- [ ] Borra de Supabase y HubSpot los leads de prueba.

### 3.5 WhatsApp

- [ ] Número correcto en el header, el hero, el footer, Nort y el formulario.
- [ ] Mensajes prellenados por contexto: general, cada servicio, gobierno, "Arma tu proyecto" y Nort.
- [ ] En el celular abre la app; en escritorio abre WhatsApp Web.

### 3.6 Nort

- [ ] Con IA: responde, sugiere WhatsApp, guarda el lead (con consentimiento) y ofrece agenda si hay Cal.com.
- [ ] Modo guiado (`NORT_AI_ENABLED=false` en una preview): opciones fijas y WhatsApp.
- [ ] El historial sobrevive a recargar la página y se borra con "Nueva conversación".
- [ ] Límite: más de 24 mensajes en 10 minutos desde la misma IP muestra el aviso amable.

### 3.7 Accesibilidad

- [ ] Solo teclado: "Saltar al contenido", mega menú (Escape cierra), menú móvil con foco atrapado, chat y formularios.
- [ ] VoiceOver en iPhone y NVDA o Narrador en Windows: encabezados en orden, botones con nombre, errores anunciados.
- [ ] "Reducir movimiento" del sistema y "Pausar animaciones" del pie: el Cerro queda quieto (se redibuja solo al cambiar la hora o al bajar) y sin animaciones.
- [ ] Zoom al 200 % sin cortes, en los dos temas.

### 3.8 Navegadores y dispositivos

| Dispositivo / navegador | Inicio (Cerro en vivo, hora y clima) | ES/EN | Tema | Nort | Formulario | Amplía + intranet |
|---|---|---|---|---|---|---|
| iPhone · Safari | | | | | | |
| iPhone · modo de bajo consumo | | — | — | — | — | — |
| Android · Chrome | | | | | | |
| Mac · Safari | | | | | | |
| Mac/Windows · Chrome | | | | | | |
| Windows · Edge | | | | | | |
| Firefox (escritorio) | | | | | | |

- [ ] Sin WebGL (o con fallo de la escena), el inicio se queda con el póster del Cerro de la hora que toca.
- [ ] La barra del hero: hora de Hermosillo, clima, las 4 fases y "Ahora". Al bajar quedan solo las luces.
- [ ] Anclas: `/#contacto`, `/#servicios` y "Arma tu proyecto" (`/#arma-tu-proyecto`) desde otra página aterrizan en su sección.

### 3.9 Legal y privacidad

- [ ] Revisa `/privacidad` con los datos reales del responsable y del contacto para derechos ARCO.
- [ ] Sin GA4 no hace falta banner de cookies: la analítica de Vercel no usa cookies y el historial de Nort es funcional (vive en el navegador). Con GA4, agrégalo al aviso.

### 3.10 Intranet de Amplía

- [ ] Primer admin creado; Fabiola entra y cambia su contraseña.
- [ ] `/amplia/portal` responde con `X-Robots-Tag: noindex` y no aparece en el sitemap.
- [ ] `npm run test:db` pasa (reglas RLS).

## 4. Después del lanzamiento

- [ ] Rollback: Vercel → Deployments → el deploy anterior → **Instant Rollback**.
- [ ] Monitoreo (opcional): un chequeo de disponibilidad cada 5 minutos a `/` y `/api/og`.
- [ ] Guarda aquí la fecha de salida y los resultados de PageSpeed (tabla 3.2).
- [ ] El mantenimiento mensual está en `08-mantenimiento.md`.
