"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { splitLocale } from "@/lib/i18n/href";

const copy = {
  es: { title: "Algo salió mal.", lead: "Ya quedó registrado. Intenta de nuevo en un momento.", retry: "Reintentar" },
  en: { title: "Something went wrong.", lead: "It's been logged. Please try again in a moment.", retry: "Try again" },
};

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale } = splitLocale(usePathname());
  const text = copy[locale];
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="grid min-h-[70svh] place-items-center pt-24">
      <div className="container-x text-center">
        <p className="eyebrow">Error</p>
        <h1 className="mt-4 text-[length:var(--text-h1)]">{text.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-dim">{text.lead}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex h-12 items-center rounded-full bg-accent-strong px-7 font-semibold text-accent-contrast"
        >
          {text.retry}
        </button>
      </div>
    </section>
  );
}
