#!/usr/bin/env node
/**
 * Actualiza las capturas de los portales municipales para /portfolio.
 * Lee la flota de content/gov.ts, abre cada dominio, acepta el aviso de términos
 * del propio portal y guarda una captura alta (800 px de ancho) en AVIF y WebP.
 *
 *   node scripts/capture-portafolio.mjs            (todos)
 *   node scripts/capture-portafolio.mjs aconchi    (solo uno)
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gov = await readFile(path.join(root, "content/gov.ts"), "utf8");
const flota = [...gov.matchAll(/slug: "([^"]+)", nombre: "[^"]+", dominio: "([^"]+)"/g)].map((m) => ({ slug: m[1], dominio: m[2] }));
const only = process.argv[2];
const OUT = path.join(root, "public/portfolio");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
for (const { slug, dominio } of flota.filter((f) => !only || f.slug === only)) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(`https://${dominio}/`, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(2500);
    const accept = page.getByRole("button", { name: /^Acepto$/ });
    if (await accept.count()) {
      await accept.first().click();
      await page.waitForTimeout(1500);
    }
    await page.evaluate(async () => {
      for (let y = 0; y < 2800; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const buf = await page.screenshot({ fullPage: true });
    const meta = await sharp(buf).metadata();
    const tall = await sharp(buf).extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, 2700) }).toBuffer();
    await sharp(tall).resize(800).webp({ quality: 70 }).toFile(path.join(OUT, `${slug}.webp`));
    await sharp(tall).resize(800).avif({ quality: 48, effort: 5 }).toFile(path.join(OUT, `${slug}.avif`));
    console.log(`✔ ${slug}`);
  } catch (e) {
    console.log(`✖ ${slug}: ${String(e).slice(0, 100)}`);
  }
  await page.close();
}
await browser.close();
