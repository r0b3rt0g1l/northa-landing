"use client";

import { track, type ConversionEvent } from "@/lib/analytics";

/**
 * Enlace externo que registra la conversión (WhatsApp, correo, agenda).
 * Se usa para las ligas que no pasan por el router de Next.
 */
export function TrackedLink({
  href,
  event,
  eventProps,
  className,
  children,
  newTabLabel,
  ariaLabel,
}: {
  href: string;
  event: ConversionEvent;
  eventProps?: Record<string, string>;
  className?: string;
  children: React.ReactNode;
  newTabLabel?: string;
  ariaLabel?: string;
}) {
  const opensTab = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => track(event, eventProps)}
      {...(opensTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {opensTab && newTabLabel && !ariaLabel && <span className="sr-only"> {newTabLabel}</span>}
    </a>
  );
}
