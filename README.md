# Northa Digital

Sitio de **Northa Digital** (Hermosillo, Sonora) con **Amplía Consultoría** como sitio hermano y su intranet. Next.js 16, bilingüe (ES/EN), modo oscuro y claro, accesible (WCAG 2.2 AA) y con Nort, un asistente con IA que responde, captura leads y pasa a WhatsApp.

| | |
|---|---|
| Producción | `https://northadigital.com` (ver `docs/05-lanzamiento.md`) |
| Repo | `github.com/r0b3rt0g1l/northa-landing` (el sitio nuevo entra por la rama `v2`) |
| Deploy | `git push`: Vercel con Git conectado (proyecto `northa-landing`); GitHub Actions como alternativa |
| Lighthouse (local, HTTP/2, 30-sep-2026) | Rendimiento 92–96 móvil (inicio) y 100 escritorio · Accesibilidad, Buenas prácticas y SEO 100 |

## Qué incluye

- **Páginas:** inicio, `/servicios` (+ 10 servicios, página corta cada uno), `/portfolio`, `/gobierno`, `/amplia`, `/blog` (+ artículos en MDX), `/contacto` y `/privacidad`, en español (raíz) y en inglés (`/en`).
- **Identidad del Cerro de la Campana:** logo animado, favicon SVG animado, loader, curvas de nivel y el **Cerro en vivo** del inicio (Three.js): sigue la hora y el clima reales de Hermosillo, y al bajar quedan solo las luces de la ciudad. Todo sale del mismo modelo.
- **Nort:** chat con Vercel AI SDK y AI Gateway, con herramientas (WhatsApp con resumen, guardar lead, agendar) e historial de 7 días en el navegador. Sin IA disponible, entra en modo guiado.
- **Leads:** formulario, "Arma tu proyecto" y Nort → Supabase + correo (Resend) + HubSpot, con WhatsApp de respaldo si ningún destino responde.
- **Intranet de Amplía** (`/amplia/portal`): comunicados, directorio, recursos, solicitudes, proyectos y usuarios, con roles y reglas RLS en Supabase.
- **SEO:** metadatos por página e idioma, `hreflang` recíproco, sitemap, robots, imágenes OG generadas y JSON-LD (Organization, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting, CollectionPage).

## Empezar

Requisitos: Node 22 (`.nvmrc`) y npm.

```bash
npm ci
cp .env.example .env.local   # todo es opcional; sin variables el sitio funciona
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build de producción y servidor |
| `npm run lint` · `npm run typecheck` · `npm run check` | ESLint, tipos (con `next typegen`) y los dos juntos |
| `npm run test:db` | Pruebas de las reglas RLS de Supabase en Postgres en memoria (PGlite) |
| `npm run render:cerro` | Vuelve a renderizar los pósters del Cerro (amanecer, día, atardecer, noche) desde la escena 3D (`docs/04-cerro-en-vivo.md`) |
| `npm run brand:assets` | Regenera favicon, íconos y curvas de nivel |
| `npm run capture:portfolio` | Actualiza las capturas de los portales para `/portfolio` |
| `npm run audit:sites` | Auditoría rápida de sitios (propios o de la competencia) |
| `npm run amplia:admin` | Crea el primer admin de la intranet (`docs/07-portal-amplia.md`) |

## Estructura

```text
app/
  [locale]/          sitio público ES/EN (estático)
  amplia/portal/     intranet (otro layout raíz, dinámica)
  api/               chat (Nort) · leads · og (imágenes para redes) · clima (Hermosillo)
components/          brand · hero · cerro · sections · chat · forms · amplia · portfolio · portal · layout · ui
content/             textos y datos del sitio + blog en MDX
lib/                 i18n · seo · jsonld · ai · leads · supabase · portal · three · cerro · gsap · hooks
public/              cerro (pósters) · portfolio · escudos · brand · amplia
scripts/             pósters del Cerro · activos de marca · capturas · auditoría · alta de admin
supabase/            migraciones SQL y pruebas de RLS
docs/                análisis, arquitectura, wireframes, Cerro en vivo, lanzamiento, contenido, portal, mantenimiento
proxy.ts             idiomas + sesión de la intranet
.github/workflows/   ci.yml (PR y main) · deploy.yml (opcional)
```

## Deploy

- **Git conectado en Vercel** (proyecto `northa-landing`): cada rama sale en preview y cada merge a `main` va a producción. Las variables están en `.env.example`.
- **GitHub Actions** (alternativa para repos privadas de una organización en Hobby): secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`, y la variable `DEPLOY_WITH_ACTIONS=true`. Corre lint, tipos y pruebas, y publica con `vercel deploy --prebuilt --prod`.

Paso a paso, dominio y lista de verificación: `docs/05-lanzamiento.md`.

## Documentación

| | |
|---|---|
| `docs/00-decisiones.md` | Decisiones confirmadas, supuestos y pendientes |
| `docs/01-analisis-competitivo.md` | Comparativa con Imagina Studio, Creapptivo y Hecho en Sonora, y las 15 mejoras |
| `docs/02-arquitectura.md` | Mapa del sitio, navegación, flujos y arquitectura técnica |
| `docs/03-wireframes.md` | Wireframes de alta fidelidad en texto |
| `docs/04-cerro-en-vivo.md` | Cerro en vivo del inicio: hora, clima, carga, pósters y cómo cambiarlo |
| `docs/05-lanzamiento.md` | Configuración, deploy, mediciones y checklist de lanzamiento |
| `docs/06-contenido.md` | Cómo editar textos, blog, portafolio y calendario editorial |
| `docs/07-portal-amplia.md` | Intranet: puesta en marcha, operación y seguridad |
| `docs/08-mantenimiento.md` | Checklist mensual, trimestral y anual |

## Reglas del proyecto

- **Nada se inventa:** sin testimonios, cifras ni clientes que no estén verificados y autorizados.
- **Base de datos aislada:** leads e intranet viven en un proyecto **nuevo** de Supabase. El código se niega a usar el de los municipios (`qpilnqzgsndymktgodoq`).
- **Commits con rutas explícitas** (nunca `git add -A`) y revisión en el iPhone antes de mezclar a `main`.
