#!/usr/bin/env node
/**
 * Auditoría técnica rápida de sitios (los propios o la competencia):
 * metadatos, Open Graph, JSON-LD, hreflang, stack, widgets, peso y H1.
 * Usa el Chromium de Playwright. Solo lee páginas públicas.
 *
 *   npm run audit:sites
 *   npm run audit:sites -- --urls=https://northadigital.com/,https://imaginastudio.mx/
 */
import { chromium } from "playwright";

const arg = process.argv.find((a) => a.startsWith("--urls="));
const urls = arg
  ? arg.slice(7).split(",")
  : ["https://imaginastudio.mx/", "https://creapptivo.com/", "https://www.hechoensonora.com/"];

const browser = await chromium.launch();
const rows = [];
for (const url of urls) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let bytes = 0;
  let requests = 0;
  page.on("response", async (r) => {
    requests++;
    const b = await r.body().catch(() => null);
    if (b) bytes += b.length;
  });
  try {
    const res = await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(3000);
    const info = await page.evaluate(() => {
      const meta = (s) => document.querySelector(s)?.getAttribute("content") ?? null;
      const html = document.documentElement.outerHTML;
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
        try {
          const j = JSON.parse(s.textContent || "null");
          const arr = Array.isArray(j) ? j : (j?.["@graph"] ?? [j]);
          return arr.flatMap((x) => x?.["@type"] ?? []);
        } catch {
          return ["(inválido)"];
        }
      });
      return {
        title: document.title,
        description: !!meta('meta[name="description"]'),
        og: !!meta('meta[property="og:title"]'),
        twitter: !!meta('meta[name="twitter:card"]'),
        jsonLd: ld.join(", ") || "—",
        hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].length,
        h1: document.querySelectorAll("h1").length,
        wordpress: /wp-content|wp-includes/.test(html),
        video: !!document.querySelector("video"),
        whatsapp: [...document.querySelectorAll("a[href]")].filter((a) => /wa\.me|whatsapp/.test(a.href)).length,
      };
    });
    rows.push({ url, status: res?.status(), requests, pesoKB: Math.round(bytes / 1024), ...info });
  } catch (e) {
    rows.push({ url, error: String(e).slice(0, 120) });
  }
  await page.close();
}
await browser.close();
console.table(rows);
