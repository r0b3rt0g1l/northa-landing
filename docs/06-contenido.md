# 06 · Guía de contenido

Todo el contenido vive en el código y se publica con un commit a `main` (Vercel despliega solo). No hay CMS: lo que cambies queda versionado en Git y se puede revertir.

**Regla de la casa:** nada se inventa. Cifras, clientes, testimonios, precios y plazos solo si están verificados y, cuando son de un cliente, con su permiso.

## 1. Dónde está cada cosa

| Qué | Archivo |
|---|---|
| Textos de la interfaz (menús, botones, títulos de sección, formularios, Nort) | `lib/i18n/dictionaries/es.ts` y `en.ts` |
| Servicios (6), con su página, FAQ y mensaje de WhatsApp | `content/services.ts` |
| Planes de referencia ("Cotización a la medida") | `content/plans.ts` |
| Preguntas frecuentes del inicio y de /contacto | `content/faq.ts` |
| Proceso (brújula de 5 etapas) | `content/process.ts` |
| Reglas de trabajo (valores) | `content/principles.ts` |
| Cifras del inicio y stack | `content/stats.ts` |
| Trabajo destacado del inicio y proyectos de /portfolio | `content/portfolio.ts` |
| Flota de portales municipales, módulos y calidad | `content/gov.ts` |
| Amplía Consultoría (textos del material de Fabiola) | `content/amplia.ts` |
| Datos del Cerro de la Campana | `content/hermosillo.ts` |
| Contacto, WhatsApp, correo y redes de Northa | `lib/site.ts` (y variables `NEXT_PUBLIC_*`) |
| Mensajes prellenados de WhatsApp | `lib/whatsapp.ts` |
| Lo que Nort sabe y cómo responde | `lib/ai/instructions.ts` (sale del mismo contenido del sitio) |
| Artículos del blog | `content/blog/es/*.mdx`, `content/blog/en/*.mdx` y el índice `content/blog/posts.ts` |

Casi todo texto tiene la forma `{ es: "...", en: "..." }`. Si agregas o cambias algo, **escribe los dos idiomas**; TypeScript avisa si falta uno.

## 2. Tareas frecuentes

### Cambiar un texto

1. Búscalo en el editor (por ejemplo "Cotización a la medida") dentro de `content/` o `lib/i18n/dictionaries/`.
2. Cámbialo en español y en inglés.
3. `npm run dev` y revisa en `http://localhost:3000` (y `/en`).
4. Commit con la ruta del archivo (sin `git add -A`) y push.

### Agregar un artículo al blog

1. Crea `content/blog/es/mi-articulo.mdx` (Markdown con componentes). El título va en el índice, no dentro del archivo.
2. Si hay versión en inglés: `content/blog/en/my-article.mdx`.
3. En `content/blog/posts.ts`:
   - Agrega su ficha en `posts`: `locale`, `slug`, `title`, `description` (máximo unos 155 caracteres: sale en Google), `date` (`AAAA-MM-DD`), `readingMinutes`, `tags` y `translation` para enlazar las dos versiones.
   - Agrega su cargador en `postLoaders`: `"es/mi-articulo": () => import("./es/mi-articulo.mdx")`.
4. Listo: sale en `/blog`, en el sitemap con su `hreflang`, con sus datos estructurados (BlogPosting), y el selector de idioma lleva a la traducción.

Buenas prácticas:
- Un tema por artículo y el término que la gente busca en el título ("páginas web en Hermosillo", "sistema de inventarios a la medida").
- Subtítulos `##` claros; párrafos cortos; una llamada a la acción al final (el sitio ya agrega la banda de contacto).
- Imágenes en `public/blog/<slug>/` en WebP o AVIF, de 1600 px de ancho como máximo, con texto alternativo que describa lo que se ve.

### Agregar un proyecto al portafolio

- **Portal municipal nuevo:** agrégalo a `flota` en `content/gov.ts` (`slug`, `nombre`, `dominio`, `amplia`). Pon su escudo en `public/escudos/<slug>.png` y genera la captura con `npm run capture:portfolio -- <slug>`. Aparece solo en /gobierno, /portfolio y las cifras.
- **Proyecto de empresa:** agrégalo a `businessProjects` en `content/portfolio.ts` con `category: "empresas"` y `published: true` **solo con autorización por escrito del cliente**. Captura en `public/portfolio/<id>.avif` y `.webp`, de 800 px de ancho y alta (la tarjeta la recorre al pasar el cursor).
- Si un sitio sale de línea, cámbialo a `published: false`.

### Actualizar las capturas de los portales

```bash
npm run capture:portfolio            # los 14
npm run capture:portfolio -- rayon   # solo uno
```

El script abre cada dominio, acepta el aviso de términos del portal, recorta a 2700 px de alto y guarda AVIF y WebP en `public/portfolio/`. Revisa las imágenes antes del commit: si un portal tenía un aviso distinto o estaba caído, la captura sale mal.

### Testimonios

Hoy no hay ninguno, a propósito. Para publicar uno:
1. Texto real, con nombre, cargo y organización, y **permiso por escrito** (correo o WhatsApp guardado).
2. Si es de un ayuntamiento, confirma que la persona puede hablar a nombre de la institución.
3. La sección de testimonios todavía no existe: se construye cuando haya al menos tres.

## 3. Estilo

- Español de México, directo, de "tú". Frases cortas. Nada de "soluciones integrales" ni "sinergias".
- Lo concreto le gana a lo grandilocuente: "14 portales en producción" y no "líderes en transformación digital".
- Inglés natural, no traducción literal: se escribe para alguien que no conoce Hermosillo.
- Accesibilidad: todo enlace dice a dónde lleva ("Ver el servicio de páginas web", no "clic aquí"); toda imagen informativa lleva texto alternativo; las decorativas van con `alt=""`.

## 4. Calendario editorial sugerido

Uno o dos artículos al mes alcanzan para empezar a posicionar búsquedas locales. Temas con intención de búsqueda en Sonora:

| Mes | Tema sugerido | Servicio al que apunta |
|---|---|---|
| 1 | Cuánto cuesta una página web en Hermosillo y de qué depende | Páginas web |
| 1 | Qué debe publicar un ayuntamiento en su portal de transparencia | Gobierno |
| 2 | Hoja de cálculo o sistema a la medida: cuándo conviene cambiar | Sistemas a la medida |
| 2 | Cómo mantener un sitio seguro sin pagar una mensualidad cara | Mantenimiento |
| 3 | Qué puede hacer un asistente con IA en el sitio de un negocio (con Nort de ejemplo) | IA |
| 3 | App o sitio web: qué necesita tu negocio primero | Aplicaciones |

Flujo: borrador → revisión (datos y tono) → rama y Pull Request → revisar la preview en el iPhone → merge a `main`.

## 5. Antes de publicar cualquier cambio

- [ ] Los dos idiomas están actualizados.
- [ ] No hay datos inventados ni nombres de clientes sin permiso.
- [ ] `npm run check` (lint y tipos) pasa.
- [ ] Revisado en el celular (tema oscuro y claro).
