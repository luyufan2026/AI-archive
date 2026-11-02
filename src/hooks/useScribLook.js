import { useEffect } from 'react';

// Move only the SVG head; pointer movement never updates React state.
export default function useScribLook(rootRef, headRef, paused) {
  useEffect(() => {
    const head = headRef.current;
    head?.setAttribute('transform', 'rotate(0 94 65)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    if (paused || reduced.matches || !finePointer.matches) return;
    let timer = null; let frame = null; let latestX = null;
    let visible = true; let needsMeasure = true; let center = 0; let angle = 0;
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; needsMeasure = true;
    });
    if (rootRef.current) observer?.observe(rootRef.current);
    function update() {
      timer = null;
      if (!visible || document.hidden || reduced.matches || !finePointer.matches || latestX === null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        if (needsMeasure) {
          const rect = rootRef.current?.getBoundingClientRect();
          if (!rect) return;
          center = rect.left + rect.width / 2;
          needsMeasure = false;
        }
        const next = Math.round(Math.max(-7, Math.min(7, (latestX - center) / 90)));
        if (next !== angle) { head?.setAttribute('transform', `rotate(${next} 94 65)`); angle = next; }
      });
    }
    function follow(event) {
      if (!visible || document.hidden) return;
      latestX = event.clientX;
      if (timer === null && frame === null) timer = setTimeout(update, 80);
    }
    function invalidate() { needsMeasure = true; }
    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate, { passive: true });
    return () => {
      window.removeEventListener('pointermove', follow);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      observer?.disconnect(); clearTimeout(timer); cancelAnimationFrame(frame);
    };
  }, [rootRef, headRef, paused]);
}
