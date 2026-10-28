import React from 'react';
import { checkedAt } from '../data/archiveData.js';
import { formatPrice } from '../utils/archive.js';

export function CompanyDetails({ company }) {
  return (
    <>
      <dl className="metadata">
        <div><dt>Company</dt><dd>{company.name}</dd></div>
        <div><dt>Company location</dt><dd>{company.location}</dd></div>
        <div><dt>Parent / ownership</dt><dd>{company.parent}</dd></div>
        <div><dt>Listing status</dt><dd>{company.listing}</dd></div>
      </dl>
      <p className="small-text">{company.listingNote}</p>
      {company.stock ? (
        <div className="stock-quote">
          <p><strong>{company.stock.ticker} · {formatPrice(company.stock.price)} / share</strong></p>
          <p>{company.stock.company} · {company.stock.exchange}</p>
          <p className="small-text">Snapshot: {company.stock.label}. Saved reference, not a live feed.</p>
          <a href={company.stock.source} target="_blank" rel="noreferrer">View market quote</a>
        </div>
      ) : <p className="stock-quote">Stock price: N/A — no publicly traded shares recorded.</p>}
      <p className="small-text">Company information checked: {checkedAt}</p>
      <ul className="source-links">
        {company.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}
      </ul>
    </>
  );
}

export default function CompanyCard({ family, company }) {
  return <article className="archive-card company-card"><p className="family-name">{family}</p><h2>{company.name}</h2><CompanyDetails company={company} /></article>;
}
