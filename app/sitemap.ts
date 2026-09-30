import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { htmlLang, locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/i18n/href";
import { services } from "@/content/services";
import { posts } from "@/content/blog/posts";

/** Sitemap con alternativas hreflang para cada página. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/servicios", priority: 0.9, freq: "monthly" },
    ...services.map((s) => ({ path: `/servicios/${s.slug}`, priority: 0.85, freq: "monthly" as const })),
    { path: "/portfolio", priority: 0.8, freq: "monthly" },
    { path: "/gobierno", priority: 0.7, freq: "monthly" },
    { path: "/amplia", priority: 0.6, freq: "monthly" },
    { path: "/blog", priority: 0.6, freq: "weekly" },
    { path: "/contacto", priority: 0.7, freq: "yearly" },
    { path: "/privacidad", priority: 0.2, freq: "yearly" },
  ];

  const pages: MetadataRoute.Sitemap = staticPaths.flatMap(({ path, priority, freq }) =>
    locales.map((locale) => ({
      url: absoluteUrl(site.url, locale, path),
      lastModified: now,
      changeFrequency: freq,
      priority: locale === "es" ? priority : Math.round(priority * 80) / 100,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], absoluteUrl(site.url, l, path)])),
      },
    })),
  );

  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(site.url, post.locale, `/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.5,
    alternates: post.translation
      ? {
          languages: {
            [htmlLang[post.locale]]: absoluteUrl(site.url, post.locale, `/blog/${post.slug}`),
            [htmlLang[post.translation.locale]]: absoluteUrl(site.url, post.translation.locale, `/blog/${post.translation.slug}`),
          },
        }
      : undefined,
  }));

  return [...pages, ...articles];
}
