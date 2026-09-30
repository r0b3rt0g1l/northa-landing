/**
 * Punto de entrada que se empaqueta con esbuild y se carga en Chromium sin
 * interfaz para renderizar el video del hero cuadro por cuadro.
 * Ver scripts/render-hero-video.mjs.
 */
import { createCerroScene, type CerroScene, type CerroSceneOptions } from "../../lib/three/cerro-scene";

type InitOptions = Omit<CerroSceneOptions, "preserveDrawingBuffer" | "pixelRatio">;

declare global {
  interface Window {
    __cerro: {
      init(options: InitOptions): boolean;
      frame(t: number, quality?: number): string;
    };
  }
}

let scene: CerroScene | null = null;

window.__cerro = {
  init(options) {
    const canvas = document.getElementById("c") as HTMLCanvasElement;
    canvas.width = options.width;
    canvas.height = options.height;
    scene?.dispose();
    scene = createCerroScene(canvas, { ...options, pixelRatio: 1, preserveDrawingBuffer: true });
    return true;
  },
  frame(t, quality = 0.95) {
    if (!scene) throw new Error("init() first");
    scene.render(t);
    return scene.canvas.toDataURL("image/jpeg", quality);
  },
};
