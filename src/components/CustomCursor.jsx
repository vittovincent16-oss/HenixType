import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../styles/navbar.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('hx-cursor-on');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');

      const interactive = e.target.closest('button, a, input, select, textarea, [role="button"]');
      ring.classList.toggle('is-hovering', Boolean(interactive));
    };

    const onDown = () => ring.classList.add('is-clicking');
    const onUp = () => ring.classList.remove('is-clicking');

    const onLeave = () => {
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove('hx-cursor-on');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return createPortal(
    <>
      <div ref={dotRef} className="hx-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="hx-cursor-ring" aria-hidden="true" />
    </>,
    document.body
  );
}