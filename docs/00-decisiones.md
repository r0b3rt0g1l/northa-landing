# 00 · Decisiones del proyecto

Registro de lo que se decidió, quién lo decidió y lo que falta confirmar. Las 68 preguntas estratégicas de la FASE 1 se respondieron por categoría en la conversación del 29 de septiembre de 2026; este documento guarda las decisiones que salieron de ahí y las que se tomaron durante la construcción.

**Regla de todo el proyecto:** nada se inventa. Si un dato no está verificado (testimonio, cifra, red social, precio, proyecto privado), no se publica; el lugar se queda vacío o con un texto honesto.

## 1. Confirmadas por Roberto

| Tema | Decisión |
|---|---|
| Amplía | **Página pública + intranet desde ya.** Inicio de sesión con roles admin y personal dentro de `/amplia/portal`. Todo arranca vacío: no se precargan datos. |
| Paleta | **Rosa + negro + azul marino.** El rosa `#FF2E7E` sigue como acento; el azul marino entra en fondos, bloques y el cielo del Cerro. Amplía conserva su teal. |
| Portafolio | **Página `/portfolio`** con proyectos reales en producción y filtros. No se nombran proyectos privados. |
| Edición de contenido | **Solo Roberto, en código.** Textos y datos viven en `content/` y el blog en MDX; todo queda versionado en Git. Sin CMS. |

## 2. Supuestos (preguntas sin respuesta; se tomó la propuesta)

Se pueden cambiar sin tocar la arquitectura.

| Tema | Supuesto | Dónde se cambia |
|---|---|---|
| Procesos internos de Amplía | Tipos de solicitud **configurables** por el admin (nada precargado) | Intranet → Solicitudes → Tipos |
| Google Workspace | Sin integración | — |
| Destino de los leads | `rgilh@hotmail.com` | `LEADS_NOTIFY_EMAIL` (acepta varios separados por coma) |
| Analítica | Vercel Analytics (sin cookies) por defecto; GA4 opcional | `NEXT_PUBLIC_GA_ID` |
| Dominio | `northadigital.com` (ya es de Northa; `api.` y `admin.` lo usan) | `NEXT_PUBLIC_SITE_URL` |
| Competidores extra | Creapptivo y Hecho en Sonora (Hermosillo) | `docs/01-analisis-competitivo.md` |
| Fecha de lanzamiento | Sin fecha fija | — |

## 3. Decisiones técnicas tomadas en el camino

| Decisión | Por qué |
|---|---|
| **Next.js 16** en lugar de 15 | Es la versión estable actual: `proxy.ts`, tipos de rutas, React 19.2. |
| **i18n propio** (español en la raíz, inglés en `/en`) | Dos idiomas, diccionarios tipados y rutas estáticas; menos peso y control total del SEO. |
| **Supabase NUEVO** para leads e intranet | Aislado de la base de los municipios. El código se niega a escribir en el proyecto `qpilnqzgsndymktgodoq`. |
| **Intranet con su propio layout raíz** | No carga el sitio de marketing ni Nort; es dinámica por la sesión mientras el sitio público es 100 % estático. |
| **Repo `r0b3rt0g1l/northa-landing`, rama `v2`** | Ya existía la repo del landing anterior: el sitio nuevo la continúa con un PR y el historial se conserva. |
| **Deploy con `git push` vía Vercel** | La repo es personal, así que Vercel despliega solo con Git conectado. `deploy.yml` (Actions + CLI) queda listo y apagado para cuando la repo sea privada en una organización. |
| **Nort con AI Gateway** y modo guiado | Sin llave o sin crédito, Nort no se rompe: responde con opciones fijas y manda a WhatsApp. |
| **WhatsApp como respaldo universal** | Si ningún destino de leads está configurado o falla, el formulario ofrece enviar el mismo mensaje por WhatsApp. |
| **Grano como PNG** (no filtro SVG) | El filtro `feTurbulence` a pantalla completa retrasaba ~1 s el primer cuadro en Lighthouse. |
| **GSAP y Motion bajo demanda** | Salieron del JavaScript inicial; se descargan al acercarse a su sección. |
| **`content-visibility` en secciones de abajo** | El primer cuadro calcula solo lo visible. `HashAlign` corrige los saltos a anclas. |
| **Sin pantalla de carga entre páginas** | Se probó un `loading.tsx`: metía un estado intermedio en el HTML estático y empeoraba LCP y CLS. |
| **Fuentes:** solo el subconjunto latin precargado; mono en peso 400 | Menos bytes antes del primer pintado, sin cambiar la tipografía de la marca. |

## 4. Vacío a propósito (hasta tener datos reales)

- **Testimonios y reseñas:** ninguno. Se agregan con permiso por escrito (ver `06-contenido.md`).
- **Redes sociales** (`sameAs` en `lib/site.ts`): vacío hasta confirmar las cuentas oficiales.
- **Proyectos para empresas** (`businessProjects` en `content/portfolio.ts`): vacío hasta tener autorización.
- **Agenda Cal.com:** oculta mientras `NEXT_PUBLIC_CAL_URL` esté vacía.
- **Intranet de Amplía:** sin comunicados, contactos, tipos de solicitud ni proyectos de ejemplo.

## 5. Por confirmar antes del lanzamiento

- [ ] Dominio final: ¿el sitio va en `northadigital.com` (raíz) con `www` redirigiendo? (`api.` y `admin.` no se tocan).
- [ ] Remitente de correos: verificar `northadigital.com` en Resend y definir `LEADS_FROM_EMAIL`.
- [ ] HubSpot: ¿se usa o no?
- [ ] Cloudflare Turnstile en formularios: ¿se activa?
- [ ] GA4: ¿se activa? (usa cookies: habría que actualizar el aviso de privacidad).
- [ ] Liga de Cal.com para agendar.
- [ ] Revisión de los textos de Amplía por Fabiola (nombres, cifras y servicios).
- [ ] Permiso de los ayuntamientos para mostrar las capturas de sus portales en `/portfolio`.
- [ ] Correos del primer admin y del personal de la intranet.
