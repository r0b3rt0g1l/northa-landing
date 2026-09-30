import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pin } from "lucide-react";
import { createPortalClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/portal/session";
import type { Announcement } from "@/lib/portal/types";
import { shortDate } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Comunicado" };

export default async function AnnouncementDetail({ params }: PageProps<"/amplia/portal/comunicados/[id]">) {
  await requireMember();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createPortalClient();
  const { data: a } = await supabase
    .from("amplia_announcements")
    .select("id, title, body, pinned, published_at, author:amplia_members(full_name)")
    .eq("id", id)
    .maybeSingle<Announcement>();
  if (!a) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/amplia/portal/comunicados" className="inline-flex items-center gap-2 text-sm text-dim hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Comunicados
      </Link>
      <h1 className="mt-6 flex items-start gap-3 text-[clamp(1.9rem,1.5rem+1.4vw,2.8rem)] text-ink">
        {a.pinned && <Pin className="mt-2 size-5 shrink-0 text-accent-ink" aria-label="Fijado" />}
        {a.title}
      </h1>
      <p className="mt-3 text-sm text-faint">
        {shortDate(a.published_at)}
        {a.author?.full_name ? ` · ${a.author.full_name}` : ""}
      </p>
      <div className="mt-8 whitespace-pre-line text-[1.05rem] leading-relaxed text-ink/90">{a.body}</div>
    </article>
  );
}
