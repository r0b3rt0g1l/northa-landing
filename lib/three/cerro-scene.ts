import * as THREE from "three";
import {
  CERRO,
  STAR_NORTH,
  STAR_POINTS,
  cityLights,
  createTerrain,
  mulberry32,
  spiralRoad,
  type Terrain,
} from "./terrain";

/**
 * Escena del Cerro de la Campana: low-poly + curvas de nivel, con la estrella
 * del norte de Northa encima. La misma escena alimenta:
 *   1. la sección interactiva "Hecho en Hermosillo" (tiempo real), y
 *   2. el video del hero (scripts/render-hero-video.mjs la renderiza cuadro por cuadro).
 *
 * Todo lo animado es función pura del tiempo `t` con periodo `loopSeconds`,
 * por eso el video hace loop perfecto y el render es reproducible.
 */

export interface CerroSceneOptions {
  width: number;
  height: number;
  pixelRatio?: number;
  quality?: "high" | "low";
  preserveDrawingBuffer?: boolean;
  /** 0 = día, ~0.45 = atardecer, ~0.72 = hora azul, 1 = noche. */
  timeOfDay?: number;
  /** Periodo de todas las animaciones cíclicas (s). */
  loopSeconds?: number;
  /** Desplaza el encuadre horizontalmente (fracción del ancho). Positivo = cerro a la derecha. */
  frameShift?: number;
  /** Desplaza el encuadre verticalmente (fracción del alto). Positivo = cerro más arriba. */
  frameShiftY?: number;
  /** Amplitud de la órbita automática de cámara (grados). */
  orbitAmplitude?: number;
  /** Multiplicador de opacidad de las curvas de nivel (0–1.5). */
  contourStrength?: number;
}

export interface CerroScene {
  readonly canvas: HTMLCanvasElement;
  render(timeSeconds: number): void;
  setTimeOfDay(t: number): void;
  /** Parallax con el puntero, en rango −1..1. */
  setPointer(x: number, y: number): void;
  /** Recorrido de cámara ligado al scroll, 0..1. */
  setJourney(progress: number): void;
  /** Qué tanto de las curvas de nivel se ha "dibujado" (0..1). */
  setContourReveal(progress: number): void;
  resize(width: number, height: number, pixelRatio?: number): void;
  dispose(): void;
}

/* ------------------------------------------------------------------ */
/* Paleta por hora del día                                             */
/* ------------------------------------------------------------------ */

interface Palette {
  zenith: number;
  horizon: number;
  ground: number;
  glow: number;
  glowStrength: number;
  fog: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  sun: number;
  sunIntensity: number;
  rim: number;
  rimIntensity: number;
  exposure: number;
  lights: number;
  stars: number;
  contour: number;
  contourOpacity: number;
}

const PALETTES: [number, Palette][] = [
  [
    0,
    {
      zenith: 0x2f6fb8,
      horizon: 0xcfe4f3,
      ground: 0x9c8a74,
      glow: 0xfff1cc,
      glowStrength: 0.25,
      fog: 0xc6d9e6,
      hemiSky: 0xcfe3f7,
      hemiGround: 0x8a6e58,
      hemiIntensity: 1.2,
      sun: 0xfff0d6,
      sunIntensity: 2.6,
      rim: 0xffffff,
      rimIntensity: 0,
      exposure: 1,
      lights: 0,
      stars: 0,
      contour: 0xffffff,
      contourOpacity: 0.16,
    },
  ],
  [
    0.45,
    {
      zenith: 0x34407c,
      horizon: 0xffa36b,
      ground: 0x6b5244,
      glow: 0xff7a59,
      glowStrength: 1,
      fog: 0xd99a86,
      hemiSky: 0xffc4a0,
      hemiGround: 0x5a4236,
      hemiIntensity: 0.9,
      sun: 0xffb27a,
      sunIntensity: 1.9,
      rim: 0xff7ab3,
      rimIntensity: 0.7,
      exposure: 1,
      lights: 0.18,
      stars: 0.04,
      contour: 0xffe2cf,
      contourOpacity: 0.22,
    },
  ],
  [
    0.72,
    {
      // Hora azul: cielo azul marino de marca con la franja rosa en el horizonte.
      zenith: 0x0b1f4d,
      horizon: 0x7a1f5c,
      ground: 0x1c1d33,
      glow: 0xff3d8b,
      glowStrength: 1.3,
      fog: 0x241a45,
      hemiSky: 0x3d5aa8,
      hemiGround: 0x16182a,
      hemiIntensity: 0.6,
      sun: 0xff7ab3,
      sunIntensity: 0.6,
      rim: 0xff4d93,
      rimIntensity: 1.4,
      exposure: 1.05,
      lights: 0.85,
      stars: 0.65,
      contour: 0xff7ab3,
      contourOpacity: 0.34,
    },
  ],
  [
    1,
    {
      zenith: 0x050c22,
      horizon: 0x2c1446,
      ground: 0x0b0f1f,
      glow: 0xff2e7e,
      glowStrength: 0.85,
      fog: 0x0f1534,
      hemiSky: 0x2a3f80,
      hemiGround: 0x090b14,
      hemiIntensity: 0.38,
      sun: 0x9fb4ff,
      sunIntensity: 0.4,
      rim: 0xff2e7e,
      rimIntensity: 1.1,
      exposure: 1.1,
      lights: 1,
      stars: 1,
      contour: 0xff5c9a,
      contourOpacity: 0.4,
    },
  ],
];

const SUN_DIRS: [number, THREE.Vector3][] = [
  [0, new THREE.Vector3(-0.55, 0.8, 0.25)],
  [0.45, new THREE.Vector3(-0.95, 0.16, 0.22)],
  [0.72, new THREE.Vector3(-0.6, 0.5, -0.4)],
  [1, new THREE.Vector3(-0.3, 0.9, -0.35)],
];

// Brillo del horizonte detrás del cerro (hacia el oriente, un poco al norte).
const GLOW_DIR = new THREE.Vector3(1, 0.07, -0.16).normalize();
const RIM_DIR = new THREE.Vector3(0.85, 0.42, -0.12).normalize();

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function samplePalette(t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < PALETTES.length - 2 && clamped > PALETTES[i + 1][0]) i++;
  const [t0, a] = PALETTES[i];
  const [t1, b] = PALETTES[i + 1];
  const k = smooth((clamped - t0) / (t1 - t0));
  return { a, b, k };
}

/* ------------------------------------------------------------------ */
/* Texturas generadas en canvas                                        */
/* ------------------------------------------------------------------ */

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function glowTexture() {
  return canvasTexture(128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.18, "rgba(255,255,255,0.55)");
    g.addColorStop(0.5, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
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
    ctx.shadowColor = "rgba(255,122,179,0.9)";
    ctx.shadowBlur = 18 * k;
    path(STAR_POINTS);
    ctx.fillStyle = "#F5F5F7";
    ctx.fill();
    ctx.shadowBlur = 0;
    const g = ctx.createLinearGradient(78 * k, 18 * k, 121 * k, 100 * k);
    g.addColorStop(0, "#FF7AB3");
    g.addColorStop(1, "#FF2E7E");
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
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform vec3 uGlowColor;
  uniform vec3 uGlowDir;
  uniform float uGlowStrength;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    // El cuadro solo ve ~10° de cielo: el degradado ocurre cerca del horizonte.
    vec3 col = mix(uHorizon, uZenith, smoothstep(0.0, 0.2, h));
    col = mix(uGround, col, smoothstep(-0.12, 0.0, h));
    float g = max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(uGlowDir.x, 0.0, uGlowDir.z))), 0.0);
    float band = exp(-max(h, 0.0) * 18.0) * smoothstep(-0.06, 0.0, h);
    float halo = exp(-max(h, 0.0) * 11.0) * pow(g, 8.0) * 0.14;
    col += uGlowColor * uGlowStrength * (band * (0.35 + 0.65 * pow(g, 3.0)) + halo);
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
  uniform float uLoop;
  uniform float uIntensity;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uTwinkle;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mv.z, 0.1);
    float tw = 1.0 - uTwinkle + uTwinkle * (0.5 + 0.5 * sin(6.2831853 * (uTime / uLoop * aFreq + aPhase)));
    float fog = 1.0 - smoothstep(uFogNear, uFogFar, dist);
    vAlpha = uIntensity * tw * (0.25 + 0.75 * fog);
    vColor = aColor;
    gl_PointSize = clamp(aSize * uPixelRatio * uScale / dist, 1.0, 10.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;

const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a * vAlpha < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ */
/* Escena                                                              */
/* ------------------------------------------------------------------ */

export function createCerroScene(canvas: HTMLCanvasElement, options: CerroSceneOptions): CerroScene {
  const quality = options.quality ?? "high";
  const loop = options.loopSeconds ?? 12;
  const orbitAmp = THREE.MathUtils.degToRad(options.orbitAmplitude ?? 5);
  const contourStrength = options.contourStrength ?? 1;
  const frameShift = options.frameShift ?? 0;
  const frameShiftY = options.frameShiftY ?? 0;
  let width = options.width;
  let height = options.height;
  let pixelRatio = options.pixelRatio ?? 1;
  let timeOfDay = options.timeOfDay ?? 0.8;
  let pointerX = 0;
  let pointerY = 0;
  let journey = 0;
  let reveal = 1;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality === "high",
    alpha: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const terrain: Terrain = createTerrain();
  const rand = mulberry32(2026);
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o);
    return o;
  };

  /* ---------- Cielo ---------- */
  const skyUniforms = {
    uZenith: { value: new THREE.Color() },
    uHorizon: { value: new THREE.Color() },
    uGround: { value: new THREE.Color() },
    uGlowColor: { value: new THREE.Color() },
    uGlowDir: { value: GLOW_DIR.clone() },
    uGlowStrength: { value: 1 },
  };
  const sky = new THREE.Mesh(
    track(new THREE.SphereGeometry(800, 48, 24)),
    track(
      new THREE.ShaderMaterial({
        uniforms: skyUniforms,
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    ),
  );
  sky.renderOrder = -10;
  scene.add(sky);

  /* ---------- Estrellas del cielo ---------- */
  const starCount = quality === "high" ? 1400 : 700;
  const starPos = new Float32Array(starCount * 3);
  const starSize = new Float32Array(starCount);
  const starColor = new Float32Array(starCount * 3);
  const starPhase = new Float32Array(starCount);
  const starFreq = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    const u = rand();
    const v = rand();
    const theta = u * Math.PI * 2;
    const y = 0.04 + Math.pow(v, 0.7) * 0.96;
    const r = Math.sqrt(1 - y * y);
    starPos.set([Math.cos(theta) * r * 600, y * 600, Math.sin(theta) * r * 600], i * 3);
    starSize[i] = 0.6 + Math.pow(rand(), 3) * 2.2;
    const warm = rand();
    const c = new THREE.Color(warm < 0.15 ? 0xffd6e8 : warm < 0.3 ? 0xd6e2ff : 0xffffff);
    starColor.set([c.r, c.g, c.b], i * 3);
    starPhase[i] = rand();
    starFreq[i] = 1 + Math.floor(rand() * 4);
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSize, 1));
  starGeo.setAttribute("aColor", new THREE.BufferAttribute(starColor, 3));
  starGeo.setAttribute("aPhase", new THREE.BufferAttribute(starPhase, 1));
  starGeo.setAttribute("aFreq", new THREE.BufferAttribute(starFreq, 1));
  const starUniforms = {
    uTime: { value: 0 },
    uLoop: { value: loop },
    uIntensity: { value: 1 },
    uPixelRatio: { value: pixelRatio },
    uScale: { value: 600 * 1.4 },
    uFogNear: { value: 5000 },
    uFogFar: { value: 6000 },
    uTwinkle: { value: 0.55 },
  };
  const skyStars = new THREE.Points(
    starGeo,
    track(
      new THREE.ShaderMaterial({
        uniforms: starUniforms,
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
    ),
  );
  skyStars.renderOrder = -9;
  scene.add(skyStars);

  /* ---------- Terreno low-poly con curvas de nivel en el shader ---------- */
  const size = 300;
  const segs = quality === "high" ? 150 : 96;
  const plane = new THREE.PlaneGeometry(size, size, segs, segs);
  plane.rotateX(-Math.PI / 2);
  const pos = plane.attributes.position as THREE.BufferAttribute;
  const cell = size / segs;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let z = pos.getZ(i);
    const edge = Math.abs(x) >= size / 2 - 0.01 || Math.abs(z) >= size / 2 - 0.01;
    if (!edge) {
      x += (rand() - 0.5) * cell * 0.55;
      z += (rand() - 0.5) * cell * 0.55;
    }
    pos.setXYZ(i, x, terrain.height(x, z), z);
  }
  const terrainGeo = track(plane.toNonIndexed());
  plane.dispose();
  terrainGeo.computeVertexNormals();

  // Color por cara: tierra de desierto que se vuelve roca hacia la cima.
  const tpos = terrainGeo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(tpos.count * 3);
  const hill = new Float32Array(tpos.count);
  const cLow = new THREE.Color(0x2f2622);
  const cPlain = new THREE.Color(0x4a3a30);
  const cFlank = new THREE.Color(0x7a5a45);
  const cRock = new THREE.Color(0x9a7b62);
  const tmp = new THREE.Color();
  for (let f = 0; f < tpos.count; f += 3) {
    const cx = (tpos.getX(f) + tpos.getX(f + 1) + tpos.getX(f + 2)) / 3;
    const cy = (tpos.getY(f) + tpos.getY(f + 1) + tpos.getY(f + 2)) / 3;
    const cz = (tpos.getZ(f) + tpos.getZ(f + 1) + tpos.getZ(f + 2)) / 3;
    const m = terrain.hillMask(cx, cz);
    const hNorm = Math.min(1, Math.max(0, cy / CERRO.H));
    if (m < 0.05) tmp.copy(cLow).lerp(cPlain, Math.min(1, Math.max(0, (cy + 0.5) * 0.8)));
    else tmp.copy(cPlain).lerp(cFlank, Math.min(1, m * 1.4)).lerp(cRock, Math.pow(hNorm, 1.6) * 0.8);
    const jitter = 0.9 + rand() * 0.2;
    tmp.multiplyScalar(jitter);
    for (let k = 0; k < 3; k++) {
      colors.set([tmp.r, tmp.g, tmp.b], (f + k) * 3);
      hill[f + k] = m;
    }
  }
  terrainGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  terrainGeo.setAttribute("aHill", new THREE.BufferAttribute(hill, 1));

  const contourUniforms = {
    uContourColor: { value: new THREE.Color(0xff5c9a) },
    uContourOpacity: { value: 0.4 },
    uContourSpacing: { value: 1.5 },
    uReveal: { value: 1 },
    uMaxH: { value: terrain.summit.y },
    uTime: { value: 0 },
    uLoop: { value: loop },
    uLights: { value: 1 },
    uStreetColor: { value: new THREE.Color(0xffa94d) },
  };
  const terrainMat = track(
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.96,
      metalness: 0,
    }),
  );
  terrainMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, contourUniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute float aHill;\nvarying float vHill;\nvarying vec3 vWorldPos;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvHill = aHill;\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform vec3 uContourColor;
        uniform float uContourOpacity;
        uniform float uContourSpacing;
        uniform float uReveal;
        uniform float uMaxH;
        uniform float uTime;
        uniform float uLoop;
        uniform float uLights;
        uniform vec3 uStreetColor;
        varying float vHill;
        varying vec3 vWorldPos;
        float nh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`,
      )
      .replace(
        "#include <opaque_fragment>",
        `{
          float h = vWorldPos.y / uContourSpacing;
          float w = fwidth(h);
          float line = 1.0 - smoothstep(0.0, w * 1.4, abs(fract(h - 0.5) - 0.5));
          float revealed = 1.0 - smoothstep(uReveal * (uMaxH + 1.5) - 1.2, uReveal * (uMaxH + 1.5), vWorldPos.y);
          float scanY = fract(uTime / uLoop) * (uMaxH + 8.0) - 4.0;
          float scan = exp(-abs(vWorldPos.y - scanY) * 1.3);
          float mask = smoothstep(0.08, 0.35, vHill);
          outgoingLight += uContourColor * line * mask * revealed * uContourOpacity * (0.7 + scan * 1.6);

          // Retícula de calles de la ciudad: tenue de día, encendida de noche.
          vec2 p = vWorldPos.xz;
          float rot = 0.32;
          vec2 q = vec2(p.x * cos(rot) - p.y * sin(rot), p.x * sin(rot) + p.y * cos(rot)) / 4.2;
          vec2 gw = fwidth(q);
          vec2 gl = 1.0 - smoothstep(vec2(0.0), gw * 1.1, abs(fract(q - 0.5) - 0.5));
          float streets = max(gl.x, gl.y);
          vec2 cellId = floor(q / 4.0);
          float avenue = max(
            1.0 - smoothstep(0.0, gw.x * 1.1, abs(fract(q.x / 4.0 - 0.5) - 0.5) * 4.0),
            1.0 - smoothstep(0.0, gw.y * 1.1, abs(fract(q.y / 4.0 - 0.5) - 0.5) * 4.0)
          );
          float plain = 1.0 - smoothstep(0.03, 0.14, vHill);
          float dist = length(p);
          float cityFade = smoothstep(14.0, 22.0, dist) * (1.0 - smoothstep(60.0, 190.0, dist));
          float hoodA = nh(floor(q / 5.0));
          float hoodB = nh(floor(q / 2.0) + 17.0);
          float density = smoothstep(0.35, 0.95, hoodA) * (0.45 + 0.55 * hoodB);
          float glow = (streets * 0.12 + avenue * 0.6) * plain * cityFade * density;
          outgoingLight += uStreetColor * glow * uLights * 0.45;
          outgoingLight *= 1.0 + streets * plain * cityFade * (1.0 - uLights) * 0.18;
        }
        #include <opaque_fragment>`,
      );
  };
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrainMesh);

  // Explanada lejana: tapa el borde del terreno hasta la sierra.
  const apron = new THREE.Mesh(
    track(new THREE.CircleGeometry(900, 64)),
    track(new THREE.MeshStandardMaterial({ color: 0x2a221f, roughness: 1 })),
  );
  apron.rotation.x = -Math.PI / 2;
  apron.position.y = -0.8;
  scene.add(apron);

  /* ---------- Sierra lejana (anillo low-poly) ---------- */
  {
    const ringSegs = 96;
    const verts: number[] = [];
    const cols: number[] = [];
    const near = new THREE.Color(0x3a2d33);
    const far = new THREE.Color(0x2a2238);
    for (let layer = 0; layer < 2; layer++) {
      const radius = layer === 0 ? 250 : 360;
      const base = layer === 0 ? 6 : 12;
      const amp = layer === 0 ? 9 : 20;
      const peaks: number[] = [];
      for (let i = 0; i <= ringSegs; i++) {
        peaks.push(i === ringSegs ? peaks[0] : base * 0.4 + rand() * amp * (0.35 + 0.65 * rand()));
      }
      const col = layer === 0 ? near : far;
      for (let i = 0; i < ringSegs; i++) {
        const a0 = (i / ringSegs) * Math.PI * 2;
        const a1 = ((i + 1) / ringSegs) * Math.PI * 2;
        const p0 = [Math.cos(a0) * radius, -2, Math.sin(a0) * radius];
        const p1 = [Math.cos(a1) * radius, -2, Math.sin(a1) * radius];
        const q0 = [Math.cos(a0) * radius, peaks[i], Math.sin(a0) * radius];
        const q1 = [Math.cos(a1) * radius, peaks[i + 1], Math.sin(a1) * radius];
        verts.push(...p0, ...q0, ...p1, ...p1, ...q0, ...q1);
        for (let k = 0; k < 6; k++) cols.push(col.r, col.g, col.b);
      }
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    g.computeVertexNormals();
    const m = track(
      new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, side: THREE.DoubleSide }),
    );
    scene.add(new THREE.Mesh(g, m));
  }

  /* ---------- Camino en espiral + lámparas ---------- */
  const roadPts = spiralRoad(terrain).map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const roadCurve = new THREE.CatmullRomCurve3(roadPts);
  const road = new THREE.Mesh(
    track(new THREE.TubeGeometry(roadCurve, quality === "high" ? 420 : 220, 0.09, 3, false)),
    track(new THREE.MeshStandardMaterial({ color: 0x6d625b, roughness: 1 })),
  );
  scene.add(road);

  const lampCount = quality === "high" ? 90 : 60;
  const lampPos = new Float32Array(lampCount * 3);
  const lampSize = new Float32Array(lampCount);
  const lampColor = new Float32Array(lampCount * 3);
  const lampPhase = new Float32Array(lampCount);
  const lampFreq = new Float32Array(lampCount);
  const warm = new THREE.Color(0xffc27a);
  for (let i = 0; i < lampCount; i++) {
    const p = roadCurve.getPointAt(i / (lampCount - 1));
    lampPos.set([p.x, p.y + 0.3, p.z], i * 3);
    lampSize[i] = 2.8;
    lampColor.set([warm.r, warm.g, warm.b], i * 3);
    lampPhase[i] = rand();
    lampFreq[i] = 1;
  }
  const lampGeo = track(new THREE.BufferGeometry());
  lampGeo.setAttribute("position", new THREE.BufferAttribute(lampPos, 3));
  lampGeo.setAttribute("aSize", new THREE.BufferAttribute(lampSize, 1));
  lampGeo.setAttribute("aColor", new THREE.BufferAttribute(lampColor, 3));
  lampGeo.setAttribute("aPhase", new THREE.BufferAttribute(lampPhase, 1));
  lampGeo.setAttribute("aFreq", new THREE.BufferAttribute(lampFreq, 1));
  const lampUniforms = {
    uTime: { value: 0 },
    uLoop: { value: loop },
    uIntensity: { value: 1 },
    uPixelRatio: { value: pixelRatio },
    uScale: { value: 260 },
    uFogNear: { value: 120 },
    uFogFar: { value: 320 },
    uTwinkle: { value: 0.12 },
  };
  scene.add(
    new THREE.Points(
      lampGeo,
      track(
        new THREE.ShaderMaterial({
          uniforms: lampUniforms,
          vertexShader: pointsVertex,
          fragmentShader: pointsFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    ),
  );

  /* ---------- Luces de la ciudad ---------- */
  const lights = cityLights(terrain, quality === "high" ? 5200 : 2400);
  const tones = [new THREE.Color(0xffcf8a), new THREE.Color(0xfff2df), new THREE.Color(0xbfd7ff)];
  const cityPos = new Float32Array(lights.length * 3);
  const citySize = new Float32Array(lights.length);
  const cityColor = new Float32Array(lights.length * 3);
  const cityPhase = new Float32Array(lights.length);
  const cityFreq = new Float32Array(lights.length);
  lights.forEach((l, i) => {
    cityPos.set([l.x, l.y, l.z], i * 3);
    citySize[i] = l.size;
    const c = tones[l.tone];
    cityColor.set([c.r, c.g, c.b], i * 3);
    cityPhase[i] = l.phase;
    cityFreq[i] = l.freq;
  });
  const cityGeo = track(new THREE.BufferGeometry());
  cityGeo.setAttribute("position", new THREE.BufferAttribute(cityPos, 3));
  cityGeo.setAttribute("aSize", new THREE.BufferAttribute(citySize, 1));
  cityGeo.setAttribute("aColor", new THREE.BufferAttribute(cityColor, 3));
  cityGeo.setAttribute("aPhase", new THREE.BufferAttribute(cityPhase, 1));
  cityGeo.setAttribute("aFreq", new THREE.BufferAttribute(cityFreq, 1));
  const cityUniforms = {
    uTime: { value: 0 },
    uLoop: { value: loop },
    uIntensity: { value: 1 },
    uPixelRatio: { value: pixelRatio },
    uScale: { value: 300 },
    uFogNear: { value: 90 },
    uFogFar: { value: 300 },
    uTwinkle: { value: 0.35 },
  };
  scene.add(
    new THREE.Points(
      cityGeo,
      track(
        new THREE.ShaderMaterial({
          uniforms: cityUniforms,
          vertexShader: pointsVertex,
          fragmentShader: pointsFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    ),
  );

  /* ---------- Antenas en la cima (1968) ---------- */
  const glowTex = track(glowTexture());
  const antennaLights: THREE.Sprite[] = [];
  {
    const mastMat = track(new THREE.MeshStandardMaterial({ color: 0x8b8f99, roughness: 0.5, metalness: 0.6 }));
    const masts: [number, number, number][] = [
      [-0.9, 0.3, 3.4],
      [0.8, -0.8, 4.6],
      [0.3, 1.3, 2.7],
    ];
    masts.forEach(([dx, dz, h], i) => {
      const x = terrain.summit.x + dx;
      const z = terrain.summit.z + dz;
      const y = terrain.height(x, z);
      const mast = new THREE.Mesh(track(new THREE.CylinderGeometry(0.05, 0.11, h, 5)), mastMat);
      mast.position.set(x, y + h / 2, z);
      scene.add(mast);
      const light = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({
            map: glowTex,
            color: 0xff2e7e,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
      light.position.set(x, y + h + 0.1, z);
      light.scale.setScalar(1.7);
      light.userData.phase = i * 0.21;
      scene.add(light);
      antennaLights.push(light);
    });
  }

  /* ---------- Estrella del norte de Northa ---------- */
  const starTex = track(starTexture());
  const star = new THREE.Sprite(
    track(new THREE.SpriteMaterial({ map: starTex, transparent: true, depthWrite: false, fog: false })),
  );
  const starBase = new THREE.Vector3(terrain.summit.x + 4, terrain.summit.y + 9, terrain.summit.z - 3.5);
  star.scale.setScalar(5.2);
  star.renderOrder = 5;
  scene.add(star);
  const starGlow = new THREE.Sprite(
    track(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xff4d93,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
    ),
  );
  starGlow.scale.setScalar(20);
  starGlow.renderOrder = 4;
  scene.add(starGlow);

  /* ---------- Luces ---------- */
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xff4d93, 1);
  scene.add(rim);
  scene.fog = new THREE.Fog(0x000000, 110, 420);

  /* ---------- Cámara ---------- */
  const camera = new THREE.PerspectiveCamera(32, width / height, 0.5, 2000);
  const target = new THREE.Vector3(0, 8.5, 0);

  function applyFraming() {
    const aspect = width / height;
    camera.aspect = aspect;
    // En vertical abrimos el campo de visión para que la campana quepa completa.
    camera.fov = aspect < 0.8 ? 54 : aspect < 1.2 ? 42 : 34;
    if (frameShift !== 0 || frameShiftY !== 0) {
      camera.setViewOffset(width, height, -frameShift * width, frameShiftY * height, width, height);
    } else {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  }
  applyFraming();

  const baseAz = Math.PI + THREE.MathUtils.degToRad(6);
  const baseEl = THREE.MathUtils.degToRad(1.5);

  function placeCamera(t: number) {
    const aspect = width / height;
    const phase = (t / loop) * Math.PI * 2;
    const az =
      baseAz +
      Math.sin(phase) * orbitAmp +
      pointerX * THREE.MathUtils.degToRad(5) +
      journey * THREE.MathUtils.degToRad(-26);
    const el = baseEl + Math.sin(phase * 2) * orbitAmp * 0.12 + pointerY * THREE.MathUtils.degToRad(2.5) + journey * 0.05;
    const radius = (aspect < 0.8 ? 78 : 70) - journey * 14;
    camera.position.set(
      target.x + Math.cos(az) * Math.cos(el) * radius,
      target.y + Math.sin(el) * radius,
      target.z + Math.sin(az) * Math.cos(el) * radius,
    );
    camera.lookAt(target);
  }

  /* ---------- Paleta ---------- */
  const cA = new THREE.Color();
  const cB = new THREE.Color();
  const lerpColor = (out: THREE.Color, a: number, b: number, k: number) =>
    out.copy(cA.setHex(a)).lerp(cB.setHex(b), k);
  const sunDir = new THREE.Vector3();

  function applyTimeOfDay() {
    const { a, b, k } = samplePalette(timeOfDay);
    const mix = (x: number, y: number) => x + (y - x) * k;
    lerpColor(skyUniforms.uZenith.value, a.zenith, b.zenith, k);
    lerpColor(skyUniforms.uHorizon.value, a.horizon, b.horizon, k);
    lerpColor(skyUniforms.uGround.value, a.ground, b.ground, k);
    lerpColor(skyUniforms.uGlowColor.value, a.glow, b.glow, k);
    skyUniforms.uGlowStrength.value = mix(a.glowStrength, b.glowStrength);
    lerpColor((scene.fog as THREE.Fog).color, a.fog, b.fog, k);
    lerpColor(hemi.color, a.hemiSky, b.hemiSky, k);
    lerpColor(hemi.groundColor, a.hemiGround, b.hemiGround, k);
    hemi.intensity = mix(a.hemiIntensity, b.hemiIntensity);
    lerpColor(sun.color, a.sun, b.sun, k);
    sun.intensity = mix(a.sunIntensity, b.sunIntensity);
    lerpColor(rim.color, a.rim, b.rim, k);
    rim.intensity = mix(a.rimIntensity, b.rimIntensity);
    renderer.toneMappingExposure = mix(a.exposure, b.exposure);
    const lightsOn = mix(a.lights, b.lights);
    cityUniforms.uIntensity.value = lightsOn;
    contourUniforms.uLights.value = lightsOn;
    lampUniforms.uIntensity.value = lightsOn * 1.2;
    starUniforms.uIntensity.value = mix(a.stars, b.stars);
    lerpColor(contourUniforms.uContourColor.value, a.contour, b.contour, k);
    contourUniforms.uContourOpacity.value = mix(a.contourOpacity, b.contourOpacity) * contourStrength;
    (starGlow.material as THREE.SpriteMaterial).opacity = 0.25 + 0.55 * mix(a.stars, b.stars);

    // Dirección del sol interpolada entre llaves.
    let i = 0;
    while (i < SUN_DIRS.length - 2 && timeOfDay > SUN_DIRS[i + 1][0]) i++;
    const [s0, d0] = SUN_DIRS[i];
    const [s1, d1] = SUN_DIRS[i + 1];
    const sk = smooth(Math.min(1, Math.max(0, (timeOfDay - s0) / (s1 - s0))));
    sunDir.copy(d0).lerp(d1, sk).normalize();
    sun.position.copy(sunDir).multiplyScalar(100);
    rim.position.copy(RIM_DIR).multiplyScalar(100);
  }
  applyTimeOfDay();

  /* ---------- API ---------- */
  function render(t: number) {
    const phase = (t / loop) * Math.PI * 2;
    starUniforms.uTime.value = t;
    cityUniforms.uTime.value = t;
    lampUniforms.uTime.value = t;
    contourUniforms.uTime.value = t;
    contourUniforms.uReveal.value = reveal;

    // Estrella: flota suave y respira (periodos que dividen al loop).
    star.position.copy(starBase);
    star.position.y += Math.sin(phase * 2) * 0.35;
    starGlow.position.copy(star.position);
    const breathe = 1 + Math.sin(phase * 4) * 0.06;
    starGlow.scale.setScalar(20 * breathe);

    // Antenas: parpadeo de 1.5 s (8 por ciclo de 12 s).
    antennaLights.forEach((s) => {
      const p = ((t / (loop / 8) + (s.userData.phase as number)) % 1 + 1) % 1;
      const on = p < 0.45 ? 1 : 0.12;
      (s.material as THREE.SpriteMaterial).opacity = on * (0.35 + 0.65 * Math.min(1, timeOfDay * 1.4));
      s.scale.setScalar(on > 0.5 ? 1.9 : 1.2);
    });

    placeCamera(t);
    renderer.render(scene, camera);
  }

  return {
    canvas,
    render,
    setTimeOfDay(t: number) {
      timeOfDay = Math.min(1, Math.max(0, t));
      applyTimeOfDay();
    },
    setPointer(x: number, y: number) {
      pointerX = Math.max(-1, Math.min(1, x));
      pointerY = Math.max(-1, Math.min(1, y));
    },
    setJourney(p: number) {
      journey = Math.max(0, Math.min(1, p));
    },
    setContourReveal(p: number) {
      reveal = Math.max(0, Math.min(1, p));
    },
    resize(w: number, h: number, dpr?: number) {
      width = Math.max(1, Math.floor(w));
      height = Math.max(1, Math.floor(h));
      if (dpr) {
        pixelRatio = dpr;
        renderer.setPixelRatio(dpr);
        starUniforms.uPixelRatio.value = dpr;
        cityUniforms.uPixelRatio.value = dpr;
        lampUniforms.uPixelRatio.value = dpr;
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
