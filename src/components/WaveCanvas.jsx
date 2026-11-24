import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

// Long waves on the left and right, a wave-ringed circle in the middle.
// Everything bends toward the cursor (or finger).
export default function WaveCanvas({ focusRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d');
    const g = { w: 0, h: 0, cx: 0, cy: 0, R: 0 };
    const m = { x: 0, y: 0, tx: 0, ty: 0, a: 0, on: false };
    const still =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduced-motion');
    let raf = 0;
    let t = 0;
    let visible = true;

    const draw = () => {
      const { w, h, cx, cy } = g;
      if (!w) return;
      const intro = still ? 1 : 1 - Math.pow(1 - Math.min(1, t / 1.6), 3);
      const R = g.R * (0.6 + 0.4 * intro) * (1 + Math.sin(t * 0.9) * 0.012);
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = intro;
      m.x += (m.tx - m.x) * 0.12;
      m.y += (m.ty - m.y) * 0.12;
      m.a += ((m.on ? 1 : 0) - m.a) * 0.08;
      const near = m.a > 0.005;
      const s2 = 2 * Math.pow(Math.max(130, Math.min(w, h) * 0.22), 2);
      const amp = Math.min(h * 0.17, 150) * intro;
      const gap = Math.max(14, Math.min(22, h / 36));
      const k1 = TAU / (w * 0.75);
      const k2 = TAU / (w * 0.34);

      ctx.lineWidth = 1;
      for (let i = 0, n = Math.ceil(h / gap) + 16; i < n; i++) {
        const y0 = (i - 8) * gap;
        const glow = 1 - Math.min(1, Math.abs(y0 - cy) / (h * 0.6));
        ctx.strokeStyle = `rgba(194,197,203,${0.1 + glow * 0.5})`;
        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          const A = amp * (0.2 + 0.8 * Math.min(1, Math.abs(x - cx) / (w * 0.5)));
          let y = y0 + A * (Math.sin(x * k1 + t + i * 0.2) + 0.45 * Math.sin(x * k2 - t * 0.7 + i * 0.12));
          if (near) {
            const dx = m.x - x;
            const dy = m.y - y;
            const f = m.a * Math.exp(-(dx * dx + dy * dy) / s2);
            y += dy * f * 0.5 + Math.sin(Math.sqrt(dx * dx + dy * dy) * 0.045 - t * 4) * 14 * f;
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // The circle covers the lines behind it, so the waves run out to the left and right.
      const disc = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.03);
      disc.addColorStop(0, '#121212');
      disc.addColorStop(1, '#000');
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.03, 0, TAU);
      ctx.fill();

      for (let j = 0; j < 5; j++) {
        const r0 = R * (0.8 + j * 0.05);
        const ra = R * 0.035 * (0.6 + j * 0.3);
        const c = 238 - j * 14;
        ctx.strokeStyle = `rgba(${c},${c},${c + 4},${0.25 + j * 0.15})`;
        ctx.lineWidth = j === 4 ? 1.6 : 1;
        ctx.beginPath();
        for (let k = 0; k <= 160; k++) {
          const a = (k / 160) * TAU;
          const r = r0 + ra * (Math.sin(a * 3 + t * 1.1 + j) + 0.6 * Math.sin(a * 5 - t * 0.8 + j * 2));
          let x = cx + r * Math.cos(a);
          let y = cy + r * Math.sin(a);
          if (near) {
            const dx = m.x - x;
            const dy = m.y - y;
            const f = m.a * Math.exp(-(dx * dx + dy * dy) / s2);
            x += dx * f * 0.35;
            y += dy * f * 0.35;
          }
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.w = r.width;
      g.h = r.height;
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const f = focusRef.current?.getBoundingClientRect();
      g.cx = f ? f.left - r.left + f.width / 2 : g.w / 2;
      g.cy = f ? f.top - r.top + f.height / 2 : g.h / 2;
      const size = f ? Math.max(f.width, f.height) * 0.75 : 0;
      g.R = Math.max(110, Math.min(size, g.w * 0.46, g.h * 0.42));
      if (still) draw();
    };

    const loop = () => {
      raf = 0;
      if (!visible) return;
      t += 0.015;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!still && !raf && visible) raf = requestAnimationFrame(loop);
    };

    const move = (e) => {
      const r = cv.getBoundingClientRect();
      m.tx = e.clientX - r.left;
      m.ty = e.clientY - r.top;
      m.on = m.tx >= 0 && m.ty >= 0 && m.tx <= r.width && m.ty <= r.height;
      if (m.on && m.a < 0.02) {
        m.x = m.tx;
        m.y = m.ty;
      }
    };
    const off = () => {
      m.on = false;
    };
    const up = (e) => {
      if (e.pointerType !== 'mouse') off();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    if (focusRef.current) ro.observe(focusRef.current);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(cv);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', off);
    document.documentElement.addEventListener('mouseleave', off);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', off);
      document.documentElement.removeEventListener('mouseleave', off);
    };
  }, [focusRef]);

  return <canvas ref={canvasRef} className="hx-waves" aria-hidden="true" />;
}