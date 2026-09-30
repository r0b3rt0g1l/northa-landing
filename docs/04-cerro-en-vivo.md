# 04 · Cerro en vivo (inicio)

Desde el 30-sep-2026 el inicio ya no usa video. El fondo es el **Cerro de la Campana en 3D**, fijo detrás de toda la página:

- Sigue la **hora real de Hermosillo** (amanecer, día, atardecer y noche) y el **clima actual** (nubes y lluvia).
- La barra del hero muestra lugar, hora y clima, y deja ver el Cerro a otra hora del día (Amanecer · Día · Atardecer · Noche). "Ahora" regresa a la hora real.
- Al bajar, el cerro y el cielo se funden con el fondo y **quedan solo las luces de la ciudad**.

Sustituye a `docs/04-video.md` (el video y `npm run render:video` se eliminaron).

## Archivos

| Archivo | Qué hace |
|---|---|
| `components/cerro/CerroBackdrop.tsx` | Fondo fijo: póster → escena 3D; fundido al hacer scroll; tema claro/oscuro; parallax con el mouse |
| `components/cerro/HeroTimeline.tsx` | Barra de hora, clima y fases del día |
| `lib/three/cerro-live.ts` | La escena: cielo, cerro, camino en espiral con lámparas, torres, ciudad (casas, árboles, centro), alumbrado y capa de "solo luces" |
| `lib/three/terrain.ts` | Geometría del cerro y retícula de la ciudad (`CITY`), compartida por la escena, el favicon y las curvas de nivel |
| `lib/cerro/sky-time.ts` | Hora de Hermosillo (UTC−7 todo el año, sin horario de verano) → estado del cielo |
| `lib/cerro/weather.ts` | Códigos de clima (WMO) → ícono, texto y nubes |
| `lib/cerro/store.ts` | Estado compartido: reloj, clima y fase elegida |
| `app/api/clima/route.ts` | Clima de Hermosillo desde Open-Meteo (sin llave). Caché de 10 min en el servidor |
| `public/cerro/*` | Pósters por fase y orientación (`{dawn,day,dusk,night}-{wide,tall}.{avif,webp}`) y `dusk-wide.jpg` para datos estructurados |
| `scripts/render-cerro-posters.mjs` | Genera los pósters desde la misma escena |

## Cómo carga

1. **Primer pintado:** un script en `<head>` marca `<html data-tod="…">` con la hora de Hermosillo y precarga el póster que toca (`fetchpriority="high"`). El CSS pinta ese póster (vertical en celular, horizontal en escritorio).
2. **Después del `load` y de un momento ocioso**, se descarga Three.js y la escena se arma por partes, cediendo el hilo principal. Los shaders se compilan en paralelo (`compileAsync`). Cuando está lista, sustituye al póster con un fundido.
3. **Sin WebGL o con Ahorro de datos**, se queda el póster.
4. **"Reducir movimiento"** del sistema o **"Pausar animaciones"** del pie: la escena se dibuja solo cuando cambia algo (hora, scroll, tema); sin animación continua.
5. El bucle se pausa con la pestaña oculta y baja a 30/20 cuadros por segundo cuando solo quedan las luces. En celular usa la versión ligera (menos casas, árboles y luces).

## Hora y clima

- **Hora:** Sonora no cambia de horario, así que se calcula con desfase fijo UTC−7.
- **Amanecer y atardecer:** llegan de Open-Meteo con el clima; mientras tanto (o si falla), se usa una tabla mensual aproximada (`SUN_TABLE`).
- **Clima:** `/api/clima` pide a Open-Meteo temperatura, código de clima, nubosidad y salida/puesta del sol. Se refresca cada 10 min. Si la API falla, la barra muestra solo la hora y el cielo queda casi despejado.

## Volver a renderizar los pósters

Hazlo si cambian los colores del cielo, el cerro o la ciudad en `lib/three/cerro-live.ts`, para que el primer pantallazo coincida con la escena.

```bash
npm run render:cerro   # ~3 min; usa Chromium de Playwright con SwiftShader
```

- Salen 8 pósters (4 fases × horizontal 1920×1080 y vertical 900×1600) en AVIF y WebP, más `dusk-wide.jpg`.
- Los momentos de cada fase son los mismos que la barra del hero (`phaseHour` en `lib/cerro/sky-time.ts`).
- `/cerro/*` se sirve con una semana de caché (`next.config.ts`). Si reemplazas un póster con el mismo nombre, algunos visitantes verán el anterior unos días.

## Ajustes rápidos

| Qué | Dónde |
|---|---|
| Colores del cielo por hora (día, atardecer, noche) y del amanecer | `PALETTES` y `DAWN` en `lib/three/cerro-live.ts` |
| Qué tan rápido se funde al bajar | `CerroBackdrop.tsx` (`scrollY / (vh × 0.9)`) |
| Encuadre del cerro (escritorio / celular) | `applyFraming` y `placeCamera` en `lib/three/cerro-live.ts` |
| Velos para leer el texto del hero | `.cerro-veil` en `app/globals.css` |
| Textos de la barra (fases, "En vivo", "Ahora") | `hero.timeline` en `lib/i18n/dictionaries/es.ts` y `en.ts` |
