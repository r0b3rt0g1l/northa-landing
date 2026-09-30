"use client";

import { Sparkles } from "lucide-react";
import { openNort } from "@/lib/chat-events";

export function AskNortButton({
  label,
  className,
  prompt,
  showIcon = true,
}: {
  label: string;
  className?: string;
  /** Mensaje que Nort recibe al abrirse (opcional). */
  prompt?: string;
  showIcon?: boolean;
}) {
  return (
    <button type="button" onClick={() => openNort(prompt)} className={className}>
      {showIcon && <Sparkles className="size-4 text-northa-2" aria-hidden />}
      {label}
    </button>
  );
}
