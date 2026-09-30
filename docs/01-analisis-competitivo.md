# 01 · Análisis competitivo

> **Fecha de la revisión:** 29 de septiembre de 2026.
> **Método:** la misma máquina, el mismo día y las mismas herramientas para todos los sitios:
> - Lighthouse 12.8.2 en modo móvil con *throttling* simulado.
> - Una auditoría automática con Chromium, que revisa metadatos, datos estructurados, idiomas, widgets, peso y señales de stack. El script está en `scripts/`; ver el README.
> - Una revisión manual de cada página de inicio.
>
> **Regla:** solo se anota lo que se pudo verificar. Si un dato no se pudo medir, dice **N/D** y se explica por qué.

## Sitios comparados

| | Sitio | Por qué está aquí |
|---|---|---|
| **Referencia** | [imaginastudio.mx](https://imaginastudio.mx/) | Referente local que el proyecto pidió superar. |
| **Competidor 1** | [creapptivo.com](https://creapptivo.com/) | Agencia web de Hermosillo. Vende web, apps y software a la medida. |
| **Competidor 2** | [hechoensonora.com](https://www.hechoensonora.com/) | Agencia de Hermosillo. Vende web, sistemas, hosting y seguridad. |

## Comparativa lado a lado

| Criterio | **Northa (este sitio)** | Imagina Studio | Creapptivo | Hecho en Sonora |
|---|---|---|---|---|
| Stack | Next.js 16 + React 19, sin plugins | WordPress 7.1.2 + Elementor + Slider Revolution + TranslatePress | WordPress (tema propio) | Sitio a la medida |
| Hero | Video 3D propio del Cerro (MP4 + WebM, versión vertical para celular) | Imagen estática ("Un lugar para crear") | Imagen estática | Video de fondo |
| Chat | **Nort**, asistente con IA con herramientas (WhatsApp, lead, agenda) | Botón de WhatsApp ("¿Necesitas ayuda?") | Botones de WhatsApp | Botón de WhatsApp |
| Captura de leads | Formulario, chat y configurador → Supabase + correo + HubSpot, con WhatsApp de respaldo | Formulario y teléfonos | WhatsApp y formulario | Formulario ("Cotizar ahora") |
| Servicios | 6, cada uno con su propia página orientada a búsqueda local | 6 (redes, web, foto, video, diseño, app) | 3 (web, apps, software a la medida) | 9 (web, software, automatización, APIs, UX, hosting, servidores, sistemas, ciberseguridad) |
| Portafolio | Proyectos en producción con enlace vivo (14 portales + plataforma + productos) | 6 proyectos + 13 logos de clientes | 20+ casos | No visible |
| Testimonios | Ninguno hasta tener textos reales con permiso | No | Sí: 12 reseñas de Google (widget) | No |
| Blog | Bilingüe (MDX) | 1 artículo visible (23-mar-2022) | Existe; sin fecha visible | No |
| Idiomas | ES/EN con hreflang recíproco y slugs traducidos | ES/EN (plugin TranslatePress) | Solo ES | ES/EN/FR (sin hreflang) |
| Modo oscuro | Sí, con selector y sin parpadeo | Sin selector | No | No |
| Precios | "Cotización a la medida" con 3 planes de referencia | 3 planes mensuales ($150–$190) con la misma descripción | No | Sí (web desde $7,000; hosting y ciberseguridad) |
| Meta description | Sí, única por página e idioma | **No** | Sí | Sí |
| Open Graph / Twitter | Sí, con imagen generada por página | **No / No** | Sí / Sí | Sí / No |
| JSON-LD | Organization + ProfessionalService, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting | **Ninguno** | LocalBusiness, Organization, WebSite… | LocalBusiness |
| H1 | 1 por página | 2 (repetido "Imagina Studio") | 1 | 1 |
| Lighthouse Rendimiento | **96–99** móvil² (inicio 97) · 100 escritorio | **61** | N/D¹ | 76 |
| Lighthouse Accesibilidad | **100** (axe: 0 violaciones en 60 combinaciones de página, tema y pantalla) | **69** | N/D¹ | 60 |
| Lighthouse Buenas prácticas | **100** | 96 | N/D¹ | 96 |
| Lighthouse SEO | **100** | 92 | N/D¹ | 92 |
| LCP (móvil) | 1.9–2.6 s² (inicio 2.4 s) | 4.5 s | N/D¹ | 4.2 s |
| Peso total (Lighthouse) | 402–529 KB en páginas internas; inicio 937 KB **con** el video vertical | 4.1 MB | N/D¹ | 21 MB (video sin optimizar) |

¹ A Lighthouse, Creapptivo le respondió con una página de verificación (HTTP 202, 10 KB) y no con el sitio. Por eso sus puntajes no son comparables. En navegador normal sí carga: 35 peticiones y unos 2 MB.

² Northa se midió con el build de producción en local, servido con HTTP/2, TLS y Brotli como en Vercel (Lighthouse 12.8.2, móvil simulado), en inicio, portafolio, un servicio y Amplía. La cifra oficial será la de PageSpeed Insights sobre el dominio publicado; el procedimiento y la tabla completa están en `05-lanzamiento.md`.

**Lo que ellos hacen mejor, sin rodeos:**

- **Creapptivo** tiene prueba social: 20+ casos y 12 reseñas de Google. Northa todavía no tiene testimonios publicables.
  - *Respuesta:* pedir permiso a los clientes para publicar casos privados y reseñas (ver `06-contenido.md`), y enlazar las reseñas reales de Google cuando existan. Nada se inventa.
- **Hecho en Sonora** publica precios y vende hosting y ciberseguridad.
  - *Respuesta:* Northa cotiza por alcance, pero los 3 planes de referencia orientan al visitante. Si más adelante quieres rangos públicos, se agregan en `content/plans.ts`.

---

## 15 mejoras concretas sobre Imagina Studio

Cada mejora dice qué se observó y cómo lo resuelve este sitio. Casi todas traen el código real del proyecto.

### 1. Hero inmersivo sin sacrificar la carga

**Qué vimos:** Imagina usa una imagen estática y su LCP es de 4.5 s en móvil.

**Northa:**
- **Video 3D propio**, generado con el mismo código del Cerro: 1920×1080 para escritorio y 720×1280 vertical para celular.
- El texto del hero entra **solo con CSS**, así el LCP no espera a JavaScript.
- El video se pide **después** del evento `load`, en un momento ocioso.
- No se descarga con "reducir movimiento", con la pausa manual ni con Ahorro de datos.

```tsx
// components/hero/HeroVideo.tsx
<video muted loop playsInline preload="none" aria-label={label}>
  {loaded && (<>
    <source src="/video/cerro-720x1280.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
    <source src="/video/cerro-720x1280.mp4"  type="video/mp4"  media="(max-aspect-ratio: 4/5)" />
    <source src="/video/cerro-1920x1080.webm" type="video/webm" />
    <source src="/video/cerro-1920x1080.mp4"  type="video/mp4" />
  </>)}
</video>
```

### 2. Chatbot con IA nativo, no un botón de WhatsApp

**Qué vimos:** Imagina solo tiene un botón de WhatsApp con "¿Necesitas ayuda?".

**Northa:** **Nort** está en todas las páginas y usa Vercel AI SDK con AI Gateway.
- Responde con el contenido real del sitio.
- Califica el proyecto.
- Tiene 3 herramientas: pasar a WhatsApp con resumen, guardar el lead **con consentimiento** y agendar una llamada.
- Si no hay llave de IA, entra en **modo guiado**: respuestas fijas más WhatsApp, y la pregunta no se pierde.

```ts
// lib/ai/tools.ts (extracto)
whatsappHandoff: tool({
  description: "Genera un enlace de WhatsApp con un resumen del proyecto ya escrito…",
  inputSchema: z.object({ summary: z.string().min(10).max(600) }),
  execute: async ({ summary }) => ({ url: whatsappUrl(`${prefix}\n${summary}`), summary }),
}),
```

### 3. WhatsApp con contexto y leads que nunca se pierden

**Qué vimos:** en Imagina, WhatsApp es un enlace genérico.

**Northa:**
- Cada punto de contacto arma su mensaje: por servicio, por gobierno, desde "Arma tu proyecto" o desde el chat.
- Los leads se envían **en paralelo** a Supabase, al correo (Resend) y a HubSpot. Cada destino es opcional.
- Si ninguno responde, la interfaz ofrece enviarlo por WhatsApp **ya escrito**.

```ts
// lib/whatsapp.ts
export function serviceWhatsappMessage(serviceName: string, locale: Locale) {
  return locale === "es"
    ? `Hola Northa 👋 Me interesa: ${serviceName}. ¿Podemos platicar?`
    : `Hi Northa 👋 I'm interested in: ${serviceName}. Can we talk?`;
}
```

### 4. "Arma tu proyecto": cotizar sin formularios eternos

**Qué vimos:** Imagina se queda en "CONTÁCTANOS" y un formulario genérico.

**Northa:**
- Un configurador de 3 preguntas (qué necesitas, en qué etapa estás, para cuándo) con una brújula que gira en cada paso.
- Al final muestra el mensaje listo para WhatsApp, o un mini formulario si la persona prefiere que la contacten.
- Es accesible: opciones con `role="checkbox"` y `role="radio"`, y los grupos de radio se recorren con las flechas del teclado.

### 5. Servicios pensados para cómo busca la gente

**Qué vimos:** Imagina mezcla redes sociales, fotografía y video con desarrollo, sin una página por intención de búsqueda.

**Northa:**
- 6 servicios ordenados por demanda (web → sistemas → apps → IA → mantenimiento → consultoría).
- Cada uno tiene **su propia página**: título SEO, qué incluye, para quién es, proceso, stack, preguntas frecuentes con `FAQPage` y JSON-LD `Service`.

### 6. SEO técnico completo

**Qué vimos:** Imagina no tiene meta description, Open Graph, Twitter Card ni JSON-LD, y repite el H1.

**Northa:** en cada página hay:
- Meta description.
- Canonical.
- hreflang es-MX/en/x-default.
- Imagen OG generada al momento (`/api/og`).
- Datos estructurados.
- `sitemap.xml` con las alternativas de idioma.

```ts
// app/[locale]/servicios/[slug]/page.tsx (el mismo patrón se usa en todas las páginas)
export async function generateMetadata({ params }: PageProps<"/[locale]/servicios/[slug]">) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) return {};
  return {
    ...pageMetadata({ locale, path: `/servicios/${slug}`, title: service.seoTitle[locale],
      description: service.seoDescription[locale], ogSubtitle: service.short[locale] }),
    keywords: service.keywords[locale],
  };
}
```

### 7. Accesibilidad verificada, no supuesta

**Qué vimos:** Imagina saca 69 en accesibilidad; fallan los nombres de enlaces y el orden de encabezados.

**Northa:** WCAG 2.2 AA, con **0 violaciones de axe** en 13 páginas, en celular y escritorio, en tema claro y oscuro. Incluye:
- Salto al contenido.
- Foco visible.
- Menú móvil con foco atrapado.
- Escape que cierra todo.
- Pausa global de animaciones (2.2.2).
- Respeto a "reducir movimiento".
- `scroll-padding` para que el header no tape el foco (2.4.11).

### 8. Peso y velocidad

**Qué vimos:** Imagina pesa 4.1 MB, carga 39 scripts y tiene recursos que bloquean el render y JavaScript sin usar.

**Northa:**
- Imágenes AVIF/WebP responsivas con `next/image`.
- JavaScript separado por ruta.
- Three.js solo se descarga cuando la sección del Cerro se acerca.
- El chat se carga en un momento ocioso.
- Fuentes autoalojadas con `next/font`.
- Cero plugins de terceros.

### 9. Identidad animada del Cerro en todas partes

**Qué vimos:** en Imagina, el logo es un archivo estático.

**Northa:** el mismo trazo del Cerro con la estrella del norte se usa como:
- Logo animado del header y del hero.
- **Favicon SVG animado**, con un faro que parpadea y un respaldo en canvas cuando la pestaña está oculta.
- Loader.
- Decoración en curvas de nivel.
- Imagen OG.
- Escena 3D interactiva: el día cae sobre el cerro al hacer scroll.

### 10. Modo oscuro y claro, sin parpadeo

**Qué vimos:** Imagina no tiene selector de tema.

**Northa:**
- El tema oscuro (negro con tinte azul marino) es el predeterminado. El claro usa neutros fríos y tinta azul marino.
- Un script mínimo pone el tema **antes del primer pintado**, así no hay flash.
- La preferencia se guarda en el navegador.

### 11. Bilingüe de verdad

**Qué vimos:** Imagina traduce con el plugin TranslatePress.

**Northa:**
- Español en la raíz y inglés en `/en`.
- El `proxy.ts` reescribe las rutas, sin redirecciones extra.
- Los artículos tienen **slugs traducidos** y el selector de idioma lleva a la traducción correcta.
- hreflang recíproco en metadatos y sitemap.

### 12. Portafolio verificable

**Qué vimos:** Imagina muestra 6 proyectos y 13 logos. Los logos no se pueden verificar.

**Northa:** `/portfolio` solo muestra lo que está **en línea hoy**:
- Capturas reales de los 14 portales municipales, con enlace a cada dominio.
- La plataforma multi-cliente que los opera.
- Los productos propios (Nort y la identidad 3D).

Tiene filtros por categoría. Un proyecto privado aparece solo con autorización del cliente (`published: true`).

### 13. Contenido que construye autoridad

**Qué vimos:** en Imagina, el último artículo visible es de marzo de 2022.

**Northa:**
- Blog bilingüe en MDX con artículos técnicos de primera mano (cómo operamos 14 portales) y guías para quien contrata ("10 preguntas antes de contratar una página web").
- Cada artículo lleva JSON-LD `BlogPosting` e imagen OG.
- En `06-contenido.md` hay un calendario sugerido.

### 14. Northa ⇄ Amplía: dos marcas, un solo sitio

**Qué vimos:** esto no existe en ninguno de los tres.

**Northa:**
- `/amplia` cambia el acento de rosa a teal con una **transición animada** (colores registrados con `@property`).
- Un selector de marca vive en el header.
- **`/amplia/portal`** es una intranet con inicio de sesión y roles (admin y personal): directorio, comunicados, recursos, solicitudes y proyectos. Arranca vacía: el equipo de Amplía captura sus datos reales.

### 15. Operación y seguridad de producción

**Qué vimos:** WordPress con plugins de maquetación, slider y traducción. Cada plugin es una superficie más que hay que mantener al día.

**Northa:**
- Revisión automática en GitHub Actions (lint, tipos y build) en cada PR.
- Deploy a producción con `git push` a `main`.
- Cabeceras de seguridad: HSTS, `frame-ancestors 'none'`, `nosniff` y Permissions-Policy.
- Límite de peticiones en las APIs.
- Candado en código para no escribir jamás en la base de los municipios.
- Analítica sin cookies (Vercel).
- Aviso de privacidad conforme a la LFPDPPP.

```ts
// lib/leads/sinks/supabase.ts
if (url.includes(SHARED_MUNICIPAL_PROJECT)) {
  console.error("[leads] SUPABASE_URL apunta a la base compartida de los municipios. Lead NO guardado ahí.");
  return "error";
}
```

---

### Fuentes

- Imagina Studio: <https://imaginastudio.mx/> (revisado el 29-sep-2026: página de inicio, auditoría técnica y Lighthouse).
- Creapptivo: <https://creapptivo.com/> y <https://creapptivo.com/servicios/diseno-web-en-hermosillo/>.
- Hecho en Sonora: <https://www.hechoensonora.com/>.
