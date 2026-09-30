#!/usr/bin/env node
/**
 * Renderiza el video del hero a partir de la escena 3D del Cerro de la Campana.
 *
 *   npm run render:video                 # escritorio + móvil, 12 s a 30 fps
 *   npm run render:video -- --preview    # solo fotogramas de prueba en .render-preview/
 *   npm run render:video -- --variant=desktop --tod=0.8 --seconds=12 --fps=30
 *
 * Requisitos: ffmpeg en el PATH (brew install ffmpeg) y Chromium de Playwright
 * (npx playwright install chromium). Salida en public/video/.
 *
 * Por qué así: el video y el modelo interactivo salen del mismo código
 * (lib/three/cerro-scene.ts). Si cambias colores o el cerro, vuelves a correr
 * este script y el video queda idéntico a lo que se ve en la página.
 */
import { build } from "esbuild";
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const SECONDS = Number(args.seconds ?? 12);
const FPS = Number(args.fps ?? 30);
const TOD = Number(args.tod ?? 0.8);
const OUT = path.join(root, "public/video");

const VARIANTS = {
  desktop: { width: 1920, height: 1080, frameShift: 0.16, name: "cerro-1920x1080" },
  // En vertical el cerro sube un poco para que la estrella no tape el texto del hero.
  mobile: { width: 720, height: 1280, frameShift: 0, frameShiftY: 0.1, name: "cerro-720x1280" },
};

function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: ["ignore", "inherit", "inherit"] });
    p.on("error", reject);
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} salió con código ${code}`))));
  });
}

async function bundle() {
  const result = await build({
    entryPoints: [path.join(root, "scripts/render/entry.ts")],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    write: false,
    minify: true,
    logLevel: "silent",
  });
  return result.outputFiles[0].text;
}

async function openPage(code) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error("[página]", e.message));
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#000"><canvas id="c"></canvas></body></html>`);
  await page.addScriptTag({ content: code });
  return { browser, page };
}

async function renderFrames(page, variant, dir, frames, tod) {
  await page.evaluate(
    (o) => window.__cerro.init(o),
    {
      width: variant.width,
      height: variant.height,
      quality: "high",
      timeOfDay: tod,
      loopSeconds: SECONDS,
      frameShift: variant.frameShift,
      frameShiftY: variant.frameShiftY ?? 0,
      orbitAmplitude: 5,
    },
  );
  for (let i = 0; i < frames.length; i++) {
    const t = frames[i];
    const dataUrl = await page.evaluate((time) => window.__cerro.frame(time, 0.94), t);
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    await writeFile(path.join(dir, `f${String(i).padStart(5, "0")}.jpg`), buf);
    if (i % 30 === 0) process.stdout.write(`  ${variant.name}: ${i}/${frames.length}\r`);
  }
  process.stdout.write("\n");
}

async function encode(variant, dir) {
  const base = path.join(OUT, variant.name);
  const input = ["-y", "-framerate", String(FPS), "-i", path.join(dir, "f%05d.jpg")];
  await run("ffmpeg", [
    ...input,
    "-an",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-preset", "slow",
    "-crf", variant.width > 1000 ? "25" : "26",
    "-pix_fmt", "yuv420p",
    "-g", String(FPS * 2),
    "-movflags", "+faststart",
    `${base}.mp4`,
  ]);
  await run("ffmpeg", [
    ...input,
    "-an",
    "-c:v", "libvpx-vp9",
    "-crf", "35",
    "-b:v", "0",
    "-row-mt", "1",
    "-deadline", "good",
    "-cpu-used", "2",
    "-pix_fmt", "yuv420p",
    `${base}.webm`,
  ]);
  const poster = path.join(dir, "f00000.jpg");
  await sharp(poster).jpeg({ quality: 78, mozjpeg: true }).toFile(`${base}-poster.jpg`);
  await sharp(poster).webp({ quality: 72 }).toFile(`${base}-poster.webp`);
  await sharp(poster).avif({ quality: 52, effort: 6 }).toFile(`${base}-poster.avif`);
  for (const ext of [".mp4", ".webm", "-poster.jpg", "-poster.webp", "-poster.avif"]) {
    const s = await stat(`${base}${ext}`);
    console.log(`  ${path.basename(base + ext)}  ${(s.size / 1024).toFixed(0)} KB`);
  }
}

async function main() {
  console.log("Empaquetando escena…");
  const code = await bundle();
  const { browser, page } = await openPage(code);
  try {
    if (args.preview) {
      const dir = path.join(root, ".render-preview");
      await mkdir(dir, { recursive: true });
      const tods = String(args.tods ?? "0,0.45,0.72,0.8,1").split(",").map(Number);
      for (const [key, variant] of Object.entries(VARIANTS)) {
        if (args.variant && args.variant !== key) continue;
        for (const tod of tods) {
          const sub = path.join(dir, `${key}-tod${tod}`);
          await mkdir(sub, { recursive: true });
          await renderFrames(page, variant, sub, [0], tod);
          console.log(`  vista previa → ${path.relative(root, sub)}/f00000.jpg`);
        }
      }
      return;
    }

    await mkdir(OUT, { recursive: true });
    const total = Math.round(SECONDS * FPS);
    const frames = Array.from({ length: total }, (_, i) => i / FPS);
    for (const [key, variant] of Object.entries(VARIANTS)) {
      if (args.variant && args.variant !== key) continue;
      const dir = path.join(root, `.render-frames/${key}`);
      if (existsSync(dir)) await rm(dir, { recursive: true });
      await mkdir(dir, { recursive: true });
      console.log(`Renderizando ${variant.name} (${total} cuadros)…`);
      await renderFrames(page, variant, dir, frames, TOD);
      console.log(`Codificando ${variant.name}…`);
      await encode(variant, dir);
      await rm(dir, { recursive: true });
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
