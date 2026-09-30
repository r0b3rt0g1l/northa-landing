import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/lib/site";

/**
 * Imagen Open Graph dinámica (1200×630) para cada página:
 *   /api/og?title=…&subtitle=…&locale=es&brand=northa|amplia
 * Usa las mismas tipografías de la marca (TTF en assets/fonts).
 */
const fontsDir = path.join(process.cwd(), "assets/fonts");
const fontCache: { data?: Awaited<ReturnType<typeof loadFonts>> } = {};

async function loadFonts() {
  const [display, body, mono] = await Promise.all([
    readFile(path.join(fontsDir, "BricolageGrotesque-ExtraBold.ttf")),
    readFile(path.join(fontsDir, "Karla-Medium.ttf")),
    readFile(path.join(fontsDir, "JetBrainsMono-Medium.ttf")),
  ]);
  return [
    { name: "Bricolage", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Karla", data: body, weight: 500 as const, style: "normal" as const },
    { name: "Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

const clean = (v: string | null, max: number) => (v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = clean(searchParams.get("title"), 110) || "El norte digital de Sonora.";
  const subtitle = clean(searchParams.get("subtitle"), 140);
  const amplia = searchParams.get("brand") === "amplia";
  const locale = searchParams.get("locale") === "en" ? "en" : "es";
  const accent = amplia ? "#3FB8AC" : "#FFA477";
  const accent2 = amplia ? "#7FD8CE" : "#FFD2B8";

  fontCache.data ??= await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `radial-gradient(900px 520px at 88% 10%, ${accent}40, transparent 70%), linear-gradient(180deg, #1a2748 0%, #0a1124 72%)`,
          color: "#F5F3EF",
          fontFamily: "Karla",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="30.5" fill="#15204a" stroke="#2f3f6b" />
              <path d="M2 50L7 49.3L11 47.6L14.5 44.2L19.5 37L23.5 31.2L27.5 28.1L32 27.2L36.5 28.1L40.5 31.2L44.5 37L49.5 44.2L53 47.6L57 49.3L62 50L60 56L4 56Z" fill="#DADAE2" />
              <path d="M20.2 36Q32 39.2 43.8 36" fill="none" stroke={accent} strokeWidth="1.8" />
              <path d="M15.3 43Q32 47 48.7 43" fill="none" stroke={accent} strokeWidth="1.8" />
              <path d="M32 4.56L34.54 11.86L40.16 14.4L34.54 16.94L32 24.24L29.46 16.94L23.84 14.4L29.46 11.86Z" fill="#F5F5F7" />
              <path d="M32 4.56L34.54 11.86L32 14.4L29.46 11.86Z" fill={amplia ? "#FFA477" : accent} />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Bricolage", fontSize: 34, letterSpacing: -1 }}>{amplia ? "Amplía" : "Northa"}</span>
              <span style={{ fontFamily: "Mono", fontSize: 14, letterSpacing: 6, color: accent2 }}>
                {amplia ? "CONSULTORÍA" : "DIGITAL"}
              </span>
            </div>
          </div>
          <span style={{ fontFamily: "Mono", fontSize: 18, letterSpacing: 4, color: "#A7A8B4" }}>
            {locale === "es" ? "HERMOSILLO, SONORA" : "HERMOSILLO, SONORA · MX"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1000 }}>
          <div
            style={{
              fontFamily: "Bricolage",
              fontSize: title.length > 60 ? 62 : 78,
              lineHeight: 1.02,
              letterSpacing: -2.5,
            }}
          >
            {title}
          </div>
          {subtitle && <div style={{ fontSize: 30, color: "#C9CAD4", lineHeight: 1.3 }}>{subtitle}</div>}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", height: 6, width: 220, borderRadius: 6, background: `linear-gradient(90deg, ${accent}, ${accent2})` }} />
          <span style={{ fontFamily: "Mono", fontSize: 20, color: "#A7A8B4" }}>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontCache.data,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    },
  );
}
