import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { postsFor } from "@/content/blog/posts";
import { PageHero } from "@/components/layout/PageHero";
import { PostCard } from "@/components/sections/BlogTeaser";
import { BlogFilter } from "@/components/blog/BlogFilter";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/blog", title: dict.nav.blog, description: dict.sections.blog.lead });
}

export default async function BlogIndex({ params }: PageProps<"/[locale]/blog">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  const list = postsFor(locale);
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ name: dict.nav.blog, path: "/blog" }]}
        eyebrow={dict.sections.blog.eyebrow}
        title={dict.sections.blog.title}
        lead={dict.sections.blog.lead}
      />
      <section className="pb-8">
        <div className="container-x">
          <BlogFilter
            tags={[...new Set(list.flatMap((p) => p.tags))]}
            itemTags={list.map((p) => p.tags)}
            labels={{
              filter: dict.sections.blog.filterLabel,
              all: dict.sections.blog.allTopics,
              count: dict.sections.blog.count,
              countOne: dict.sections.blog.countOne,
            }}
          >
            {list.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} locale={locale} minutesLabel={dict.sections.blog.minutes} />
              </li>
            ))}
          </BlogFilter>
        </div>
      </section>
      <CtaBand locale={locale} location="blog_index" />
    </>
  );
}
