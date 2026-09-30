import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { htmlLang, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { absoluteUrl, href } from "@/lib/i18n/href";
import { ogImageUrl, pageMetadata } from "@/lib/seo";
import { JsonLd, articleJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { getPost, postLoaders, posts } from "@/content/blog/posts";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";

export function generateStaticParams() {
  return posts.map((p) => ({ locale: p.locale, slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getPost(locale, slug);
  if (!post) return {};
  const meta = pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.description,
    type: "article",
    publishedTime: post.date,
  });
  // hreflang apunta al artículo traducido (slug distinto), no a la misma ruta.
  const languages: Record<string, string> = { [htmlLang[locale]]: absoluteUrl(site.url, locale, `/blog/${slug}`) };
  if (post.translation) {
    languages[htmlLang[post.translation.locale]] = absoluteUrl(site.url, post.translation.locale, `/blog/${post.translation.slug}`);
  }
  return { ...meta, alternates: { canonical: absoluteUrl(site.url, locale, `/blog/${slug}`), languages } };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const post = getPost(locale, slug);
  const load = postLoaders[`${locale}/${slug}`];
  if (!post || !load) notFound();
  const { default: Content } = await load();
  const dict = getDictionary(locale);
  const url = absoluteUrl(site.url, locale, `/blog/${slug}`);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          url,
          date: post.date,
          locale,
          image: ogImageUrl({ title: post.title, locale }),
        })}
      />
      <PageHero
        locale={locale}
        crumbs={[
          { name: dict.nav.blog, path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ]}
        eyebrow={post.tags.join(" · ")}
        title={post.title}
        lead={post.description}
      >
        <p className="flex items-center gap-2 text-sm text-faint">
          {dict.sections.blog.by} {site.founder}
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <span aria-hidden>·</span>
          {post.readingMinutes} {dict.sections.blog.minutes}
        </p>
      </PageHero>
      <article className="container-x pb-12">
        <div className="prose-northa mx-auto max-w-[68ch]">
          <Content />
        </div>
        <div className="mx-auto mt-16 max-w-[68ch] border-t border-line pt-8">
          <Link href={href(locale, "/blog")} className="inline-flex items-center gap-2 font-semibold text-accent-ink hover:underline">
            <ArrowLeft className="size-4" aria-hidden />
            {dict.cta.allPosts}
          </Link>
        </div>
      </article>
      <CtaBand locale={locale} location={`post_${slug}`} />
    </>
  );
}
