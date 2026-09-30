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
  /** Prominencia sobre la ciudad (estilizada: un poco más alta que la real para leerse como campana). */
  H: 15.5,
  /** Radio de la campana. */
  R: 11.5,
  /** Alargamiento norte–sur. */
  elong: 1.16,
  /** Rugosidad rocosa sobre las laderas. */
  rough: 1.15,
  /** Radio de la explanada de la cima (mirador y antenas). */
  plateauR: 1.35,
  /** Ancho del camino empedrado en espiral (1964). */
  roadWidth: 0.27,
  /** Vueltas del "caracol" hasta la cima. */
  roadTurns: 2.55,
  seed: 1968,
} as const;

export interface Terrain {
  /** Altura final: laderas, explanada de la cima y el corte del camino. */
  height: (x: number, z: number) => number;
  /** Altura natural, sin camino ni explanada. */
  baseHeight: (x: number, z: number) => number;
  /** 0 en la llanura, 1 en la cima: útil para colorear y excluir luces. */
  hillMask: (x: number, z: number) => number;
  /** 0 = tierra con matorral · 1 = roca expuesta. */
  rockiness: (x: number, z: number) => number;
  /** Distancia al eje del camino (Infinity si está lejos). */
  roadDistance: (x: number, z: number) => number;
  /** Eje del camino, de la base a la cima. */
  road: [number, number, number][];
  summit: { x: number; y: number; z: number };
}

export function createTerrain(seed: number = CERRO.seed): Terrain {
  const rock = createNoise2D(seed);
  const ridgeNoise = createNoise2D(seed + 3);
  const plain = createNoise2D(seed + 17);
  const detail = createNoise2D(seed + 29);

  const radial = (x: number, z: number) => Math.hypot(x, z / CERRO.elong);
  const bell = (x: number, z: number) => Math.exp(-Math.pow(radial(x, z) / CERRO.R, 2.25));
  // Cono superior: la campana vista desde el poniente se afila hacia la cima.
  const cone = (x: number, z: number) => Math.exp(-Math.pow(radial(x, z) / (CERRO.R * 0.46), 1.9));
  // Hombro al sureste y lomas bajas alrededor: rompen la simetría como en las fotos.
  const shoulder = (x: number, z: number) => Math.exp(-Math.pow(Math.hypot(x - 9, (z - 12) / 1.1) / 6.5, 2.2));
  const knoll = (x: number, z: number) =>
    0.9 * Math.exp(-Math.pow(Math.hypot(x - 24, z + 20) / 5, 2)) + 0.6 * Math.exp(-Math.pow(Math.hypot(x + 6, z - 30) / 4, 2));

  const hillMask = (x: number, z: number) => Math.min(1, bell(x, z) * 1.25 + shoulder(x, z) * 0.35);

  const ridged = (x: number, z: number) => {
    // Ridged multifractal corto: crestas de granito que bajan de la cima.
    let sum = 0;
    let amp = 0.55;
    let freq = 1;
    for (let i = 0; i < 3; i++) {
      const n = 1 - Math.abs(ridgeNoise(x * 0.17 * freq + 11.3, z * 0.17 * freq - 4.1));
      sum += amp * n * n;
      amp *= 0.5;
      freq *= 2.1;
    }
    return sum;
  };

  const baseHeight = (x: number, z: number) => {
    const b = bell(x, z);
    const s = shoulder(x, z);
    const hill = CERRO.H * (0.8 * b + 0.2 * cone(x, z)) + 2.3 * s + knoll(x, z);
    const onHill = Math.min(1, b * 1.6 + s * 0.4);
    const rocks = (ridged(x, z) - 0.32) * 1.9 + fbm(rock, x * 0.11 + 3.1, z * 0.11 - 1.7, 4) * 0.9;
    const fine = fbm(detail, x * 0.5, z * 0.5, 2) * 0.22;
    const ground = fbm(plain, x * 0.022, z * 0.022, 3);
    return hill + (rocks + fine) * CERRO.rough * onHill + ground * 0.45 * (1 - Math.min(1, b * 1.8));
  };

  // Cima natural (antes de la explanada).
  let peak = { x: 0, y: -Infinity, z: 0 };
  for (let x = -3; x <= 3; x += 0.2) {
    for (let z = -3; z <= 3; z += 0.2) {
      const y = baseHeight(x, z);
      if (y > peak.y) peak = { x, y, z };
    }
  }
  const plateauY = peak.y - 0.35;

  const withPlateau = (x: number, z: number) => {
    const h = baseHeight(x, z);
    const d = Math.hypot(x - peak.x, z - peak.z);
    const k = 1 - smoothstep(CERRO.plateauR * 0.7, CERRO.plateauR * 1.5, d);
    return h + (plateauY - h) * k;
  };

  // --- Camino en espiral: sube con pendiente constante desde el suroeste. ---
  const samples = 900;
  const start = -Math.PI * 0.62;
  const raw: [number, number][] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const ease = 1 - Math.pow(1 - t, 1.35);
    const ang = start + t * CERRO.roadTurns * Math.PI * 2;
    // El trazo real sigue el terreno: el radio ondula un poco en cada vuelta.
    const wobble = 1 + (0.05 * Math.sin(ang * 2.3 + 1.1) + 0.03 * Math.sin(ang * 5.2 + 0.4)) * (1 - ease * 0.7);
    const r = (CERRO.R * 1.32 * (1 - ease) + CERRO.plateauR * 0.95 * ease) * wobble;
    raw.push([Math.cos(ang) * r, Math.sin(ang) * r * CERRO.elong]);
  }
  // Altura del camino: la ladera suavizada y siempre en ascenso.
  const roadY: number[] = raw.map(([x, z]) => withPlateau(x, z));
  // Suavizado ligero: el camino sigue la ladera (poco corte y poco relleno).
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < roadY.length - 1; i++) roadY[i] = (roadY[i - 1] + roadY[i] * 2 + roadY[i + 1]) / 4;
  }
  roadY[roadY.length - 1] = Math.min(roadY[roadY.length - 1], plateauY);
  const road: [number, number, number][] = raw.map(([x, z], i) => [x, roadY[i], z]);

  // Índice espacial del camino para medir distancias rápido.
  const cell = 1.2;
  const grid = new Map<string, number[]>();
  const key = (ix: number, iz: number) => `${ix},${iz}`;
  for (let i = 0; i < road.length - 1; i++) {
    const [x, , z] = road[i];
    const k = key(Math.floor(x / cell), Math.floor(z / cell));
    const arr = grid.get(k);
    if (arr) arr.push(i);
    else grid.set(k, [i]);
  }
  const nearestRoad = (x: number, z: number): { d: number; y: number } => {
    const ix = Math.floor(x / cell);
    const iz = Math.floor(z / cell);
    let best = Infinity;
    let bestY = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const arr = grid.get(key(ix + dx, iz + dz));
        if (!arr) continue;
        for (const i of arr) {
          const [ax, ay, az] = road[i];
          const [bx, by, bz] = road[i + 1];
          const vx = bx - ax;
          const vz = bz - az;
          const len2 = vx * vx + vz * vz || 1e-9;
          const t = Math.min(1, Math.max(0, ((x - ax) * vx + (z - az) * vz) / len2));
          const px = ax + vx * t;
          const pz = az + vz * t;
          const d = Math.hypot(x - px, z - pz);
          if (d < best) {
            best = d;
            bestY = ay + (by - ay) * t;
          }
        }
      }
    }
    return { d: best, y: bestY };
  };

  const W = CERRO.roadWidth;
  const height = (x: number, z: number) => {
    const h = withPlateau(x, z);
    const { d, y } = nearestRoad(x, z);
    if (d > W * 2.2) return h;
    // Plataforma del camino + talud (corte arriba, relleno abajo).
    const k = smoothstep(W * 0.5, W * 2.2, d);
    return y + (h - y) * k;
  };

  const rockiness = (x: number, z: number) => {
    const m = hillMask(x, z);
    const up = smoothstep(0.25, 0.9, m);
    const n = ridged(x * 1.6, z * 1.6);
    return Math.min(1, Math.max(0, up * 0.55 + smoothstep(0.35, 0.75, n) * 0.6 * m));
  };

  const summit = { x: peak.x, y: height(peak.x, peak.z), z: peak.z };

  return {
    height,
    baseHeight,
    hillMask,
    rockiness,
    roadDistance: (x, z) => nearestRoad(x, z).d,
    road,
    summit,
  };
}

function smoothstep(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
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

export function spiralRoad(terrain: Terrain): [number, number, number][] {
  return terrain.road.map(([x, y, z]) => [x, y + 0.06, z] as [number, number, number]);
}

/* ------------------------------------------------------------------ */
/* Ciudad: retícula de calles (compartida por shader, casas y luces)   */
/* ------------------------------------------------------------------ */

/**
 * Retícula girada del centro de Hermosillo. Manzanas alargadas de 2.8 × 1.7
 * (a la escala visual del cerro), calles de ~0.3 y una avenida cada 5 cuadras.
 * El shader del suelo usa LOS MISMOS números (ver cityGLSL en cerro-live.ts).
 */
export const CITY = {
  rot: 0.32,
  /** Largo de la manzana (eje x de la retícula). */
  bx: 2.8,
  /** Ancho de la manzana (eje z de la retícula). */
  bz: 1.7,
  /** Medio ancho de calle. */
  street: 0.15,
  /** Una avenida cada N cuadras. */
  avenue: 5,
  /** Lotes por manzana: 6 a lo largo, 2 filas. */
  lots: 6,
  /** Separación entre postes de luz. */
  lamp: 0.7,
} as const;

/** Mundo (x, z) → retícula (en manzanas). */
export function toCity(x: number, z: number): [number, number] {
  const c = Math.cos(CITY.rot);
  const s = Math.sin(CITY.rot);
  return [(x * c - z * s) / CITY.bx, (x * s + z * c) / CITY.bz];
}

/** Retícula (en manzanas) → mundo (x, z). */
export function fromCity(gx: number, gz: number): [number, number] {
  const lx = gx * CITY.bx;
  const lz = gz * CITY.bz;
  const c = Math.cos(CITY.rot);
  const s = Math.sin(CITY.rot);
  return [lx * c + lz * s, -lx * s + lz * c];
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
  /** Frecuencia entera de parpadeo. */
  freq: number;
}

/**
 * Luces sueltas sobre los postes de las calles (las mismas posiciones que pinta
 * el shader), más densas cerca del cerro y por colonias. Son los puntos que
 * titilan; la retícula completa de alumbrado la dibuja el shader.
 */
export function cityLights(terrain: Terrain, count: number, seed = 64): CityLight[] {
  const rand = mulberry32(seed);
  const hood = createNoise2D(seed + 5);
  const lights: CityLight[] = [];
  let guard = 0;
  while (lights.length < count && guard < count * 60) {
    guard++;
    // Centro de la ciudad al poniente del cerro (hacia donde mira la cámara).
    const ang = rand() * Math.PI * 2;
    const dist = 13 + Math.pow(rand(), 1.15) * 150;
    const x0 = Math.cos(ang) * dist - 18;
    const z0 = Math.sin(ang) * dist;
    // Colonias: el ruido decide dónde hay más o menos luz.
    const density = fbm(hood, x0 * 0.03, z0 * 0.03, 3) * 0.5 + 0.5;
    if (rand() > Math.pow(density, 1.4) * 1.4) continue;
    const [qx, qz] = toCity(x0, z0);
    // A un poste de la calle más cercana (a lo largo o a lo ancho).
    const alongX = rand() < 0.62;
    let gx: number;
    let gz: number;
    if (alongX) {
      const step = CITY.lamp / CITY.bx;
      gx = (Math.round(qx / step) + 0.5 * (Math.round(qz) & 1)) * step;
      gz = Math.round(qz);
    } else {
      const step = CITY.lamp / CITY.bz;
      gx = Math.round(qx);
      gz = Math.round(qz / step) * step;
    }
    const [x, z] = fromCity(gx, gz);
    if (terrain.hillMask(x, z) > 0.06) continue;
    const r = rand();
    lights.push({
      x,
      y: terrain.height(x, z) + 0.12,
      z,
      size: 0.55 + Math.pow(rand(), 2.2) * 1.5,
      tone: r < 0.72 ? 0 : r < 0.93 ? 1 : 2,
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
