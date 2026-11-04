import { Localize } from '../i18n/LanguageContext.jsx';
import React, { memo, useRef } from 'react';
import useScribLook from '../hooks/useScribLook.js';

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
const chefArms = [...limbs([[80, 78], [67, 103], [60, 135], [43, 148]]), ...limbs([[111, 80], [147, 68], [183, 51], [221, 55], [250, 60]])];
function dottedPath(test, seed, count = 8500) {
  const next = random(seed); const dots = [];
  for (let i = 0; i < count; i++) {
    const x = next() * 195; const y = next() * 240;
    if (!test(x, y, next())) continue;
    const size = .4 + next() * .8;
    dots.push(`M${x.toFixed(1)} ${y.toFixed(1)}h${size.toFixed(1)}v${size.toFixed(1)}h-${size.toFixed(1)}z`);
  }
  return dots.join('');
}
function nearLine(x, y, points, width) {
  return points.slice(1).some(([bx, by], i) => {
    const [ax, ay] = points[i]; const t = Math.max(0, Math.min(1, ((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2)));
    return Math.hypot(x-ax-t*(bx-ax), y-ay-t*(by-ay)) < width;
  });
}
const dotHead = dottedPath((x,y,r) => ((x-94)/25)**2 + ((y-43)/29)**2 < .85 + r*.3, 719, 14000);
const dotBody = dottedPath((x,y,r) => ((x-96)/23)**2 + ((y-105)/35)**2 < .8+r*.4 || nearLine(x,y,[[85,130],[77,159],[69,184],[73,215],[57,222]],4+r*2) || nearLine(x,y,[[104,130],[115,160],[124,184],[116,214],[132,222]],4+r*2), 821, 14000);
const dotArms = dottedPath((x,y,r) => nearLine(x,y,[[80,78],[63,103],[62,130],[37,155],[22,157]],3+r*2) || nearLine(x,y,[[111,80],[125,103],[131,128],[151,144],[173,141]],3+r*2), 1019, 14000);
const ScribFigure = memo(function ScribFigure({ headRef, chef, dotted }) {
  return <Localize><svg viewBox="0 0 195 240" role="img" aria-label={dotted ? 'A little person made of black ink dots' : 'An abstract little person made of restless black ink lines'}>
    <ellipse cx="98" cy="228" rx="41" ry="5" fill="#000" opacity=".35" />
    <g className="scrib-figure" fill="none" stroke="#10120f" strokeWidth=".8" strokeLinejoin="round">
      {dotted ? <g fill="#292925" stroke="none"><path d={dotBody} /><path d={dotArms} /><g ref={headRef}><path d={dotHead} /></g></g> : <>
      <g className="scrib-left-leg"><path d={leftLeg.join(' ')} /></g><g className="scrib-right-leg"><path d={rightLeg.join(' ')} /></g>
      <path d={torso.join(' ')} /><g className="scrib-arms"><path d={(chef ? chefArms : arms).join(' ')} /></g>
      <g ref={headRef}><path d={head.join(' ')} /><path d="M82 43l8 -1 M100 42l8 1" stroke="#6a625b" strokeWidth="1.5" /></g>
      </>}

    </g>
  </svg></Localize>;
});

export default function ScribCompanion({ mood = 'idle', message = 'Still deciding? Shocking.', cargo = '', variant = '', onPoke, motionPaused = false }) {
  const root = useRef(null); const headRef = useRef(null);
  useScribLook(root, headRef, motionPaused);
  return (
    <Localize><div ref={root} className={`scrib-companion scrib-${mood} ${variant}`}>
      {message && <div className="scrib-speech" role="status"><p>{message}</p></div>}
      <button className="scrib-body" type="button" onClick={onPoke} aria-label="Talk to Scrib, your studio companion">
        <ScribFigure headRef={headRef} chef={variant === 'chef'} dotted={variant === 'room'} />
        {cargo && <span className="scrib-cargo" key={cargo}>{cargo}</span>}
      </button>
      
    </div></Localize>
  );
}
