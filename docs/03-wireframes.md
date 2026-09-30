# 03 · Wireframes de alta fidelidad (textuales)

**Sistema base:**

- **Contenedor:** `container-x`, máx. 80 rem, con márgenes laterales de 1.25 rem en celular y 2 rem en escritorio.
- **Ritmo vertical:** secciones de 6–8 rem de alto en celular y 8–10 rem en escritorio.
- **Grid:** 12 columnas en escritorio, 1 en celular.
- **Tipografía:**
  - Display: Bricolage Grotesque 800, con tracking de −0.045 em.
  - Texto: Karla, 17 px de base.
  - Datos y eyebrows: JetBrains Mono en mayúsculas, con tracking de 0.2 em.
- **Color:**
  - Fondo negro con tinte azul marino (`#060a16`).
  - Acento rosa (`#ff2e7e → #ff7ab3`).
  - Azul marino de marca (`#0b1f4d`) en bloques: franja de gobierno, CTA y footer.
  - Teal (`#3fb8ac`) para Amplía.
- **Tema claro:** neutros fríos y tinta azul marino.
- **Movimiento:**
  - Curva `cubic-bezier(.16,1,.3,1)`, de 300 a 900 ms.
  - Todo respeta "reducir movimiento" y el botón **Pausar animaciones**.

---

## Header

**Layout**
- Barra fija de 72 px.
- A la izquierda, el logo (isotipo animado de 38 px + "Northa / DIGITAL").
- Al centro, la navegación.
- A la derecha, el selector de marca (pastilla Northa | Amplía), el selector de idioma ES | EN, el tema y el botón WhatsApp (rosa).

**Estados**
- Sobre el hero es transparente, con texto blanco.
- Al hacer scroll se vuelve vidrio: `backdrop-blur` con borde inferior y sombra.

**Interacciones**
- "Servicios" abre un mega menú con clic, Enter o Espacio. Tiene 3 columnas: servicios con icono y descripción corta, "Ver todos los servicios" y una tarjeta de Gobierno.
- Se cierra con Escape (el foco regresa al botón) o con un clic fuera.

**Celular**
- Botón de menú que abre un diálogo a pantalla completa. Muestra los enlaces grandes, los servicios, las preferencias y WhatsApp.
- El foco queda atrapado dentro y Escape lo cierra.

## Hero (inicio)

**Layout**
- Ocupa 100 svh.
- Al fondo va el video 3D del Cerro (póster AVIF mientras carga).
- **Escritorio:** degradado lateral para leer el texto a la izquierda, con el Cerro a la derecha.
- **Celular:** degradado vertical, con la estrella y la cima arriba y el texto abajo.

**Contenido**
1. Eyebrow: "NORTHA DIGITAL · HERMOSILLO, SONORA".
2. H1: "El **norte** digital de Sonora." (la palabra "norte" va con el degradado rosa).
3. Subtítulo: "Software que se queda en producción."
4. Entrada: "Diseñamos y desarrollamos páginas web, sistemas a la medida, apps e inteligencia artificial…".
5. Botones: **Cotiza por WhatsApp** (principal) y **Pregúntale a Nort** (vidrio).
6. Esquina: botón de pausa/reproducción del video con el pie "Cerro de la Campana · render 3D de Northa".
7. Centro inferior: "Desliza para explorar" (solo en escritorio).

**Animación**
- Las palabras del H1 suben desde abajo de su máscara, con 70 ms entre cada una.
- Subtítulo, texto y botones aparecen con *fade* y 14 px de desplazamiento.
- Todo es CSS puro para no retrasar el LCP.
- El video entra con un *fade* de 1.4 s en cuanto tiene su primer cuadro.

## Franja de confianza

- **Layout:** 4 cifras en grid (4 columnas en escritorio, 2 en celular), separadas por líneas de 1 px.
- **Cifras:** 14 sitios en producción · 14 dominios propios · 1 plataforma multi-cliente · 0 cruces de datos entre clientes.
- **Debajo:** marquesina del stack (Next.js, React, Express, Prisma, PostgreSQL, Supabase, Cloudinary, Vercel, Render, Cloudflare, AI SDK…). Se detiene con hover, con foco y con la pausa global.

## Servicios (bento)

**Layout** (grid de 3 columnas):
- **Páginas web** ocupa 2×1 e incluye un boceto animado de sitio web.
- **Sistemas** y **Apps** van en columna a la derecha.
- La segunda fila tiene 3 tarjetas: IA, Mantenimiento y Consultoría.
- Cierra una tarjeta punteada de Gobierno.

**Tarjeta:** icono en caja de 48 px, número (01–06), título, descripción, chips de "qué incluye" (solo en la grande) y "Ver detalle ↗".

**Interacción**
- Efecto *spotlight*: un brillo radial sigue al cursor.
- El borde toma el color del acento en hover y foco.
- La tarjeta completa es clicable, con un solo enlace.

## Arma tu proyecto (configurador)

**Layout**
- Tarjeta grande en 2 columnas: a la izquierda la brújula SVG (160 px) con "Paso X de 4" y 4 barras; a la derecha la pregunta.

**Pasos**
1. **¿Qué necesitas?** Chips de selección múltiple: Página web · Sistema o panel · App · Chatbot/IA · Mantenimiento · Consultoría · Portal de gobierno.
2. **¿En qué etapa estás?** Opción única, con flechas del teclado.
3. **¿Para cuándo?** Opción única, con flechas del teclado.
4. Resumen: campo "Tu nombre (opcional)", el mensaje armado en bloque, y los botones **Enviar por WhatsApp** y **Prefiero que me contacten**. Este último despliega un mini formulario con correo o teléfono y consentimiento.

**Animación**
- La brújula gira 90° por paso.
- El contenido de cada paso entra desde la derecha y sale hacia la izquierda (Motion).
- Si intentas avanzar sin elegir, aparece la pista "Elige al menos una opción" (`role="alert"`).

## Trabajo en producción (resumen del portafolio en el inicio)

**Layout**
- La primera tarjeta es ancha: "Catorce portales, una sola plataforma", con texto a la izquierda y un grid de 14 escudos a la derecha.
- Debajo, 2 tarjetas:
  - **Nort:** mini chat simulado con burbujas que aparecen al entrar a la vista.
  - **Cerro en código:** isotipo sobre curvas de nivel.
- CTA "Ver portafolio completo →" que lleva a `/portfolio`.

## Proceso (brújula)

**Layout**
- En escritorio son 2 columnas.
- **Izquierda (fija):** una brújula de 200 px, con el rumbo en grande ("180°") y el nombre de la etapa.
- **Derecha:** 5 pasos (N, E, S, O y N de nuevo): Conversamos, Diseñamos, Construimos, Lanzamos y Acompañamos.

**Animación**
- Con el scroll, GSAP ScrollTrigger gira la aguja y llena la línea de progreso.
- El paso activo gana borde de acento y fondo.
- Los inactivos solo bajan el color del título y conservan el contraste AA.

## Principios (misión, visión y valores)

- **Arriba:** Misión y Visión en 2 columnas, con eyebrow y una frase cada una.
- **Abajo:** grid de 2×2 con las 4 reglas, cada una con un número en contorno rosa (01–04): Nada se inventa · Se verifica sobre lo publicado · Un piloto antes de escalar · Aprobación explícita en lo compartido.
- **Fondo:** curvas de nivel tenues en la esquina.

## Hecho en Hermosillo (Cerro 3D)

**Layout**
- Sección de 230 vh con un lienzo fijo (*sticky*) de 100 svh.
- A la izquierda, una tarjeta de vidrio (máx. 28 rem) con:
  - El título "Al pie del Cerro de la Campana."
  - 3 datos con fuente: 319 m, 1964 y 1968.
  - El origen del nombre y los enlaces a las fuentes.

**Interacción**
- Con el scroll, el día cae sobre el cerro: día → atardecer → hora azul (cielo azul marino con franja rosa) → noche con luces de la ciudad.
- Barra inferior con sol ☀ → luna ☾.
- El puntero mueve un poco la cámara.

**Pantallas bajas:** se ocultan los datos extra para que la tarjeta no choque con el header.

## Gobierno (franja en el inicio · bloque azul marino)

- **Layout:** título "También construimos portales para gobierno." y el botón "Conocer el apartado de gobierno". Debajo, una marquesina de escudos.
- **Texto:** 14 ayuntamientos sobre una sola plataforma con aislamiento verificado. Alianza con Amplía Consultoría.

## Planes

- **Layout:** 3 tarjetas: Starter, Pro (destacada, con la etiqueta "Más elegido" y un brillo rosa debajo) y Enterprise.
- **Contenido de cada tarjeta:** nombre, para qué es, "Cotización a la medida", 4 viñetas con ✓ y el botón "Solicitar cotización", que abre WhatsApp con el plan en el mensaje.

## Preguntas frecuentes

- **Layout:** en 2 columnas, el título a la izquierda y un acordeón `<details>` a la derecha.
- **Interacción:** el ícono + gira a × al abrir.
- **SEO:** lleva JSON-LD `FAQPage`.

## Blog (teaser) y contacto

**Teaser del blog**
- 2 tarjetas de artículo con título, extracto, fecha (zona horaria de Hermosillo), tiempo de lectura y ↗.

**Contacto**
- En 2 columnas.
- **Izquierda:** título grande, WhatsApp, teléfono, correo y ubicación.
- **Derecha:** formulario con Nombre, Empresa (opcional), Correo, Teléfono/WhatsApp, Cuéntanos brevemente, consentimiento y Enviar.

**Validación**
- Se valida al enviar, con mensajes de error debajo de cada campo (`aria-describedby`) y foco en el primer error.
- Al enviar, el botón muestra el loader del Cerro.
- **Éxito:** "Gracias, te escribimos pronto" o "Casi listo" más un WhatsApp prellenado si ningún destino recibió el lead.

## Footer (bloque azul marino)

- **Layout:** 4 columnas: marca con la frase, Servicios, Northa y Contacto.
- **Barra inferior:** © y aviso de privacidad a la izquierda; Pausar animaciones, idioma y tema a la derecha.
- **Cierre:** la palabra "Northa" gigante en contorno, como decoración.

## Nort (chat)

- **Lanzador:** botón flotante abajo a la derecha, con el avatar de estrella y "Pregúntale a Nort".
- **Sugerencia:** una vez por sesión, a los 25 s o al llegar al 55 % del scroll, aparece "¿Dudas? Pregúntale a Nort ✦" con botón para cerrarla.

**Panel**
- En escritorio mide 25 × 40 rem; en celular ocupa toda la pantalla.
- **Header:** avatar, "Nort · Asistente con IA de Northa", botón "Nueva conversación" y cerrar.
- **Registro** (`role="log"`, `aria-live`): saludo, respuestas rápidas en chips, burbujas y tarjetas de herramienta:
  - **Continuar por WhatsApp:** muestra el resumen citado y el botón.
  - **Datos recibidos.**
  - **Agenda una videollamada.**
- **Compositor:** área de texto que crece hasta 128 px; Enter envía y Shift+Enter hace salto de línea. Botón Detener mientras responde.
- **Pie:** "Nort es una IA y puede equivocarse. No compartas datos sensibles. Privacidad", más un botón de WhatsApp.

**Estados**
- *Pensando:* loader del Cerro con el texto "Nort está pensando…".
- *Modo guiado:* una pastilla lo avisa.
- *Error:* mensaje amable más WhatsApp con la pregunta.
- *Historial:* se conserva 7 días en este navegador; se borra con "Nueva conversación".

## Loader del Cerro

- La silueta del cerro se dibuja (trazo), las curvas de nivel suben, la estrella gira 90° y el faro parpadea, todo en bucle de 1.6 s.
- **Dónde:** botones de envío (18–20 px, en el color del botón), "Nort está pensando…" (26 px) y la escena 3D mientras llega Three.js (36 px).
- **Sin pantalla de carga entre páginas:** las páginas son estáticas y abren al instante; una pantalla intermedia solo retrasaría el primer pintado (se probó y empeoraba LCP y CLS).
- **Accesibilidad:** `role="status"` con texto oculto "Cargando…".
- **Con movimiento reducido:** queda estático, con el faro encendido.

---

## /servicios

- **PageHero:** migas, eyebrow, H1 "Servicios", entrada y un fondo de curvas de nivel.
- **Cuerpo:**
  - Lista de los 6 servicios en tarjetas grandes: icono, nombre, descripción, 3 puntos de "incluye" y "Ver servicio".
  - Tarjeta de gobierno.
  - Franja CTA.

## /servicios/[slug]

**Layout** (dos columnas):
- **Izquierda:** intro y "Para quién es".
- **Derecha (fija):** tarjeta con WhatsApp del servicio, "Pregúntale a Nort sobre esto" y "Arma tu proyecto".

**Bloques** (en este orden):
1. Qué incluye (grid de checks).
2. Cómo trabajamos (pasos numerados).
3. Stack (chips).
4. Preguntas frecuentes (con FAQPage).
5. Servicios relacionados.
6. CTA.

## /portfolio

**PageHero**
- Eyebrow "Portafolio".
- H1: "Trabajo en producción, no maquetas."
- Entrada: "Todo lo que ves aquí se puede abrir hoy."

**Caso destacado** (tarjeta ancha)
- "Plataforma multi-cliente": 14 portales, 1 panel, 0 cruces.
- Diagrama simple: backend → panel → 14 dominios.
- Botón "Cómo lo operamos" (artículo del blog).

**Filtros**
- Chips con `aria-pressed`: Todos · Gobierno · Producto propio · Empresas (solo aparece si hay proyectos).
- El conteo se anuncia con `aria-live`.

**Grid** (3 columnas en escritorio, 1 en celular)
- Cada tarjeta lleva una **captura real** del sitio (16:10, AVIF/WebP), el escudo superpuesto, la categoría, el nombre ("Ayuntamiento de Aconchi"), el dominio, chips (Transparencia · Turismo · Noticias) y "Ver en línea ↗".
- **Hover:** la captura se desplaza hacia arriba lentamente, como si hiciera scroll dentro de la tarjeta.

**Cierre:** franja CTA "¿El siguiente proyecto es el tuyo?".

## /gobierno

**Secciones** (en este orden):
1. PageHero con las 4 cifras de la flota.
2. Grid de 14 portales (escudo, nombre y dominio, con enlace vivo).
3. "Qué construye Northa" (4 pilares).
4. Módulos.
5. Calidad (pruebas y aislamiento).
6. Alianza con Amplía.
7. CTA de WhatsApp de gobierno.

## /amplia (pública, acento teal)

- **Transición:** el acento cambia de rosa a teal en 0.7 s.
- **Hero:** enso que se dibuja con una máscara cónica, "Amplía Consultoría" y la promesa.

**Secciones** (en este orden):
1. Qué es.
2. Metodología: diagrama de Venn que entra al verse.
3. Servicios.
4. "Presenta: Lic. Fabiola Kitazawa Galaz".
5. Contacto: teléfono y correo del apéndice A, tal cual.
6. **Acceso del equipo**, discreto, que lleva a `/amplia/portal`.

## /amplia/portal (intranet)

**Entrar**
- Pantalla dividida.
- **Izquierda:** panel teal con el enso y "Portal del equipo".
- **Derecha:** formulario con correo, contraseña y Entrar. Los errores se anuncian, y el botón muestra el loader mientras procesa.
- Abajo: "¿Sin acceso? Pídelo a tu administrador."

**Shell**
- **Barra lateral** de 16 rem, que en celular se vuelve un cajón: logo de Amplía, los módulos con icono y, al final, el usuario, el tema y Salir.
- **Contenido:** título del módulo y acción principal a la derecha (solo admin: "Nuevo …").

**Inicio**
- 3 tarjetas: Comunicados fijados, Mis solicitudes (con estado) y Proyectos en curso.
- Accesos rápidos a Directorio y Recursos.

**Comunicados**
- Lista con los fijados arriba.
- Cada comunicado muestra título, fecha, autor y extracto; el detalle trae el texto completo.
- El admin crea, edita, fija y borra.

**Directorio**
- Buscador instantáneo.
- Tabla en escritorio y tarjetas en celular: nombre, puesto, área, teléfono (`tel:`), extensión y correo (`mailto:`).
- El admin agrega, edita y borra.

**Recursos**
- Agrupados por categoría.
- Cada recurso es un enlace o un archivo descargable (liga firmada de 60 s).
- El admin sube archivos o pega enlaces.

**Solicitudes**
- El personal crea una solicitud (tipo, título, detalle y fechas opcionales) y ve las suyas con su estado: Pendiente, Aprobada, Rechazada o Completada.
- El admin ve todas, cambia el estado y deja una nota.
- Los tipos los define el admin.

**Proyectos**
- Tablero de 4 columnas: Por iniciar, En curso, En revisión y Terminado.
- Cada tarjeta muestra nombre, cliente o dependencia, responsable y fecha límite (en rojo si ya venció).
- El admin crea, edita y mueve el estado.

**Usuarios (admin)**
- Tabla de miembros con rol y estado activo.
- "Nueva cuenta": nombre, correo, rol y contraseña temporal. La persona la cambia en Mi cuenta.

**Estados vacíos**
- Todos los módulos arrancan sin datos y lo explican.
- Admin: "Aún no hay comunicados. **Crear el primero**".
- Personal: "Aquí aparecerán los comunicados del equipo."

## /blog y /blog/[slug]

**Índice**
- PageHero y chips de tema (Todos, Arquitectura, Guía…).
- Grid de tarjetas: fecha, lectura, título, extracto y tags.

**Artículo**
- Migas, título, fecha, lectura, tags y cuerpo en `prose-northa` con ancho de 70 caracteres.
- Al final: enlace a la traducción y CTA.

## 404 y error

- **404:** isotipo, "Esta ruta no está en el mapa.", botones a Inicio y WhatsApp, y enlaces a Servicios y Blog.
- **Error:** mensaje amable, botón Reintentar y WhatsApp.
