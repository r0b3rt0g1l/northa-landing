# Northa Digital

**El norte de tu gobierno digital.** Estudio de software e inteligencia artificial en
Sonora, México. Construimos y operamos sistemas para organizaciones que ya tienen el
proceso resuelto en papel y lo necesitan resuelto en software.

No entregamos prototipos: lo que sale de aquí queda en producción, con dominio propio,
usuarios reales y alguien responsable de que siga funcionando el año que viene.

---

## Qué hacemos

**Plataformas y portales.** Sitios institucionales y de producto, con su panel de
administración para que el cliente publique sin depender de nosotros. Cuando hay muchos
clientes sobre la misma base, arquitectura multi-inquilino con aislamiento verificado:
cada cuenta ve lo suyo y solo lo suyo.

**Automatización con agentes.** Procesos que hoy alguien repite a mano —clasificar,
capturar, responder, dar seguimiento— convertidos en agentes que corren solos y escalan
al humano cuando toca. La medida de éxito es cuántas veces deja de hacerse el trabajo
dos veces.

**Asistentes y búsqueda sobre información propia.** Atención 24/7 que responde con los
datos reales de la organización, y búsqueda que encuentra por lo que el documento dice,
no por las palabras exactas que alguien recordó teclear.

**Documentos y archivos.** Resúmenes de expedientes largos, redacción asistida en el tono
de la casa, clasificación y nombrado automáticos, edición y optimización de imágenes en
lote.

**Operación.** Monitoreo, respaldos, migraciones y el mantenimiento aburrido que decide
si un sistema dura tres años o tres meses.

---

## Lo que está en producción

**Catorce portales municipales de transparencia**, en Sonora, sobre una sola plataforma:

- 14 ayuntamientos, cada uno con su dominio `.com.mx` y su certificado
- Un backend compartido (`cmsmunicipal`) y un panel único (`cms-admin`)
- Aislamiento entre municipios verificado por suite automatizada
- Herramienta de alta que da de vida a un municipio nuevo de punta a punta

Es el caso que enseñamos porque prueba lo difícil: no hacer un sitio, sino operar catorce
a la vez sin que se contaminen entre sí.

### El ecosistema

| Repositorio | Qué es |
|---|---|
| `northa-landing` | Este repo — el sitio de Northa Digital |
| `cmsmunicipal` | Backend (Express + Prisma) y herramientas de operación de la flota |
| `cms-admin` | Panel de administración que usan los clientes |
| `plantilla-municipal` | Molde del que nace cada portal nuevo |
| 14 repos por municipio | Un frontend por ayuntamiento, parametrizado desde el molde |

---

## Con quién colaboramos

Northa no cubre todo lo que un proyecto grande necesita, y no fingimos que sí. Trabajamos
con despachos especializados que aportan lo que a nosotros nos falta.

**Amplía Consultoría** — asesoría jurídica y gestión pública para ayuntamientos del Estado
de Sonora: entrega-recepción, Plan Municipal de Desarrollo, normatividad, atención a entes
fiscalizadores y obligaciones de transparencia. En la vertical de gobierno el reparto es
claro: Amplía ordena la gestión, Northa la publica. **Diez de los catorce municipios de la
flota trabajan con las dos.**

*Contacto: Lic. Fabiola Kitazawa Galaz · ampliaconsul@gmail.com · 662 205 5021*

---

## Cómo trabajamos

Cuatro reglas que no se negocian, ganadas a base de equivocarnos:

**Nada se inventa.** Un dato lleva fuente verificable o el campo se queda vacío. Aplica a
escudos, redes sociales, cronologías, correos y cifras. Un portal de gobierno que publica
un dato falso hace más daño que uno incompleto.

**La verificación se hace sobre lo servido.** No sobre el código, no sobre la API que lo
alimenta, no sobre la suite en verde: sobre la URL exacta donde el usuario vería el
problema. Verde en una capa no dice nada de las otras.

**Un piloto antes de la flota.** Lo que se va a repetir en catorce lugares se hace bien
una vez, se verifica completo, y hasta entonces se replica.

**Aprobación explícita en lo compartido.** Todo lo que toca una base de datos con varios
clientes encima se muestra antes de ejecutarse. Nunca un "no vuelvas a preguntar".

---

## Este repositorio

Sitio de Northa Digital. Next.js 16 (App Router) · React 19 · Tailwind CSS 4 ·
framer-motion · lucide-react · `sharp` para imágenes.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

### Estructura

```
app/            rutas, metadatos, sitemap, robots, opengraph
components/     secciones de la página y primitivas de UI
lib/content/    contenido editable (la flota, servicios, textos)
lib/site.js     identidad, contacto y URLs
public/escudos/ escudos de los municipios, optimizados
```

El contenido vive en `lib/content/`, separado de los componentes: para cambiar lo que
dice la página no hace falta tocar JSX.

### Despliegue

Vercel, team `northa-digital1`, rama de producción `main`.

> **Ojo:** la GitHub App de Vercel no tiene acceso concedido a este repositorio, así que
> **un push a `main` no dispara deploy**. Hasta que se conceda ese acceso, cada cambio
> requiere `vercel --prod` a mano — y conviene comparar el `HEAD` de GitHub contra el
> commit del último deployment antes de dar por hecho que producción está al día.

La URL canónica se controla con `NEXT_PUBLIC_SITE_URL`; alimenta el canonical, el sitemap,
el robots y el OpenGraph. Si no está definida, el sitio anuncia un dominio que puede no
existir.

---

## Contacto

**Roberto Gil** · rgilh@hotmail.com · +52 662 386 6834 · Sonora, México
