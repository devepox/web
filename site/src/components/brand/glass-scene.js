// @ts-check
/**
 * The epox holographic-glass wordmark, as one plain three.js scene (no React, no framework).
 * Shared by the live hero logo (GlassLogo.tsx) and the fallback loop renderer (scripts/logo-3d/loop.js), so the
 * phone / low-power video always matches the live logo.
 *
 * Look: the exact brand wordmark, extruded and bevelled, as clear glass with a thin-film (holographic) coating and
 * a little dispersion (rainbow fringes on the edges). Behind it, the three foil bars of the brand device, which the
 * glass bends. Lit by a studio of Ice Mint softboxes; the studio turns with the site's one light (the cursor), so
 * reflections sweep across the letters as you move.
 *
 * Cost: smooth (creased) normals let the letters use far fewer curve and bevel segments than before for a smoother
 * result; the scene renders only while it is on screen, at full rate only while something moves (cursor, scroll,
 * the opening turn) and at 30 fps for the idle sway; resolution steps down on its own if frames run slow.
 */
import {
  ACESFilmicToneMapping, BackSide, BufferAttribute, BufferGeometry, CanvasTexture, Color, DoubleSide, ExtrudeGeometry, MathUtils, Mesh, MeshBasicMaterial,
  MeshPhysicalMaterial, MirroredRepeatWrapping, PerspectiveCamera, PlaneGeometry, PMREMGenerator, Scene, ShaderMaterial,
  SphereGeometry, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries, toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** the backdrop's three bars [left, top, height] on its 2048 × 1024 texture: thick bars, narrow gaps, so the glass
 *  always has foil behind it to bend, and the dark gaps run through the letters as bent lines */
const BARS = [[300, 60, 280], [240, 400, 280], [180, 740, 280]];
/** bevel depth and width (wordmark units; the word is ~1000 wide) */
const BEVEL = { thickness: 22, size: 13 };
const FOIL = ['#BFE3FF', '#E2FFF4', '#8FC9FF', '#7FF5D0', '#E4FBFF', '#A8F0E0'];
const BG = '#0B0C0F';

/** detail per use: the live logo is light; the exported video can afford more segments */
export const QUALITY = {
  live: { curve: 10, bevel: 4 },
  export: { curve: 22, bevel: 9 },
};

/**
 * Ice Mint studio: softboxes in the foil stops around a dark room (only ever seen as reflections)
 * @param {WebGLRenderer} renderer @param {number} room brightness of the room fill (top of the dome)
 */
function studio(renderer, room) {
  const env = new Scene(); env.background = new Color('#05060a');
  /** @param {import('three').ColorRepresentation} color @param {number} w @param {number} h @param {number[]} pos @param {number[]} rot @param {number} [k] @param {import('three').Texture} [map] */
  const panel = (color, w, h, pos, rot, k = 1, map) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(color).multiplyScalar(k), side: DoubleSide, ...(map ? { map } : {}) }));
    m.position.set(pos[0], pos[1], pos[2]); m.rotation.set(rot[0], rot[1], rot[2]); env.add(m); return m;
  };
  // banded softbox in front of the letters. Its middle (what the flat faces reflect straight back) is a wide white band,
  // so the glass reads clear and bright; the colour bands sit toward its edges and sweep across the faces as the
  // studio turns with the cursor
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 512; const x = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  x.fillStyle = '#000'; x.fillRect(0, 0, 64, 512);
  [['#E2FFF4', 10, 40], ['#8FC9FF', 80, 60], ['#FFFFFF', 168, 196], ['#7FF5D0', 392, 46], ['#E4FBFF', 460, 40]].forEach(([c, y, h]) => { x.fillStyle = /** @type {string} */ (c); x.fillRect(0, /** @type {number} */ (y), 64, /** @type {number} */ (h)); });
  const bands = new CanvasTexture(cv); bands.colorSpace = SRGBColorSpace;
  panel(new Color(2.4, 2.4, 2.4), 12, 8, [0, 1.5, 5], [0, 0, 0], 1, bands).lookAt(0, 0, 0);
  panel('#7FF5D0', 3.5, 6, [-5, 0, 4], [0, Math.PI / 3, 0], 1.7);
  panel('#8FC9FF', 3.5, 6, [5, 0.4, 4], [0, -Math.PI / 3, 0], 1.9);
  panel('#E4FBFF', 10, 0.5, [0, -2.2, 5], [Math.PI / 5, 0, 0], 2.6);
  // a narrow white key strip off to one side: as the studio turns with the cursor it slides across the faces
  panel('#FFFFFF', 0.6, 9, [3.2, 0, 4.4], [0, -0.6, 0], 3.2);
  panel('#BFE3FF', 9, 0.8, [0, 2.5, -5], [Math.PI / 3, 0, 0], 2.0);
  panel('#A8F0E0', 0.8, 6, [-6, 0, -2], [0, Math.PI / 2, 0], 1.5);
  panel('#E2FFF4', 0.8, 6, [6, 0, -2], [0, -Math.PI / 2, 0], 1.5);
  // soft room fill so nothing reflects pure black
  env.add(new Mesh(new SphereGeometry(20, 32, 16), new ShaderMaterial({ side: BackSide,
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `varying vec3 p; void main(){ float t = p.y*0.5+0.5; gl_FragColor = vec4(mix(vec3(0.05,0.06,0.08), vec3(${room.toFixed(3)}, ${(room * 1.18).toFixed(3)}, ${(room * 1.36).toFixed(3)}), t), 1.); }` })));
  const pmrem = new PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.035).texture;
  pmrem.dispose(); bands.dispose();
  env.traverse(o => { if (o instanceof Mesh) { o.geometry.dispose(); o.material.dispose(); } });
  return tex;
}

/**
 * the wordmark: brand path → shapes → bevelled extrusion. The flat faces (lids) keep flat normals; the bevels and side
 * walls get creased normals, so curves and the rounded bevel shade smoothly while the letters' corners stay crisp.
 * @param {string} path @param {{ curve: number, bevel: number }} q
 */
function wordmark(path, q) {
  const shapes = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`).paths.flatMap(p => SVGLoader.createShapes(p));
  /** @type {import('three').BufferGeometry[]} */
  const lids = [];
  /** @type {import('three').BufferGeometry[]} */
  const sides = [];
  for (const shape of shapes) {
    const g = new ExtrudeGeometry(shape, { depth: 70, curveSegments: q.curve, bevelEnabled: true, bevelThickness: BEVEL.thickness, bevelSize: BEVEL.size, bevelSegments: q.bevel });
    const pos = /** @type {import('three').BufferAttribute} */ (g.getAttribute('position'));
    for (const grp of g.groups) {
      const part = new BufferGeometry();
      part.setAttribute('position', new BufferAttribute(pos.array.slice(grp.start * 3, (grp.start + grp.count) * 3), 3));
      (grp.materialIndex === 0 ? lids : sides).push(part);
    }
    g.dispose();
  }
  const lid = /** @type {import('three').BufferGeometry} */ (mergeGeometries(lids)); lid.computeVertexNormals();
  const side = toCreasedNormals(/** @type {import('three').BufferGeometry} */ (mergeGeometries(sides)), MathUtils.degToRad(60));
  const geo = /** @type {import('three').BufferGeometry} */ (mergeGeometries([lid, side]));
  [...lids, ...sides, lid, side].forEach(x => x.dispose());
  // SVG y points down: mirror y, and z with it, so the triangles keep their winding (front faces stay front faces)
  geo.scale(1, -1, -1);
  geo.computeBoundingBox(); const c = new Vector3(); /** @type {import('three').Box3} */ (geo.boundingBox).getCenter(c);
  geo.translate(-c.x, -c.y, -c.z); geo.computeBoundingBox();
  return geo;
}

/** the three foil bars (brand device) as a flat backdrop for the glass to bend: foil gradient + the fine diagonal grain */
/** @param {number[][]} layout bars as [left x, top y, height] on a 2048 × 1024 canvas */
function barsTexture(layout) {
  const W = 2048, H = 1024;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
  x.fillStyle = BG; x.fillRect(0, 0, W, H);
  const bars = new Path2D();
  // left ends slant like the E (0.44 across per 1 down)
  layout.forEach(([l, y, h]) => { bars.moveTo(l + h * 0.44, y); bars.lineTo(W, y); bars.lineTo(W, y + h); bars.lineTo(l, y + h); bars.closePath(); });
  const g = x.createLinearGradient(0, 0, W, H); FOIL.forEach((c, i) => g.addColorStop(i / 5, c));
  x.save(); x.filter = 'blur(2px)'; x.fillStyle = g; x.fill(bars); x.restore();
  // grain: thin light lines at the foil's angle, only on the bars
  x.save(); x.clip(bars); x.strokeStyle = 'rgba(255,255,255,0.16)'; x.lineWidth = 2;
  for (let i = -H; i < W + H; i += 7) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + H * Math.tan(MathUtils.degToRad(35)), H); x.stroke(); }
  x.restore();
  const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.wrapS = MirroredRepeatWrapping; t.anisotropy = 4;
  return t;
}

/** @param {number} t */
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ path: string, quality?: keyof typeof QUALITY, fit?: number, bars?: { x: number, y: number, s: number },
 *           dpr?: number, preserve?: boolean, intro?: boolean,
 *           look?: { material?: import('three').MeshPhysicalMaterialParameters, bevel?: { thickness: number, size: number }, exposure?: number, bars?: number[][], room?: number } }} o
 *   look: tuning overrides for the render harness only (the site uses the defaults)
 */
export function createGlassScene(canvas, o) {
  const t0 = performance.now();
  const q = QUALITY[o.quality ?? 'live'];
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!o.preserve });
  renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; renderer.outputColorSpace = SRGBColorSpace;
  let dpr = o.dpr ?? 1; renderer.setPixelRatio(dpr);

  const scene = new Scene(); scene.background = new Color(BG);
  scene.environment = studio(renderer, o.look?.room ?? 0.42);
  const camera = new PerspectiveCamera(28, 16 / 9, 10, 10000); camera.position.set(0, 0, 2300);

  if (o.look?.bevel) Object.assign(BEVEL, o.look.bevel);
  if (o.look?.exposure) renderer.toneMappingExposure = o.look.exposure;
  const geo = wordmark(o.path, q);
  const glass = new MeshPhysicalMaterial({
    color: '#F4FBFF', metalness: 0, roughness: 0.06, transmission: 1, thickness: 70, ior: 1.55, dispersion: 6,
    iridescence: 0.8, iridescenceIOR: 1.32, iridescenceThicknessRange: [220, 920], envMapIntensity: 1.9,
    clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, specularColor: new Color('#E4FBFF'),
    attenuationColor: new Color('#CFEFFF'), attenuationDistance: 1100,
    ...(o.look?.material ?? {}),
  });
  const logo = new Mesh(geo, glass); scene.add(logo);
  const barsTex = barsTexture(o.look?.bars ?? BARS);
  // the middle bar sits behind most of the word, so the glass has foil to bend and glows; the bars' slanted ends cross
  // the first letter, so you see the glass change from the black ground to the foil
  const b = o.bars ?? { x: 340, y: 60, s: 1.15 };
  const backdrop = new Mesh(new PlaneGeometry(2600, 1300), new MeshBasicMaterial({ map: barsTex, toneMapped: false }));
  backdrop.position.set(b.x, b.y, -900); backdrop.scale.setScalar(b.s); scene.add(backdrop);
  const setupMs = performance.now() - t0;
  // compile the glass shaders off the main thread where the browser can (KHR_parallel_shader_compile), so the first
  // frame does not freeze the page; the live loop waits for it
  let compiled = false;
  const compiling = renderer.compileAsync(scene, camera).catch(() => {}).then(() => { compiled = true; if (active && !raf) raf = requestAnimationFrame(frame); });

  // ---- size: the word fills `fit` of the frame width at any aspect
  const bb = /** @type {import('three').Box3} */ (geo.boundingBox);
  let w = 1, h = 1;
  /** @param {number} width @param {number} height */
  function resize(width, height) {
    w = Math.max(1, width); h = Math.max(1, height);
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const viewW = 2 * camera.position.z * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    logo.scale.setScalar(((o.fit ?? 0.6) * viewW) / (bb.max.x - bb.min.x));
  }

  // ---- motion state: light (cursor) 0..1, scroll 0..1 (hero leaving), opening turn
  const light = { x: 0.5, y: 0.4 }, cur = { ry: 0, rx: 0, ey: 0, ex: 0 };
  let scroll = 0, intro = o.intro === false ? 1 : 0, clock = 0;
  /** @param {number} dt @param {{ x: number, y: number }} sway */
  function pose(dt, sway) {
    const ty = (light.x - 0.5) * 0.7 + sway.y;
    const tx = (light.y - 0.5) * 0.35 + sway.x - 0.04 + scroll * 0.45;
    const k = 1 - Math.exp(-dt * 3.2);
    cur.ry += (ty - cur.ry) * k; cur.rx += (tx - cur.rx) * k;
    // the studio turns further than the letters, so the reflections visibly slide across them
    cur.ey += ((light.x - 0.5) * 1.4 - cur.ey) * k; cur.ex += ((light.y - 0.5) * 0.5 - cur.ex) * k;
    const e = easeOut(intro);
    logo.rotation.set(cur.rx, cur.ry + (1 - e) * 0.9, 0);
    logo.position.set(0, (1 - e) * -60, (1 - e) * -260);
    scene.environmentRotation.set(cur.ex, cur.ey, 0);
    barsTex.offset.x = (light.x - 0.5) * 0.12 + sway.y * 0.25;
    return Math.abs(ty - cur.ry) + Math.abs(tx - cur.rx) > 0.0004 || intro < 1;
  }

  // ---- live loop: on screen only; full rate while moving, 30 fps idle sway; steps resolution down if slow
  let active = false, raf = 0, last = 0, skip = false, firstFrame = /** @type {null | (() => void)} */ (null);
  /** @type {number[]} */
  const slow = []; let downgrades = 0;
  /** @param {number} now */
  function frame(now) {
    raf = 0; if (!active || !compiled) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60; last = now;
    clock += dt; if (intro < 1) intro = Math.min(1, intro + dt / 1.6);
    const busy = pose(dt, { y: Math.sin(clock * 0.35) * 0.08, x: Math.cos(clock * 0.3) * 0.04 });
    skip = !busy && !skip;
    if (!skip) {
      renderer.render(scene, camera);
      if (firstFrame) { const f = firstFrame; firstFrame = null; requestAnimationFrame(() => f()); }
      if (busy && downgrades < 3) {
        slow.push(dt);
        if (slow.length >= 45) {
          const m = slow.sort((a, c) => a - c)[22]; slow.length = 0;
          if (m > 0.024 && dpr > 0.75) { dpr = Math.max(0.75, dpr - 0.25); downgrades++; renderer.setPixelRatio(dpr); resize(w, h); }
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  return {
    setupMs,
    /** resolves when the shaders are ready (the export harness waits for it before its first frame) */
    compiling,
    resize,
    /** @param {number} x @param {number} y */
    setLight(x, y) { light.x = x; light.y = y; },
    /** @param {number} p */
    setScroll(p) { scroll = Math.max(0, Math.min(1, p)); },
    /** start / stop the live loop (off screen = no frames at all) */
    /** @param {boolean} on */
    setActive(on) { active = on; last = 0; if (on && !raf) raf = requestAnimationFrame(frame); },
    /** resolves after the first frame is on screen */
    /** @param {() => void} fn */
    onFirstFrame(fn) { firstFrame = fn; },
    get dpr() { return dpr; },
    /** export: one frame of the seamless loop, phase in [0, 1): a calm sway, the studio sweeping with it */
    /** @param {number} phase @param {number} [sway] */
    renderAt(phase, sway = 0.7) {
      const a = phase * Math.PI * 2; intro = 1;
      light.x = 0.5 + Math.sin(a) * 0.32 * sway; light.y = 0.42 + Math.cos(a) * 0.12 * sway;
      // settle fully on the pose for this phase (no easing lag in a video)
      for (let i = 0; i < 40; i++) pose(1, { y: Math.sin(a) * 0.1 * sway, x: Math.cos(a) * 0.05 * sway });
      renderer.render(scene, camera);
    },
    dispose() {
      active = false; cancelAnimationFrame(raf);
      geo.dispose(); glass.dispose(); barsTex.dispose(); backdrop.geometry.dispose(); backdrop.material.dispose();
      scene.environment?.dispose(); renderer.dispose();
    },
  };
}
