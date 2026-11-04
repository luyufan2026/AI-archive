import { Localize } from '../i18n/LanguageContext.jsx';
import React, { useState } from 'react';
import ScribCompanion from './ScribCompanion.jsx';

export default function StudioScene({ onNavigate, message, onPoke, motionPaused }) {
  const [hovered, setHovered] = useState(false);
  return <Localize><section className="studio-scene grain-home" aria-label="AI Archive">
    <div className="grain-home-copy"><h1>Cook your AI.</h1><p>Choose your needs. Scrib serves the matches.</p><button className="grain-start" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)} onClick={() => onNavigate('find')}>Start cooking <span aria-hidden="true">↗</span></button></div>
    <div className={`grain-resident ${hovered ? 'is-curious' : ''}`}><ScribCompanion variant="room" mood="idle" message={message} onPoke={onPoke} motionPaused={motionPaused} /></div>
    <svg className="grain-floor" viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="floor-grain" width="39" height="31" patternUnits="userSpaceOnUse"><path d="M2 4h1v1H2z M11 22h.7v.7H11z M20 8h1v1H20z M33 26h.6v.6H33z M26 17h.8v.8H26z M6 30h.6v.6H6z" fill="currentColor" /></pattern></defs><path d="M0 88Q250 120 450 76T850 65T1200 91V140H0z" fill="url(#floor-grain)" /></svg>
    <div className="grain-home-links"><button onClick={() => onNavigate('compare')}>Compare models ↗</button><button onClick={() => onNavigate('archive')}>All 23 models ↗</button><a href="./archive.html?v=20261104-light">Text archive ↗</a></div>
  </section></Localize>;
}
