import React from 'react';
import { companies } from '../data/archiveData.js';
import { formatPrice } from '../utils/archive.js';
import { CompanyDetails } from './CompanyCard.jsx';

export default function ArchiveCard({ item, selected, selectionFull, onToggle }) {
  return (
    <article className="archive-card">
      <p className="family-name">{item.family} · Record {String(item.id).padStart(2, '0')}</p>
      <h2>{item.name}</h2>
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
      <details className="company-details"><summary>Company & stock details</summary><CompanyDetails company={companies[item.family]} /></details>
      <div className="card-bottom">
        <p className="source-links"><a href={item.releaseSource} target="_blank" rel="noreferrer">Release source</a><a href={item.priceSource} target="_blank" rel="noreferrer">Price source</a></p>
        <label className="compare-choice"><input type="checkbox" checked={selected} disabled={!selected && selectionFull} onChange={onToggle} />Compare {item.name}</label>
      </div>
    </article>
  );
}
