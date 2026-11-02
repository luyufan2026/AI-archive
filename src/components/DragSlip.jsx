import React from 'react';

export default function DragSlip({ drag, elementRef }) {
  return drag && <div ref={elementRef} className="drag-slip" aria-hidden="true" style={{ left: 0, top: 0, transform: `translate3d(${drag.x + 16}px, ${drag.y - 20}px, 0) rotate(-5deg)` }}>{drag.label}<span>{drag.over ? 'RELEASE TO ADD ↙' : 'TAKE TO THE TRAY ↗'}</span></div>;
}
