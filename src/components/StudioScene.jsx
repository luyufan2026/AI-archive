import React from 'react';
import ScribCompanion from './ScribCompanion.jsx';
import studioImage from '../assets/manhattan-studio.jpg';

export default function StudioScene({ onNavigate, message, onPoke, motionPaused }) {
  return (
    <section className={`studio-scene ${motionPaused ? 'motion-paused' : ''}`} aria-label="Manhattan Night Studio">
      <div className="scene-world">
        <img className="room-image" src={studioImage} alt="A warm, lived-in computer studio with a walnut desk and a rain-covered window overlooking the Manhattan skyline at night" fetchPriority="high" />
        <div className="window-rain" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--rain-x': `${17 + i * 4.3}%`, '--rain-delay': `${-i * .59}s`, '--rain-speed': `${2 + i % 4}s` }} />)}</div>
        <button className="monitor-hotspot" onClick={() => onNavigate('find')} aria-label="Use the computer: Find My AI">
          <span className="monitor-top">AI ARCHIVE / PERSONAL TERMINAL</span><strong>FIND<br />MY AI<span className="cursor-block">_</span></strong><span className="monitor-bottom">[ CLICK TO BOOT ]</span>
        </button>
        <button className="desk-object compare-object" onClick={() => onNavigate('compare')}><span>02 / THE WEIGH-IN</span><strong>COMPARE<br />MODELS</strong><i>Lay them on the table ↗</i></button>
        <button className="desk-object archive-object" onClick={() => onNavigate('archive')}><span>03 / THE FILING CABINET</span><strong>EXPLORE<br />ARCHIVE</strong><i>Every model. Every receipt. ↗</i></button>
        <div className="scene-pet"><ScribCompanion message={message} onPoke={onPoke} variant="room" /></div>
      </div>
      <div className="scene-shade" aria-hidden="true" />
      <div className="scene-introduction"><p className="eyebrow">A MANHATTAN NIGHT STUDIO</p><h1>Make up<br />your mind.</h1><p>A desk full of models.<br />A small creature with strong opinions.</p></div>
      <div className="scene-caption"><span><i /> NEW YORK / AFTER HOURS</span><span>Click an object. Follow your curiosity.</span><button onClick={() => onNavigate('find')}>Start with a recipe ↗</button></div>
      <div className="mobile-scene-actions"><button onClick={() => onNavigate('find')}>01 Find my AI ↗</button><button onClick={() => onNavigate('compare')}>02 Compare models ↗</button><button onClick={() => onNavigate('archive')}>03 Explore archive ↗</button></div>
    </section>
  );
}
