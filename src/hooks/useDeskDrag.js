import { useCallback, useEffect, useRef, useState } from 'react';

// Render once at drag start and when crossing the tray, not on every pointer move.
export default function useDeskDrag(targetRef, onDrop) {
  const pending = useRef(null); const suppressClick = useRef(false);
  const frame = useRef(null); const ghostRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const bindings = useRef(new Map());
  const dropHandler = useRef(onDrop);
  dropHandler.current = onDrop;
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  function inside(x, y) {
    const box = targetRef.current?.getBoundingClientRect();
    return Boolean(box && x >= box.left && x <= box.right && y >= box.top && y <= box.bottom);
  }
  function reset() { cancelAnimationFrame(frame.current); frame.current = null; pending.current = null; setDrag(null); }
  function updateGhost() {
    frame.current = null;
    const current = pending.current;
    if (!current?.active) return;
    if (ghostRef.current) ghostRef.current.style.transform = `translate3d(${current.x + 16}px, ${current.y - 20}px, 0) rotate(-5deg)`;
    const over = inside(current.x, current.y);
    if (over !== current.over) {
      current.over = over;
      setDrag({ id: current.id, label: current.label, x: current.x, y: current.y, over });
    }
  }
  const bind = useCallback((id, label, disabled = false) => {
    const key = `${id}:${label}:${disabled}`;
    if (bindings.current.has(key)) return bindings.current.get(key);
    const handlers = {
      draggable: false,
      onPointerDown(event) {
        if (disabled || event.button !== 0 || event.pointerType === 'touch') return;
        if (event.currentTarget.tagName !== 'BUTTON' && event.target.closest('button, a, input, select, summary')) return;
        suppressClick.current = false;
        pending.current = { id, label, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, active: false, over: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove(event) {
        const current = pending.current;
        if (!current || current.id !== id) return;
        current.x = event.clientX; current.y = event.clientY;
        if (!current.active) {
          if (Math.hypot(current.x - current.startX, current.y - current.startY) < 7) return;
          current.active = true;
          current.over = inside(current.x, current.y);
          setDrag({ id, label, x: current.x, y: current.y, over: current.over });
        }
        if (frame.current === null) frame.current = requestAnimationFrame(updateGhost);
      },
      onPointerUp(event) {
        const current = pending.current;
        if (!current || current.id !== id) return;
        if (current.active) { suppressClick.current = true; if (inside(event.clientX, event.clientY)) dropHandler.current(current.id); }
        reset();
      },
      onPointerCancel: reset,
      onClickCapture(event) {
        if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
      },
    };
    bindings.current.set(key, handlers);
    return handlers;
  }, [targetRef]);
  return { bind, drag, ghostRef };
}
