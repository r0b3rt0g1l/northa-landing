"use client";

import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { comparacion } from "@/lib/content/comparacion";

function Panel({ data, variant }) {
  const isAhora = variant === "ahora";
  const Icon = isAhora ? Check : Minus;
  return (
    <div
      className={cn(
        "fade-in rounded-2xl border p-7 sm:p-9",
        isAhora
          ? "border-[var(--color-bright)]/30 bg-[var(--color-surface)] shadow-[0_20px_60px_-20px_rgba(255,46,126,0.45)]"
          : "border-[var(--color-line)] bg-[var(--color-surface)]/60",
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3
          className={cn(
            "text-[length:var(--text-h3)] font-semibold",
            isAhora ? "text-gradient" : "text-[var(--color-muted)]",
          )}
        >
          {data.title}
        </h3>
      </div>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{data.tagline}</p>
      <ul className="mt-6 flex flex-col gap-4">
        {data.points.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                isAhora
                  ? "gradient-brand text-white"
                  : "border border-[var(--color-line)] text-[var(--color-muted)]",
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span
              className={cn(
                isAhora
                  ? "text-[var(--color-text)]"
                  : "text-[var(--color-muted)]",
              )}
            >
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Comparator() {
  return (
    <Tabs defaultSelectedKey="ahora" className="mt-12 flex flex-col items-center">
      <TabList
        aria-label="Comparación entre un portal heredado y un portal Northa"
        className="inline-flex gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/70 p-1 backdrop-blur"
      >
        <Tab
          id="antes"
          className={({ isSelected }) =>
            cn(
              "cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              isSelected
                ? "bg-white/10 text-[var(--color-text)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
            )
          }
        >
          Antes
        </Tab>
        <Tab
          id="ahora"
          className={({ isSelected }) =>
            cn(
              "cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              isSelected
                ? "gradient-brand text-white"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
            )
          }
        >
          Con Northa
        </Tab>
      </TabList>

      <div className="mt-8 w-full max-w-2xl">
        <TabPanel id="antes" className="outline-none">
          <Panel data={comparacion.antes} variant="antes" />
        </TabPanel>
        <TabPanel id="ahora" className="outline-none">
          <Panel data={comparacion.ahora} variant="ahora" />
        </TabPanel>
      </div>
    </Tabs>
  );
}

export default Comparator;
