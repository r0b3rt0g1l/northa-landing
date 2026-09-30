"use client";

import { useEffect, useRef, useState } from "react";
import type { CerroLive } from "@/lib/three/cerro-live";
import { skyOf, useCerro } from "@/lib/cerro/store";
import { useCalmMotion } from "@/lib/hooks";

/**
 * Fondo fijo del inicio: el Cerro de la Campana en vivo.
 *
 * 1. Primer pintado: póster del cerro según la hora (CSS + <html data-tod>).
 * 2. Con la página ya quieta: Three.js se descarga y la escena se arma por
 *    partes (cediendo el hilo principal), y sustituye al póster.
 * 3. Al bajar, el cerro y el cielo se funden con el fondo y quedan solo las
 *    luces de la ciudad.
 *
 * Sin WebGL, con "ahorro de datos" o si algo falla, se queda el póster.
 */
export function CerroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<CerroLive | null>(null);
  const fadeRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const dirty = useRef(true);
  const [ready, setReady] = useState(false);
  const calm = useCalmMotion();
  const snapshot = useCerro();
  const sky = skyOf(snapshot);
  // Última foto del estado para usarla al terminar de armar la escena.
  const snapshotRef = useRef(snapshot);
  useEffect(() => {
    snapshotRef.current = snapshot;
  });

  // Mantiene <html data-tod> al día (póster y colores del hero).
  useEffect(() => {
    if (!snapshot.now) return;
    const root = document.documentElement;
    if (root.dataset.tod !== sky.phase) root.dataset.tod = sky.phase;
  }, [sky.phase, snapshot.now]);

  // El cielo de la escena sigue a la hora (o a la fase elegida).
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !snapshot.now) return;
    // Con movimiento reducido el cambio es inmediato (no hay bucle de animación).
    scene.setSky({ tod: sky.tod, morning: sky.morning, cloud: sky.cloud, rain: sky.rain }, calm);
    dirty.current = true;
  }, [sky.tod, sky.morning, sky.cloud, sky.rain, snapshot.now, ready, calm]);

  // 1) Crear la escena cuando la página ya cargó y está en reposo.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;

    let cancelled = false;
    let idleId = 0;
    const start = () => {
      const pause = () =>
        new Promise<void>((resolve) => {
          const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
          if (s?.yield) s.yield().then(resolve);
          else setTimeout(resolve, 0);
        });
      import("@/lib/three/cerro-live")
        .then(async ({ createCerroLive }) => {
          if (cancelled) return;
          const small = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
          const tall = window.innerWidth / window.innerHeight < 1;
          const scene = await createCerroLive(canvas, {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2),
            quality: small ? "low" : "high",
            layout: tall ? "tall" : "wide",
            pause,
          });
          if (cancelled) {
            scene.dispose();
            return;
          }
          const s = skyOf({ ...snapshotRef.current, now: Date.now() });
          scene.setSky({ tod: s.tod, morning: s.morning, cloud: s.cloud, rain: s.rain }, true);
          applyTheme(scene);
          scene.setScrollFade(fadeRef.current);
          scene.render(performance.now() / 1000);
          sceneRef.current = scene;
          setReady(true);
        })
        .catch((err) => console.warn("[cerro] sin WebGL:", err));
    };
    const onLoad = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
      idleId = ric(start, { timeout: 4000 }) as number;
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // 2) Scroll: el cerro se funde y quedan las luces. Tamaño y orientación.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const f = Math.min(1, Math.max(0, window.scrollY / (vh * 0.9)));
      fadeRef.current = f;
      root.style.setProperty("--cerro-fade", f.toFixed(3));
      sceneRef.current?.setScrollFade(f);
      dirty.current = true;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      const scene = sceneRef.current;
      if (scene) {
        const small = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
        scene.resize(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
        scene.setLayout(window.innerWidth / window.innerHeight < 1 ? "tall" : "wide");
      }
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ready]);

  // 3) Tema claro/oscuro: color de fondo con el que se funde la escena.
  useEffect(() => {
    if (!ready) return;
    const obs = new MutationObserver(() => {
      if (sceneRef.current) applyTheme(sceneRef.current);
      dirty.current = true;
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [ready]);

  // 4) Parallax con el mouse (solo escritorio).
  useEffect(() => {
    if (!ready || calm) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ready, calm]);

  // 5) Bucle de render: pausado en segundo plano, más lento cuando solo hay luces.
  useEffect(() => {
    if (!ready) return;
    const small = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const scene = sceneRef.current;
      if (!scene || document.hidden) return;
      const lightsOnly = fadeRef.current > 0.98;
      const fps = calm ? 0 : lightsOnly ? (small ? 20 : 30) : small ? 30 : 60;
      if (calm) {
        if (!dirty.current) return;
      } else if (now - last < 1000 / fps - 2) return;
      last = now;
      dirty.current = false;
      const p = pointer.current;
      p.x += (p.tx - p.x) * 0.05;
      p.y += (p.ty - p.y) * 0.05;
      scene.setPointer(p.x, p.y);
      scene.render(calm ? 20 : now / 1000);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ready, calm]);

  return (
    <div ref={rootRef} className="cerro-backdrop" data-ready={ready ? "true" : undefined} aria-hidden="true">
      <div className="cerro-poster" />
      <canvas ref={canvasRef} className="cerro-canvas" />
      <div className="cerro-veil" />
    </div>
  );
}

function applyTheme(scene: CerroLive) {
  const root = document.documentElement;
  const light = root.dataset.theme === "light";
  const bg = getComputedStyle(root).getPropertyValue("--bg").trim() || (light ? "#faf7f3" : "#0a1124");
  scene.setBackground(bg, light);
}
