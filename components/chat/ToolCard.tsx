"use client";

import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { ChatDict, NortPart } from "./types";

/** Tarjetas que dibuja el chat cuando Nort usa una herramienta. */
export function ToolCard({ part, dict, newTabLabel }: { part: NortPart; dict: ChatDict; newTabLabel: string }) {
  if (part.type === "tool-whatsappHandoff") {
    if (part.state !== "output-available") return <Pending />;
    return (
      <WhatsAppCard
        url={part.output.url}
        summary={part.output.summary}
        dict={dict}
        newTabLabel={newTabLabel}
      />
    );
  }

  if (part.type === "tool-saveLead") {
    if (part.state !== "output-available") return <Pending />;
    const out = part.output;
    if (!out.ok) return null;
    return (
      <div className="rounded-2xl border border-accent-line bg-accent-soft p-4">
        <p className="flex items-center gap-2 font-semibold text-ink">
          <CheckCircle2 className="size-4 text-accent-ink" aria-hidden />
          {dict.leadSavedTitle}
        </p>
        <p className="mt-1 text-sm text-dim">{out.delivered ? dict.leadSaved : dict.leadNotDelivered}</p>
        {!out.delivered && out.whatsappUrl && (
          <TrackedLink
            href={out.whatsappUrl}
            event="whatsapp_click"
            eventProps={{ location: "chat_lead" }}
            newTabLabel={newTabLabel}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-accent-strong px-4 text-sm font-semibold text-accent-contrast"
          >
            <WhatsAppIcon className="size-4" />
            {dict.whatsappCardCta}
          </TrackedLink>
        )}
      </div>
    );
  }

  if (part.type === "tool-bookCall") {
    if (part.state !== "output-available") return <Pending />;
    if (!part.output.url) return null;
    return (
      <div className="rounded-2xl border border-line bg-surface-2 p-4">
        <p className="flex items-center gap-2 font-semibold text-ink">
          <CalendarDays className="size-4 text-accent-ink" aria-hidden />
          {dict.bookCardTitle}
        </p>
        <TrackedLink
          href={part.output.url}
          event="call_booking_click"
          eventProps={{ location: "chat" }}
          newTabLabel={newTabLabel}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-line-2 px-4 text-sm font-semibold text-ink hover:border-accent-line"
        >
          {dict.bookCardCta}
        </TrackedLink>
      </div>
    );
  }

  return null;
}

export function WhatsAppCard({
  url,
  summary,
  dict,
  newTabLabel,
}: {
  url: string;
  summary?: string;
  dict: ChatDict;
  newTabLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-4">
      <p className="flex items-center gap-2 font-semibold text-ink">
        <WhatsAppIcon className="size-4 text-whatsapp" />
        {dict.whatsappCardTitle}
      </p>
      {summary && (
        <p className="mt-2 line-clamp-4 rounded-xl bg-bg/60 p-3 text-sm italic text-dim">“{summary}”</p>
      )}
      <TrackedLink
        href={url}
        event="whatsapp_click"
        eventProps={{ location: "chat" }}
        newTabLabel={newTabLabel}
        className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-accent-strong px-4 text-sm font-semibold text-accent-contrast transition-transform hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="size-4" />
        {dict.whatsappCardCta}
      </TrackedLink>
    </div>
  );
}

function Pending() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-faint">
      <Loader2 className="size-3.5 animate-spin" aria-hidden />…
    </span>
  );
}
