import React from 'react';

export default function DragSlip({ drag }) {
  return drag && <div className="drag-slip" aria-hidden="true" style={{ left: drag.x + 16, top: drag.y - 20 }}>{drag.label}<span>{drag.over ? 'RELEASE TO ADD ↙' : 'TAKE TO THE TRAY ↗'}</span></div>;
}
