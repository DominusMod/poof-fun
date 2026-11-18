'use client';

import { useEffect, useRef } from 'react';

interface PoofSettings {
cols: string[];
a: number;
N: number;
dur: number;
sp: number;
y: number;
wave: number;
sw: number;
sz: number;
bl: number;
mb: string;
}

interface PoofParticle {
ox: number;
oy: number;
r: number;
ph: number;
c: string;
}

interface Poof {
ps: PoofParticle[];
cy: number;
}

/**
 * Poof glow background — engine logic exactly as specified; only the
 * theme keys are repo-aware (smoke/paper) so the existing toggle and
 * device default keep working, and the canvas is owned by React
 * (client effect only, never double-loaded).
 */
export default function FragmentField() {
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
const cv = canvasRef.current;
if (!cv || cv.dataset.poofRunning === '1') return;
const ctx = cv.getContext('2d');
if (!ctx) return;
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
cv.dataset.poofRunning = '1';

const T: { light: PoofSettings; dark: PoofSettings } = {
light: { cols: ['255,255,255', '255,232,250'], a: .75, N: 36, dur: 11000, sp: 1, y: .5, wave: .12, sw: 0, sz: 1.05, bl: 9, mb: 'normal' },
dark: { cols: ['150,175,235', '210,225,255'], a: .38, N: 38, dur: 10000, sp: 1, y: .5, wave: .04, sw: 0, sz: 1.1, bl: 10, mb: 'screen' },
};

const root = document.documentElement;
const mq = window.matchMedia('(prefers-color-scheme: dark)');
let W: number;
let H: number;
let v: PoofSettings;
let puff: Poof | null = null;
let begin = 0;
let gap = 0;
let raf = 0;

function size(): void {
const d = Math.min(window.devicePixelRatio || 1, 2);
W = window.innerWidth;
H = window.innerHeight;
cv!.width = W * d;
cv!.height = H * d;
ctx!.setTransform(d, 0, 0, d, 0, 0);
}
window.addEventListener('resize', size);
size();

const sm = (a: number, b: number, t: number): number => { t = Math.max(0, Math.min(1, (t - a) / (b - a))); return t * t * (3 - 2 * t); };

function mk(): Poof {
const ps: PoofParticle[] = [];
for (let i = 0; i < v.N; i++) ps.push({
ox: -Math.random() * 1.1 + .12,
oy: Math.random() + Math.random() - 1,
r: .5 + Math.random() * .7,
ph: Math.random() * 6.28,
c: v.cols[i % v.cols.length],
});
return { ps, cy: H * (v.y + (Math.random() - .5) * .14) };
}

function frame(now: number): void {
ctx!.clearRect(0, 0, W, H);
if (!puff && now >= gap) { puff = mk(); begin = now; } /* one puff per left-to-right travel */
if (puff) {
const t = (now - begin) / v.dur;
if (t >= 1) { puff = null; gap = now + 800; }
else {
const e = 1 - Math.pow(1 - t, 2),
base = Math.min(W, H) * .16 * v.sz,
env = sm(0, .12, t) * (1 - sm(.62, 1, t)),
cx = -W * .2 + e * W * 1.45;
for (const p of puff.ps) {
const dx = p.ox * W * .55 * (.3 + e),
dy = p.oy * H * .55 * (.15 + e * v.sp) + Math.sin(t * 6.28 + p.ph) * H * v.wave,
an = e * v.sw * p.r, co = Math.cos(an), si = Math.sin(an),
px = cx + dx * co - dy * si,
py = puff.cy + dx * si + dy * co,
r = base * p.r * (.35 + 1.7 * e),
a = v.a * env * (.6 + .4 * p.r);
if (a < .003) continue;
const g = ctx!.createRadialGradient(px, py, 0, px, py, r);
g.addColorStop(0, `rgba(${p.c},${a})`);
g.addColorStop(.5, `rgba(${p.c},${a * .5})`);
g.addColorStop(1, `rgba(${p.c},0)`);
ctx!.fillStyle = g;
ctx!.beginPath();
ctx!.arc(px, py, r, 0, 6.2832);
ctx!.fill();
}
}
}
raf = requestAnimationFrame(frame);
}

function mode(): 'light' | 'dark' {
const t = root.getAttribute('data-theme');
if (t === 'light' || t === 'paper') return 'light';
if (t === 'dark' || t === 'smoke') return 'dark';
return mq.matches ? 'dark' : 'light';
}
function apply(): void {
v = T[mode()];
puff = null;
gap = 0;
cv!.style.filter = 'blur(' + v.bl + 'px)';
cv!.style.mixBlendMode = v.mb;
}
mq.addEventListener('change', apply);

// optional: setPoofTheme('light' | 'dark' | 'auto')
(window as unknown as { setPoofTheme: (m: string) => void }).setPoofTheme = function (m: string): void {
if (m === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', m);
apply();
};

apply();
raf = requestAnimationFrame(frame);

return () => {
cancelAnimationFrame(raf);
window.removeEventListener('resize', size);
mq.removeEventListener('change', apply);
delete cv.dataset.poofRunning;
};
}, []);

return <canvas id="poof-canvas" ref={canvasRef} className="fragment-field" aria-hidden="true" />;
}
