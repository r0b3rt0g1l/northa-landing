"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookUser,
  CircleUser,
  ClipboardList,
  FolderOpen,
  House,
  LogOut,
  Megaphone,
  Menu,
  SquareKanban,
  Users,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/Preferences";
import { cn } from "@/lib/utils";

const BASE = "/amplia/portal";
const items = [
  { href: BASE, label: "Inicio", icon: House, exact: true },
  { href: `${BASE}/comunicados`, label: "Comunicados", icon: Megaphone },
  { href: `${BASE}/directorio`, label: "Directorio", icon: BookUser },
  { href: `${BASE}/recursos`, label: "Recursos", icon: FolderOpen },
  { href: `${BASE}/solicitudes`, label: "Solicitudes", icon: ClipboardList },
  { href: `${BASE}/proyectos`, label: "Proyectos", icon: SquareKanban },
  { href: `${BASE}/usuarios`, label: "Usuarios", icon: Users, admin: true },
];

export function PortalNav({
  memberName,
  isAdmin,
  signOutAction,
}: {
  memberName: string;
  isAdmin: boolean;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const nav = (
    <nav aria-label="Portal de Amplía" className="flex flex-col gap-1">
      {items
        .filter((i) => !i.admin || isAdmin)
        .map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[0.95rem] transition-colors",
                active ? "bg-accent-soft font-semibold text-ink" : "text-dim hover:bg-surface-2 hover:text-ink",
              )}
            >
              <Icon className={cn("size-[1.1rem]", active ? "text-accent-ink" : "text-faint")} aria-hidden />
              {label}
            </Link>
          );
        })}
    </nav>
  );

  const account = (
    <div className="mt-auto grid gap-2 border-t border-line pt-4">
      <Link
        href={`${BASE}/cuenta`}
        aria-current={pathname === `${BASE}/cuenta` ? "page" : undefined}
        className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm text-dim hover:bg-surface-2 hover:text-ink"
      >
        <CircleUser className="size-[1.1rem] text-faint" aria-hidden />
        <span className="min-w-0">
          <span className="block truncate font-semibold text-ink">{memberName}</span>
          <span className="block text-xs text-faint">{isAdmin ? "Administración" : "Personal"} · Mi cuenta</span>
        </span>
      </Link>
      <div className="flex items-center justify-between gap-2 px-1">
        <ThemeToggle labels={{ toLight: "Cambiar a tema claro", toDark: "Cambiar a tema oscuro" }} />
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-sm text-dim transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <LogOut className="size-4" aria-hidden />
            Salir
          </button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <Link href={BASE} className="flex items-center gap-3 rounded-xl px-2 py-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element -- enso de Amplía (PNG ya optimizado) */}
      <img src="/amplia/enso.png" alt="" width={36} height={36} className="size-9" />
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold tracking-[-0.02em] text-ink">Amplía</span>
        <span className="block font-mono text-[0.62rem] uppercase tracking-[0.3em] text-accent-ink">Portal del equipo</span>
      </span>
    </Link>
  );

  return (
    <>
      {/* Escritorio: la columna lleva el fondo; la barra se queda fija al desplazarse */}
      <div className="hidden border-r border-line bg-bg-2 lg:block">
        <aside className="sticky top-0 flex h-dvh flex-col gap-6 px-4 py-6">
          {brand}
          {nav}
          {account}
        </aside>
      </div>

      {/* Celular */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-bg/90 px-4 py-2 backdrop-blur lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="portal-drawer"
          className="grid size-11 place-items-center rounded-full border border-line-2 text-ink"
        >
          <Menu className="size-5" aria-hidden />
          <span className="sr-only">Abrir menú del portal</span>
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú del portal" id="portal-drawer">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="Cerrar menú" />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col gap-6 overflow-y-auto border-r border-line bg-bg-2 px-4 py-5">
            <div className="flex items-center justify-between">
              {brand}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full text-dim hover:text-ink"
                autoFocus
              >
                <X className="size-5" aria-hidden />
                <span className="sr-only">Cerrar menú</span>
              </button>
            </div>
            {nav}
            {account}
          </div>
        </div>
      )}
    </>
  );
}
