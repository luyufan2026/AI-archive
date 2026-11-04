import { Localize } from '../i18n/LanguageContext.jsx';
import React, { useEffect, useState } from 'react';
import ScribCompanion from './ScribCompanion.jsx';
import DeskDrawing, { ComputerDrawing, CompareDrawing, DrawerDrawing } from './DeskDrawing.jsx';

const objectNotes = { find: 'Pick your ingredients.', compare: 'Compare your picks.', archive: 'All 23 models.' };
export default function StudioScene({ onNavigate, message, onPoke, motionPaused }) {
  const [hovered, setHovered] = useState('');
  const [idleAction, setIdleAction] = useState('idle');
  useEffect(() => {
    if (motionPaused) return;
    const timer = setInterval(() => setIdleAction((current) => current === 'doodling' ? 'rummaging' : 'doodling'), 14000);
    return () => clearInterval(timer);
  }, [motionPaused]);
  function objectEvents(view) { return { onMouseEnter: () => setHovered(view), onMouseLeave: () => setHovered(''), onFocus: () => setHovered(view), onBlur: () => setHovered(''), onClick: () => onNavigate(view) }; }
  const idleNote = message;
  return <Localize><section className="studio-scene pencil-scene" aria-label="Manhattan pencil studio">
    <div className={`paper-stage looking-at-${hovered || 'nothing'}`}>
      <DeskDrawing />
      <div className="desk-introduction"><h1>AI Archive</h1><p>Choose an AI for your needs.</p></div>
      
      <span className="pencil-annotation start-annotation">start here.</span>
      <button className="pencil-object desk-computer" {...objectEvents('find')} aria-label="Cook my AI: start at the computer"><ComputerDrawing /><span className="computer-label"><strong>Cook<br />my AI<span className="typed-cursor">_</span></strong><span className="computer-enter">ENTER ↗</span></span></button>
      <button className="pencil-object desk-compare" {...objectEvents('compare')} aria-label="Compare models: two files under the lamp"><CompareDrawing /><span className="compare-paper-label"><strong>Compare ↗</strong></span></button>
      <button className="pencil-object desk-archive" {...objectEvents('archive')} aria-label="Explore archive: open all 23 records"><DrawerDrawing /><span className="drawer-label"><strong>Archive ↗</strong></span></button>
      <div className={`paper-pet pet-${idleAction}`}><ScribCompanion mood={hovered || motionPaused ? 'idle' : idleAction} message={objectNotes[hovered] || idleNote} onPoke={() => { setIdleAction('idle'); onPoke(); }} variant="room" motionPaused={motionPaused} /><svg className="scrib-doodle" viewBox="0 0 120 60" aria-hidden="true"><path d="M7 36q20-48 25-1t25 2t21-3t25 3 M10 44l96 -3 M17 53l68 -5" /></svg></div>
      
    </div>
    <footer className="paper-scene-footer"><a href="./archive.html?v=20261104">Text archive ↗</a></footer>
  </section></Localize>;
}
