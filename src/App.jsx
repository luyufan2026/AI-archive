import React, { useState } from 'react';
import FilterBar from './components/FilterBar.jsx';
import ArchiveCard from './components/ArchiveCard.jsx';
import CompanyCard from './components/CompanyCard.jsx';
import ComparisonTable from './components/ComparisonTable.jsx';
import archiveData, { checkedAt, companies } from './data/archiveData.js';
import { filterAndSort } from './utils/archive.js';

export default function App() {
  const [view, setView] = useState('models');
  const [family, setFamily] = useState('all');
  const [type, setType] = useState('all');
  const [specialty, setSpecialty] = useState('all');
  const [priceBasis, setPriceBasis] = useState('all');
  const [sortMode, setSortMode] = useState('default');
  const [comparisonIds, setComparisonIds] = useState([]);
  const visibleItems = filterAndSort(archiveData, { family, type, specialty, priceBasis, sortMode });
  const comparedItems = comparisonIds.map((id) => archiveData.find((item) => item.id === id));

  function toggleComparison(id) {
    setComparisonIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 3 ? [...current, id] : current);
  }
  function resetFilters() {
    setFamily('all'); setType('all'); setSpecialty('all'); setPriceBasis('all'); setSortMode('default');
  }

  return (
    <main className="app">
      <header className="page-header">
        <h1>AI Archive</h1>
        <p>A field guide to AI models, the companies behind them, and the cost of a token.</p>
        <p className="prototype-note">Greybox prototype · 20 selected model versions · Sources checked {checkedAt}</p>
      </header>
      <aside className="archive-note" aria-label="About this archive">
        <p>This archive includes historical model releases. Token prices are published reference rates with their own dates, not a live pricing feed.</p>
        <p>Stock prices are saved company or parent-company quotes. Private companies have no public quote. Model specialties summarize the linked sources, not independent rankings.</p>
      </aside>
      <nav className="view-switch" aria-label="Archive views">
        <button type="button" aria-pressed={view === 'models'} onClick={() => setView('models')}>Model archive (20)</button>
        <button type="button" aria-pressed={view === 'companies'} onClick={() => setView('companies')}>Companies & stocks (5)</button>
      </nav>
      {view === 'models' ? (
        <>
          <FilterBar family={family} type={type} specialty={specialty} priceBasis={priceBasis} sortMode={sortMode}
            onFamilyChange={setFamily} onTypeChange={setType} onSpecialtyChange={setSpecialty} onPriceBasisChange={setPriceBasis} onSortChange={setSortMode} onReset={resetFilters} />
          <ComparisonTable items={comparedItems} onRemove={toggleComparison} onClear={() => setComparisonIds([])} />
          <p className="result-count" role="status">Showing {visibleItems.length} of {archiveData.length} models · {comparisonIds.length}/3 selected for comparison</p>
          <section className="archive-grid" aria-label="AI model records">
            {visibleItems.map((item) => <ArchiveCard key={item.id} item={item} selected={comparisonIds.includes(item.id)} selectionFull={comparisonIds.length === 3} onToggle={() => toggleComparison(item.id)} />)}
          </section>
          {visibleItems.length === 0 && <div className="empty-state"><p>No models match these filters.</p><button type="button" onClick={resetFilters}>Show all models</button></div>}
        </>
      ) : (
        <>
          <h2 className="section-title">Companies & stock snapshots</h2>
          <p>Company information checked {checkedAt}. Saved quotes show the October 28, 2026 regular-session close in USD and do not update automatically.</p>
          <section className="archive-grid" aria-label="Company records">{Object.entries(companies).map(([name, company]) => <CompanyCard key={name} family={name} company={company} />)}</section>
        </>
      )}
      <footer className="page-footer">Interactive Archive · React + useState · A metadata archive; no AI responses are generated.</footer>
    </main>
  );
}
