"use client";

import { CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { Dictionary } from "@/lib/i18n/dictionaries/es";
import type { LeadStatus } from "./useLeadSubmit";

export function FormStatus({
  status,
  dict,
  newTabLabel,
  fallbackWhatsapp,
}: {
  status: LeadStatus;
  dict: Dictionary["form"];
  newTabLabel: string;
  fallbackWhatsapp: string;
}) {
  if (status.state === "success") {
    return (
      <div role="status" className="rounded-2xl border border-accent-line bg-accent-soft p-5">
        <p className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <CheckCircle2 className="size-5 text-accent-ink" aria-hidden />
          {status.delivered ? dict.successTitle : dict.notDeliveredTitle}
        </p>
        <p className="mt-2 text-dim">{status.delivered ? dict.success : dict.notDelivered}</p>
        <TrackedLink
          href={status.whatsappUrl ?? fallbackWhatsapp}
          event="whatsapp_click"
          eventProps={{ location: "form_success" }}
          newTabLabel={newTabLabel}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-accent-strong px-5 font-semibold text-accent-contrast"
        >
          <WhatsAppIcon className="size-4" />
          {dict.sendWhatsapp}
        </TrackedLink>
      </div>
    );
  }
  if (status.state === "error") {
    return (
      <p role="alert" className="rounded-xl border border-accent-line bg-accent-soft p-4 text-sm text-ink">
        {status.kind === "rate" ? dict.rateLimited : status.kind === "captcha" ? dict.errors.captcha : dict.error}
      </p>
    );
  }
  return null;
}
