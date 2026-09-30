"use client";

import { useEffect, useRef, useState } from "react";
import { loadGsap } from "@/lib/gsap";
import { useCalmMotion, useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export interface ProcessStepView {
  bearing: number;
  heading: string;
  title: string;
  body: string;
}

/**
 * Proceso como rumbo de brújula: al desplazarte, la aguja gira de N a E, S, O
 * y vuelve al N (acompañamiento). GSAP ScrollTrigger con scrub; con movimiento
 * reducido la aguja salta al rumbo de la etapa activa, sin animación continua.
 * GSAP se descarga cuando la sección está a ~600 px de aparecer.
 */
export function Process({
  eyebrow,
  title,
  lead,
  bearingLabel,
  steps,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  bearingLabel: string;
  steps: ProcessStepView[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const needle = useRef<SVGGElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const calm = useCalmMotion();
  const near = useInView(root, { rootMargin: "600px 0px", once: true });

  useEffect(() => {
    if (!near) return;
    let cancelled = false;
    let kill: (() => void) | undefined;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      const list = root.current?.querySelector("ol");
      if (cancelled || !list || !needle.current) return;
      const setRotation = gsap.quickSetter(needle.current, "rotation", "deg") as (value: number) => void;
      gsap.set(needle.current, { svgOrigin: "100 100" });
      const st = ScrollTrigger.create({
        trigger: list,
        start: "top 65%",
        end: "bottom 55%",
        scrub: calm ? false : 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
          setActive(idx);
          if (calm) setRotation(steps[idx].bearing);
          else setRotation(p * 360);
          if (line.current) line.current.style.transform = `scaleY(${p})`;
        },
      });
      kill = () => st.kill();
    });
    return () => {
      cancelled = true;
      kill?.();
    };
  }, [near, calm, steps]);

  return (
    <div ref={root} className="container-x grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h2 id="proceso-title" className="text-[length:var(--text-h2)] text-ink">
          {title}
        </h2>
        <p className="mt-5 max-w-md text-[length:var(--text-lead)] text-dim">{lead}</p>

        <div className="mt-12 hidden items-center gap-8 lg:flex">
          <svg viewBox="0 0 200 200" className="size-56" role="img" aria-label={`${bearingLabel}: ${steps[active].heading}`}>
            <defs>
              <linearGradient id="proc-n" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--accent-2)" />
                <stop offset="1" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="92" fill="none" stroke="var(--line-2)" />
            <circle cx="100" cy="100" r="74" fill="none" stroke="var(--line)" strokeDasharray="1 6" />
            {Array.from({ length: 36 }, (_, i) => (
              <line
                key={i}
                x1="100"
                y1="10"
                x2="100"
                y2={i % 9 === 0 ? 20 : 15}
                stroke={i % 9 === 0 ? "var(--dim)" : "var(--line-2)"}
                transform={`rotate(${i * 10} 100 100)`}
              />
            ))}
            {["N", "E", "S", steps[3]?.heading ?? "O"].map((l, i) => (
              <text
                key={`${l}-${i}`}
                x={100 + Math.sin((i * Math.PI) / 2) * 60}
                y={100 - Math.cos((i * Math.PI) / 2) * 60 + 4}
                textAnchor="middle"
                className="font-mono"
                fontSize="11"
                fill={i === active % 4 ? "var(--accent-ink)" : "var(--faint)"}
              >
                {l}
              </text>
            ))}
            <g ref={needle}>
              <path d="M100 32L108 100L100 108L92 100Z" fill="url(#proc-n)" />
              <path d="M100 168L92 100L100 92L108 100Z" fill="var(--line-2)" />
            </g>
            <circle cx="100" cy="100" r="6" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2.5" />
          </svg>
          <div aria-live="polite">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">{bearingLabel}</p>
            <p className="mt-2 font-display text-5xl font-bold tracking-[-0.04em] text-ink tabular-nums">
              {String(steps[active].bearing % 360).padStart(3, "0")}°
            </p>
            <p className="mt-1 text-sm text-accent-ink">{steps[active].title}</p>
          </div>
        </div>
      </div>

      <ol className="relative grid gap-4">
        <span aria-hidden className="absolute bottom-8 left-[1.6rem] top-8 w-px bg-line" />
        <span
          ref={line}
          aria-hidden
          className="absolute bottom-8 left-[1.6rem] top-8 w-px origin-top scale-y-0 bg-gradient-to-b from-accent to-accent-2"
        />
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={cn(
              "relative flex gap-6 rounded-3xl border p-6 transition-[border-color,background-color] duration-500 md:p-7",
              // Los pasos inactivos se atenúan sin bajar el contraste del texto (WCAG 1.4.3).
              i === active ? "border-accent-line bg-surface" : "border-transparent",
            )}
          >
            <span
              className={cn(
                "relative z-10 grid size-[3.25rem] shrink-0 place-items-center rounded-full border font-mono text-sm transition-colors duration-500",
                i <= active ? "border-accent bg-accent-soft text-ink" : "border-line-2 bg-bg text-faint",
              )}
            >
              {step.heading}
            </span>
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint">
                {String(i + 1).padStart(2, "0")} · {String(step.bearing % 360).padStart(3, "0")}°
              </p>
              <h3
                className={cn(
                  "mt-2 text-[length:var(--text-h3)] transition-colors duration-500",
                  i === active ? "text-ink" : "text-ink/75",
                )}
              >
                {step.title}
              </h3>
              <p className="mt-2 text-dim">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
