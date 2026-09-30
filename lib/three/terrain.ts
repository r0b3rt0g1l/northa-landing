/**
 * Geometría procedural del Cerro de la Campana — matemática pura, sin Three.js,
 * para poder usarla en el navegador (escena 3D) y en Node (SVG de curvas de
 * nivel y perfil del logotipo). Todo es determinístico: misma semilla, mismo cerro.
 *
 * Unidades: 1 unidad ≈ 10 m. El cerro se estiliza como una campana vista desde
 * el poniente (así nace su nombre), con un hombro al sureste para romper la simetría.
 * Ejes: +x = oriente, −x = poniente (desde donde mira la cámara), +z = sur, −z = norte.
 */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ruido de gradiente 2D (tipo Perlin) con permutación sembrada. Rango ≈ [-1, 1]. */
export function createNoise2D(seed = 1) {
  const rand = mulberry32(seed);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -v : v);
  };

  return function noise(x: number, y: number) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[xi] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const ba = perm[perm[xi + 1] + yi];
    const bb = perm[perm[xi + 1] + yi + 1];
    const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
    return lerp(x1, x2, v) * 0.72;
  };
}

export function fbm(noise: (x: number, y: number) => number, x: number, y: number, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

export const CERRO = {
  /** Prominencia sobre la ciudad (estilizada: más alta que la real para leerse como campana). */
  H: 16,
  /** Radio de la campana. */
  R: 12.5,
  /** Alargamiento norte–sur. */
  elong: 1.28,
  /** Rugosidad rocosa sobre las laderas. */
  rough: 1.35,
  seed: 1968,
} as const;

export interface Terrain {
  height: (x: number, z: number) => number;
  /** 0 en la llanura, 1 en la cima: útil para colorear y excluir luces. */
  hillMask: (x: number, z: number) => number;
  summit: { x: number; y: number; z: number };
}

export function createTerrain(seed: number = CERRO.seed): Terrain {
  const rock = createNoise2D(seed);
  const plain = createNoise2D(seed + 17);

  const bell = (x: number, z: number) => {
    const r = Math.hypot(x, z / CERRO.elong);
    return Math.exp(-Math.pow(r / CERRO.R, 2.7));
  };
  const shoulder = (x: number, z: number) => {
    const r = Math.hypot(x - 10, (z - 14) / 1.1);
    return Math.exp(-Math.pow(r / 7, 2.2));
  };

  const hillMask = (x: number, z: number) => Math.min(1, bell(x, z) * 1.25 + shoulder(x, z) * 0.35);

  const height = (x: number, z: number) => {
    const b = bell(x, z);
    const s = shoulder(x, z);
    const hill = CERRO.H * b + 2.4 * s;
    const ridges = fbm(rock, x * 0.11 + 3.1, z * 0.11 - 1.7, 4);
    const ground = fbm(plain, x * 0.022, z * 0.022, 3);
    const onHill = Math.min(1, b * 1.6 + s * 0.4);
    return hill + ridges * CERRO.rough * onHill + ground * 0.45 * (1 - Math.min(1, b * 1.8));
  };

  // Busca la cima numéricamente cerca del centro.
  let summit = { x: 0, y: -Infinity, z: 0 };
  for (let x = -4; x <= 4; x += 0.25) {
    for (let z = -4; z <= 4; z += 0.25) {
      const y = height(x, z);
      if (y > summit.y) summit = { x, y, z };
    }
  }

  return { height, hillMask, summit };
}

/* ------------------------------------------------------------------ */
/* Curvas de nivel (marching squares)                                  */
/* ------------------------------------------------------------------ */

export interface ContourOptions {
  xmin: number;
  xmax: number;
  zmin: number;
  zmax: number;
  /** Tamaño de celda de la malla de muestreo. */
  step: number;
  levels: number[];
}

/** Devuelve, por nivel, segmentos planos [x1, z1, x2, z2, ...]. */
export function contourSegments(
  height: (x: number, z: number) => number,
  { xmin, xmax, zmin, zmax, step, levels }: ContourOptions,
): { level: number; segments: number[] }[] {
  const nx = Math.floor((xmax - xmin) / step) + 1;
  const nz = Math.floor((zmax - zmin) / step) + 1;
  const grid = new Float32Array(nx * nz);
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      grid[j * nx + i] = height(xmin + i * step, zmin + j * step);
    }
  }

  const out: { level: number; segments: number[] }[] = [];
  for (const level of levels) {
    const segs: number[] = [];
    for (let j = 0; j < nz - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const x0 = xmin + i * step;
        const z0 = zmin + j * step;
        const a = grid[j * nx + i]; // (x0, z0)
        const b = grid[j * nx + i + 1]; // (x1, z0)
        const c = grid[(j + 1) * nx + i + 1]; // (x1, z1)
        const d = grid[(j + 1) * nx + i]; // (x0, z1)
        let idx = 0;
        if (a > level) idx |= 1;
        if (b > level) idx |= 2;
        if (c > level) idx |= 4;
        if (d > level) idx |= 8;
        if (idx === 0 || idx === 15) continue;

        const t = (v1: number, v2: number) => (level - v1) / (v2 - v1 || 1e-9);
        const top = [x0 + t(a, b) * step, z0];
        const right = [x0 + step, z0 + t(b, c) * step];
        const bottom = [x0 + t(d, c) * step, z0 + step];
        const left = [x0, z0 + t(a, d) * step];
        const push = (p: number[], q: number[]) => segs.push(p[0], p[1], q[0], q[1]);

        switch (idx) {
          case 1:
          case 14:
            push(left, top);
            break;
          case 2:
          case 13:
            push(top, right);
            break;
          case 3:
          case 12:
            push(left, right);
            break;
          case 4:
          case 11:
            push(right, bottom);
            break;
          case 5:
            push(left, top);
            push(right, bottom);
            break;
          case 6:
          case 9:
            push(top, bottom);
            break;
          case 7:
          case 8:
            push(left, bottom);
            break;
          case 10:
            push(top, right);
            push(left, bottom);
            break;
        }
      }
    }
    out.push({ level, segments: segs });
  }
  return out;
}

/** Une segmentos sueltos en polilíneas (para SVG compacto). */
export function joinSegments(segments: number[], precision = 1000): number[][] {
  const key = (x: number, z: number) => `${Math.round(x * precision)},${Math.round(z * precision)}`;
  type Seg = { a: [number, number]; b: [number, number]; used: boolean };
  const list: Seg[] = [];
  const byKey = new Map<string, Seg[]>();
  for (let i = 0; i < segments.length; i += 4) {
    const s: Seg = { a: [segments[i], segments[i + 1]], b: [segments[i + 2], segments[i + 3]], used: false };
    list.push(s);
    for (const p of [s.a, s.b]) {
      const k = key(p[0], p[1]);
      const arr = byKey.get(k);
      if (arr) arr.push(s);
      else byKey.set(k, [s]);
    }
  }
  const lines: number[][] = [];
  for (const start of list) {
    if (start.used) continue;
    start.used = true;
    const line: [number, number][] = [start.a, start.b];
    // extiende hacia adelante
    for (let guard = 0; guard < 100000; guard++) {
      const end = line[line.length - 1];
      const next = (byKey.get(key(end[0], end[1])) ?? []).find((s) => !s.used);
      if (!next) break;
      next.used = true;
      const nextPoint = key(next.a[0], next.a[1]) === key(end[0], end[1]) ? next.b : next.a;
      line.push(nextPoint);
    }
    // extiende hacia atrás
    for (let guard = 0; guard < 100000; guard++) {
      const first = line[0];
      const prev = (byKey.get(key(first[0], first[1])) ?? []).find((s) => !s.used);
      if (!prev) break;
      prev.used = true;
      const prevPoint = key(prev.a[0], prev.a[1]) === key(first[0], first[1]) ? prev.b : prev.a;
      line.unshift(prevPoint);
    }
    lines.push(line.flat());
  }
  return lines;
}

/* ------------------------------------------------------------------ */
/* Camino en espiral a la cima (construido en 1964)                    */
/* ------------------------------------------------------------------ */

export function spiralRoad(terrain: Terrain, samples = 420, turns = 2.35): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const start = -Math.PI * 0.62; // arranca al suroeste, de cara a la ciudad
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const ang = start + t * turns * Math.PI * 2;
    const r = CERRO.R * 1.55 * (1 - ease) + 1.4 * ease;
    const x = Math.cos(ang) * r;
    const z = Math.sin(ang) * r * CERRO.elong;
    pts.push([x, terrain.height(x, z) + 0.2, z]);
  }
  return pts;
}

/* ------------------------------------------------------------------ */
/* Luces de la ciudad                                                  */
/* ------------------------------------------------------------------ */

export interface CityLight {
  x: number;
  y: number;
  z: number;
  size: number;
  /** 0 cálida, 1 blanca, 2 fría */
  tone: 0 | 1 | 2;
  phase: number;
  /** Frecuencia entera de parpadeo dentro del ciclo del video (loop perfecto). */
  freq: number;
}

export function cityLights(terrain: Terrain, count: number, seed = 64): CityLight[] {
  const rand = mulberry32(seed);
  const hood = createNoise2D(seed + 5);
  const lights: CityLight[] = [];
  const block = 4.2; // misma retícula que las calles del shader
  const rot = 0.32;
  let guard = 0;
  while (lights.length < count && guard < count * 60) {
    guard++;
    const ang = rand() * Math.PI * 2;
    const dist = 17 + Math.pow(rand(), 0.9) * 150;
    const x0 = Math.cos(ang) * dist;
    const z0 = Math.sin(ang) * dist;
    // Colonias: el ruido decide dónde hay más o menos luz.
    const density = fbm(hood, x0 * 0.03, z0 * 0.03, 3) * 0.5 + 0.5;
    if (rand() > Math.pow(density, 1.6) * 1.35) continue;
    // Coordenadas de la retícula (girada) y "snap" a una calle.
    const qx = (x0 * Math.cos(rot) - z0 * Math.sin(rot)) / block;
    const qz = (x0 * Math.sin(rot) + z0 * Math.cos(rot)) / block;
    const alongX = rand() < 0.5;
    const sx = alongX ? qx : Math.round(qx);
    const sz = alongX ? Math.round(qz) : qz;
    const ox = (rand() - 0.5) * 0.08;
    const lx = (sx + (alongX ? 0 : ox)) * block;
    const lz = (sz + (alongX ? ox : 0)) * block;
    const x = lx * Math.cos(-rot) - lz * Math.sin(-rot);
    const z = lx * Math.sin(-rot) + lz * Math.cos(-rot);
    if (terrain.hillMask(x, z) > 0.08) continue;
    const r = rand();
    lights.push({
      x,
      y: terrain.height(x, z) + 0.2,
      z,
      size: 0.7 + Math.pow(rand(), 2) * 1.6,
      tone: r < 0.74 ? 0 : r < 0.93 ? 1 : 2,
      phase: rand(),
      freq: 1 + Math.floor(rand() * 3),
    });
  }
  return lights;
}

/* ------------------------------------------------------------------ */
/* Estrella de Northa (misma geometría que el logotipo)                */
/* ------------------------------------------------------------------ */

/** Estrella de 4 puntas de la marca, en caja 200×200 centrada en (100, 100). */
export const STAR_POINTS: [number, number][] = [
  [100, 18],
  [121.2, 78.8],
  [168, 100],
  [121.2, 121.2],
  [100, 182],
  [78.8, 121.2],
  [32, 100],
  [78.8, 78.8],
];

/** Cuadrante norte (rosa) de la estrella. */
export const STAR_NORTH: [number, number][] = [
  [100, 18],
  [121.2, 78.8],
  [100, 100],
  [78.8, 78.8],
];
