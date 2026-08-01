"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { navSections } from "@/lib/content/nav";

const SPY_IDS = ["inicio", ...navSections.map((s) => s.id)];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const activeId = useScrollSpy(SPY_IDS);
  const panelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar el menú móvil con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "glass shadow-[var(--shadow-nav)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6"
      >
        <a
          href="#inicio"
          className="rounded-lg"
          aria-label="Northa Digital — inicio"
        >
          <Logo />
        </a>

        {/* Enlaces de escritorio */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navSections.map((s) => {
            const isActive = activeId === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
                  )}
                >
                  {s.label}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3.5 -bottom-px h-px gradient-brand"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href="#contacto" className="px-5 py-2.5">
            Solicitar propuesta
          </Button>
        </div>

        {/* Botón de menú móvil */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line)] bg-white/5 text-[var(--color-text)] lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Panel móvil */}
      {open ? (
        <div
          id="menu-movil"
          ref={panelRef}
          className="glass border-t border-[var(--color-glass-border)] lg:hidden"
        >
          <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-4">
            {navSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={activeId === s.id ? "true" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-base transition-colors",
                    activeId === s.id
                      ? "bg-white/5 text-[var(--color-text)]"
                      : "text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-text)]",
                  )}
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <Button
                href="#contacto"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Solicitar propuesta
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

export default Nav;
