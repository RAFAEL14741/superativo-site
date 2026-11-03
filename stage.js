/* SuperAtivo v14 — the logo tunnel.
   One WebGL canvas behind the page. Every chapter is a coloured wall with a red logo-triangle
   window cut in it; through the window you see the next chapter's world. Scrolling flies the
   camera through the window. The footer pulls back out so every world sits nested in one logo.
   Everything is driven by the sections' REAL positions (content boundary), never a timer. */
import * as THREE from './assets/three.module.min.js';

const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mq = matchMedia('(max-width:860px), (orientation:portrait) and (max-width:1100px)');
const fine = matchMedia('(pointer:fine)').matches;
const G = window.__G || { tx: 0, ty: 0, intro: 0 };

/* ---------- worlds: colour of the wall (a = near the window, b = far) + its objects ----------
   desktop props: [file, x, y (screen fraction at rest), width (fraction of screen width), depth (bigger = nearer), rotation] */
const WORLDS = {
  hero:      { a: '#FFFFFF', b: '#ECE8E4', glow: '#FFE9D2', lt: 1, props: [        /* one object per thing we do: training, coaching, nutrition */
    ['kettlebell', .87, .17, .11, 1.1, -8], ['dumbbell', .57, .84, .14, 1.3, 14], ['avocado', .95, .74, .09, .9, -12], ['shoe', .58, .16, .10, .7, -10], ['stopwatch', .47, .50, .05, 1.2, 8], ['bottle', .70, .92, .045, 1.6, 12]] },
  classes:   { a: '#FFF8F3', b: '#F6DDD3', glow: '#FFE2C4', lt: 1, props: [
    ['bumper', .88, .18, .13, 1.0, 12], ['rings', .58, .15, .10, .8, -8], ['jumprope', .91, .68, .10, 1.2, 6], ['medball', .58, .84, .11, 1.2, 0], ['hexdb', .78, .92, .06, 1.5, -10]] },
  coaching:  { a: '#FFF3F1', b: '#F4CDC6', glow: '#FFDCD3', lt: 1, props: [
    ['phone2', .58, .16, .07, 1.2, -10], ['clipboard', .90, .17, .10, .9, 8], ['tape2', .90, .58, .07, 1.3, 0], ['stopwatch2', .57, .82, .065, 1.3, -6], ['scale', .80, .90, .09, .8, 0]] },
  nutrition: { a: '#FCFBF2', b: '#E9EDD6', glow: '#FFF1C9', lt: 1, props: [
    ['mealprep', .88, .15, .13, 1.0, -6], ['salmon', .58, .14, .10, 1.3, 8], ['oats', .91, .56, .10, .9, 0], ['avocado', .56, .62, .08, .7, -10], ['almonds', .60, .88, .07, 1.5, 0], ['lemon', .78, .92, .07, 1.2, 14], ['tomatoes', .70, .08, .06, 1.1, 6]] },
  witor:     { a: '#FFFFFF', b: '#EFEEEA', lt: 1, props: [] },
  rules:     { a: '#F6F5F2', b: '#DEDDD8', lt: 1, props: [
    ['bottle', .92, .15, .05, 1.1, 10], ['towel', .88, .84, .11, .9, -6], ['shoe', .57, .87, .11, 1.3, -10], ['clock', .62, .14, .06, 1.5, 0], ['bag', .98, .50, .12, .7, 8]] },
  visit:     { a: '#F7F7F5', b: '#E6E5E1', lt: 1, props: [] },
  foot:      { a: '#C30A05', b: '#8A0000', props: [] },
};
/* phone: 3 objects around the window, offsets in screen widths from the window centre + width */
const PH = [[-.36, -.06, .2], [.37, -.16, .18], [.33, .12, .15]];

/* ---------- renderer ---------- */
const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mq.matches, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, mq.matches ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const FOV = 35, tanH = Math.tan(FOV / 2 * Math.PI / 180);
const cam = new THREE.PerspectiveCamera(FOV, 1, .02, 800);
scene.add(new THREE.AmbientLight(0xffffff, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(-3, 5, 6); scene.add(sun);

const secs = [...document.querySelectorAll('[data-w]')];
const N = secs.length - 1;                       // chapters with a wall; the last entry is the footer
const fades = secs.map(s => s.querySelector('[data-fade]'));
const defs = secs.map(s => WORLDS[s.id]);
secs.forEach((s, n) => { const d = defs[n]; s.style.setProperty('--wp', mixHex(d.a, d.b, .32)); });
function mixHex(a, b, t) { const A = new THREE.Color(a), B = new THREE.Color(b); return '#' + A.lerp(B, t).getHexString(); }

/* ---------- geometry: logo triangle (side 1, centroid at origin, apex up) ---------- */
const R3 = Math.sqrt(3);
const tri = s => [new THREE.Vector2(0, s / R3), new THREE.Vector2(-s / 2, -s / (2 * R3)), new THREE.Vector2(s / 2, -s / (2 * R3))];
const BAND = 0, OUT = 1;                        /* the logo fills the window edge to edge */
const DEPTH = .3;                               /* how deep the logo is */
/* the real SuperAtivo mark (traced from logo-white.png, side 1, centroid at 0, apex up): one 18-point shape.
   The S channel between its strokes is the window you see the next world through and fly through. */
const LOGO = [[0.0, 0.5774], [-0.5, -0.2887], [0.5, -0.2887], [0.2381, 0.166], [0.2247, 0.1732], [0.0728, 0.1732], [0.018, 0.2392], [-0.0666, 0.0856], [0.1834, 0.0856], [0.3449, -0.199], [-0.3451, -0.199], [-0.2874, -0.1021], [0.1775, -0.1021], [0.1267, -0.0134], [-0.2369, -0.0124], [-0.0008, 0.3949], [0.0696, 0.2732], [0.176, 0.2732]];
const DIVE = { x: -.123, y: .053 };            /* widest point of the S channel = where the camera passes */
const logoGeo = (() => {
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(LOGO.map(p => new THREE.Vector2(p[0], p[1]))),
    { depth: DEPTH, bevelEnabled: true, bevelThickness: .01, bevelSize: .006, bevelSegments: 3, curveSegments: 1 });
  g.translate(0, 0, -DEPTH + .012); return g;
})();
const logoFace = new THREE.MeshStandardMaterial({ color: 0xAA0100, roughness: .5, metalness: 0 });
const logoSide = new THREE.MeshStandardMaterial({ color: 0x6E0000, roughness: .75 });
function wallGeo(hole) {
  const sh = new THREE.Shape([new THREE.Vector2(-300, -300), new THREE.Vector2(300, -300), new THREE.Vector2(300, 300), new THREE.Vector2(-300, 300)]);
  if (hole) sh.holes.push(new THREE.Path(tri(1.002).reverse()));
  return new THREE.ShapeGeometry(sh);
}
const WALL_VS = `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const WALL_FS = `
uniform vec3 cA; uniform vec3 cB; uniform vec3 cG; uniform float uR; uniform float uG; uniform float uRing;
varying vec2 vP;
float sdTri(vec2 p, float r){ const float k = 1.7320508; p.x = abs(p.x) - r; p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0; p.x -= clamp(p.x, -2.0 * r, 0.0); return -length(p) * sign(p.y); }
void main(){
  float d = length(vP - vec2(0.0, -0.05)) / uR;
  vec3 c = mix(cA, cB, smoothstep(0.0, 1.0, d));
  vec2 g = vP - vec2(-1.4, 1.3) * uR; c += cG * uG * exp(-dot(g, g) / (uR * uR * 0.9));
  float e = sdTri(vP, ${(OUT / 2).toFixed(4)});              /* soft contact shadow around the red frame */
  c *= 1.0 - uRing * 0.16 * exp(-max(e, 0.0) / 0.05);
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}`;
const walls = [];
for (let k = 0; k <= N; k++) {
  const d = defs[k];
  const mat = new THREE.ShaderMaterial({ vertexShader: WALL_VS, fragmentShader: WALL_FS, uniforms: {
    cA: { value: new THREE.Color(d.a) }, cB: { value: new THREE.Color(d.b) }, cG: { value: new THREE.Color(d.glow || '#000000') },
    uG: { value: d.glow ? (d.lt ? .25 : .55) : 0 }, uR: { value: 2 }, uRing: { value: k < N - 1 ? 1 : 0 } } });
  const g = new THREE.Group();
  /* the last chapter (hours) is a plain wall: the page ends calm, the footer pulls back out */
  g.add(new THREE.Mesh(wallGeo(k < N - 1), mat));
  if (k < N - 1) {
    g.add(new THREE.Mesh(logoGeo, [logoFace, logoSide]));
  }
  scene.add(g); walls.push(g);
}
const wall0 = walls[0].children[0].material.uniforms, footU = walls[N].children[0].material.uniforms;
const W0 = { a: wall0.cA.value.clone(), b: wall0.cB.value.clone() };

/* ---------- objects (Flow cut-outs) as camera-facing planes at real depth ---------- */
const loader = new THREE.TextureLoader();
let texLoaded = 0;
const objs = [];
defs.forEach((d, k) => d.props.forEach((p, q) => {
  const mat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 1 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  m.visible = false; m.userData = { k, q, p, asp: 1 };
  /* soft baked shadow under each object (light walls need it or objects look pasted on) */
  const shm = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: .34 });
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shm); sh.visible = false; m.userData.sh = sh; scene.add(sh);
  loader.load(`assets/obj/${p[0]}-sh.webp`, t => { shm.map = t; shm.needsUpdate = true; });
  loader.load(`assets/obj/${p[0]}.webp`, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; mat.map = t; mat.needsUpdate = true;
    m.userData.asp = t.image.height / t.image.width; m.visible = true; texLoaded++; place(); });
  scene.add(m); objs.push(m);
}));

/* ---------- layout (depends on screen) ---------- */
let W = 0, H = 0, phone = false, R = 2.5, D = 6, VX = 0, VY = 0, CX = 0, CY = 0, holeSide = 0;
function layout() {
  W = innerWidth; H = innerHeight; phone = mq.matches;
  renderer.setSize(W, H, false); cam.aspect = W / H;
  if (phone) {                                  /* fit by width AND height: apex stays >= 80px below the top (header) */
    CX = W * .5; CY = H * .3; holeSide = Math.min(W * .66, (CY - 80) * 1.5 / .866);
    document.documentElement.style.setProperty('--hb', Math.round(CY + holeSide * .866 / 3 * OUT) + 'px');
  }
  else { holeSide = Math.min(H * .5 / .866, W * .38); CX = Math.max(W * .73, Math.min(W - holeSide / 2 - 24, 640 + holeSide / 2)); CY = H * .5; }
  VX = CX + DIVE.x * holeSide; VY = CY - DIVE.y * holeSide;
  R = .866 * H / (2 * tanH * holeSide * .866);   /* camera distance where the window is holeSide px wide */
  D = R * 2.3;
  walls.forEach((w, k) => { w.position.set(-DIVE.x, -DIVE.y, -k * D); w.children[0].material.uniforms.uR.value = R * .8; });
  place();
}
const restS = n => -n * D + R, restE = n => -n * D + R * .86;
function place() {
  if (!W) return;
  objs.forEach(m => {
    const { k, q, p, asp } = m.userData;
    const camZ = restS(k);
    let sx, sy, wpx, dist;
    if (phone) {
      if (q > 2) { m.visible = false; return; }
      const o = PH[q], U = holeSide / .66;          /* object layout scales with the doorway, not the screen width */
      wpx = o[2] * U; sx = cl(CX + o[0] * U, wpx * .55 + 8, W - wpx * .55 - 8); sy = CY + o[1] * U; dist = R * (.62 + q * .08);
    } else {
      wpx = p[3] * W; const hpx = wpx * asp;
      sx = cl(p[1] * W, wpx / 2 + 24, W - wpx / 2 - 24); sy = cl(p[2] * H, 84 + hpx / 2, H - 96 - hpx / 2);
      dist = R * cl(1 - .38 * p[4], .3, .92);
    }
    const u = 2 * dist * tanH / H;               /* world units per pixel at that distance */
    m.position.set((sx - VX) * u, (VY - sy) * u, camZ - dist);
    m.scale.set(wpx * u, wpx * asp * u, 1);
    m.rotation.z = -p[5] * Math.PI / 180;
    m.userData.base = m.position.clone();
    const sh = m.userData.sh;                    /* shadow: a bit lower and right, just behind the object */
    sh.position.set(m.position.x + wpx * u * .05, m.position.y - wpx * asp * u * .09, m.position.z - .02);
    sh.scale.set(wpx * u * 1.24, wpx * asp * u * 1.24, 1); sh.rotation.z = m.rotation.z;
    if (m.material.map) m.visible = true;
  });
  last = '';
}

/* ---------- per frame: where is the camera? ---------- */
let last = '';
const css = (el, k, v) => { if (el['_' + k] !== v) { el['_' + k] = v; el.style[k] = v; } };
function frame() {
  const tops = secs.map(s => s.getBoundingClientRect().top);
  const Zs = H * (phone ? .6 : .66), Ze = H * (phone ? .26 : .3);   /* short dive: fewer in-between frames */
  let k = 0; for (let n = 1; n <= N; n++) if (tops[n] <= Ze) k = n;
  let camZ, p = 0, fp = 0;
  const FAR = R * 1.3;
  if (k < N) {
    const secH = tops[k + 1] - tops[k];
    const creep = cl((Ze - tops[k]) / Math.max(1, secH + Ze - Zs));
    p = cl((Zs - tops[k + 1]) / (Zs - Ze)); if (rm) p = p > .5 ? 1 : 0;
    const zr = lerp(restS(k), restE(k), rm ? 0 : creep);
    if (k + 1 < N) camZ = lerp(zr, restS(k + 1), ease(p));
    else { fp = ease(p); camZ = lerp(zr, FAR, fp); }      /* footer: fly back out through every window */
  } else { fp = 1; camZ = FAR; }
  camZ += G.intro * R * 1.4;

  /* vanishing point: chapters on the right (desktop) / top (phone); footer in the middle */
  const vx = lerp(VX, W * .5 + DIVE.x * holeSide, phone ? 0 : fp), vy = lerp(VY, H * .3 - DIVE.y * holeSide, fp);
  let near = 1e9; for (let n = 0; n < N - 1; n++) near = Math.min(near, Math.abs(camZ + n * D));
  const lean = fine && !rm ? cl(near / (R * .6)) : 0;   /* no lean while passing through the S */
  const lx = G.ty * R * .05 * lean, ly = G.tx * R * .035 * lean;

  /* chapter text: the leaving one fades as the camera enters the window, the next one appears once through */
  const act = p > .5 ? k + 1 : k;
  fades.forEach((el, n) => {
    if (!el) return;
    let o = 1;
    if (n === k && k < N) o = 1 - cl((p - .08) / .3);
    if (n === k + 1) o = cl((p - .42) / .3);
    o = Math.round(o * 100) / 100;
    if (el._o !== o) { el._o = o; el.style.setProperty('--o', o); } css(el, 'pointerEvents', o < .2 ? 'none' : '');  /* text fades, its panel stays solid */
  });
  const dark = !defs[act].lt;
  document.body.classList.toggle('dk', dark);
  const bg = mixHex(defs[act].a, defs[act].b, .3);
  if (document.documentElement._bg !== bg) { document.documentElement._bg = bg; document.documentElement.style.setProperty('--bg', bg); }

  /* only the current + next world's objects (deeper ones are just clutter in the middle) */
  objs.forEach(m => { const on = !!m.material.map && !(phone && m.userData.q > 2) && (m.userData.k === k || m.userData.k === k + 1) && fp < .05; const op = m.userData.k === k ? 1 : cl((p - .04) / .3);   /* next world's objects only fade in once the dive starts */
    if (m.material.opacity !== op) { m.material.opacity = op; m.userData.sh.material.opacity = .34 * op; last = ''; }
    if (m.visible !== (on && op > 0)) { m.visible = on && op > 0; last = ''; } m.userData.sh.visible = m.visible && !!m.userData.sh.material.map && !!defs[m.userData.k].lt; });
  const key = [camZ, vx, vy, lx, ly, fp, W, H, texLoaded].map(v => Math.round(v * 1000)).join();
  if (key === last) return;
  last = key;
  /* footer: wall 0 turns footer red so the nest of worlds reads as one logo */
  wall0.cA.value.copy(W0.a).lerp(footU.cA.value, fp); wall0.cB.value.copy(W0.b).lerp(footU.cB.value, fp);
  cam.position.set(lx, ly, camZ);
  cam.updateProjectionMatrix();
  const e = cam.projectionMatrix.elements; e[8] = -(2 * vx / W - 1); e[9] = -(1 - 2 * vy / H);
  cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
  renderer.render(scene, cam);
}
function loop() { frame(); requestAnimationFrame(loop); }
layout();
addEventListener('resize', layout);
mq.addEventListener('change', layout);
requestAnimationFrame(loop);
window.__stage = { get R() { return R; }, get D() { return D; } };
