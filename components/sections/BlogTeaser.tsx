import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { formatDate } from "@/lib/utils";
import { postsFor, type PostMeta } from "@/content/blog/posts";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function BlogTeaser({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const latest = postsFor(locale).slice(0, 2);
  if (!latest.length) return null;
  return (
    <Section id="blog" labelledBy="blog-title" className="bg-bg-2" defer={[1120, 790]}>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="blog-title" eyebrow={dict.sections.blog.eyebrow} title={dict.sections.blog.title} lead={dict.sections.blog.lead} />
          <Link href={href(locale, "/blog")} className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-accent-ink hover:underline">
            {dict.cta.allPosts}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <RevealGroup as="ul" className="mt-12 grid gap-4 md:grid-cols-2">
          {latest.map((post) => (
            <RevealItem as="li" key={post.slug}>
              <PostCard post={post} locale={locale} minutesLabel={dict.sections.blog.minutes} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

export function PostCard({ post, locale, minutesLabel }: { post: PostMeta; locale: Locale; minutesLabel: string }) {
  return (
    <article className="group relative flex h-full flex-col rounded-[1.75rem] border border-line bg-surface/70 p-7 transition-colors hover:border-accent-line md:p-9">
      <div className="flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="mt-6 text-[clamp(1.35rem,1.1rem+0.8vw,1.8rem)] text-ink">
        <Link href={href(locale, `/blog/${post.slug}`)} className="after:absolute after:inset-0 after:rounded-[1.75rem]">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 text-dim">{post.description}</p>
      <p className="mt-auto flex items-center gap-2 pt-8 text-sm text-faint">
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        <span aria-hidden>·</span>
        {post.readingMinutes} {minutesLabel}
        <ArrowUpRight className="ml-auto size-4 text-accent-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </p>
    </article>
  );
}
