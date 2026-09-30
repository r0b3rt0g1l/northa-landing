# 04 · Video del hero

El banner de la página de inicio es un video del Cerro de la Campana hecho con la **misma escena 3D** que la sección interactiva de Hermosillo (`lib/three/cerro-scene.ts`). Si cambian los colores o el cerro, se vuelve a renderizar y el video queda idéntico a la página.

## Archivos (`public/video/`)

| Archivo | Uso | Peso |
|---|---|---|
| `cerro-1920x1080.webm` / `.mp4` | Escritorio y pantallas horizontales | 1.5 MB / 2.2 MB |
| `cerro-720x1280.webm` / `.mp4` | Celular (vertical, relación ≤ 4:5) | 0.5 MB / 0.8 MB |
| `cerro-*-poster.avif` / `.webp` / `.jpg` | Primer cuadro: se ve al instante y es lo que mide el LCP | 14–76 KB |

- 12 s en bucle a 30 fps, sin audio.
- WebM (VP9) va primero y MP4 (H.264) queda de respaldo, sobre todo para Safari de iPhone.
- El cerro sube un poco en la versión vertical para que la estrella no tape el texto.

## Cómo carga (`components/hero/HeroVideo.tsx`)

1. Primero se pinta el póster con `fetchpriority="high"`: así el primer pantallazo sale rápido.
2. El video **no se pide** hasta después del evento `load` y de un momento ocioso. No compite con la carga de la página.
3. `<source media="(max-aspect-ratio: 4/5)">` hace que el celular baje solo la versión vertical.
4. Se pausa fuera de pantalla y con la pestaña oculta.
5. **No se descarga** con "reducir movimiento" del sistema, con "Pausar animaciones" del sitio ni con Ahorro de datos o 2G. El botón Reproducir/Pausar siempre está disponible (WCAG 2.2.2).

## Volver a renderizar

Requisitos: `ffmpeg` en el PATH (`brew install ffmpeg`) y Chromium de Playwright (`npx playwright install chromium`).

```bash
npm run render:video                      # escritorio + celular, 12 s a 30 fps
npm run render:video:preview              # solo cuadros de prueba en .render-preview/
npm run render:video -- --variant=desktop --tod=0.8 --seconds=12 --fps=30
```

- `--tod` es la hora del día de la escena (0 = mediodía, 1 = noche). El valor por defecto es 0.8, el atardecer azul marino.
- Los cuadros temporales se guardan en `.render-frames/` y `.render-preview/`; los dos están en `.gitignore`.
- Parámetros de salida: H.264 CRF 25–26 `-preset slow` con `+faststart`, VP9 CRF 35, pósters en AVIF (q52), WebP (q72) y JPG mozjpeg (q78).

Después de renderizar, revisa en el iPhone que la estrella no choque con el texto del hero.

## Cambiarlo por un video grabado

Si más adelante hay tomas reales (dron del cerro, equipo trabajando):

1. **Material:** de 8 a 15 s, que el final empalme con el inicio (bucle), sin texto quemado y sin audio. Horizontal 1920×1080 y una versión vertical 720×1280 (o un recorte centrado).
2. **Convertir** (ejemplo para la versión horizontal):

   ```bash
   ffmpeg -i toma.mov -an -vf "scale=1920:-2,fps=30" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart cerro-1920x1080.mp4
   ffmpeg -i toma.mov -an -vf "scale=1920:-2,fps=30" -c:v libvpx-vp9 -crf 35 -b:v 0 -row-mt 1 cerro-1920x1080.webm
   ffmpeg -i cerro-1920x1080.mp4 -frames:v 1 -q:v 2 poster.png
   ```

   Los pósters se sacan de `poster.png` con `sharp` o con cualquier conversor a AVIF, WebP y JPG.
3. **Meta de peso:** menos de 2.5 MB el horizontal y menos de 1 MB el vertical.
4. **Si cambia el nombre de los archivos**, actualiza las rutas en `components/hero/HeroVideo.tsx` y `components/hero/Hero.tsx`. Con los mismos nombres no hay que tocar código.
5. **Caché:** `/video/*` se sirve con un mes de caché. Si reemplazas un archivo con el mismo nombre, algunos visitantes verán el viejo hasta que caduque. Para un cambio inmediato, usa un nombre nuevo (por ejemplo, `cerro-2027-1920x1080.mp4`).
