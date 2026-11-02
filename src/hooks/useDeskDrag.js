import { useRef, useState } from 'react';

// Small pointer-based drag interaction. Click/keyboard remains the primary alternative.
// Touch keeps normal page scrolling; touch users can tap to add/remove.
export default function useDeskDrag(targetRef, onDrop) {
  const pending = useRef(null);
  const suppressClick = useRef(false);
  const [drag, setDrag] = useState(null);
  function inside(x, y) {
    const box = targetRef.current?.getBoundingClientRect();
    return Boolean(box && x >= box.left && x <= box.right && y >= box.top && y <= box.bottom);
  }
  function reset() { pending.current = null; setDrag(null); }
  function bind(id, label, disabled = false) {
    return {
      draggable: false,
      onPointerDown(event) {
        if (disabled || event.button !== 0 || event.pointerType === 'touch') return;
        if (event.currentTarget.tagName !== 'BUTTON' && event.target.closest('button, a, input, select, summary')) return;
        suppressClick.current = false;
        pending.current = { id, label, x: event.clientX, y: event.clientY, active: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove(event) {
        const current = pending.current;
        if (!current || current.id !== id) return;
        if (!current.active && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 7) return;
        current.active = true;
        setDrag({ id, label, x: event.clientX, y: event.clientY, over: inside(event.clientX, event.clientY) });
      },
      onPointerUp(event) {
        const current = pending.current;
        if (!current || current.id !== id) return;
        if (current.active) {
          suppressClick.current = true;
          if (inside(event.clientX, event.clientY)) onDrop(current.id);
        }
        reset();
      },
      onPointerCancel: reset,
      onClickCapture(event) {
        if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
      },
    };
  }
  return { bind, drag };
}
