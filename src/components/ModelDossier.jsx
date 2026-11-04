import { Localize } from '../i18n/LanguageContext.jsx';
import React, { useEffect, useRef } from 'react';
import { companies } from '../data/archiveData.js';
import { formatContext, scoreDisclosure } from '../data/modelProfiles.js';
import { formatPrice } from '../utils/archive.js';
import { CompanyDetails } from './CompanyCard.jsx';

export function CapabilityMeters({ model }) {
  return <Localize><div className="capability-meters">{[['coding', 'Coding'], ['writing', 'Writing'], ['research', 'Research'], ['image', 'Image generation'], ['search', 'Search tools']].map(([key, label]) => <div className="capability-row" key={key}><span>{label}</span><div className="meter-track" aria-hidden="true"><i style={{ width: `${model.scores[key] * 10}%` }} /></div><b>{key === 'image' && !model.capabilities.imageGeneration ? 'No' : key === 'search' && !model.capabilities.search ? 'Unrecorded' : `${model.scores[key]}/10`}</b></div>)}</div></Localize>;
}

export default function ModelDossier({ model, onClose, onCompare }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => { if (dialog.open) dialog.close(); }; }, []);
  return (
    <Localize><dialog className="dossier-dialog" ref={ref} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }} aria-labelledby="dossier-title">
      <div className="dossier-inner"><div className="section-label"><span>DOSSIER / {String(model.id).padStart(3, '0')}</span><button onClick={onClose} aria-label="Close model dossier">CLOSE ×</button></div><p className="eyebrow">{model.family} / {model.status}</p><h2 id="dossier-title">{model.name}</h2><p className="dossier-best">Best for: {model.bestFor}</p>
        <dl className="dossier-specs"><div><dt>Reference input</dt><dd>{formatPrice(model.inputPrice)} / 1M tokens</dd></div><div><dt>Reference output</dt><dd>{formatPrice(model.outputPrice)} / 1M tokens</dd></div><div><dt>Context</dt><dd>{formatContext(model.contextTokens)}</dd></div><div><dt>Modalities</dt><dd>{model.modalities}</dd></div><div><dt>Access</dt><dd>{model.access}</dd></div><div><dt>Date reference</dt><dd>{model.releaseDate} · {model.releaseKind}</dd></div></dl>
        <p className="source-note">{model.priceBasis} / {model.priceDate}. {model.priceNote}</p><div className="pros-cons"><section><h3>What works</h3><ul>{model.pros.map((pro) => <li key={pro}>{pro}</li>)}</ul></section><section><h3>What to watch</h3><ul>{model.cons.map((con) => <li key={con}>{con}</li>)}</ul></section></div><h3>Our fit notes</h3><CapabilityMeters model={model} /><p className="source-note">{scoreDisclosure} “Unrecorded” means not verified in this dossier, not necessarily unsupported.</p>
        <div className="dossier-actions"><button className="primary-button" onClick={() => { onCompare(model.id); onClose(); }}>Put on comparison desk ↗</button><a href={model.profileSource} target="_blank" rel="noreferrer">Read model source ↗</a></div><details className="company-details"><summary>Company, stock snapshot & original sources</summary><CompanyDetails company={companies[model.family]} /><p className="source-links"><a href={model.releaseSource} target="_blank" rel="noreferrer">Release reference</a><a href={model.priceSource} target="_blank" rel="noreferrer">Price reference</a>{model.lifecycleSource && <a href={model.lifecycleSource} target="_blank" rel="noreferrer">Lifecycle source</a>}</p></details>
      </div>
    </dialog></Localize>
  );
}
