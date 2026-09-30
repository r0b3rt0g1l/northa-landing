"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowUp, RotateCcw, Square, X } from "lucide-react";
import { StarGlyph, WhatsAppIcon } from "@/components/ui/Icons";
import { CerroLoader } from "@/components/brand/CerroLoader";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { MarkdownLite } from "./MarkdownLite";
import { ToolCard } from "./ToolCard";
import type { ChatDict, NortPart, NortShellProps, NortUIMessage } from "./types";

type Mode = "checking" | "ai" | "guided";
type QuickKey = keyof ChatDict["quickReplies"];

const QUICK: QuickKey[] = ["web", "system", "ai", "price", "work", "whatsapp"];
let localId = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(localId++).toString(36)}`;

/* ---------- Historial: 7 días en este navegador (localStorage), sin cuentas ---------- */
const HISTORY_KEY = "nort-history-v1";
const HISTORY_TTL = 7 * 24 * 60 * 60 * 1000;
const HISTORY_MAX = 30;

/** Solo partes completas: texto y herramientas ya resueltas. */
function cleanForStorage(messages: NortUIMessage[]): NortUIMessage[] {
  return messages
    .map((m) => ({
      ...m,
      parts: m.parts.filter(
        (p) => p.type === "text" || (p.type.startsWith("tool-") && (p as { state?: string }).state === "output-available"),
      ),
    }))
    .filter((m) => m.parts.length > 0)
    .slice(-HISTORY_MAX);
}

function loadHistory(): NortUIMessage[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as { savedAt?: number; messages?: NortUIMessage[] };
    if (!data?.savedAt || Date.now() - data.savedAt > HISTORY_TTL || !Array.isArray(data.messages)) {
      localStorage.removeItem(HISTORY_KEY);
      return [];
    }
    return cleanForStorage(data.messages);
  } catch {
    return [];
  }
}

function saveHistory(messages: NortUIMessage[]) {
  try {
    const clean = cleanForStorage(messages);
    if (clean.length === 0) localStorage.removeItem(HISTORY_KEY);
    else localStorage.setItem(HISTORY_KEY, JSON.stringify({ savedAt: Date.now(), messages: clean }));
  } catch {
    /* sin almacenamiento (modo privado, cuota llena): el chat sigue funcionando */
  }
}

interface Props extends NortShellProps {
  open: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onPromptUsed: () => void;
}

export default function NortPanel({
  open,
  onClose,
  locale,
  dict,
  whatsappHref,
  privacyHref,
  newTabLabel,
  initialPrompt,
  onPromptUsed,
}: Props) {
  const titleId = useId();
  const [mode, setMode] = useState<Mode>("checking");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  // Última pregunta enviada: si la IA falla, viaja al mensaje de WhatsApp.
  const lastAskRef = useRef("");

  const [transport] = useState(
    () =>
      new DefaultChatTransport<NortUIMessage>({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: { ...body, messages: messages.slice(-16), locale, page: window.location.pathname },
        }),
      }),
  );

  // El panel solo se monta en el navegador (dynamic + ssr:false): leer localStorage aquí es seguro.
  const [initialMessages] = useState<NortUIMessage[]>(loadHistory);

  const { messages, sendMessage, setMessages, status, stop } = useChat<NortUIMessage>({
    transport,
    messages: initialMessages,
    // Si la IA no está disponible o falla, pasamos a modo guiado sin perder la pregunta.
    onError: (err) => handleChatError(err),
  });

  // ¿Hay IA? Si no, modo guiado (respuestas fijas + WhatsApp).
  useEffect(() => {
    let alive = true;
    fetch("/api/chat", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { enabled?: boolean }) => alive && setMode(d.enabled ? "ai" : "guided"))
      .catch(() => alive && setMode("guided"));
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- utilidades de mensajes locales (modo guiado) ---------- */
  const pushLocal = useCallback(
    (userText: string | null, answer: string, summary?: string) => {
      const parts: NortPart[] = [{ type: "text", text: answer }];
      if (summary !== undefined) {
        const url = whatsappUrl(
          `${locale === "es" ? "Hola Northa 👋 Vengo de Nort." : "Hi Northa 👋 Nort sent me."}\n${summary}`,
        );
        parts.push({
          type: "tool-whatsappHandoff",
          toolCallId: uid("local"),
          state: "output-available",
          input: { summary },
          output: { url, summary },
        } as NortPart);
      }
      setMessages((prev) => [
        ...prev,
        ...(userText ? [{ id: uid("u"), role: "user" as const, parts: [{ type: "text" as const, text: userText }] }] : []),
        { id: uid("a"), role: "assistant" as const, parts },
      ]);
    },
    [locale, setMessages],
  );

  const send = useCallback(
    (text: string) => {
      const clean = text.trim().slice(0, 1500);
      if (!clean) return;
      track("chat_message", { mode });
      lastAskRef.current = clean;
      if (mode === "ai") {
        sendMessage({ text: clean });
      } else {
        pushLocal(clean, dict.guidedFallback, clean);
      }
    },
    [mode, sendMessage, pushLocal, dict.guidedFallback],
  );

  const quick = (key: QuickKey) => {
    const label = dict.quickReplies[key];
    if (key === "whatsapp") {
      pushLocal(label, dict.guidedFallback, locale === "es" ? "Quiero hablar con una persona del equipo." : "I'd like to talk to someone on the team.");
      return;
    }
    if (mode === "ai") {
      send(label);
    } else {
      const answer = dict.guided[key as Exclude<QuickKey, "whatsapp">];
      pushLocal(label, answer, key === "work" || key === "ai" ? undefined : label);
    }
  };

  // Mensaje inicial desde un botón del sitio ("Pregúntale a Nort sobre…").
  useEffect(() => {
    if (!initialPrompt || mode === "checking") return;
    send(initialPrompt);
    onPromptUsed();
  }, [initialPrompt, mode, send, onPromptUsed]);

  function handleChatError(err: Error) {
    const ask = lastAskRef.current || undefined;
    const message = err.message ?? "";
    if (/rate_limited/.test(message)) {
      pushLocal(null, dict.rateLimited, ask);
    } else if (/ai_unavailable|401|403|gateway|credential|unauthori/i.test(message)) {
      setMode("guided");
      pushLocal(null, dict.guidedFallback, ask);
    } else {
      pushLocal(null, dict.error, ask);
    }
  }

  // Foco y Escape.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Guarda el historial cuando no hay una respuesta en curso.
  useEffect(() => {
    if (status === "ready" || status === "error") saveHistory(messages);
  }, [messages, status]);

  // Auto-scroll al final.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const busy = status === "submitted" || status === "streaming";
  const showQuick = messages.length === 0;

  return (
    <section
      id="nort-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      inert={!open}
      className={cn(
        "glass fixed z-50 flex flex-col overflow-hidden border-line text-ink shadow-[0_30px_90px_-30px_rgba(0,0,0,0.85)] transition-[opacity,transform] duration-300 ease-out-expo",
        "inset-0 border-0 md:inset-auto md:bottom-24 md:right-6 md:h-[min(40rem,calc(100dvh-8rem))] md:w-[25rem] md:rounded-[1.75rem] md:border",
        open ? "pointer-events-auto opacity-100 md:translate-y-0" : "pointer-events-none opacity-0 md:translate-y-4",
      )}
    >
      {/* Encabezado */}
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="relative grid size-10 place-items-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#2a3d72,#0a1124)]">
          <StarGlyph className="size-5 text-white" />
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-surface bg-emerald-400" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="font-display text-base font-bold leading-tight tracking-[-0.01em]">
            {dict.title}
          </h2>
          <p className="truncate text-xs text-faint">{dict.subtitle}</p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              stop();
              setMessages([]);
              saveHistory([]);
            }}
            className="grid size-9 place-items-center rounded-full text-faint hover:bg-accent-soft hover:text-ink"
            aria-label={dict.reset}
            title={dict.reset}
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 place-items-center rounded-full text-faint hover:bg-accent-soft hover:text-ink"
          aria-label={dict.close}
        >
          <X className="size-4" aria-hidden />
        </button>
      </header>

      {/* Conversación */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
      >
        <Bubble role="assistant">
          <MarkdownLite text={dict.intro} />
        </Bubble>

        {mode === "guided" && (
          <p className="mx-auto w-fit rounded-full border border-line px-3 py-1 text-center text-[0.72rem] text-faint">
            {dict.guidedNotice}
          </p>
        )}

        {messages.map((message) => (
          <Bubble key={message.id} role={message.role === "user" ? "user" : "assistant"}>
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return message.role === "user" ? (
                  <p key={i} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                ) : (
                  <MarkdownLite key={i} text={part.text} />
                );
              }
              if (part.type.startsWith("tool-")) {
                return <ToolCard key={i} part={part} dict={dict} newTabLabel={newTabLabel} />;
              }
              return null;
            })}
          </Bubble>
        ))}

        {status === "submitted" && (
          <div className="flex items-center gap-2.5 text-sm text-faint">
            <CerroLoader size={26} decorative />
            {dict.thinking}
          </div>
        )}

        {showQuick && (
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => quick(key)}
                disabled={mode === "checking"}
                className="min-h-9 rounded-full border border-line-2 bg-surface/60 px-3.5 py-1.5 text-left text-[0.85rem] text-ink transition-colors hover:border-accent-line hover:bg-accent-soft disabled:opacity-50"
              >
                {dict.quickReplies[key]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Redactar */}
      <form
        className="border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (busy || mode === "checking") return;
          send(input);
          setInput("");
          if (inputRef.current) inputRef.current.style.height = "auto";
        }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-line-2 bg-bg/60 p-1.5 focus-within:border-accent-line">
          <label htmlFor={`${titleId}-input`} className="sr-only">
            {dict.placeholder}
          </label>
          <textarea
            id={`${titleId}-input`}
            ref={inputRef}
            value={input}
            rows={1}
            maxLength={1500}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder={dict.placeholder}
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-[0.95rem] text-ink outline-none placeholder:text-faint"
          />
          {busy ? (
            <button
              type="button"
              onClick={() => stop()}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-2 text-ink"
              aria-label={dict.stop}
            >
              <Square className="size-3.5" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || mode === "checking"}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-strong text-accent-contrast transition-opacity disabled:opacity-40"
              aria-label={dict.send}
            >
              <ArrowUp className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 px-1">
          <p className="text-[0.7rem] leading-snug text-faint">
            {dict.disclaimer}{" "}
            <a href={privacyHref} className="underline underline-offset-2 hover:text-ink">
              {dict.privacy}
            </a>
          </p>
          <TrackedLink
            href={whatsappHref}
            event="whatsapp_click"
            eventProps={{ location: "chat_footer" }}
            ariaLabel={`${dict.whatsappCardCta} ${newTabLabel}`}
            className="grid size-8 shrink-0 place-items-center rounded-full text-whatsapp hover:bg-accent-soft"
          >
            <WhatsAppIcon className="size-4" />
          </TrackedLink>
        </div>
      </form>
    </section>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="ml-10 flex justify-end">
        <div className="max-w-full rounded-2xl rounded-br-md bg-accent-strong px-4 py-2.5 text-[0.93rem] leading-relaxed text-accent-contrast">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="mr-6 flex gap-2.5">
      <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#2a3d72,#0a1124)]">
        <StarGlyph className="size-3.5 text-white" />
      </span>
      <div className="min-w-0 space-y-3 text-[0.93rem] leading-relaxed text-dim [&_p]:text-ink/90">{children}</div>
    </div>
  );
}
