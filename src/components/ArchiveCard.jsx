import React, { memo } from 'react';
import { companies } from '../data/archiveData.js';
import { formatPrice } from '../utils/archive.js';
import { formatContext } from '../data/modelProfiles.js';
import { CompanyDetails } from './CompanyCard.jsx';

function ArchiveCard({ item, selected, selectionFull, onToggle, onInspect, dragProps }) {
  return (
    <article className="archive-card" {...dragProps}>
      <p className="family-name">{item.family} · Record {String(item.id).padStart(2, '0')}</p>
      <p className="dossier-status">{item.status}</p><h2>{item.name}</h2>
      <dl className="metadata">
        <div><dt>Released</dt><dd><time dateTime={item.releaseDate}>{item.releaseDate}</time> · {item.releaseKind}</dd></div>
        <div><dt>Model type</dt><dd>{item.type}</dd></div>
        <div><dt>Specialties</dt><dd>{item.strengths.join(' / ')}</dd></div>
        <div><dt>Company</dt><dd>{companies[item.family].name}</dd></div>
      </dl>
      <div className="price-block">
        <h3>Token reference price</h3>
        <p className="small-text">USD / 1M text tokens · uncached input</p>
        <dl className="price-values">
          <div><dt>Input</dt><dd>{formatPrice(item.inputPrice)}</dd></div>
          <div><dt>Output</dt><dd>{formatPrice(item.outputPrice)}</dd></div>
        </dl>
        <p className="small-text price-basis">{item.priceBasis} · {item.priceDate}</p>
        <p className="small-text">{item.priceNote}</p>
      </div>
      <details className="capability-details"><summary>Fit, capabilities & limitations</summary><dl className="metadata">
        <div><dt>Best for / strengths</dt><dd>{item.bestFor}</dd></div>
        <div><dt>Watch out</dt><dd>{item.cons[0]}</dd></div>
        <div><dt>Context / modality</dt><dd>{formatContext(item.contextTokens)} · {item.modalities}</dd></div>
        <div><dt>Access</dt><dd>{item.access}</dd></div>
        <div><dt>Capabilities</dt><dd>Image generation: no. Search tools: {item.capabilities.search ? 'recorded' : 'unrecorded'}.</dd></div>
      </dl></details>
      <details className="company-details"><summary>Company & stock details</summary><CompanyDetails company={companies[item.family]} /></details>
      <div className="card-bottom"><p className="file-check-stamp">LAST CHECKED <time dateTime={item.recordCheckedAt}>{item.recordCheckedAt}</time></p><button className="dossier-open" onClick={() => onInspect(item)}>Open dossier ↗</button>
        <p className="source-links"><a href={item.releaseSource} target="_blank" rel="noreferrer">Release source</a><a href={item.priceSource} target="_blank" rel="noreferrer">Price source</a></p>
        <label className="compare-choice"><input type="checkbox" checked={selected} disabled={!selected && selectionFull} onChange={() => onToggle(item.id)} />Compare {item.name}</label>
      </div>
    </article>
  );
}

export default memo(ArchiveCard);
