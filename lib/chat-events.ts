"use client";

/** Abre el chat de Nort desde cualquier parte (botones del hero, portafolio, menú). */
export const OPEN_CHAT_EVENT = "northa:open-chat";

export function openNort(prompt?: string) {
  window.dispatchEvent(new CustomEvent<{ prompt?: string }>(OPEN_CHAT_EVENT, { detail: { prompt } }));
}
