import React, { useEffect, useState } from 'react';
import ScribCompanion from './ScribCompanion.jsx';
import DeskDrawing, { ComputerDrawing, CompareDrawing, DrawerDrawing } from './DeskDrawing.jsx';

const objectNotes = { find: 'Change the needs. I’ll move the files.', compare: 'Two files. One difficult decision.', archive: 'All 23. Yes, I kept the old ones.' };
export default function StudioScene({ onNavigate, message, onPoke, motionPaused }) {
  const [hovered, setHovered] = useState('');
  const [idleAction, setIdleAction] = useState('idle');
  useEffect(() => {
    if (motionPaused) return;
    const timer = setInterval(() => setIdleAction((current) => current === 'doodling' ? 'rummaging' : 'doodling'), 14000);
    return () => clearInterval(timer);
  }, [motionPaused]);
  function objectEvents(view) { return { onMouseEnter: () => setHovered(view), onMouseLeave: () => setHovered(''), onFocus: () => setHovered(view), onBlur: () => setHovered(''), onClick: () => onNavigate(view) }; }
  const idleNote = idleAction === 'doodling' ? 'I made a note. You’re still thinking.' : idleAction === 'rummaging' ? 'Just checking the drawer. Again.' : message;
  return <section className="studio-scene pencil-scene" aria-label="Manhattan pencil studio">
    <div className={`paper-stage looking-at-${hovered || 'nothing'}`}>
      <DeskDrawing />
      <div className="desk-introduction"><p className="eyebrow">AN ARCHIVE IN USE / NEW YORK</p><h1>A working<br />archive.</h1><p>Same models. Different needs.<br />Watch the order change.</p></div>
      <span className="window-caption">Manhattan, after hours.</span>
      <span className="pencil-annotation start-annotation">start here.</span>
      <button className="pencil-object desk-computer" {...objectEvents('find')} aria-label="Find my AI: start at the computer"><ComputerDrawing /><span className="computer-label"><small>01 / ARRANGE THE MODELS</small><strong>Find<br />my AI<span className="typed-cursor">_</span></strong><span className="computer-enter">[ CLICK OR PRESS ENTER ↗ ]</span></span></button>
      <button className="pencil-object desk-compare" {...objectEvents('compare')} aria-label="Compare models: two files under the lamp"><CompareDrawing /><span className="compare-paper-label"><small>02 / SIDE BY SIDE</small><strong>Compare<br />models ↗</strong></span></button>
      <button className="pencil-object desk-archive" {...objectEvents('archive')} aria-label="Explore archive: open all 23 records"><DrawerDrawing /><span className="drawer-label"><small>03 / THE OLD FILES TOO</small><strong>Explore<br />archive ↗</strong><i>23 records</i></span></button>
      <div className={`paper-pet pet-${idleAction}`}><ScribCompanion mood={hovered || motionPaused ? 'idle' : idleAction} message={objectNotes[hovered] || idleNote} onPoke={() => { setIdleAction('idle'); onPoke(); }} variant="room" motionPaused={motionPaused} /><svg className="scrib-doodle" viewBox="0 0 120 60" aria-hidden="true"><path d="M7 36q20-48 25-1t25 2t21-3t25 3 M10 44l96 -3 M17 53l68 -5" /></svg></div>
      <span className="pencil-annotation desk-margin-note">a change of mind<br />is a change of order.</span>
    </div>
    <footer className="paper-scene-footer"><p><span className="small-red-mark">↳</span> The computer arranges. The lamp compares. The drawer keeps everything.</p><a href="./archive.html">Read the text archive ↗</a></footer>
  </section>;
}
