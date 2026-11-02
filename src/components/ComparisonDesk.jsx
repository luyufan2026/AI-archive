import React, { useRef, useState } from 'react';
import useDeskDrag from '../hooks/useDeskDrag.js';
import DragSlip from './DragSlip.jsx';
import { formatPrice } from '../utils/archive.js';
import { formatContext } from '../data/modelProfiles.js';
import { CapabilityMeters } from './ModelDossier.jsx';
import ComparisonTable from './ComparisonTable.jsx';

export default function ComparisonDesk({ models, selectedIds, onToggle, onAdd, onClear, onInspect }) {
  const [query, setQuery] = useState('');
  const deskRef = useRef(null);
  const { bind, drag, ghostRef } = useDeskDrag(deskRef, onAdd);
  const items = selectedIds.map((id) => models.find((model) => model.id === id)).filter(Boolean);
  const choices = models.filter((model) => `${model.name} ${model.family}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <DragSlip drag={drag} elementRef={ghostRef} />
      <div className="workspace-heading"><div><p className="eyebrow">02 / THE WEIGH-IN</p><h1>Side by side.<br /><em>No fan clubs.</em></h1></div><p className="heading-aside">Two good choices.<br />Usually one better fit.<br /><span>Drag in a dossier, or click a name below.</span></p></div>
      <section ref={deskRef} className={`comparison-desk ${drag?.over ? 'drag-over' : ''}`} aria-label="Model comparison area">
        <div className="section-label"><span>{items.length} / 3 DOSSIERS ON THE DESK</span><button onClick={onClear} disabled={!items.length}>CLEAR DESK ×</button></div><div className="comparison-slots" style={{ '--slot-count': Math.max(2, items.length) }}>{Array.from({ length: Math.max(2, items.length) }, (_, index) => { const model = items[index]; return model ? <article key={model.id} className="comparison-file"><div className="file-tab">FILE {String(model.id).padStart(3, '0')}<button onClick={() => onToggle(model.id)} aria-label={`Remove ${model.name} from comparison`}>×</button></div><p className="eyebrow">{model.family} / {model.status}</p><h2>{model.name}</h2><p className="compare-rate">{formatPrice(model.inputPrice)} <span>in</span> / {formatPrice(model.outputPrice)} <span>out</span></p><p className="source-note">Per 1M text tokens · {model.priceBasis.toLowerCase()} / {model.priceDate}</p><p><strong>Best for</strong><br />{model.bestFor}</p><CapabilityMeters model={model} /><p className="context-line">Context <strong>{formatContext(model.contextTokens)}</strong></p><div className="choose-if"><h3>Choose {model.name} if…</h3><p>{model.chooseIf}</p></div><p className="compare-strengths"><strong>Strengths:</strong> {model.pros.join(' ')}</p><p className="compare-warning"><strong>Watch out:</strong> {model.cons[0]}</p><button className="text-button" onClick={() => onInspect(model)}>Read the full dossier ↗</button></article> : <div className="empty-comparison-slot" key={`empty-${index}`}><span>0{index + 1}</span><h2>A model goes here.</h2><p>Drag one onto the desk.<br />Clicking works too. We’re civilized.</p></div>; })}</div><p className="source-note">Bars are editorial 0–10 fit estimates, not measured benchmarks. Image means image generation, not image input. Historical rates and versions are explicitly identified.</p>
      </section>
      <section className="dossier-rack" aria-label="Choose models to compare"><div className="rack-heading"><div><p className="eyebrow">THE DOSSIER RACK</p><h2>Pick your contenders.</h2></div><label className="search-field">FIND A MODEL<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or company…" /></label></div><div className="rack-models">{choices.map((model) => <button className="rack-model" key={model.id} {...bind(model.id, model.name, items.length >= 3 && !selectedIds.includes(model.id))} onClick={() => onToggle(model.id)} aria-pressed={selectedIds.includes(model.id)} disabled={items.length >= 3 && !selectedIds.includes(model.id)}><span>{model.family}</span><strong>{model.name}</strong><i>{selectedIds.includes(model.id) ? 'ADDED −' : 'ADD +'}</i></button>)}</div>{!choices.length && <p>No dossier matches that search.</p>}</section>
      {items.length > 0 && <details className="full-comparison"><summary>Open the original technical comparison & company information</summary><ComparisonTable items={items} onRemove={onToggle} onClear={onClear} /></details>}
    </>
  );
}
