/**
 * Pósters del Cerro en vivo (lo que se ve antes de que cargue la escena 3D, o
 * siempre si el navegador no tiene WebGL). Salen de la MISMA escena
 * (lib/three/cerro-live.ts), una por fase del día y por orientación:
 *
 *   public/cerro/{dawn,day,dusk,night}-{wide,tall}.{avif,webp}  (+ dusk-wide.jpg para datos estructurados)
 *
 * Uso: npm run render:cerro   (tarda ~1 min; usa Chromium de Playwright con SwiftShader)
 */
import { build } from "esbuild";
import { chromium } from "playwright";
import sharp from "sharp";
import http from "node:http";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public/cerro");
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cerro-"));

await build({
  entryPoints: [path.join(root, "scripts/cerro-posters/entry.ts")],
  bundle: true,
  format: "iife",
  outfile: path.join(tmp, "bundle.js"),
  logLevel: "warning",
});
await fs.writeFile(
  path.join(tmp, "index.html"),
  '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#0a1124}</style><canvas id="c"></canvas><script src="bundle.js"></script>',
);

const server = http
  .createServer(async (req, res) => {
    const file = path.join(tmp, new URL(req.url, "http://x").pathname === "/" ? "index.html" : path.basename(req.url.split("?")[0]));
    try {
      const body = await fs.readFile(file);
      res.writeHead(200, { "content-type": file.endsWith(".js") ? "text/javascript" : "text/html" });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(0);
const port = server.address().port;

// Mismos momentos que la línea de tiempo del hero (phaseHour en lib/cerro/sky-time.ts).
const phases = {
  dawn: { tod: 0.458, m: 1, cloud: 0.12 },
  day: { tod: 0, m: 0, cloud: 0.1 },
  dusk: { tod: 0.444, m: 0, cloud: 0.12 },
  night: { tod: 1, m: 0, cloud: 0.05 },
};
const layouts = { wide: [1920, 1080], tall: [900, 1600] };

await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
for (const [layout, [w, h]] of Object.entries(layouts)) {
  for (const [phase, p] of Object.entries(phases)) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const qs = new URLSearchParams({ w, h, layout, tod: p.tod, m: p.m, cloud: p.cloud });
    await page.goto(`http://localhost:${port}/?${qs}`);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
    const png = await page.screenshot({ type: "png" });
    await page.close();
    const base = path.join(out, `${phase}-${layout}`);
    await sharp(png).avif({ quality: 48, effort: 6 }).toFile(`${base}.avif`);
    await sharp(png).webp({ quality: 74 }).toFile(`${base}.webp`);
    if (phase === "dusk" && layout === "wide") await sharp(png).jpeg({ quality: 80, mozjpeg: true }).toFile(`${base}.jpg`);
    const sizes = await Promise.all(["avif", "webp"].map(async (ext) => (await fs.stat(`${base}.${ext}`)).size));
    console.log(`${phase}-${layout}: avif ${(sizes[0] / 1024).toFixed(0)} KB · webp ${(sizes[1] / 1024).toFixed(0)} KB`);
  }
}
await browser.close();
server.close();
await fs.rm(tmp, { recursive: true, force: true });
