/**
 * Página mínima para renderizar un cuadro del Cerro (la usa render-cerro-posters.mjs).
 * Parámetros por query string: w, h, tod, m (mañana), cloud, layout.
 */
import { createCerroLive } from "../../lib/three/cerro-live";

declare global {
  interface Window {
    __ready: boolean;
  }
}

(async () => {
  const q = new URLSearchParams(location.search);
  const canvas = document.getElementById("c") as HTMLCanvasElement;
  const w = Number(q.get("w") || 1920);
  const h = Number(q.get("h") || 1080);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const scene = await createCerroLive(canvas, {
    width: w,
    height: h,
    pixelRatio: 1,
    // Igual que la escena en vivo: en celular (vertical) va la versión ligera.
    quality: q.get("layout") === "tall" ? "low" : "high",
    layout: q.get("layout") === "tall" ? "tall" : "wide",
  });
  scene.setSky({ tod: Number(q.get("tod") || 0), morning: q.get("m") === "1", cloud: Number(q.get("cloud") || 0), rain: false }, true);
  scene.render(12);
  window.__ready = true;
})();
