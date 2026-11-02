import React, { useEffect, useRef, useState } from 'react';

// Seeded hand-drawn loops: a living ink sculpture, not a bitmap mascot.
function random(seed) { let value = seed; return () => { value = (value * 16807) % 2147483647; return (value - 1) / 2147483646; }; }
const rand = random(219);
function loops(cx, cy, rx, ry, count) {
  return Array.from({ length: count }, (_, index) => {
    const phase = rand() * Math.PI * 2;
    return Array.from({ length: 45 }, (__, step) => {
      const angle = step / 44 * Math.PI * 2 + phase;
      const wobble = 0.78 + rand() * 0.5;
      const x = cx + Math.cos(angle) * rx * wobble + (rand() - 0.5) * 7;
      const y = cy + Math.sin(angle) * ry * wobble + (rand() - 0.5) * 7;
      return `${step ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ') + ' Z';
  });
}
function limbs(points, count = 11) {
  return Array.from({ length: count }, () => points.map(([x, y], i) => `${i ? 'L' : 'M'}${(x + (rand() - .5) * 12).toFixed(1)},${(y + (rand() - .5) * 10).toFixed(1)}`).join(' '));
}
const head = loops(94, 43, 24, 28, 20);
const torso = loops(96, 105, 21, 34, 19);
const arms = [...limbs([[80, 78], [63, 103], [62, 130], [37, 155], [22, 157]]), ...limbs([[111, 80], [125, 103], [131, 128], [151, 144], [173, 141]])];
const leftLeg = limbs([[85, 130], [77, 159], [69, 184], [73, 215], [57, 222]], 15);
const rightLeg = limbs([[104, 130], [115, 160], [124, 184], [116, 214], [132, 222]], 15);
function Lines({ paths }) { return paths.map((path, index) => <path key={index} d={path} />); }

export default function ScribCompanion({ mood = 'idle', message = 'Still deciding? Shocking.', cargo = '', variant = '', onPoke }) {
  const root = useRef(null);
  const [look, setLook] = useState(0);
  useEffect(() => {
    let frame;
    function follow(event) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = root.current?.getBoundingClientRect();
        if (bounds) setLook(Math.max(-7, Math.min(7, (event.clientX - bounds.left - bounds.width / 2) / 90)));
        frame = null;
      });
    }
    window.addEventListener('pointermove', follow, { passive: true });
    return () => { window.removeEventListener('pointermove', follow); cancelAnimationFrame(frame); };
  }, []);
  return (
    <div ref={root} className={`scrib-companion scrib-${mood} ${variant}`}>
      <div className="scrib-speech" role="status"><span>SCRIB / RESIDENT CRITIC</span><p>{message}</p></div>
      <button className="scrib-body" type="button" onClick={onPoke} aria-label="Talk to Scrib, your studio companion">
        <svg viewBox="0 0 195 240" role="img" aria-label="An abstract little person made of restless black ink lines">
          <defs><filter id={`ink-glow-${variant || 'main'}`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="1.1" floodColor="#e3cda1" floodOpacity=".85" /></filter></defs>
          <ellipse cx="98" cy="228" rx="41" ry="5" fill="#000" opacity=".35" />
          <g className="scrib-figure" fill="none" stroke="#10120f" strokeWidth=".8" strokeLinejoin="round">
            <g className="scrib-left-leg"><Lines paths={leftLeg} /></g><g className="scrib-right-leg"><Lines paths={rightLeg} /></g>
            <Lines paths={torso} /><g className="scrib-arms"><Lines paths={arms} /></g>
            <g style={{ transform: `rotate(${look}deg)`, transformOrigin: '94px 65px' }}><Lines paths={head} /><path d="M82 43l8 -1 M100 42l8 1" stroke="#6a625b" strokeWidth="1.5" /></g>
          </g>
        </svg>
        {cargo && <span className="scrib-cargo" key={cargo}>{cargo}</span>}
      </button>
      <span className="scrib-name">Scrib. <i>He has opinions.</i></span>
    </div>
  );
}
