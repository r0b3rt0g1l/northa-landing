"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Landmark, Menu, Sparkles, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { splitLocale, type PathAlternates } from "@/lib/i18n/href";
import { NorthaLogo } from "@/components/brand/CerroMark";
import { WhatsAppIcon, serviceIcons } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { ServiceIcon } from "@/content/services";
import { openNort } from "@/lib/chat-events";
import { cn } from "@/lib/utils";
import { BrandSwitch, LocaleSwitch, ThemeToggle } from "./Preferences";

export interface HeaderData {
  locale: Locale;
  /** Slugs traducidos del blog para el selector de idioma. */
  alternates: PathAlternates;
  homeHref: string;
  nav: { key: string; label: string; href: string; path: string }[];
  services: { slug: string; icon: ServiceIcon; name: string; short: string; href: string }[];
  servicesIndexHref: string;
  govHref: string;
  whatsappHref: string;
  labels: {
    services: string;
    allServices: string;
    gov: string;
    govLead: string;
    whatsapp: string;
    whatsappLong: string;
    askNort: string;
    openMenu: string;
    closeMenu: string;
    primaryNav: string;
    brandSwitch: string;
    language: string;
    toLight: string;
    toDark: string;
    home: string;
    newTab: string;
  };
}

export function HeaderClient({ data }: { data: HeaderData }) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);
  const isHome = path === "/";
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaId = useId();
  const mobileId = useId();
  const megaRef = useRef<HTMLLIElement>(null);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Cierra menús al navegar (estado ajustado durante el render, sin efecto).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  // Mega menú: cerrar con Escape o clic fuera.
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        megaButtonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!megaRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  const hoverOpen = useCallback((open: boolean) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMegaOpen(open), open ? 80 : 180);
  }, []);

  const overHero = isHome && !scrolled && !mobileOpen;
  const isActive = (itemPath: string) =>
    itemPath !== "/" && !itemPath.startsWith("/#") && (path === itemPath || path.startsWith(`${itemPath}/`));

  const nav = data.nav.filter((n) => n.key !== "contact" && n.key !== "services");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500",
        overHero
          ? "border-b border-transparent text-white"
          : "glass border-b border-line/70 text-ink shadow-[0_12px_40px_-28px_rgba(0,0,0,0.6)]",
      )}
      data-over-hero={overHero ? "true" : undefined}
    >
      <div className="container-x flex h-[4.5rem] items-center gap-4">
        <Link
          href={data.homeHref}
          className="-ml-1 rounded-full p-1"
          aria-label={`Northa Digital — ${data.labels.home}`}
        >
          <NorthaLogo id="hdr" animate size={38} onDark={overHero} />
        </Link>

        <nav aria-label={data.labels.primaryNav} className="ml-4 hidden flex-1 items-center lg:flex">
          <ul className="flex items-center gap-1">
            <li
              ref={megaRef}
              className="relative"
              onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && hoverOpen(false)}
            >
              <button
                ref={megaButtonRef}
                type="button"
                aria-expanded={megaOpen}
                aria-controls={megaId}
                onClick={() => setMegaOpen((v) => !v)}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[0.93rem] transition-colors",
                  overHero ? "text-white/85 hover:text-white" : "text-dim hover:text-ink",
                  (megaOpen || isActive("/servicios")) && (overHero ? "text-white" : "text-ink"),
                )}
              >
                {data.labels.services}
                <svg
                  aria-hidden
                  viewBox="0 0 12 12"
                  className={cn("size-2.5 transition-transform duration-300", megaOpen && "rotate-180")}
                >
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              {megaOpen && (
                <div
                  id={megaId}
                  className="glass absolute left-0 top-[calc(100%+0.6rem)] w-[min(46rem,calc(100vw-4rem))] origin-top-left animate-[pop-in_0.28s_var(--ease-out-expo)_both] rounded-3xl border border-line p-3 text-ink shadow-[var(--shadow)]"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {data.services.map((s) => {
                      const Icon = serviceIcons[s.icon];
                      return (
                        <Link
                          key={s.slug}
                          href={s.href}
                          className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-accent-soft focus-visible:bg-accent-soft"
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-accent-ink transition-colors group-hover:border-accent-line">
                            <Icon className="size-[1.15rem]" aria-hidden />
                          </span>
                          <span>
                            <span className="block text-[0.95rem] font-semibold text-ink">{s.name}</span>
                            <span className="mt-0.5 block text-[0.85rem] leading-snug text-dim">{s.short}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface/70 p-3">
                    <Link href={data.govHref} className="group flex items-center gap-3">
                      <Landmark className="size-4 text-accent-ink" aria-hidden />
                      <span className="text-[0.9rem] text-dim group-hover:text-ink">
                        <strong className="font-semibold text-ink">{data.labels.gov}:</strong> {data.labels.govLead}
                      </span>
                    </Link>
                    <Link
                      href={data.servicesIndexHref}
                      className="inline-flex shrink-0 items-center gap-1.5 text-[0.9rem] font-semibold text-accent-ink hover:underline"
                    >
                      {data.labels.allServices}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              )}
            </li>
            {nav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-3.5 text-[0.93rem] transition-colors",
                    overHero ? "text-white/85 hover:text-white" : "text-dim hover:text-ink",
                    isActive(item.path) && (overHero ? "text-white" : "text-ink"),
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <BrandSwitch locale={data.locale} label={data.labels.brandSwitch} className="hidden xl:flex" />
          <div className="hidden md:block">
            <LocaleSwitch locale={data.locale} label={data.labels.language} alternates={data.alternates} />
          </div>
          <div className="hidden md:block">
            <ThemeToggle labels={{ toLight: data.labels.toLight, toDark: data.labels.toDark }} />
          </div>
          <TrackedLink
            href={data.whatsappHref}
            event="whatsapp_click"
            eventProps={{ location: "header" }}
            newTabLabel={data.labels.newTab}
            className="hidden h-10 items-center gap-2 rounded-full bg-accent-strong px-4 text-[0.9rem] font-semibold text-accent-contrast shadow-[0_8px_30px_-10px_var(--accent)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            {data.labels.whatsapp}
          </TrackedLink>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line/60 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? data.labels.closeMenu : data.labels.openMenu}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {mobileOpen && <MobileMenu id={mobileId} data={data} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

function MobileMenu({ id, data, onClose }: { id: string; data: HeaderData; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const list = focusables();
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={data.labels.primaryNav}
      className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 animate-[fade-in_0.25s_ease-out_both] overflow-y-auto bg-bg/98 text-ink backdrop-blur-xl lg:hidden"
    >
      <div className="container-x flex min-h-full flex-col gap-8 pb-10 pt-6">
        <BrandSwitch locale={data.locale} label={data.labels.brandSwitch} className="self-start" />
        <nav aria-label={data.labels.primaryNav}>
          <ul className="divide-y divide-line border-y border-line">
            {data.nav.map((item, i) => (
              <li
                key={item.key}
                className="animate-[rise-in_0.4s_var(--ease-out-expo)_both]"
                style={{ animationDelay: `${40 * i}ms` }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 font-display text-2xl font-semibold tracking-[-0.02em]"
                >
                  {item.label}
                  <ArrowRight className="size-5 text-faint" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-3">{data.labels.services}</p>
          <ul className="grid gap-1">
            {data.services.map((s) => (
              <li key={s.slug}>
                <Link href={s.href} onClick={onClose} className="block rounded-xl px-1 py-2 text-dim hover:text-ink">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto grid gap-3">
          <TrackedLink
            href={data.whatsappHref}
            event="whatsapp_click"
            eventProps={{ location: "mobile_menu" }}
            newTabLabel={data.labels.newTab}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-strong font-semibold text-accent-contrast"
          >
            <WhatsAppIcon className="size-5" />
            {data.labels.whatsappLong}
          </TrackedLink>
          <button
            type="button"
            onClick={() => {
              onClose();
              openNort();
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-2 font-semibold"
          >
            <Sparkles className="size-4 text-accent-ink" aria-hidden />
            {data.labels.askNort}
          </button>
          <div className="flex items-center justify-between pt-2">
            <LocaleSwitch locale={data.locale} label={data.labels.language} alternates={data.alternates} />
            <ThemeToggle labels={{ toLight: data.labels.toLight, toDark: data.labels.toDark }} />
          </div>
        </div>
      </div>
    </div>
  );
}
