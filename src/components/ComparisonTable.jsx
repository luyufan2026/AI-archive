import React from 'react';
import { companies } from '../data/archiveData.js';
import { formatPrice } from '../utils/archive.js';

export default function ComparisonTable({ items, onRemove, onClear }) {
  if (items.length === 0) return <p className="compare-hint">Select up to 3 model cards to compare their details side by side.</p>;
  const rows = [
    ['AI family', (item) => item.family], ['Released', (item) => item.releaseDate],
    ['Model type', (item) => item.type], ['Specialties', (item) => item.strengths.join(' / ')],
    ['Input / 1M tokens', (item) => formatPrice(item.inputPrice)], ['Output / 1M tokens', (item) => formatPrice(item.outputPrice)],
    ['Price basis', (item) => `${item.priceBasis} · ${item.priceDate}`],
    ['Price conditions', (item) => item.priceNote],
    ['Company', (item) => companies[item.family].name], ['Location', (item) => companies[item.family].location],
    ['Listing', (item) => companies[item.family].listing],
    ['Parent stock snapshot', (item) => {
      const stock = companies[item.family].stock;
      return stock ? `${stock.ticker} · ${formatPrice(stock.price)} · ${stock.label}` : 'N/A — no public quote';
    }],
  ];
  return (
    <section className="comparison" aria-labelledby="comparison-title">
      <div className="section-heading"><h2 id="comparison-title">Compare models ({items.length}/3)</h2><button type="button" onClick={onClear}>Clear comparison</button></div>
      <p className="small-text">Prices may refer to different dates and conditions. Historical rates are not current offers.</p>
      <div className="table-scroll" role="region" aria-label="Model comparison table" tabIndex="0">
        <table>
          <thead><tr><th scope="col">Field</th>{items.map((item) => <th scope="col" key={item.id}>{item.name}<button type="button" className="remove-compare" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name} from comparison`}>Remove</button></th>)}</tr></thead>
          <tbody>{rows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th>{items.map((item) => <td key={item.id}>{value(item)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
