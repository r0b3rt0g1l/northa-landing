import * as THREE from "three";
import {
  CERRO,
  CITY,
  STAR_NORTH,
  STAR_POINTS,
  cityLights,
  fromCity,
  toCity,
  createNoise2D,
  createTerrain,
  fbm,
  mulberry32,
  type Terrain,
} from "./terrain";

/**
 * El Cerro de la Campana en vivo (hero del inicio).
 *
 * - El cielo sigue la hora real de Hermosillo (amanecer, día, atardecer, noche)
 *   y las nubes, el clima actual (lib/cerro/sky-time.ts + /api/clima).
 * - Referencias: fotos del cerro (Wikipedia, Sonora Star, Noro): campana rocosa
 *   de granito con matorral (palo verde), camino empedrado en espiral (1964)
 *   con muro blanco y lámparas, explanada con mirador y tres torres de antenas
 *   rojo y blanco (1968). De noche la parte alta se ilumina en tono cálido.
 * - Al hacer scroll, el cerro y el cielo se funden con el fondo de la página y
 *   solo quedan las luces de la ciudad (`setScrollFade`).
 *
 * Unidades: 1 ≈ 10 m. La cámara mira desde el poniente (−x) hacia el oriente.
 */

export interface CerroLiveOptions {
  width: number;
  height: number;
  pixelRatio?: number;
  quality?: "high" | "low";
  /** "wide": cerro a la derecha (texto a la izquierda). "tall": cerro abajo, centrado. */
  layout?: "wide" | "tall";
  /**
   * Cede el hilo principal entre etapas pesadas (p. ej. `scheduler.yield`).
   * Así construir la escena nunca bloquea la página más de unos milisegundos.
   */
  pause?: () => Promise<void>;
}

export interface SkyInput {
  /** 0 día · 0.45 hora dorada · 0.72 hora azul · 1 noche */
  tod: number;
  morning: boolean;
  /** 0–1 */
  cloud: number;
  rain: boolean;
}

export interface CerroLive {
  readonly canvas: HTMLCanvasElement;
  setSky(sky: SkyInput, instant?: boolean): void;
  /** 0 = cerro completo · 1 = solo las luces de la ciudad sobre el fondo. */
  setScrollFade(f: number): void;
  setBackground(color: string, light: boolean): void;
  setPointer(x: number, y: number): void;
  setLayout(layout: "wide" | "tall"): void;
  render(timeSeconds: number): void;
  resize(width: number, height: number, pixelRatio?: number): void;
  dispose(): void;
}

/* ------------------------------------------------------------------ */
/* Paleta por hora del día (naranja y azul marino en tonos pastel)     */
/* ------------------------------------------------------------------ */

interface Palette {
  zenith: number;
  mid: number;
  horizon: number;
  haze: number;
  glow: number;
  glowStrength: number;
  fog: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  sun: number;
  sunIntensity: number;
  exposure: number;
  lights: number;
  stars: number;
  flood: number;
  cloudLit: number;
  cloudShade: number;
  mountain: number;
  tower: number;
}

/** Atardecer (y día/noche). Los tonos de amanecer van aparte, abajo. */
const PALETTES: [number, Palette][] = [
  [
    0,
    {
      zenith: 0x2f6cbd,
      mid: 0x8ab6e0,
      horizon: 0xd6e5f1,
      haze: 0xd9cbb4,
      glow: 0xfff4de,
      glowStrength: 0.2,
      fog: 0xcbd9e5,
      hemiSky: 0xd6e7fb,
      hemiGround: 0xa48a6c,
      hemiIntensity: 1.25,
      sun: 0xfff2de,
      sunIntensity: 2.8,
      exposure: 1.12,
      lights: 0,
      stars: 0,
      flood: 0,
      cloudLit: 0xffffff,
      cloudShade: 0xbcc8d8,
      mountain: 0x9fadc0,
      tower: 1,
    },
  ],
  [
    0.45,
    {
      zenith: 0x2c3e74,
      mid: 0xf0bd8c,
      horizon: 0xff9f5e,
      haze: 0xd99873,
      glow: 0xff9d5c,
      glowStrength: 1.15,
      fog: 0xd9a080,
      hemiSky: 0xffcfa8,
      hemiGround: 0x6c5142,
      hemiIntensity: 0.95,
      sun: 0xffb98a,
      sunIntensity: 2.2,
      exposure: 1.1,
      lights: 0.22,
      stars: 0.03,
      flood: 0.12,
      cloudLit: 0xffb98e,
      cloudShade: 0x5f6a8e,
      mountain: 0x545c7c,
      tower: 0.85,
    },
  ],
  [
    0.72,
    {
      zenith: 0x141d45,
      mid: 0x34467f,
      horizon: 0xf09a5e,
      haze: 0x2e3354,
      glow: 0xff9656,
      glowStrength: 1.25,
      fog: 0x2c3354,
      hemiSky: 0x5068a3,
      hemiGround: 0x1a1c2c,
      hemiIntensity: 0.6,
      sun: 0xffb08a,
      sunIntensity: 0.5,
      exposure: 1.12,
      lights: 0.88,
      stars: 0.6,
      flood: 0.6,
      cloudLit: 0xe89a78,
      cloudShade: 0x303a62,
      mountain: 0x262d4f,
      tower: 0.45,
    },
  ],
  [
    1,
    {
      zenith: 0x060b1c,
      mid: 0x101b3d,
      horizon: 0x1d2b55,
      haze: 0x0c1122,
      glow: 0x3a4d7e,
      glowStrength: 0.5,
      fog: 0x10182f,
      hemiSky: 0x2c3f78,
      hemiGround: 0x080a12,
      hemiIntensity: 0.4,
      sun: 0xa9bbe3,
      sunIntensity: 0.35,
      exposure: 1.15,
      lights: 1,
      stars: 1,
      flood: 0.8,
      cloudLit: 0x2c3759,
      cloudShade: 0x141b33,
      mountain: 0x131a32,
      tower: 0.3,
    },
  ],
];

/** Amanecer: más claro y dorado que el atardecer (mismas claves de tiempo). */
const DAWN: Record<number, Partial<Palette>> = {
  0.45: {
    zenith: 0x5a78b4,
    mid: 0xdcc3ae,
    horizon: 0xffcf9a,
    haze: 0xd6b79a,
    glow: 0xffd49e,
    glowStrength: 1,
    fog: 0xd7c1aa,
    hemiSky: 0xffe2c4,
    hemiGround: 0x75604e,
    sun: 0xffd2a4,
    cloudLit: 0xffdcbc,
    cloudShade: 0x8a92ab,
    mountain: 0x7e869f,
  },
  0.72: {
    zenith: 0x1a2550,
    mid: 0x3f5590,
    horizon: 0xd9a07a,
    glow: 0xf2b07e,
    glowStrength: 0.9,
    haze: 0x353b5c,
    fog: 0x333a5c,
    cloudLit: 0xd6a58c,
    cloudShade: 0x353f68,
  },
};
const PALETTES_DAWN: [number, Palette][] = PALETTES.map(([t, p]) => [t, { ...p, ...DAWN[t] }]);

const COLOR_KEYS = new Set<keyof Palette>([
  "zenith",
  "mid",
  "horizon",
  "haze",
  "glow",
  "fog",
  "hemiSky",
  "hemiGround",
  "sun",
  "cloudLit",
  "cloudShade",
  "mountain",
]);

function smooth(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

/** Mezcla dos colores en sRGB (perceptual): sin tonos lodosos entre cálido y frío. */
function mixHex(a: number, b: number, k: number) {
  const ch = (v: number, sh: number) => (v >> sh) & 255;
  const m = (sh: number) => Math.round(ch(a, sh) + (ch(b, sh) - ch(a, sh)) * k);
  return (m(16) << 16) | (m(8) << 8) | m(0);
}

function mixPalette(a: Palette, b: Palette, k: number): Palette {
  const out = { ...a };
  (Object.keys(a) as (keyof Palette)[]).forEach((key) => {
    out[key] = COLOR_KEYS.has(key) ? mixHex(a[key], b[key], k) : a[key] + (b[key] - a[key]) * k;
  });
  return out;
}

function sampleList(list: [number, Palette][], t: number) {
  const x = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < list.length - 2 && x > list[i + 1][0]) i++;
  const [t0, a] = list[i];
  const [t1, b] = list[i + 1];
  return mixPalette(a, b, smooth((x - t0) / (t1 - t0)));
}

/** Paleta de la hora: `tod` (0 día → 1 noche) y `morning` (0 tarde → 1 mañana). */
function paletteAt(tod: number, morning: number): Palette {
  const dusk = sampleList(PALETTES, tod);
  if (morning <= 0.001) return dusk;
  return mixPalette(dusk, sampleList(PALETTES_DAWN, tod), morning);
}

/* ------------------------------------------------------------------ */
/* Texturas generadas en canvas                                        */
/* ------------------------------------------------------------------ */

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function glowTexture() {
  return canvasTexture(128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.16, "rgba(255,255,255,0.6)");
    g.addColorStop(0.5, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function cloudTexture(seed: number) {
  const rand = mulberry32(seed);
  return canvasTexture(256, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    const puffs = 16 + Math.floor(rand() * 10);
    for (let i = 0; i < puffs; i++) {
      const x = s * (0.18 + rand() * 0.64);
      const y = s * (0.42 + (rand() - 0.5) * 0.22);
      const r = s * (0.08 + rand() * 0.16);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(0.6, "rgba(255,255,255,0.22)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function starTexture() {
  return canvasTexture(256, (ctx, s) => {
    const k = s / 200;
    const path = (pts: [number, number][]) => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * k, y * k) : ctx.moveTo(x * k, y * k)));
      ctx.closePath();
    };
    ctx.shadowColor = "rgba(255,174,130,0.9)";
    ctx.shadowBlur = 18 * k;
    path(STAR_POINTS);
    ctx.fillStyle = "#F7F4EF";
    ctx.fill();
    ctx.shadowBlur = 0;
    const g = ctx.createLinearGradient(78 * k, 18 * k, 121 * k, 100 * k);
    g.addColorStop(0, "#FFD2B8");
    g.addColorStop(1, "#FF9F6E");
    path(STAR_NORTH);
    ctx.fillStyle = g;
    ctx.fill();
  });
}

/* ------------------------------------------------------------------ */
/* Shaders                                                              */
/* ------------------------------------------------------------------ */

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uHaze;
  uniform vec3 uGlowColor;
  uniform vec3 uGlowDir;
  uniform float uGlowStrength;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uSunDisk;
  uniform vec3 uMoonDir;
  uniform float uMoon;
  varying vec3 vDir;
  vec3 toG(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }
  vec3 toL(vec3 c) { return pow(max(c, 0.0), vec3(2.2)); }
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    // Degradado mezclado en espacio perceptual: sin tonos lodosos ni rosados.
    // La cámara casi no mira hacia arriba (el cuadro llega a ~15° sobre el
    // horizonte), así que todo el degradado vive en esa franja.
    // Tono intermedio: el cenit aclarado con la luminancia del medio (gris
    // azulado). Así el paso de naranja a marino no cruza por malva/rosa.
    // Otro intermedio abajo (horizonte → crema neutra): de naranja a azul pasa
    // por un tono cálido apagado, nunca por rosa.
    vec3 hor = toG(uHorizon);
    vec3 mid = toG(uMid);
    vec3 lower = mix(hor, vec3(dot(hor, vec3(0.3, 0.55, 0.15))) * vec3(1.04, 1.0, 0.86), 0.6);
    vec3 upper = mix(toG(uZenith), vec3(dot(mid, vec3(0.3, 0.55, 0.15))), 0.42);
    vec3 col = mix(hor, lower, smoothstep(-0.005, 0.035, h));
    col = mix(col, mid, smoothstep(0.02, 0.085, h));
    col = mix(col, upper, smoothstep(0.06, 0.15, h));
    col = mix(col, toG(uZenith), smoothstep(0.11, 0.3, h));
    col = mix(toG(uHaze), col, smoothstep(-0.08, 0.006, h));
    col = toL(col);
    vec3 hz = normalize(vec3(d.x, 0.0, d.z) + 1e-5);
    float g = max(dot(hz, normalize(vec3(uGlowDir.x, 0.0, uGlowDir.z))), 0.0);
    // Resplandor pegado al horizonte (si sube, el naranja sobre el azul se ve malva).
    float band = exp(-max(h, 0.0) * 55.0) * smoothstep(-0.05, 0.0, h);
    float halo = exp(-max(h, 0.0) * 32.0) * pow(g, 6.0) * 0.22;
    col += uGlowColor * uGlowStrength * (band * (0.3 + 0.7 * pow(g, 2.5)) + halo);
    // Sol: disco y resplandor (solo cuando está en cuadro, al amanecer).
    float sd = max(dot(d, normalize(uSunDir)), 0.0);
    col += uSunColor * uSunDisk * (smoothstep(0.9993, 0.9997, sd) * 6.0 + pow(sd, 350.0) * 1.1 + pow(sd, 24.0) * 0.08);
    // Luna.
    float md = max(dot(d, normalize(uMoonDir)), 0.0);
    col += vec3(0.86, 0.9, 1.0) * uMoon * (smoothstep(0.99955, 0.99975, md) * 2.4 + pow(md, 120.0) * 0.12);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const pointsVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aFreq;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uTwinkle;
  uniform float uMaxSize;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mv.z, 0.1);
    float tw = 1.0 - uTwinkle + uTwinkle * (0.5 + 0.5 * sin(uTime * (0.6 + aFreq * 0.9) + aPhase * 6.2831853));
    float fog = 1.0 - smoothstep(uFogNear, uFogFar, dist);
    vAlpha = uIntensity * tw * (0.3 + 0.7 * fog);
    vColor = aColor;
    gl_PointSize = clamp(aSize * uPixelRatio * uScale / dist, 1.0, uMaxSize * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;

const pointsFragment = /* glsl */ `
  uniform float uLightTheme;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a * vAlpha < 0.01) discard;
    vec3 c = mix(vColor, vec3(0.86, 0.45, 0.25) * (0.75 + 0.25 * vColor.g), uLightTheme);
    gl_FragColor = vec4(c, a * vAlpha * (1.0 - 0.35 * uLightTheme));
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ */
/* Ciudad en el shader: manzanas, lotes, azoteas y alumbrado            */
/* ------------------------------------------------------------------ */

/** Azoteas (sRGB): blanco, gris claro, impermeabilizante rojo, beige, concreto. */
const ROOF_TONES = [0xf2f0ec, 0xd9d7d3, 0xb07a63, 0xe3d4bc, 0xa9adb1];
/** Proporción acumulada de cada tono (las casas 3D usan la misma). */
const ROOF_CUTS = [0.45, 0.7, 0.84, 0.94, 1];

function glslColor(hex: number) {
  const c = new THREE.Color(hex); // sRGB → lineal
  return `vec3(${c.r.toFixed(4)}, ${c.g.toFixed(4)}, ${c.b.toFixed(4)})`;
}

/**
 * Funciones GLSL de la ciudad (mismos números que CITY en terrain.ts).
 * - cityDay: albedo de día (azoteas, patios, árboles, calles) con nivel de
 *   detalle según el tamaño del pixel, para que de lejos no haga moiré.
 * - cityNight: alumbrado (postes de sodio cada 0.7, avenidas más blancas y
 *   juntas) y ventanas encendidas.
 */
const cityGLSL = /* glsl */ `
  const float CITY_ROT = ${CITY.rot};
  const vec2 CITY_BLOCK = vec2(${CITY.bx}, ${CITY.bz});
  const float CITY_STREET = ${CITY.street};
  const float CITY_AVENUE = ${CITY.avenue.toFixed(1)};
  const float CITY_LOTS = ${CITY.lots.toFixed(1)};
  const float CITY_LAMP = ${CITY.lamp};
  float h12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vn(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(h12(i), h12(i + vec2(1.0, 0.0)), u.x), mix(h12(i + vec2(0.0, 1.0)), h12(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  vec2 cityGrid(vec2 p) {
    float c = cos(CITY_ROT);
    float s = sin(CITY_ROT);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c) / CITY_BLOCK;
  }
  // Distancia (mundo) al eje de la calle más cercana: x → transversales, y → largas.
  vec2 cityStreetDist(vec2 q) { return abs(fract(q + 0.5) - 0.5) * CITY_BLOCK; }
  vec2 cityAvenue(vec2 q) {
    vec2 n = floor(q + 0.5);
    return vec2(1.0 - step(0.5, mod(n.x, CITY_AVENUE)), 1.0 - step(0.5, mod(n.y, CITY_AVENUE)));
  }
  // Lote: (u a lo largo 0–1, v desde la banqueta 0–1, fila, -) e id del lote.
  vec4 cityLot(vec2 q, out vec2 lotId) {
    vec2 cell = floor(q);
    vec2 f = fract(q);
    float row = step(0.5, f.y);
    float usable = CITY_BLOCK.x - 2.0 * CITY_STREET;
    float lx = clamp((f.x * CITY_BLOCK.x - CITY_STREET) / usable, 0.0, 0.9999) * CITY_LOTS;
    float depth = (row < 0.5 ? f.y : 1.0 - f.y) * CITY_BLOCK.y - CITY_STREET;
    lotId = cell * vec2(CITY_LOTS, 2.0) + vec2(floor(lx), row);
    return vec4(fract(lx), depth / (0.5 * CITY_BLOCK.y - CITY_STREET), row, 0.0);
  }
  vec3 cityRoof(float t) {
    vec3 c = ${glslColor(ROOF_TONES[0])};
    c = mix(c, ${glslColor(ROOF_TONES[1])}, step(${ROOF_CUTS[0]}, t));
    c = mix(c, ${glslColor(ROOF_TONES[2])}, step(${ROOF_CUTS[1]}, t));
    c = mix(c, ${glslColor(ROOF_TONES[3])}, step(${ROOF_CUTS[2]}, t));
    c = mix(c, ${glslColor(ROOF_TONES[4])}, step(${ROOF_CUTS[3]}, t));
    return c;
  }
  // px = tamaño de un pixel en unidades de mundo.
  vec3 cityDay(vec2 p, float px) {
    vec2 q = cityGrid(p);
    vec2 d = cityStreetDist(q);
    vec2 hw = CITY_STREET * (1.0 + cityAvenue(q) * 0.8);
    float aa = max(px, 0.002);
    float street = max(1.0 - smoothstep(hw.x - aa, hw.x + aa, d.x), 1.0 - smoothstep(hw.y - aa, hw.y + aa, d.y));
    vec2 lotId;
    vec4 lot = cityLot(q, lotId);
    float lotDepth = 0.55 + 0.25 * h12(lotId + 4.1);
    float house = step(0.22, h12(lotId + 0.37)) * step(0.09, lot.x) * step(lot.x, 0.91) * step(0.07, lot.y) * step(lot.y, lotDepth);
    vec3 roof = cityRoof(h12(lotId + 8.3)) * (0.94 + 0.12 * h12(lotId + 2.2));
    vec3 yard = mix(${glslColor(0xa39580)}, ${glslColor(0x8f8f6e)}, vn(p * 2.3));
    float tn = vn(p * 4.5 + 11.0) * 0.6 + vn(p * 10.0 + 3.0) * 0.4;
    float tree = smoothstep(0.6, 0.68, tn) * (1.0 - house);
    vec3 col = mix(yard, roof, house);
    col = mix(col, ${glslColor(0x4d5e3a)}, tree);
    // De lejos: color promedio de la manzana (con variación por colonias).
    float area = (0.9 + 0.2 * vn(p * 0.09 + 5.0)) * (0.88 + 0.24 * vn(p * 0.8 + 1.3));
    col = mix(col, ${glslColor(0xa8a390)} * area, smoothstep(0.09, 0.26, px));
    float far = smoothstep(0.35, 0.9, px);
    col = mix(col, mix(${glslColor(0x6c6d70)}, ${glslColor(0x8b8b8c)}, smoothstep(0.08, 0.3, px)), street * (1.0 - far) * (1.0 - 0.45 * smoothstep(0.12, 0.35, px)));
    return mix(col, ${glslColor(0xa19d8e)} * area, far);
  }
  vec3 cityNight(vec2 p, float px, float density) {
    vec2 q = cityGrid(p);
    vec2 d = cityStreetDist(q);
    vec2 av = cityAvenue(q);
    float oddY = mod(floor(q.y + 0.5), 2.0);
    float sx = CITY_LAMP * (1.0 - av.y * 0.2);
    float tx = q.x * CITY_BLOCK.x / sx - 0.5 * oddY;
    float ix = floor(tx + 0.5);
    float jx = h12(vec2(ix, floor(q.y + 0.5)) + 3.3);
    float ax = (tx - ix - (jx - 0.5) * 0.3) * sx;
    float sy = CITY_LAMP * (1.0 - av.x * 0.2);
    float ty = q.y * CITY_BLOCK.y / sy;
    float iy = floor(ty + 0.5);
    float jy = h12(vec2(floor(q.x + 0.5), iy) + 7.9);
    float ay = (ty - iy - (jy - 0.5) * 0.3) * sy;
    // El punto crece con la distancia (sin parpadeo sub-pixel) y conserva energía.
    float sig = max(0.05, px * 0.85);
    float norm = 0.0025 / (sig * sig);
    // Cada tramo de calle con su propio brillo (algunos apagados): nada de "papel cuadriculado".
    float segX = h12(vec2(floor(q.x), floor(q.y + 0.5)) + 13.7);
    float segY = h12(vec2(floor(q.x + 0.5), floor(q.y)) + 29.1);
    float bx = step(0.12, segX) * (0.45 + 0.75 * segX) * step(0.1, jx) * (0.7 + 0.6 * jx);
    float by = step(0.12, segY) * (0.45 + 0.75 * segY) * step(0.1, jy) * (0.7 + 0.6 * jy);
    // Avenidas: más brillo, pero cada una distinta.
    float avX = 0.8 + 0.7 * h12(vec2(floor(q.y + 0.5), 1.7));
    float avY = 0.8 + 0.7 * h12(vec2(floor(q.x + 0.5), 5.3));
    float lx = exp(-(ax * ax + d.y * d.y) / (sig * sig)) * mix(bx, avX, av.y);
    float ly = exp(-(ay * ay + d.x * d.x) / (sig * sig)) * mix(by, avY, av.x);
    vec3 sodium = ${glslColor(0xffa25a)};
    vec3 led = ${glslColor(0xffcf9c)};
    vec3 col = (mix(sodium, led, av.y) * lx + mix(sodium, led, av.x) * ly) * norm;
    // Charco de luz alrededor de cada poste (ilumina la calle).
    float ps = max(0.2, px * 0.85);
    float pn = 0.04 / (ps * ps);
    float px2 = exp(-(ax * ax + d.y * d.y) / (ps * ps)) * mix(bx, avX, av.y);
    float py2 = exp(-(ay * ay + d.x * d.x) / (ps * ps)) * mix(by, avY, av.x);
    col += sodium * (px2 + py2) * pn * 0.1;
    // Ventanas encendidas en algunas casas.
    vec2 lotId;
    vec4 lot = cityLot(q, lotId);
    float lit = step(0.22, h12(lotId + 0.37)) * step(0.7, h12(lotId + 5.7));
    vec2 wv = vec2((lot.x - 0.5) * 0.43, (lot.y - 0.3) * 0.6);
    float ws = max(0.035, px * 0.85);
    col += ${glslColor(0xffd9a0)} * exp(-dot(wv, wv) / (ws * ws)) * (0.001225 / (ws * ws)) * lit * 0.55;
    return col * density;
  }
  float cityDensity(vec2 p) { return 0.5 + 0.5 * smoothstep(0.2, 0.75, vn(p * 0.035 + 7.0)); }
`;

/* ------------------------------------------------------------------ */
/* Escena                                                              */
/* ------------------------------------------------------------------ */

export async function createCerroLive(canvas: HTMLCanvasElement, options: CerroLiveOptions): Promise<CerroLive> {
  const pause = options.pause ?? (() => Promise.resolve());
  const quality = options.quality ?? "high";
  const hi = quality === "high";
  let layout = options.layout ?? "wide";
  let width = options.width;
  let height = options.height;
  let pixelRatio = options.pixelRatio ?? 1;
  let pointerX = 0;
  let pointerY = 0;
  let fade = 0;
  let lastT = 0;

  // Cielo actual (interpolado) y objetivo.
  const skyNow = { tod: 1, morning: 0, cloud: 0, rain: 0 };
  const skyTarget = { tod: 1, morning: 0, cloud: 0, rain: 0 };

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: hi,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // "Neutral" (Khronos PBR Neutral) respeta el tono: con ACES el azul marino se
  // corría a morado y el naranja pastel se lavaba.
  renderer.toneMapping = THREE.NeutralToneMapping;

  const world = new THREE.Scene();
  const top = new THREE.Scene();
  await pause();
  const terrain: Terrain = createTerrain();
  await pause();
  const rand = mulberry32(2026);
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o);
    return o;
  };
  const glowTex = track(glowTexture());

  /* ---------- Cielo ---------- */
  const skyU = {
    uZenith: { value: new THREE.Color() },
    uMid: { value: new THREE.Color() },
    uHorizon: { value: new THREE.Color() },
    uHaze: { value: new THREE.Color() },
    uGlowColor: { value: new THREE.Color() },
    uGlowDir: { value: new THREE.Vector3(1, 0.05, -0.2) },
    uGlowStrength: { value: 1 },
    uSunDir: { value: new THREE.Vector3(1, 0.1, 0) },
    uSunColor: { value: new THREE.Color(0xfff0d8) },
    uSunDisk: { value: 0 },
    uMoonDir: { value: new THREE.Vector3(0.55, 0.62, -0.56).normalize() },
    uMoon: { value: 0 },
  };
  const sky = new THREE.Mesh(
    track(new THREE.SphereGeometry(900, 48, 24)),
    track(
      new THREE.ShaderMaterial({
        uniforms: skyU,
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    ),
  );
  sky.renderOrder = -10;
  world.add(sky);

  /* ---------- Estrellas ---------- */
  const pointsMaterial = (u: Record<string, { value: unknown }>, opts: Partial<THREE.ShaderMaterialParameters> = {}) =>
    track(
      new THREE.ShaderMaterial({
        uniforms: { uLightTheme: { value: 0 }, uMaxSize: { value: 10 }, ...u },
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
        ...opts,
      }),
    );
  const pointsGeometry = (count: number, fill: (i: number, set: (p: number[], size: number, c: THREE.Color, phase: number, freq: number) => void) => void) => {
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const color = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const freq = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      fill(i, (p, s, c, ph, fr) => {
        pos.set(p, i * 3);
        size[i] = s;
        color.set([c.r, c.g, c.b], i * 3);
        phase[i] = ph;
        freq[i] = fr;
      });
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    g.setAttribute("aFreq", new THREE.BufferAttribute(freq, 1));
    return g;
  };

  const starU = {
    uTime: { value: 0 },
    uIntensity: { value: 1 },
    uPixelRatio: { value: pixelRatio },
    uScale: { value: 820 },
    uFogNear: { value: 5000 },
    uFogFar: { value: 6000 },
    uTwinkle: { value: 0.5 },
  };
  const starTints = [new THREE.Color(0xffe6d6), new THREE.Color(0xdbe5ff), new THREE.Color(0xffffff)];
  const skyStars = new THREE.Points(
    pointsGeometry(hi ? 1500 : 700, (_, set) => {
      const theta = rand() * Math.PI * 2;
      const y = 0.05 + Math.pow(rand(), 0.7) * 0.95;
      const r = Math.sqrt(1 - y * y);
      const w = rand();
      set(
        [Math.cos(theta) * r * 700, y * 700, Math.sin(theta) * r * 700],
        0.6 + Math.pow(rand(), 3) * 2.2,
        starTints[w < 0.15 ? 0 : w < 0.3 ? 1 : 2],
        rand(),
        rand() * 3,
      );
    }),
    pointsMaterial(starU),
  );
  skyStars.renderOrder = -9;
  world.add(skyStars);

  /* ---------- Nubes (según el clima) ---------- */
  const cloudTextures = [track(cloudTexture(7)), track(cloudTexture(19)), track(cloudTexture(31))];
  const clouds: THREE.Sprite[] = [];
  {
    const n = hi ? 16 : 9;
    for (let i = 0; i < n; i++) {
      const mat = track(
        new THREE.SpriteMaterial({
          map: cloudTextures[i % cloudTextures.length],
          transparent: true,
          depthWrite: false,
          fog: false,
          opacity: 0,
        }),
      );
      const s = new THREE.Sprite(mat);
      // Solo en la mitad del cielo que ve la cámara (hacia el oriente).
      const az = (rand() - 0.5) * 1.5;
      const dist = 380 + rand() * 260;
      const el = 0.05 + rand() * 0.22;
      s.position.set(Math.cos(az) * dist, Math.sin(el) * dist + 20, Math.sin(az) * dist);
      const w = 120 + rand() * 150;
      s.scale.set(w, w * (0.36 + rand() * 0.2), 1);
      s.userData = { threshold: rand(), drift: (rand() - 0.5) * 0.6, baseZ: s.position.z };
      s.renderOrder = -8;
      world.add(s);
      clouds.push(s);
    }
  }

  /* ---------- Terreno: cerro detallado + llanura ---------- */
  const PATCH = 64;
  const patchSegs = hi ? 230 : 190; // el camino (0.27) necesita celdas chicas o sale dentado
  const patchGeo = track(new THREE.PlaneGeometry(PATCH, PATCH, patchSegs, patchSegs));
  patchGeo.rotateX(-Math.PI / 2);
  const plainSize = 768;
  const plainSegs = 96; // celdas de 8 → coinciden con el borde del cerro (±32)
  const plainGeo = track(new THREE.PlaneGeometry(plainSize, plainSize, plainSegs, plainSegs));
  plainGeo.rotateX(-Math.PI / 2);

  const colRock = new THREE.Color(0x857a70);
  const colRockDark = new THREE.Color(0x4f463f);
  const colSoil = new THREE.Color(0x9c8469);
  const colBrush = new THREE.Color(0x6d7248);
  const colPlain = new THREE.Color(0xc2ad90);
  const colRoad = new THREE.Color(0xcfc6b8);
  const tmpC = new THREE.Color();
  const jitterNoise = createNoise2D(77);

  async function shapeGround(geo: THREE.BufferGeometry, isPatch: boolean) {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const hillAttr = new Float32Array(pos.count);
    const roadAttr = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      if (i % 2500 === 0) await pause();
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const inside = Math.abs(x) < PATCH / 2 - 0.01 && Math.abs(z) < PATCH / 2 - 0.01;
      let y = terrain.height(x, z);
      if (!isPatch && inside) y -= 0.6; // la llanura queda debajo del cerro detallado
      pos.setY(i, y);
      hillAttr[i] = terrain.hillMask(x, z);
      roadAttr[i] = isPatch ? 1 - smoothstepJS(CERRO.roadWidth * 0.45, CERRO.roadWidth * 0.75, terrain.roadDistance(x, z)) : 0;
    }
    geo.computeVertexNormals();
    const nor = geo.attributes.normal as THREE.BufferAttribute;
    // Oclusión aproximada por curvatura: grietas más oscuras, crestas más claras.
    const row = (isPatch ? patchSegs : plainSegs) + 1;
    const ao = new Float32Array(pos.count).fill(1);
    if (isPatch) {
      for (let i = row; i < pos.count - row; i++) {
        const c = i % row;
        if (c === 0 || c === row - 1) continue;
        const lap = (pos.getY(i - 1) + pos.getY(i + 1) + pos.getY(i - row) + pos.getY(i + row)) / 4 - pos.getY(i);
        ao[i] = Math.min(1.12, Math.max(0.55, 1 - lap * 3.2));
      }
    }
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      if (i % 4000 === 0) await pause();
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const m = hillAttr[i];
      const slope = 1 - nor.getY(i);
      const rockiness = terrain.rockiness(x, z);
      const j = jitterNoise(x * 0.9, z * 0.9) * 0.08;
      if (m < 0.04) {
        tmpC.copy(colPlain);
      } else {
        // Tierra con matorral abajo; granito expuesto en crestas y pendientes fuertes.
        const brush = smoothstepJS(0.55, 0.1, rockiness) * (1 - smoothstepJS(0.25, 0.6, slope)) * 0.75;
        tmpC.copy(colSoil).lerp(colBrush, brush);
        tmpC.lerp(colRock, smoothstepJS(0.25, 0.75, rockiness + slope * 0.6));
        tmpC.lerp(colRockDark, smoothstepJS(0.45, 0.9, slope) * 0.55);
        tmpC.lerp(colPlain, 1 - smoothstepJS(0.04, 0.25, m));
      }
      tmpC.multiplyScalar((1 + j) * ao[i]);
      if (roadAttr[i] > 0) tmpC.lerp(colRoad, roadAttr[i]);
      colors.set([tmpC.r, tmpC.g, tmpC.b], i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aHill", new THREE.BufferAttribute(hillAttr, 1));
    geo.setAttribute("aRoad", new THREE.BufferAttribute(roadAttr, 1));
  }
  await shapeGround(patchGeo, true);
  await shapeGround(plainGeo, false);
  await pause();

  const groundU = {
    uTime: { value: 0 },
    uLights: { value: 1 },
    uFlood: { value: 1 },
    uDay: { value: 0 },
    uMaxH: { value: terrain.summit.y },
    uStreetColor: { value: new THREE.Color(0xffb36b) },
    uFloodColor: { value: new THREE.Color(0xffd29a) },
  };
  const groundMat = track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }));
  groundMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, groundU);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute float aHill;\nattribute float aRoad;\nvarying float vHill;\nvarying float vRoad;\nvarying vec3 vWorldPos;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvHill = aHill;\nvRoad = aRoad;\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uTime;
        uniform float uLights;
        uniform float uFlood;
        uniform float uDay;
        uniform float uMaxH;
        uniform vec3 uStreetColor;
        uniform vec3 uFloodColor;
        varying float vHill;
        varying float vRoad;
        varying vec3 vWorldPos;
        ${cityGLSL}`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        {
          vec2 p = vWorldPos.xz;
          // Textura de roca y matorral (sin imágenes: ruido en espacio de mundo).
          float n = vn(p * 2.6) * 0.55 + vn(p * 8.0) * 0.3 + vn(p * 21.0) * 0.15;
          float onHill = smoothstep(0.05, 0.3, vHill);
          diffuseColor.rgb *= mix(1.0, 0.68 + 0.62 * n, onHill * (1.0 - vRoad * 0.7));
          // Empedrado del camino.
          diffuseColor.rgb *= 1.0 - vRoad * (vn(p * 30.0) * 0.12);
          // La ciudad: manzanas, azoteas, patios con árboles y calles.
          float px = length(fwidth(p));
          float dist = length(p);
          float cityFade = smoothstep(12.5, 17.0, dist) * (1.0 - smoothstep(260.0, 520.0, dist));
          float plain = 1.0 - smoothstep(0.004, 0.04, vHill);
          diffuseColor.rgb = mix(diffuseColor.rgb, cityDay(p, px), plain * cityFade);
        }`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        if (uLights > 0.005) {
          vec2 p = vWorldPos.xz;
          float px = length(fwidth(p));
          float plain = 1.0 - smoothstep(0.004, 0.05, vHill);
          float dist = length(p);
          float cityFade = smoothstep(13.0, 18.0, dist) * (1.0 - smoothstep(240.0, 480.0, dist));
          vec3 night = cityNight(p, px, cityDensity(p));
          // Resplandor general de la ciudad (contaminación lumínica).
          night += ${glslColor(0xffa25a)} * 0.02 * cityDensity(p);
          totalEmissiveRadiance += night * plain * cityFade * uLights;
          // El cerro de noche: manchas cálidas en la parte alta (tenues) y el camino.
          float up = smoothstep(uMaxH * 0.45, uMaxH * 0.9, vWorldPos.y) * smoothstep(0.25, 0.7, vHill);
          float spots = (0.45 + 0.55 * smoothstep(0.15, 0.9, vn(p * 0.8 + 3.0))) * (0.7 + 0.3 * vn(p * 3.0));
          totalEmissiveRadiance += uFloodColor * up * spots * uFlood * 0.14;
          totalEmissiveRadiance += uStreetColor * smoothstep(0.7, 1.0, vRoad) * uLights * 0.12;
        }`,
      );
  };
  const patch = new THREE.Mesh(patchGeo, groundMat);
  const plainMesh = new THREE.Mesh(plainGeo, groundMat);
  world.add(patch, plainMesh);

  await pause();
  /* ---------- Muro blanco del camino (lado exterior) ---------- */
  let roadWallMat: THREE.MeshStandardMaterial | null = null;
  {
    const pts = terrain.road;
    const verts: number[] = [];
    const up = 0.13;
    for (let i = 0; i < pts.length - 1; i += 2) {
      const [x0, y0, z0] = pts[i];
      const [x1, y1, z1] = pts[Math.min(i + 2, pts.length - 1)];
      const out0 = Math.hypot(x0, z0) || 1;
      const out1 = Math.hypot(x1, z1) || 1;
      const o = CERRO.roadWidth * 0.62;
      const ax = x0 + (x0 / out0) * o;
      const az = z0 + (z0 / out0) * o;
      const bx = x1 + (x1 / out1) * o;
      const bz = z1 + (z1 / out1) * o;
      verts.push(ax, y0, az, bx, y1, bz, ax, y0 + up, az, ax, y0 + up, az, bx, y1, bz, bx, y1 + up, bz);
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g.computeVertexNormals();
    // De noche el muro refleja las lámparas: una línea cálida y limpia a lo
    // largo del camino (en el suelo, con celdas de ~0.3, salía dentada).
    roadWallMat = track(new THREE.MeshStandardMaterial({ color: 0xe8e2d6, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xffc27a, emissiveIntensity: 0 }));
    const wall = new THREE.Mesh(g, roadWallMat);
    world.add(wall);
  }

  await pause();
  /* ---------- Matorral (palo verde, palo fierro, ocotillo) ---------- */
  let shrubMat: THREE.MeshStandardMaterial | null = null;
  {
    const count = hi ? 1700 : 600;
    const geo = track(new THREE.IcosahedronGeometry(0.15, 0));
    const mat = track(new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true, emissive: 0xffc98a, emissiveIntensity: 0 }));
    shrubMat = mat;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uMaxH = { value: terrain.summit.y };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying float vWY;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvWY = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).y;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform float uMaxH;\nvarying float vWY;")
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance *= smoothstep(uMaxH * 0.34, uMaxH * 0.8, vWY);");
    };
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const greens = [0x5a6a3a, 0x6f7a45, 0x7c8456, 0x4f5b35];
    let placed = 0;
    for (let guard = 0; placed < count && guard < count * 20; guard++) {
      const a = rand() * Math.PI * 2;
      const r = 1.8 + Math.pow(rand(), 0.8) * 19;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r * CERRO.elong;
      if (terrain.roadDistance(x, z) < CERRO.roadWidth * 1.4) continue;
      const rocky = terrain.rockiness(x, z);
      const m = terrain.hillMask(x, z);
      if (m < 0.06 || rand() < rocky * 0.75) continue;
      const k = 0.55 + rand() * 0.9;
      p.set(x, terrain.height(x, z) + 0.05 * k, z);
      q.setFromEuler(new THREE.Euler(0, rand() * 6.28, 0));
      s.set(k, k * (0.6 + rand() * 0.4), k);
      m4.compose(p, q, s);
      mesh.setMatrixAt(placed, m4);
      mesh.setColorAt(placed, tmpC.setHex(greens[Math.floor(rand() * greens.length)]));
      placed++;
    }
    mesh.count = placed;
    world.add(mesh);
  }

  await pause();
  /* ---------- Ciudad: casas, árboles y el centro ---------- */
  // Casas de 1–2 pisos sobre los mismos lotes que pinta el shader, solo en la
  // cuña que ve la cámara (más allá, el shader basta). De noche, algunas
  // ventanas encendidas (patrón en el shader, por posición).
  const cityMats: THREE.MeshStandardMaterial[] = [];
  {
    const windowsShader = (density: number, floorH: number) => (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vWP;\nvarying vec3 vWN;\nvarying vec2 vSeed;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          vWP = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
          vWN = normalize(mat3(instanceMatrix) * objectNormal);
          vSeed = instanceMatrix[3].xz;`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying vec3 vWP;
          varying vec3 vWN;
          varying vec2 vSeed;
          float wh(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }`,
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          {
            // Ventanas: solo en muros, por pisos y columnas.
            float wall = 1.0 - step(0.5, abs(vWN.y));
            float hc = (abs(vWN.x) > abs(vWN.z) ? vWP.z : vWP.x) / 0.075;
            float vc = vWP.y / ${floorH.toFixed(3)};
            vec2 cell = vec2(floor(hc), floor(vc));
            vec2 f = vec2(fract(hc), fract(vc));
            float pane = step(0.25, f.x) * step(f.x, 0.75) * step(0.3, f.y) * step(f.y, 0.72);
            float on = step(${(1 - density).toFixed(2)}, wh(cell + vSeed * 3.7));
            totalEmissiveRadiance *= wall * pane * on * step(0.035, vWP.y);
          }`,
        );
    };

    const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));
    boxGeo.translate(0, 0.5, 0);
    const houseMat = track(new THREE.MeshStandardMaterial({ roughness: 0.92, emissive: 0xffc98a, emissiveIntensity: 0 }));
    houseMat.onBeforeCompile = windowsShader(0.18, 0.1);
    houseMat.customProgramCacheKey = () => "cerro-houses";
    const towerMat = track(new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0.05, emissive: 0xffd6a0, emissiveIntensity: 0 }));
    towerMat.onBeforeCompile = windowsShader(0.42, 0.085);
    towerMat.customProgramCacheKey = () => "cerro-downtown";
    cityMats.push(houseMat, towerMat);

    // Cuña visible desde la cámara del hero (poniente → cerro), con margen para
    // el vaivén y el mouse. En celular (vertical) es más angosta.
    const camX = -79;
    const camZ = -9.7;
    const toTarget = Math.atan2(-camZ, -camX);
    const [angMin, angMax] = hi ? [-0.76, 0.48] : [-0.36, 0.36];
    const maxD = hi ? 98 : 92;
    const inView = (x: number, z: number) => {
      const d = Math.hypot(x - camX, z - camZ);
      if (d < 17 || d > maxD) return false;
      const a = Math.atan2(z - camZ, x - camX) - toTarget;
      return a > angMin && a < angMax;
    };

    const tonesLinear = ROOF_TONES.map((h) => new THREE.Color(h));
    const toneOf = (t: number) => tonesLinear[ROOF_CUTS.findIndex((c) => t < c)] ?? tonesLinear[0];
    const lotW = (CITY.bx - 2 * CITY.street) / CITY.lots;
    const halfDepth = 0.5 * CITY.bz - CITY.street;

    // Lotes candidatos (manzanas dentro de la cuña).
    const lots: { gx: number; gz: number; row: number; x: number; z: number; d: number }[] = [];
    const [c0x, c0z] = toCity(camX, camZ);
    for (let gz = Math.floor(c0z - 75); gz <= Math.ceil(c0z + 75); gz++) {
      if (gz % 12 === 0) await pause();
      for (let gx = Math.floor(c0x - 5); gx <= Math.ceil(c0x + 45); gx++) {
        const [bx, bz] = fromCity(gx + 0.5, gz + 0.5);
        if (!inView(bx, bz) && Math.hypot(bx, bz) > 34) continue;
        for (let i = 0; i < CITY.lots; i++) {
          for (let row = 0; row < 2; row++) {
            const ux = gx + (CITY.street + (i + 0.5) * lotW) / CITY.bx;
            const depth = CITY.street + halfDepth * 0.34;
            const uz = row === 0 ? gz + depth / CITY.bz : gz + 1 - depth / CITY.bz;
            const [x, z] = fromCity(ux, uz);
            if (!inView(x, z)) continue;
            if (terrain.hillMask(x, z) > 0.025) continue;
            lots.push({ gx: ux, gz: uz, row, x, z, d: Math.hypot(x - camX, z - camZ) });
          }
        }
      }
    }
    await pause();

    const houseCap = hi ? 12000 : 4200;
    const occupancy = Math.min(0.8, houseCap / Math.max(1, lots.length));
    const houses = new THREE.InstancedMesh(boxGeo, houseMat, Math.min(houseCap, lots.length));
    const treeGeo = track(new THREE.IcosahedronGeometry(1, 0));
    const treeMat = track(new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }));
    const treeCap = hi ? 5200 : 1700;
    const trees = new THREE.InstancedMesh(treeGeo, treeMat, treeCap);
    const greens = [0x55663f, 0x4a5a36, 0x62704a, 0x3f4f30].map((h) => new THREE.Color(h));
    const m4 = new THREE.Matrix4();
    const qRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, CITY.rot, 0));
    const qTree = new THREE.Quaternion();
    const sc = new THREE.Vector3();
    const pos = new THREE.Vector3();
    let nh = 0;
    let nt = 0;
    for (let i = 0; i < lots.length; i++) {
      if (i % 1200 === 0) await pause();
      const L = lots[i];
      // Menos casas hacia la orilla de la cuña: sin corte brusco con el shader.
      const edge = smoothstepJS(maxD, maxD - 24, L.d);
      if (nh < houseCap && rand() < occupancy * edge) {
        const two = rand() < 0.12;
        const w = lotW * (0.66 + rand() * 0.2);
        const dp = halfDepth * (0.42 + rand() * 0.2);
        const hh = two ? 0.19 + rand() * 0.07 : 0.09 + rand() * 0.05;
        pos.set(L.x, terrain.height(L.x, L.z) - 0.02, L.z);
        sc.set(w, hh, dp);
        m4.compose(pos, qRot, sc);
        houses.setMatrixAt(nh, m4);
        houses.setColorAt(nh, tmpC.copy(toneOf(rand())).multiplyScalar(0.92 + rand() * 0.12));
        nh++;
      }
      // Árbol en el patio de atrás (o en la banqueta).
      if (nt < treeCap && rand() < (hi ? 0.36 : 0.3)) {
        const back = rand() < 0.7;
        const off = back ? (halfDepth * (0.72 + rand() * 0.2)) / CITY.bz : (-CITY.street * 0.7) / CITY.bz;
        const gz = L.row === 0 ? L.gz - (halfDepth * 0.34) / CITY.bz + off : L.gz + (halfDepth * 0.34) / CITY.bz - off;
        const [tx, tz] = fromCity(L.gx + (rand() - 0.5) * (lotW / CITY.bx) * 0.8, gz);
        if (terrain.hillMask(tx, tz) < 0.03) {
          const k = 0.14 + rand() * 0.14;
          pos.set(tx, terrain.height(tx, tz) + k * 0.7, tz);
          qTree.setFromEuler(new THREE.Euler(0, rand() * 6.28, 0));
          sc.set(k, k * (0.8 + rand() * 0.3), k);
          m4.compose(pos, qTree, sc);
          trees.setMatrixAt(nt, m4);
          trees.setColorAt(nt, greens[Math.floor(rand() * greens.length)]);
          nt++;
        }
      }
    }
    houses.count = nh;
    trees.count = nt;
    world.add(houses, trees);

    // El centro: edificios de 4 a 13 pisos al pie del cerro (poniente).
    const towerCount = hi ? 110 : 50;
    const downtown = new THREE.InstancedMesh(boxGeo, towerMat, towerCount);
    const towerTones = [0xd8d4cc, 0xc5c9cf, 0xb9b2a6, 0xe8e4dc, 0x9aa3ad].map((h) => new THREE.Color(h));
    let nd = 0;
    for (let guard = 0; nd < towerCount && guard < towerCount * 40; guard++) {
      const x0 = -36 + rand() * 20;
      const z0 = -16 + rand() * 24;
      if (terrain.hillMask(x0, z0) > 0.02) continue;
      const [qx, qz] = toCity(x0, z0);
      const fx = qx - Math.floor(qx);
      const fz = qz - Math.floor(qz);
      // Dentro de la manzana, lejos de la calle.
      if (fx * CITY.bx < CITY.street + 0.35 || (1 - fx) * CITY.bx < CITY.street + 0.35) continue;
      if (fz * CITY.bz < CITY.street + 0.3 || (1 - fz) * CITY.bz < CITY.street + 0.3) continue;
      const core = 1 - smoothstepJS(4, 14, Math.hypot(x0 + 26, z0 + 4));
      const hh = 0.35 + Math.pow(rand(), 2.2) * (0.45 + core * 0.9);
      pos.set(x0, terrain.height(x0, z0) - 0.02, z0);
      sc.set(0.5 + rand() * 0.5, hh, 0.45 + rand() * 0.45);
      m4.compose(pos, qRot, sc);
      downtown.setMatrixAt(nd, m4);
      downtown.setColorAt(nd, towerTones[Math.floor(rand() * towerTones.length)]);
      nd++;
    }
    downtown.count = nd;
    world.add(downtown);
  }

  await pause();
  /* ---------- Sierra lejana ---------- */
  const mountainMats: THREE.MeshBasicMaterial[] = [];
  {
    const ridge = createNoise2D(404);
    const layers = [
      { radius: 340, base: -5, amp: 15, freq: 7, shade: 1 },
      { radius: 480, base: -2, amp: 30, freq: 4.2, shade: 0.84 },
      { radius: 640, base: 4, amp: 44, freq: 2.6, shade: 0.72 },
    ];
    layers.forEach((L) => {
      const segs = 180;
      const verts: number[] = [];
      const shades: number[] = [];
      for (let i = 0; i < segs; i++) {
        const a0 = (i / segs) * Math.PI * 2;
        const a1 = ((i + 1) / segs) * Math.PI * 2;
        const prof = (a: number) => {
          const n = fbm(ridge, Math.cos(a) * L.freq + L.radius, Math.sin(a) * L.freq, 5) * 0.5 + 0.5;
          const peaks = Math.pow(Math.max(0, n), 1.8);
          return L.base + peaks * L.amp * (0.55 + 0.45 * Math.abs(Math.sin(a * 2.3 + L.radius)));
        };
        const hA = prof(a0);
        const hB = prof(a1);
        const p0 = [Math.cos(a0) * L.radius, -3, Math.sin(a0) * L.radius];
        const p1 = [Math.cos(a1) * L.radius, -3, Math.sin(a1) * L.radius];
        const q0 = [Math.cos(a0) * L.radius, hA, Math.sin(a0) * L.radius];
        const q1 = [Math.cos(a1) * L.radius, hB, Math.sin(a1) * L.radius];
        verts.push(...p0, ...q0, ...p1, ...p1, ...q0, ...q1);
        // Bruma: la falda de la sierra más clara que las crestas.
        const lo = 1.14;
        const hi2 = 0.9;
        shades.push(lo, lo, lo, hi2, hi2, hi2, lo, lo, lo, lo, lo, lo, hi2, hi2, hi2, hi2, hi2, hi2);
      }
      const g = track(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(shades, 3));
      const m = track(new THREE.MeshBasicMaterial({ color: 0x8899aa, side: THREE.DoubleSide, fog: false, vertexColors: true }));
      m.userData.shade = L.shade;
      mountainMats.push(m);
      const mesh = new THREE.Mesh(g, m);
      mesh.renderOrder = -7;
      world.add(mesh);
    });
  }

  await pause();
  /* ---------- Cima: explanada, mirador y tres torres de antenas ---------- */
  const towerMats: THREE.LineBasicMaterial[] = [];
  const beacons: THREE.Sprite[] = [];
  const summitLights: THREE.Sprite[] = [];
  {
    const S = terrain.summit;
    // Edificio del mirador y caseta de antenas.
    const buildMat = track(new THREE.MeshStandardMaterial({ color: 0xece7de, roughness: 0.8, emissive: 0xffc98a, emissiveIntensity: 0 }));
    const b1 = new THREE.Mesh(track(new THREE.BoxGeometry(1.1, 0.42, 0.8)), buildMat);
    b1.position.set(S.x - 0.55, S.y + 0.21, S.z + 0.35);
    const b2 = new THREE.Mesh(track(new THREE.BoxGeometry(0.6, 0.3, 0.55)), buildMat);
    b2.position.set(S.x + 0.45, S.y + 0.15, S.z - 0.5);
    world.add(b1, b2);
    buildMat.userData.night = true;
    world.userData.buildMat = buildMat;

    // Torres reticuladas (tres patas con contravientos), rojo y blanco.
    const towers: [number, number, number][] = [
      [0.1, -0.35, 7.2],
      [0.75, 0.55, 5.4],
      [-0.55, -0.85, 4.1],
    ];
    const red = new THREE.Color(0xd4553f);
    const white = new THREE.Color(0xf4f1ea);
    towers.forEach(([dx, dz, h], ti) => {
      const bx = S.x + dx;
      const bz = S.z + dz;
      const by = terrain.height(bx, bz) - 0.05;
      const pts: number[] = [];
      const cols: number[] = [];
      const levels = Math.round(h / 0.32);
      const legAt = (lvl: number, leg: number) => {
        const t = lvl / levels;
        const w = 0.34 * (1 - t) + 0.07 * t;
        const a = (leg / 3) * Math.PI * 2 + ti;
        return [bx + Math.cos(a) * w, by + t * h, bz + Math.sin(a) * w];
      };
      const bandColor = (y: number) => (Math.floor(((y - by) / h) * 7) % 2 === 0 ? red : white);
      const seg = (a: number[], b: number[]) => {
        pts.push(...a, ...b);
        const c = bandColor((a[1] + b[1]) / 2);
        cols.push(c.r, c.g, c.b, c.r, c.g, c.b);
      };
      for (let l = 0; l < levels; l++) {
        for (let leg = 0; leg < 3; leg++) {
          const a = legAt(l, leg);
          const b = legAt(l + 1, leg);
          seg(a, b);
          const next = legAt(l, (leg + 1) % 3);
          if (l % 2 === 0) seg(a, next);
          seg(a, legAt(l + 1, (leg + 1) % 3));
        }
      }
      // Antena superior.
      seg([bx, by + h, bz], [bx, by + h + h * 0.12, bz]);
      const g = track(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
      const m = track(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 }));
      towerMats.push(m);
      world.add(new THREE.LineSegments(g, m));

      // Balizas rojas: punta y media altura.
      [1.12, 0.55].forEach((f, k) => {
        const s = new THREE.Sprite(
          track(
            new THREE.SpriteMaterial({
              map: glowTex,
              color: 0xff5a45,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            }),
          ),
        );
        s.position.set(bx, by + h * f, bz);
        s.scale.setScalar(k === 0 ? 1.5 : 1);
        s.userData.phase = ti * 0.23 + k * 0.5;
        world.add(s);
        beacons.push(s);
      });
    });

    // Luces cálidas de la explanada (el mirador iluminado).
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const s = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({
            map: glowTex,
            color: 0xffd9a3,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
      const x = S.x + Math.cos(a) * CERRO.plateauR * 0.9;
      const z = S.z + Math.sin(a) * CERRO.plateauR * 0.9;
      s.position.set(x, terrain.height(x, z) + 0.25, z);
      s.scale.setScalar(1.1);
      world.add(s);
      summitLights.push(s);
    }
  }

  /* ---------- Lámparas del camino ---------- */
  const lampU = {
    uTime: { value: 0 },
    uIntensity: { value: 1 },
    uPixelRatio: { value: pixelRatio },
    uScale: { value: 240 },
    uFogNear: { value: 140 },
    uFogFar: { value: 360 },
    uTwinkle: { value: 0.08 },
  };
  {
    const pts = terrain.road;
    const n = hi ? 150 : 90;
    const warm = new THREE.Color(0xffd08a);
    const g = pointsGeometry(n, (i, set) => {
      const idx = Math.floor((i / (n - 1)) * (pts.length - 1));
      const [x, y, z] = pts[idx];
      const r = Math.hypot(x, z) || 1;
      const o = CERRO.roadWidth * 0.55;
      set([x + (x / r) * o, y + 0.3, z + (z / r) * o], 2.4, warm, rand(), 1);
    });
    world.add(new THREE.Points(g, pointsMaterial(lampU)));
  }

  await pause();
  /* ---------- Luces de la ciudad (quedan de fondo al hacer scroll) ---------- */
  // 1) Alumbrado completo: un plano con el mismo patrón del shader del suelo,
  //    sin prueba de profundidad, para cuando el cerro ya se fundió.
  const gridTopU = { uIntensity: { value: 0 }, uLightTheme: { value: 0 } };
  const gridTopMat = track(
    new THREE.ShaderMaterial({
      uniforms: gridTopU,
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        varying float vDist;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vec4 mv = viewMatrix * wp;
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uIntensity;
        uniform float uLightTheme;
        varying vec3 vWorldPos;
        varying float vDist;
        ${cityGLSL}
        void main() {
          vec2 p = vWorldPos.xz;
          float px = length(fwidth(p));
          float fog = 1.0 - smoothstep(120.0, 420.0, vDist);
          // De fondo, bajo el texto: más tenue, y aún más en primer plano.
          float near = mix(0.4, 1.0, smoothstep(22.0, 75.0, vDist));
          vec3 c = cityNight(p, px, cityDensity(p)) * fog * near * uIntensity * 0.62;
          if (uLightTheme > 0.5) {
            float a = clamp(max(c.r, max(c.g, c.b)) * 1.6, 0.0, 0.85);
            gl_FragColor = vec4(vec3(0.86, 0.45, 0.25), a);
          } else {
            gl_FragColor = vec4(c, 1.0);
          }
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      transparent: true,
      // Con prueba de profundidad: mientras el cerro se funde, las luces que
      // quedan detrás no lo atraviesan. Ya fundido, el búfer está limpio.
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  {
    const size = 700;
    const segs = 8;
    const g = track(new THREE.PlaneGeometry(size, size, segs, segs));
    g.rotateX(-Math.PI / 2);
    g.translate(-20, 0.06, 0);
    const gridTop = new THREE.Mesh(g, gridTopMat);
    gridTop.renderOrder = -1;
    top.add(gridTop);
  }

  // 2) Puntos que titilan encima (sobre los mismos postes).
  const lights = cityLights(terrain, hi ? 7000 : 2600);
  const tones = [new THREE.Color(0xffc987), new THREE.Color(0xfff1dc), new THREE.Color(0xc4d6ff)];
  const cityGeo = pointsGeometry(lights.length, (i, set) => {
    const l = lights[i];
    set([l.x, l.y + 0.15, l.z], l.size, tones[l.tone], l.phase, l.freq);
  });
  const cityU = {
    uTime: { value: 0 },
    uIntensity: { value: 1 },
    uPixelRatio: { value: pixelRatio },
    uScale: { value: 300 },
    uFogNear: { value: 110 },
    uFogFar: { value: 340 },
    uTwinkle: { value: 0.35 },
  };
  world.add(new THREE.Points(cityGeo, pointsMaterial(cityU)));
  // Copia sin prueba de profundidad para el modo "solo luces".
  const cityTopU = {
    uTime: cityU.uTime,
    uIntensity: { value: 0 },
    uPixelRatio: cityU.uPixelRatio,
    uScale: { value: 300 },
    uFogNear: { value: 140 },
    uFogFar: { value: 420 },
    uTwinkle: { value: 0.45 },
  };
  const cityTopMat = pointsMaterial(cityTopU);
  top.add(new THREE.Points(cityGeo, cityTopMat));

  await pause();
  /* ---------- Estrella del norte de Northa ---------- */
  const starTex = track(starTexture());
  const brandStar = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: starTex, transparent: true, depthWrite: false, fog: false })));
  const starBase = new THREE.Vector3(terrain.summit.x + 3, terrain.summit.y + 6.8, terrain.summit.z - 6.5);
  brandStar.scale.setScalar(3.2);
  brandStar.renderOrder = 5;
  world.add(brandStar);
  const brandGlow = new THREE.Sprite(
    track(
      new THREE.SpriteMaterial({ map: glowTex, color: 0xffae82, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
    ),
  );
  brandGlow.scale.setScalar(11);
  brandGlow.renderOrder = 4;
  world.add(brandGlow);

  /* ---------- Luz ---------- */
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  world.add(hemi, sun);
  world.fog = new THREE.Fog(0x000000, 95, 520);

  /* ---------- Capa para fundir con el fondo ---------- */
  const overlayCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const overlayScene = new THREE.Scene();
  const overlayMat = track(new THREE.MeshBasicMaterial({ color: 0x0a1124, transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false }));
  overlayScene.add(new THREE.Mesh(track(new THREE.PlaneGeometry(2, 2)), overlayMat));
  const bgColor = new THREE.Color(0x0a1124);
  let lightTheme = 0;

  /* ---------- Cámara ---------- */
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.5, 2400);
  const target = new THREE.Vector3();

  function applyFraming() {
    const aspect = width / height;
    camera.aspect = aspect;
    const tall = layout === "tall";
    camera.fov = tall ? (aspect < 0.62 ? 40 : 36) : aspect < 1.25 ? 36 : 30;
    const shiftX = tall ? 0 : 0.2;
    // En vertical, la cima queda debajo de los botones del hero.
    const shiftY = tall ? -0.27 : 0.02;
    camera.setViewOffset(width, height, -shiftX * width, shiftY * height, width, height);
    camera.updateProjectionMatrix();
  }
  applyFraming();

  // Modo "solo luces": la cámara sube poco y se ve el horizonte de la ciudad
  // (en vertical, un poco más, para que las luces llenen la pantalla).
  const FADE_EL = { wide: 6, tall: 14 } as const;
  const baseAz = Math.PI + THREE.MathUtils.degToRad(7);
  const tmpV = new THREE.Vector3();
  function placeCamera(t: number) {
    const f = smooth(fade);
    const tall = layout === "tall";
    const idle = Math.sin((t / 48) * Math.PI * 2) * THREE.MathUtils.degToRad(2.6);
    const az = baseAz + idle + pointerX * THREE.MathUtils.degToRad(4) * (1 - f) + f * THREE.MathUtils.degToRad(-12);
    const el = THREE.MathUtils.degToRad(tall ? 5 : 4.5) + pointerY * THREE.MathUtils.degToRad(2) * (1 - f) + f * THREE.MathUtils.degToRad(FADE_EL[layout]);
    const radius = (tall ? 78 : 80) - f * 16;
    target.set(0, 6.8, 0).lerp(tmpV.set(-26, 0, 4), f);
    camera.position.set(
      target.x + Math.cos(az) * Math.cos(el) * radius,
      target.y + Math.sin(el) * radius,
      target.z + Math.sin(az) * Math.cos(el) * radius,
    );
    camera.lookAt(target);
  }

  /* ---------- Cielo y luz según la hora ---------- */
  const cA = new THREE.Color();
  const sunDir = new THREE.Vector3();
  const cloudLit = new THREE.Color();
  const cloudShade = new THREE.Color();

  function applySky() {
    const tod = skyNow.tod;
    const morning = skyNow.morning;
    const P = paletteAt(tod, morning);
    skyU.uZenith.value.setHex(P.zenith);
    skyU.uMid.value.setHex(P.mid);
    skyU.uHorizon.value.setHex(P.horizon);
    skyU.uHaze.value.setHex(P.haze);
    skyU.uGlowColor.value.setHex(P.glow);
    skyU.uGlowStrength.value = P.glowStrength;
    (world.fog as THREE.Fog).color.setHex(P.fog);
    hemi.color.setHex(P.hemiSky);
    hemi.groundColor.setHex(P.hemiGround);
    hemi.intensity = P.hemiIntensity;
    sun.color.setHex(P.sun);
    renderer.toneMappingExposure = P.exposure;

    // Nubes: el clima baja el sol y agrisa el cielo.
    const cloud = skyNow.cloud;
    const overcast = smooth((cloud - 0.55) / 0.45) * 0.55 + skyNow.rain * 0.3;
    skyU.uZenith.value.lerp(cA.setHex(0x8a94a6).multiplyScalar(1 - tod * 0.85), overcast * (1 - tod * 0.6));
    sun.intensity = P.sunIntensity * (1 - overcast * 0.6);

    // Sol: sale detrás del cerro (oriente) y se pone detrás de la cámara.
    const alt = THREE.MathUtils.degToRad(tod < 0.45 ? 62 * (1 - tod / 0.45) * 0.6 + 6 : tod < 0.72 ? 6 - ((tod - 0.45) / 0.27) * 10 : -8);
    const az = THREE.MathUtils.lerp(THREE.MathUtils.degToRad(160), THREE.MathUtils.degToRad(-6), morning);
    sunDir.set(Math.cos(alt) * Math.cos(az), Math.sin(alt), Math.cos(alt) * Math.sin(az)).normalize();
    if (tod > 0.8) sunDir.set(0.4, 0.8, -0.45).normalize(); // luna
    sun.position.copy(sunDir).multiplyScalar(120);
    skyU.uSunDir.value.copy(sunDir);
    skyU.uSunColor.value.copy(sun.color);
    skyU.uSunDisk.value = morning * smooth(1 - Math.abs(tod - 0.4) / 0.35) * (1 - overcast);
    skyU.uGlowDir.value.set(1, 0.05, THREE.MathUtils.lerp(0.35, -0.3, morning));
    skyU.uMoon.value = smooth((tod - 0.75) / 0.2) * (1 - overcast);

    const lightsOn = P.lights;
    cityU.uIntensity.value = lightsOn;
    lampU.uIntensity.value = lightsOn * 1.25;
    groundU.uLights.value = lightsOn;
    groundU.uFlood.value = P.flood;
    groundU.uDay.value = 1 - smooth(tod / 0.6);
    starU.uIntensity.value = P.stars * (1 - overcast);
    towerMats.forEach((m) => m.color.setScalar(P.tower));
    const buildMat = world.userData.buildMat as THREE.MeshStandardMaterial;
    buildMat.emissiveIntensity = lightsOn * 0.5;
    cityMats.forEach((m) => (m.emissiveIntensity = lightsOn));
    if (roadWallMat) roadWallMat.emissiveIntensity = lightsOn * 0.55;
    if (shrubMat) shrubMat.emissiveIntensity = P.flood * 0.1;
    summitLights.forEach((s) => ((s.material as THREE.SpriteMaterial).opacity = lightsOn));
    mountainMats.forEach((m) => m.color.setHex(P.mountain).multiplyScalar(m.userData.shade as number));
    (brandGlow.material as THREE.SpriteMaterial).opacity = 0.2 + 0.5 * P.stars;
    (brandStar.material as THREE.SpriteMaterial).opacity = 0.55 + 0.45 * lightsOn;

    // Nubes: cuántas y de qué color.
    const lit = cloudLit.setHex(P.cloudLit);
    const shade = cloudShade.setHex(P.cloudShade);
    clouds.forEach((c) => {
      const th = c.userData.threshold as number;
      const visible = smooth((cloud - th * 0.85) / 0.2);
      const mat = c.material as THREE.SpriteMaterial;
      mat.opacity = visible * (0.55 + 0.35 * cloud) * (1 - 0.3 * skyNow.rain);
      mat.color.copy(shade).lerp(lit, 0.55 + 0.45 * (1 - overcast));
    });
  }
  applySky();

  function stepSky(dt: number) {
    const k = 1 - Math.exp(-dt * 2.2);
    let changed = false;
    (["tod", "morning", "cloud", "rain"] as const).forEach((key) => {
      const d = skyTarget[key] - skyNow[key];
      if (Math.abs(d) > 1e-4) {
        skyNow[key] += d * k;
        changed = true;
      } else skyNow[key] = skyTarget[key];
    });
    if (changed) applySky();
  }

  /* ---------- API ---------- */
  function render(t: number) {
    const dt = Math.min(0.1, Math.max(0, t - lastT));
    lastT = t;
    stepSky(dt);
    starU.uTime.value = t;
    cityU.uTime.value = t;
    lampU.uTime.value = t;
    groundU.uTime.value = t;

    // Nubes a la deriva, muy lento.
    clouds.forEach((c) => {
      c.position.z = (c.userData.baseZ as number) + Math.sin(t * 0.01 + (c.userData.threshold as number) * 9) * 30 * (c.userData.drift as number);
    });

    // Estrella de marca: flota suave.
    brandStar.position.copy(starBase);
    brandStar.position.y += Math.sin(t * 0.5) * 0.3;
    brandGlow.position.copy(brandStar.position);
    brandGlow.scale.setScalar(11 * (1 + Math.sin(t * 1.1) * 0.05));

    // Balizas: destello de 1.5 s.
    const night = Math.min(1, skyNow.tod * 1.3);
    beacons.forEach((s) => {
      const p = ((t / 1.5 + (s.userData.phase as number)) % 1 + 1) % 1;
      const on = p < 0.4 ? 1 : 0.1;
      (s.material as THREE.SpriteMaterial).opacity = on * (0.3 + 0.7 * night);
      s.scale.setScalar((on > 0.5 ? 1.6 : 1.1) * (0.8 + 0.6 * night));
    });

    placeCamera(t);

    const f = smooth(fade);
    cityTopU.uIntensity.value = smooth((fade - 0.08) / 0.55);
    gridTopU.uIntensity.value = cityTopU.uIntensity.value;
    overlayMat.opacity = smooth((fade - 0.04) / 0.7);
    if (overlayMat.opacity < 0.999) {
      renderer.autoClear = true;
      renderer.render(world, camera);
    } else {
      renderer.setClearColor(bgColor, 1);
      renderer.clear();
    }
    if (f > 0.001) {
      renderer.autoClear = false;
      if (overlayMat.opacity > 0.001 && overlayMat.opacity < 0.999) renderer.render(overlayScene, overlayCam);
      if (cityTopU.uIntensity.value > 0.001) renderer.render(top, camera);
      renderer.autoClear = true;
    }
  }

  // Compila los shaders sin bloquear el hilo principal (KHR_parallel_shader_compile)
  // antes del primer cuadro: si no, la primera llamada a render() tarda cientos de ms.
  placeCamera(0);
  try {
    await renderer.compileAsync(world, camera);
    await pause();
    await renderer.compileAsync(top, camera);
    await renderer.compileAsync(overlayScene, overlayCam);
  } catch {
    /* sin compilación asíncrona: se compila en el primer render */
  }
  await pause();

  return {
    canvas,
    render,
    setSky(s: SkyInput, instant = false) {
      skyTarget.tod = Math.min(1, Math.max(0, s.tod));
      skyTarget.morning = s.morning ? 1 : 0;
      skyTarget.cloud = Math.min(1, Math.max(0, s.cloud));
      skyTarget.rain = s.rain ? 1 : 0;
      if (instant) {
        Object.assign(skyNow, skyTarget);
        applySky();
      }
    },
    setScrollFade(v: number) {
      fade = Math.min(1, Math.max(0, v));
    },
    setBackground(color: string, light: boolean) {
      bgColor.set(color);
      overlayMat.color.set(color);
      lightTheme = light ? 1 : 0;
      (cityTopMat.uniforms.uLightTheme as { value: number }).value = lightTheme;
      cityTopMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      cityTopMat.needsUpdate = true;
      gridTopU.uLightTheme.value = lightTheme;
      gridTopMat.blending = cityTopMat.blending;
      gridTopMat.needsUpdate = true;
    },
    setPointer(x: number, y: number) {
      pointerX = Math.max(-1, Math.min(1, x));
      pointerY = Math.max(-1, Math.min(1, y));
    },
    setLayout(next: "wide" | "tall") {
      layout = next;
      applyFraming();
    },
    resize(w: number, h: number, dpr?: number) {
      width = Math.max(1, Math.floor(w));
      height = Math.max(1, Math.floor(h));
      if (dpr) {
        pixelRatio = dpr;
        renderer.setPixelRatio(dpr);
        starU.uPixelRatio.value = dpr;
        cityU.uPixelRatio.value = dpr;
        lampU.uPixelRatio.value = dpr;
      }
      renderer.setSize(width, height, false);
      applyFraming();
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}

function smoothstepJS(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
