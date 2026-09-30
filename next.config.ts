import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/**
 * Encabezados de seguridad para todo el sitio. HSTS sin `preload` a propósito:
 * agrégalo solo cuando el dominio vaya a registrarse en la lista de precarga.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Las fuentes para las imágenes Open Graph se leen del disco en /api/og.
  outputFileTracingIncludes: {
    "/api/og": ["./assets/fonts/**"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Portal de Amplía: archivos de hasta 4 MB (Vercel corta el cuerpo en ~4.5 MB).
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Los videos y pósters se regeneran con nombre nuevo si cambian.
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        source: "/escudos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        source: "/portfolio/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        // Grano, curvas de nivel e íconos. Una semana: si el logo cambia, se nota pronto.
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        // Intranet de Amplía: nunca se indexa ni se guarda en cachés compartidas.
        source: "/amplia/portal/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
