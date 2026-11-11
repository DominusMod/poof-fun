'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

interface Shard {
  x: number;
  y: number;
  size: number;
  angle: number;
  spin: number;
  vx: number;
  vy: number;
  phase: number;
  fadeSpeed: number;
  alpha: number;
  color: string;
  radii: [number, number, number, number];
  skew: [number, number, number, number];
  ox: number;
  oy: number;
  ovx: number;
  ovy: number;
}

interface Palette {
  colors: string[];
  tinted: string[];
  tintCount: number;
  sizeMin: number;
  sizeMax: number;
  alphaMin: number;
  alphaMax: number;
  tintAlphaMin: number;
  tintAlphaMax: number;
  vyMin: number;
  vyMax: number;
  vxMax: number;
}

/** Ink Smoke: large soft off-white shards, three tinted for the tokens. */
const SMOKE: Palette = {
  colors: ['#EDE9E3'],
  tinted: ['#f5820b', '#4f8ff7', '#3fce6f'],
  tintCount: 3,
  sizeMin: 30,
  sizeMax: 96,
  alphaMin: 0.025,
  alphaMax: 0.06,
  tintAlphaMin: 0.05,
  tintAlphaMax: 0.09,
  vyMin: -14,
  vyMax: -5,
  vxMax: 7,
};

/** Cold Paper: thin charcoal/slate torn-paper fragments. */
const PAPER: Palette = {
  colors: ['#2B3A4A', '#5C6B7C', '#8796A6'],
  tinted: [],
  tintCount: 0,
  sizeMin: 14,
  sizeMax: 46,
  alphaMin: 0.05,
  alphaMax: 0.11,
  tintAlphaMin: 0.05,
  tintAlphaMax: 0.11,
  vyMin: -10,
  vyMax: -3,
  vxMax: 9,
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeShards(w: number, h: number, p: Palette): Shard[] {
  const count = Math.round(Math.min(80, Math.max(26, (w * h) / 26000)));
  const shards: Shard[] = [];
  for (let i = 0; i < count; i++) {
    const tinted = i < p.tintCount;
    shards.push({
      x: rand(0, w),
      y: rand(0, h),
      size: rand(p.sizeMin, p.sizeMax),
      angle: rand(0, Math.PI * 2),
      spin: rand(-0.15, 0.15),
      vx: rand(-p.vxMax, p.vxMax),
      vy: rand(p.vyMin, p.vyMax),
      phase: rand(0, Math.PI * 2),
      fadeSpeed: rand(0.15, 0.4),
      alpha: tinted ? rand(p.tintAlphaMin, p.tintAlphaMax) : rand(p.alphaMin, p.alphaMax),
      color: tinted ? p.tinted[i % p.tinted.length] : p.colors[i % p.colors.length],
      radii: [rand(0.55, 1), rand(0.55, 1), rand(0.55, 1), rand(0.55, 1)],
      skew: [rand(-0.45, 0.45), rand(-0.45, 0.45), rand(-0.45, 0.45), rand(-0.45, 0.45)],
      ox: 0,
      oy: 0,
      ovx: 0,
      ovy: 0,
    });
  }
  return shards;
}

function drawShard(ctx: CanvasRenderingContext2D, s: Shard, alpha: number) {
  ctx.save();
  ctx.translate(s.x + s.ox, s.y + s.oy);
  ctx.rotate(s.angle);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = s.color;
  ctx.beginPath();
  for (let k = 0; k < 4; k++) {
    const ang = (k * Math.PI) / 2 + s.skew[k];
    const r = s.size * s.radii[k];
    const px = Math.cos(ang) * r;
    const py = Math.sin(ang) * r * 0.62;
    if (k === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Ambient background fragment field. Theme-adaptive, pointer-reactive,
 * and static when the user prefers reduced motion.
 */
export default function FragmentField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolved } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = resolved === 'paper' ? PAPER : SMOKE;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = window.innerWidth;
    let h = window.innerHeight;
    let shards = makeShards(w, h, palette);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      ctx.clearRect(0, 0, w, h);
      for (const s of shards) drawShard(ctx, s, s.alpha * 0.8);
      const onResize = () => {
        resize();
        shards = makeShards(w, h, palette);
        ctx!.clearRect(0, 0, w, h);
        for (const s of shards) drawShard(ctx!, s, s.alpha * 0.8);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const pointer = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') pointer.active = false;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onLeave, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);

    const SCATTER_RADIUS = 150;
    let raf = 0;
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      ctx!.clearRect(0, 0, w, h);

      for (const s of shards) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.angle += s.spin * dt;

        // Scatter away from the cursor/finger, then ease back.
        if (pointer.active) {
          const dx = s.x + s.ox - pointer.x;
          const dy = s.y + s.oy - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < SCATTER_RADIUS && d > 0.01) {
            const f = (1 - d / SCATTER_RADIUS) * 900;
            s.ovx += (dx / d) * f * dt;
            s.ovy += (dy / d) * f * dt;
          }
        }
        s.ovx += (-s.ox * 2.2 - s.ovx * 2.8) * dt;
        s.ovy += (-s.oy * 2.2 - s.ovy * 2.8) * dt;
        s.ox += s.ovx * dt;
        s.oy += s.ovy * dt;

        // Wrap around the viewport with a margin.
        const m = s.size * 1.5;
        if (s.y < -m) {
          s.y = h + m;
          s.x = rand(0, w);
        } else if (s.y > h + m) {
          s.y = -m;
          s.x = rand(0, w);
        }
        if (s.x < -m) s.x = w + m;
        else if (s.x > w + m) s.x = -m;

        const a = s.alpha * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.fadeSpeed + s.phase)));
        drawShard(ctx!, s, a);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onLeave);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [resolved]);

  return <canvas ref={canvasRef} className="fragment-field" aria-hidden="true" />;
}
