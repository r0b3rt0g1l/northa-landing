"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { useCalmMotion, useInView } from "@/lib/hooks";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries/es";
import { LeadMiniForm } from "@/components/forms/LeadMiniForm";

type ScopeDict = Dictionary["sections"]["scope"];
type NeedKey = keyof ScopeDict["needs"];
type StageKey = keyof ScopeDict["stages"];
type TimingKey = keyof ScopeDict["timing"];

type StepMotion = typeof import("./ScopeStepMotion").default;

/**
 * Envuelve el paso actual. Mientras Motion no ha llegado, el paso entra con una
 * animación CSS; cuando la sección se acerca a la pantalla se descarga la
 * versión con Motion (que además anima la salida del paso anterior).
 */
function StepTransition({ step, children }: { step: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { rootMargin: "400px 0px", once: true });
  const calm = useCalmMotion();
  const [Motion, setMotion] = useState<StepMotion | null>(null);

  useEffect(() => {
    if (!near) return;
    let cancelled = false;
    import("./ScopeStepMotion").then((mod) => {
      if (!cancelled) setMotion(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, [near]);

  return (
    <div ref={ref}>
      {Motion ? (
        <Motion stepKey={step} calm={calm}>
          {children}
        </Motion>
      ) : (
        <div key={step} className={step > 0 && !calm ? "animate-[step-in_0.45s_var(--ease-out-expo)_both]" : undefined}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * "Arma tu proyecto": tres preguntas con chips y un mensaje listo para
 * WhatsApp. No pide datos personales salvo que la persona elija que la contacten.
 * La brújula gira un cuarto de vuelta por paso.
 */
export function ScopeBuilder({
  dict,
  formDict,
  locale,
  privacyHref,
  newTabLabel,
}: {
  dict: ScopeDict;
  formDict: Dictionary["form"];
  locale: "es" | "en";
  privacyHref: string;
  newTabLabel: string;
}) {
  const baseId = useId();
  const [step, setStep] = useState(0);
  const [needs, setNeeds] = useState<NeedKey[]>([]);
  const [stage, setStage] = useState<StageKey | null>(null);
  const [timing, setTiming] = useState<TimingKey | null>(null);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [hint, setHint] = useState(false);

  const total = 4;
  const message = useMemo(() => {
    const lines = [dict.messageIntro];
    if (name.trim()) lines.push(`${dict.messageName} ${name.trim()}.`);
    if (needs.length) lines.push(`${dict.messageNeeds}: ${needs.map((n) => dict.needs[n]).join(", ")}.`);
    if (stage) lines.push(`${dict.messageStage}: ${dict.stages[stage]}.`);
    if (timing) lines.push(`${dict.messageTiming}: ${dict.timing[timing]}.`);
    return lines.join("\n");
  }, [dict, name, needs, stage, timing]);

  const canNext = step === 0 ? needs.length > 0 : step === 1 ? !!stage : step === 2 ? !!timing : true;

  const next = () => {
    if (!canNext) {
      setHint(true);
      return;
    }
    setHint(false);
    if (step === 2) track("scope_completed", { needs: needs.join(","), stage: stage ?? "", timing: timing ?? "" });
    setStep((s) => Math.min(total - 1, s + 1));
  };

  const reset = () => {
    setStep(0);
    setNeeds([]);
    setStage(null);
    setTiming(null);
    setName("");
    setShowForm(false);
    setHint(false);
  };

  const titles = [dict.step1, dict.step2, dict.step3, dict.step4];

  return (
    <div className="grid gap-10 rounded-[2rem] border border-line bg-surface/70 p-6 md:p-10 lg:grid-cols-[14rem_1fr] lg:gap-14">
        {/* Brújula de progreso */}
        <div className="flex items-center gap-5 lg:flex-col lg:items-start">
          <svg viewBox="0 0 120 120" className="size-20 shrink-0 lg:size-40" aria-hidden>
            <circle cx="60" cy="60" r="56" fill="none" stroke="var(--line-2)" />
            <circle cx="60" cy="60" r="44" fill="none" stroke="var(--line)" strokeDasharray="2 5" />
            {["N", "E", "S", locale === "es" ? "O" : "W"].map((l, i) => (
              <text
                key={l}
                x={60 + Math.sin((i * Math.PI) / 2) * 50}
                y={60 - Math.cos((i * Math.PI) / 2) * 50 + 4}
                textAnchor="middle"
                className={cn("font-mono text-[10px]", i === step ? "fill-[var(--accent-ink)]" : "fill-[var(--faint)]")}
              >
                {l}
              </text>
            ))}
            <g
              style={{
                transform: `rotate(${step * 90}deg)`,
                transformOrigin: "60px 60px",
                transition: "transform 0.8s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <path d="M60 18L66 60L60 66L54 60Z" fill="var(--accent)" />
              <path d="M60 102L54 60L60 54L66 60Z" fill="var(--line-2)" />
            </g>
            <circle cx="60" cy="60" r="4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
          </svg>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint" aria-live="polite">
              {dict.progress.replace("{current}", String(step + 1)).replace("{total}", String(total))}
            </p>
            <div className="mt-3 flex gap-1.5" aria-hidden>
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 w-8 rounded-full transition-colors duration-500",
                    i <= step ? "bg-accent" : "bg-line-2",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-[19rem]">
          <StepTransition step={step}>
              <fieldset>
                <legend className="font-display text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-bold tracking-[-0.02em] text-ink">
                  {titles[step]}
                </legend>
                {step === 0 && <p className="mt-2 text-sm text-faint">{dict.step1Hint}</p>}

                {step === 0 && (
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {(Object.keys(dict.needs) as NeedKey[]).map((key) => {
                      const active = needs.includes(key);
                      return (
                        <Chip
                          key={key}
                          role="checkbox"
                          active={active}
                          onClick={() => setNeeds((prev) => (active ? prev.filter((k) => k !== key) : [...prev, key]))}
                        >
                          {dict.needs[key]}
                        </Chip>
                      );
                    })}
                  </div>
                )}

                {step === 1 && (
                  <RadioChips
                    label={dict.step2}
                    options={(Object.keys(dict.stages) as StageKey[]).map((key) => ({ key, label: dict.stages[key] }))}
                    value={stage}
                    onChange={setStage}
                  />
                )}

                {step === 2 && (
                  <RadioChips
                    label={dict.step3}
                    options={(Object.keys(dict.timing) as TimingKey[]).map((key) => ({ key, label: dict.timing[key] }))}
                    value={timing}
                    onChange={setTiming}
                  />
                )}

                {step === 3 && (
                  <div className="mt-6 grid gap-5">
                    <div>
                      <label htmlFor={`${baseId}-name`} className="mb-2 block text-sm text-dim">
                        {dict.nameLabel}
                      </label>
                      <input
                        id={`${baseId}-name`}
                        value={name}
                        onChange={(e) => setName(e.target.value.slice(0, 60))}
                        placeholder={dict.namePlaceholder}
                        autoComplete="name"
                        className="h-12 w-full max-w-sm rounded-xl border border-line-2 bg-bg/60 px-4 text-ink outline-none placeholder:text-faint focus:border-accent-line"
                      />
                    </div>
                    <pre className="whitespace-pre-wrap rounded-2xl border border-line bg-bg/70 p-5 font-sans text-[0.95rem] leading-relaxed text-ink">
                      {message}
                    </pre>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={whatsappUrl(message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("whatsapp_click", { location: "scope" })}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-accent-strong px-6 font-semibold text-accent-contrast shadow-[0_12px_40px_-14px_var(--accent)] transition-transform hover:-translate-y-0.5"
                      >
                        <WhatsAppIcon className="size-5" />
                        {dict.sendWhatsapp}
                        <span className="sr-only"> {newTabLabel}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setShowForm((v) => !v)}
                        aria-expanded={showForm}
                        className="inline-flex h-12 items-center rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line"
                      >
                        {dict.preferContact}
                      </button>
                    </div>
                    {showForm && (
                      <LeadMiniForm
                        dict={formDict}
                        locale={locale}
                        privacyHref={privacyHref}
                        newTabLabel={newTabLabel}
                        defaultName={name}
                        message={message}
                        service={needs.map((n) => dict.needs[n]).join(", ")}
                        source="scope"
                      />
                    )}
                  </div>
                )}
              </fieldset>
          </StepTransition>

          {hint && (
            <p className="mt-4 text-sm text-accent-ink" role="alert">
              {dict.selectAtLeastOne}
            </p>
          )}

          <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-dim hover:text-ink"
              >
                <ArrowLeft className="size-4" aria-hidden />
                {dict.back}
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                aria-disabled={!canNext}
                className={cn(
                  "ml-auto inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors",
                  canNext ? "bg-ink text-bg hover:bg-ink/90" : "bg-surface-2 text-faint",
                )}
              >
                {dict.next}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="ml-auto inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-dim hover:text-ink"
              >
                <RotateCcw className="size-4" aria-hidden />
                {dict.restart}
              </button>
            )}
          </div>
        </div>
      </div>
  );
}

/**
 * Grupo de opciones únicas con el patrón de radio de WAI-ARIA:
 * un solo alto de Tab y flechas/Inicio/Fin para moverse (y elegir).
 */
function RadioChips<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: K; label: string }[];
  value: K | null;
  onChange: (key: K) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = Math.max(
    0,
    options.findIndex((o) => o.key === value),
  );
  const move = (i: number) => {
    const n = (i + options.length) % options.length;
    onChange(options[n].key);
    refs.current[n]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="mt-6 flex flex-wrap gap-2.5"
      onKeyDown={(e) => {
        const idx = refs.current.findIndex((el) => el === document.activeElement);
        if (idx < 0) return;
        const keys: Record<string, number> = {
          ArrowRight: idx + 1,
          ArrowDown: idx + 1,
          ArrowLeft: idx - 1,
          ArrowUp: idx - 1,
          Home: 0,
          End: options.length - 1,
        };
        if (e.key in keys) {
          e.preventDefault();
          move(keys[e.key]);
        }
      }}
    >
      {options.map((o, i) => (
        <Chip
          key={o.key}
          ref={(el) => {
            refs.current[i] = el;
          }}
          role="radio"
          tabIndex={i === current ? 0 : -1}
          active={value === o.key}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  role,
  tabIndex,
  ref,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  role: "checkbox" | "radio";
  tabIndex?: number;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      role={role}
      aria-checked={active}
      tabIndex={tabIndex}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[0.95rem] transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.98]",
        active
          ? "border-accent bg-accent-soft text-ink"
          : "border-line-2 bg-bg/40 text-dim hover:border-accent-line hover:text-ink",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-4 place-items-center rounded-full border transition-colors",
          active ? "border-accent bg-accent text-accent-contrast" : "border-line-2",
        )}
      >
        {active && <Check className="size-3" strokeWidth={3} />}
      </span>
      {children}
    </button>
  );
}
