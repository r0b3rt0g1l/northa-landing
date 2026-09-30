/**
 * Genera los activos de marca a partir de la misma geometría del cerro:
 *   - app/icon.svg              favicon SVG animado (faro que parpadea)
 *   - app/apple-icon.png        180×180
 *   - public/brand/icon-192.png, icon-512.png, icon-maskable-512.png (manifest)
 *   - public/brand/contours.svg curvas de nivel vistas desde arriba (fondos decorativos)
 *   - public/brand/northa-mark.svg isotipo estático para terceros (correo, OG, prensa)
 *
 *   npm run brand:assets
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { contourSegments, createTerrain, joinSegments } from "../lib/three/terrain";

const root = path.resolve(__dirname, "..");

const HILL = "M2 50L7 49.3L11 47.6L14.5 44.2L19.5 37L23.5 31.2L27.5 28.1L32 27.2L36.5 28.1L40.5 31.2L44.5 37L49.5 44.2L53 47.6L57 49.3L62 50L64 64L0 64Z";
const FACET_LIGHT = "M2 50L7 49.3L11 47.6L14.5 44.2L19.5 37L23.5 31.2L27.5 28.1L32 27.2L27 64L0 64Z";
const FACET_MID = "M32 27.2L27 64L38 64Z";
const FACET_DARK = "M32 27.2L36.5 28.1L40.5 31.2L44.5 37L49.5 44.2L53 47.6L57 49.3L62 50L64 64L38 64Z";
const STAR = "M32 4.56L34.54 11.86L40.16 14.4L34.54 16.94L32 24.24L29.46 16.94L23.84 14.4L29.46 11.86Z";
const STAR_NORTH = "M32 4.56L34.54 11.86L32 14.4L29.46 11.86Z";

function markSvg({ animated, padding = 0 }: { animated: boolean; padding?: number }) {
  const vb = `${-padding} ${-padding} ${64 + padding * 2} ${64 + padding * 2}`;
  const style = animated
    ? `<style>
  .l{animation:b 2.6s steps(1,end) infinite}
  .g{animation:p 5.2s ease-in-out infinite}
  @keyframes b{0%,14%{opacity:.2}15%,100%{opacity:1}}
  @keyframes p{0%,100%{opacity:.7}50%{opacity:1}}
  @media (prefers-reduced-motion:reduce){.l,.g{animation:none}}
</style>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="64" height="64">${style}
<defs>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a3270"/><stop offset=".62" stop-color="#0d1b42"/><stop offset="1" stop-color="#060a16"/></linearGradient>
<radialGradient id="h" cx="32" cy="15" r="15" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff2e7e" stop-opacity=".45"/><stop offset="1" stop-color="#ff2e7e" stop-opacity="0"/></radialGradient>
<linearGradient id="n" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7ab3"/><stop offset="1" stop-color="#ff2e7e"/></linearGradient>
<clipPath id="c"><circle cx="32" cy="32" r="30.5"/></clipPath>
</defs>
<circle cx="32" cy="32" r="${padding ? 32 + padding : 30.5}" fill="url(#s)"/>
<circle class="g" cx="32" cy="15" r="15" fill="url(#h)"/>
<g clip-path="url(#c)">
<path d="${FACET_LIGHT}" fill="#ECECF1"/><path d="${FACET_MID}" fill="#CFCFD9"/><path d="${FACET_DARK}" fill="#A9AAB7"/>
<path d="${HILL}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>
<path d="M20.2 36Q32 39.2 43.8 36" fill="none" stroke="#FF2E7E" stroke-width="1.6" stroke-linecap="round"/>
<path d="M15.3 43Q32 47 48.7 43" fill="none" stroke="#FF2E7E" stroke-width="1.6" stroke-linecap="round"/>
</g>
<circle class="l" cx="32" cy="26.3" r="1.4" fill="#FF2E7E"/>
<path d="${STAR}" fill="#F5F5F7"/><path d="${STAR_NORTH}" fill="url(#n)"/>
<circle cx="32" cy="32" r="30.5" fill="none" stroke="#2c3858" stroke-width="1"/>
</svg>`;
}

function contoursSvg() {
  const terrain = createTerrain();
  const W = 1200;
  const H = 800;
  const xr: [number, number] = [-48, 48];
  const zr: [number, number] = [-32, 32];
  const levels = Array.from({ length: 16 }, (_, i) => 0.6 + i * 1.02);
  const sets = contourSegments(terrain.height, {
    xmin: xr[0],
    xmax: xr[1],
    zmin: zr[0],
    zmax: zr[1],
    step: 0.35,
    levels,
  });
  const sx = (x: number) => ((x - xr[0]) / (xr[1] - xr[0])) * W;
  const sz = (z: number) => ((z - zr[0]) / (zr[1] - zr[0])) * H;
  // Se usa como máscara decorativa a ~1:1, así que se simplifica cada curva
  // (Ramer–Douglas–Peucker, tolerancia 0.25 px) y se escribe con coordenadas
  // relativas de un decimal: el archivo baja de ~55 KB a ~12 KB sin cambio visible.
  const paths: string[] = [];
  for (const set of sets) {
    for (const line of joinSegments(set.segments)) {
      if (line.length < 8) continue;
      const pts: [number, number][] = [];
      for (let i = 0; i < line.length; i += 2) pts.push([sx(line[i]), sz(line[i + 1])]);
      const simple = simplify(pts, 0.25);
      // Décimas enteras para que las diferencias relativas no acumulen error.
      const q = (v: number) => Math.round(v * 10);
      const f = (v: number) => (v / 10).toString().replace(/^(-?)0\./, "$1.");
      let [px, py] = [q(simple[0][0]), q(simple[0][1])];
      let d = `M${f(px)} ${f(py)}l`;
      let first = true;
      for (let i = 1; i < simple.length; i++) {
        const x = q(simple[i][0]);
        const y = q(simple[i][1]);
        if (x === px && y === py) continue;
        const dx = f(x - px);
        const dy = f(y - py);
        d += `${first || dx.startsWith("-") ? "" : " "}${dx}${dy.startsWith("-") ? "" : " "}${dy}`;
        first = false;
        px = x;
        py = y;
      }
      paths.push(`<path d="${d}"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke="#000" stroke-width="1.1" stroke-linejoin="round">${paths.join("")}</svg>`;
}

/** Ramer–Douglas–Peucker: quita puntos que se desvían menos de `tol` de la recta. */
function simplify(pts: [number, number][], tol: number): [number, number][] {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const len = Math.hypot(bx - ax, by - ay);
  let max = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const dist = len === 0 ? Math.hypot(x - ax, y - ay) : Math.abs((by - ay) * x - (bx - ax) * y + bx * ay - by * ax) / len;
    if (dist > max) {
      max = dist;
      idx = i;
    }
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]];
  const left = simplify(pts.slice(0, idx + 1), tol);
  return [...left.slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

async function main() {
  await mkdir(path.join(root, "public/brand"), { recursive: true });

  const animated = markSvg({ animated: true });
  await writeFile(path.join(root, "app/icon.svg"), animated);

  const staticMark = markSvg({ animated: false });
  await writeFile(path.join(root, "public/brand/northa-mark.svg"), staticMark);

  const png = (svg: string, size: number) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png();
  await png(staticMark, 180).toFile(path.join(root, "app/apple-icon.png"));
  await png(staticMark, 192).toFile(path.join(root, "public/brand/icon-192.png"));
  await png(staticMark, 512).toFile(path.join(root, "public/brand/icon-512.png"));
  // Maskable: el isotipo con margen de seguridad (80 % central).
  await png(markSvg({ animated: false, padding: 8 }), 512).toFile(path.join(root, "public/brand/icon-maskable-512.png"));

  await writeFile(path.join(root, "public/brand/contours.svg"), contoursSvg());
  console.log("Activos de marca generados.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
