"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { CerroScene } from "@/lib/three/cerro-scene";
import { loadGsap } from "@/lib/gsap";
import { useCalmMotion, useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { CerroLoader } from "@/components/brand/CerroLoader";

/**
 * Escenario 3D del Cerro de la Campana. Three.js se descarga solo cuando la
 * sección se acerca al viewport (import dinámico) y el render corre solo
 * mientras está en pantalla. El scroll mueve la hora del día: el sol baja,
 * aparecen las curvas de nivel y se encienden el camino y la ciudad.
 */
export function CerroStage({
  canvasLabel,
  fallbackLabel,
  hint,
  dayLabel,
  nightLabel,
  loadingLabel,
  children,
}: {
  canvasLabel: string;
  fallbackLabel: string;
  hint: string;
  dayLabel: string;
  nightLabel: string;
  loadingLabel: string;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<CerroScene | null>(null);
  const progressRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");
  const barRef = useRef<HTMLSpanElement>(null);
  const calm = useCalmMotion();
  const near = useInView(sectionRef, { rootMargin: "800px 0px", once: true });
  const visible = useInView(stickyRef);

  // 1) Crea la escena al acercarse.
  useEffect(() => {
    if (!near || !canvasRef.current) return;
    let cancelled = false;
    const canvas = canvasRef.current;
    const small = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    import("@/lib/three/cerro-scene")
      .then(({ createCerroScene }) => {
        if (cancelled) return;
        const rect = canvas.getBoundingClientRect();
        const scene = createCerroScene(canvas, {
          width: rect.width,
          height: rect.height,
          pixelRatio: Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2),
          quality: small ? "low" : "high",
          timeOfDay: 0.06,
          frameShift: window.innerWidth >= 1024 ? 0.2 : 0,
          orbitAmplitude: 3,
          contourStrength: 1.2,
        });
        scene.setContourReveal(0);
        scene.render(0);
        sceneRef.current = scene;
        setStatus("ready");
      })
      .catch((err) => {
        console.warn("[cerro] WebGL no disponible:", err);
        setStatus("failed");
      });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [near]);

  // 2) Ajusta tamaño.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || status !== "ready") return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      sceneRef.current?.resize(width, height);
      sceneRef.current?.render(performance.now() / 1000);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [status]);

  // 3) Scroll → hora del día, recorrido de cámara y curvas de nivel.
  //    GSAP llega con la escena (al acercarse), no con la carga de la página.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !near) return;
    let cancelled = false;
    let kill: (() => void) | undefined;
    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: calm ? false : 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          if (barRef.current) barRef.current.style.width = `${Math.round(p * 100)}%`;
          const scene = sceneRef.current;
          if (!scene) return;
          scene.setTimeOfDay(0.06 + p * 0.92);
          scene.setJourney(p);
          scene.setContourReveal(Math.min(1, p * 1.7));
          if (calm) scene.render(0);
        },
      });
      kill = () => st.kill();
    });
    return () => {
      cancelled = true;
      kill?.();
    };
  }, [calm, status, near]);

  // 4) Bucle de render solo en pantalla y sin "reducir movimiento".
  useEffect(() => {
    if (status !== "ready" || !visible || calm) return;
    let raf = 0;
    const loop = (now: number) => {
      const scene = sceneRef.current;
      if (scene) {
        const p = pointer.current;
        p.x += (p.tx - p.x) * 0.06;
        p.y += (p.ty - p.y) * 0.06;
        scene.setPointer(p.x, p.y);
        scene.render(now / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [status, visible, calm]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section
      ref={sectionRef}
      id="hermosillo"
      aria-labelledby="hermosillo-title"
      className="relative h-[230vh] bg-[#060a16] text-white"
    >
      <div ref={stickyRef} className="sticky top-0 h-[100svh] overflow-hidden" onPointerMove={onPointerMove}>
        {/* Respaldo: el mismo cerro en imagen fija */}
        <picture className={cn("absolute inset-0 transition-opacity duration-700", status === "ready" ? "opacity-0" : "opacity-100")}>
          <source type="image/avif" srcSet="/video/cerro-1920x1080-poster.avif" />
          <source type="image/webp" srcSet="/video/cerro-1920x1080-poster.webp" />
          <img
            src="/video/cerro-1920x1080-poster.jpg"
            alt={status === "failed" ? fallbackLabel : ""}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
            width={1920}
            height={1080}
          />
        </picture>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={canvasLabel}
          className={cn("absolute inset-0 size-full transition-opacity duration-1000", status === "ready" ? "opacity-100" : "opacity-0")}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(6_10_22/0.78)_0%,rgb(6_10_22/0.3)_45%,transparent_70%)] max-lg:bg-[linear-gradient(180deg,transparent_35%,rgb(6_10_22/0.9)_100%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />

        <div className="container-x relative flex h-full items-end pb-20 lg:items-center lg:pb-6 lg:pt-20">{children}</div>

        {/* Mientras llega Three.js: el loader del Cerro sobre la imagen fija */}
        {near && status === "idle" && (
          <CerroLoader size={36} label={loadingLabel} className="absolute right-5 top-24 text-white md:right-8" />
        )}

        {/* Indicador de hora del día */}
        <div className="absolute bottom-6 right-5 flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/70 md:right-8">
          <Sun className="size-3.5" aria-hidden />
          <span className="sr-only">{dayLabel}</span>
          <span className="relative h-1 w-28 overflow-hidden rounded-full bg-white/15" aria-hidden>
            <span
              ref={barRef}
              className="absolute inset-y-0 left-0 w-0 rounded-full bg-gradient-to-r from-amber-300 via-northa to-[#3d5aa8]"
            />
          </span>
          <Moon className="size-3.5" aria-hidden />
          <span className="sr-only">{nightLabel}</span>
          <span className="hidden text-white/50 lg:inline">· {hint}</span>
        </div>
      </div>
    </section>
  );
}
