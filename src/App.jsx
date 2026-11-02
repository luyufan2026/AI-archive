import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import useDeskDrag from './hooks/useDeskDrag.js';
import DragSlip from './components/DragSlip.jsx';
import FilterBar from './components/FilterBar.jsx';
import ArchiveCard from './components/ArchiveCard.jsx';
import CompanyCard from './components/CompanyCard.jsx';
import StudioScene from './components/StudioScene.jsx';
import RecipeFinder from './components/RecipeFinder.jsx';
import ComparisonDesk from './components/ComparisonDesk.jsx';
import ModelDossier from './components/ModelDossier.jsx';
import { checkedAt, companies } from './data/archiveData.js';
import { decisionModels } from './data/modelProfiles.js';
import { defaultUsage } from './utils/recommendation.js';
import { filterAndSort } from './utils/archive.js';

const petLines = ['Still deciding? Shocking.', 'I’m all tangled up. You’re the indecisive one.', 'The most expensive one is not a personality.', 'You can click the computer. It’s not a museum.', 'Bring a budget. Leave the brand loyalty.'];
export default function App() {
  const [view, setView] = useState('studio');
  const [family, setFamily] = useState('all');
  const [type, setType] = useState('all');
  const [specialty, setSpecialty] = useState('all');
  const [priceBasis, setPriceBasis] = useState('all');
  const [sortMode, setSortMode] = useState('default');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [comparisonIds, setComparisonIds] = useState([]);
  const [dossier, setDossier] = useState(null);
  const [recipe, setRecipe] = useState({ selected: [], budget: 20, usage: { ...defaultUsage } });
  const [petLine, setPetLine] = useState(0);
  const [motionPaused, setMotionPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(document.hidden);
  const effectsPaused = motionPaused || pageHidden;
  useEffect(() => {
    const update = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  const [notice, setNotice] = useState('');
  const archiveDropRef = useRef(null);
  const { bind: bindArchiveDrag, drag: archiveDrag, ghostRef: archiveGhostRef } = useDeskDrag(archiveDropRef, (id) => addComparison(id));
  const visibleItems = useMemo(() => filterAndSort(decisionModels, { family, type, specialty, priceBasis, sortMode, query: deferredQuery }), [family, type, specialty, priceBasis, sortMode, deferredQuery]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer); }, [notice]);
  function navigate(next) { setView(next); setDossier(null); window.scrollTo({ top: 0, behavior: 'instant' }); }
  const toggleComparison = useCallback((id) => {
    setComparisonIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 3 ? [...current, id] : current);
    if (!comparisonIds.includes(id) && comparisonIds.length >= 3) setNotice('Three dossiers fit on this desk. Remove one before adding another.');
  }, [comparisonIds]);
  const addComparison = useCallback((id) => { if (!comparisonIds.includes(id)) toggleComparison(id); }, [comparisonIds, toggleComparison]);
  function compareFromResult(id) { addComparison(id); navigate('compare'); }
  function resetFilters() { setFamily('all'); setType('all'); setSpecialty('all'); setPriceBasis('all'); setSortMode('default'); setQuery(''); }
  const isArchive = view === 'archive' || view === 'companies';
  return (
    <div className={`studio-app ${view === 'studio' ? 'is-room' : 'is-workspace'} ${effectsPaused ? 'motion-paused' : ''}`}>
      <DragSlip drag={archiveDrag} elementRef={archiveGhostRef} />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="studio-header"><button className="wordmark" onClick={() => navigate('studio')} aria-label="AI Archive: back to studio">AI<span className="wordmark-symbol">/</span>ARCHIVE<small>MANHATTAN NIGHT STUDIO</small></button><nav aria-label="Main navigation"><button aria-current={view === 'find' ? 'page' : undefined} onClick={() => navigate('find')}>Find my AI</button><button aria-current={view === 'compare' ? 'page' : undefined} onClick={() => navigate('compare')}>Compare <span>{comparisonIds.length ? `(${comparisonIds.length})` : ''}</span></button><button aria-current={isArchive ? 'page' : undefined} onClick={() => navigate('archive')}>Archive</button></nav><button className="motion-toggle" onClick={() => setMotionPaused(!motionPaused)} aria-pressed={motionPaused} aria-label={motionPaused ? 'Resume ambient motion' : 'Pause ambient motion'}>{motionPaused ? 'PLAY MOTION ▷' : 'PAUSE MOTION Ⅱ'}</button></header>
      <main id="main-content">
        {view === 'studio' ? <StudioScene onNavigate={navigate} message={petLines[petLine % petLines.length]} onPoke={() => setPetLine(petLine + 1)} motionPaused={effectsPaused} /> : (
          <div className="workspace-wrap"><div className="workspace-location"><button onClick={() => navigate('studio')}>← BACK TO THE STUDIO</button><span>NEW YORK / PERSONAL INFERENCE LAB</span></div><div className="workspace-sheet">
            {view === 'find' && <RecipeFinder models={decisionModels} recipe={recipe} onRecipeChange={setRecipe} onInspect={setDossier} onCompare={compareFromResult} motionPaused={effectsPaused} />}
            {view === 'compare' && <ComparisonDesk models={decisionModels} selectedIds={comparisonIds} onToggle={toggleComparison} onAdd={addComparison} onClear={() => setComparisonIds([])} onInspect={setDossier} />}
            {isArchive && <>
              <div className="workspace-heading"><div><p className="eyebrow">03 / THE FILING CABINET</p><h1>Every model.<br /><em>Every receipt.</em></h1></div><p className="heading-aside">{decisionModels.length} dossiers. Five families.<br />The old files stay.<br /><span>Original company & stock snapshot: {checkedAt}.</span></p></div>
              <div className="archive-subnav"><button aria-pressed={view === 'archive'} onClick={() => setView('archive')}>MODEL DOSSIERS / {decisionModels.length}</button><button aria-pressed={view === 'companies'} onClick={() => setView('companies')}>COMPANIES & STOCKS / 5</button><button className="compare-desk-link" onClick={() => navigate('compare')}>COMPARISON DESK ({comparisonIds.length}) ↗</button></div>
              {view === 'archive' ? <>
                <div className="archive-toolbar"><label className="search-field">SEARCH THE CABINET<input type="search" placeholder="Model, family, type, specialty…" value={query} onChange={(event) => setQuery(event.target.value)} /></label><p>Original 20 records preserved, plus 3 current references.<br />Historical models are not automatically eligible for recommendations.</p></div>
                <FilterBar family={family} type={type} specialty={specialty} priceBasis={priceBasis} sortMode={sortMode} onFamilyChange={setFamily} onTypeChange={setType} onSpecialtyChange={setSpecialty} onPriceBasisChange={setPriceBasis} onSortChange={setSortMode} onReset={resetFilters} />
                <p className="result-count" role="status">{String(visibleItems.length).padStart(2, '0')} OF {decisionModels.length} DOSSIERS / {comparisonIds.length} ON THE COMPARISON DESK</p>
                <section className="archive-grid" aria-label="AI model records" aria-busy={query !== deferredQuery}>{visibleItems.map((item) => <ArchiveCard key={item.id} item={item} selected={comparisonIds.includes(item.id)} selectionFull={comparisonIds.length === 3} onToggle={toggleComparison} onInspect={setDossier} dragProps={bindArchiveDrag(item.id, item.name)} />)}</section>
                {!visibleItems.length && <div className="empty-state"><h2>An empty drawer.</h2><p>No models match those filters.</p><button onClick={resetFilters}>Reset the cabinet ↗</button></div>}
              </> : <><p className="archive-company-note">These are saved company and parent-company stock references from October 28, 2026, not live market quotes. Private companies have no public stock quote in this archive.</p><section className="archive-grid" aria-label="Company records">{Object.entries(companies).map(([name, company]) => <CompanyCard key={name} family={name} company={company} />)}</section></>}
            </>}
            <footer className="workspace-footer"><span>AI ARCHIVE / AN INTERACTIVE DECISION TOOL · <a href="./archive.html">READABLE ARCHIVE ↗</a></span><button onClick={() => navigate('studio')}>Meet me back at the desk. ↗</button></footer>
          </div></div>
        )}
      </main>
      {archiveDrag && <aside ref={archiveDropRef} className={`archive-drop-desk ${archiveDrag.over ? 'drag-over' : ''}`} aria-label="Archive comparison drop area"><span>THE COMPARISON DESK / {comparisonIds.length} OF 3</span><strong>{comparisonIds.length < 3 ? 'Drop a dossier here ↙' : 'Desk full. Remove a file first.'}</strong><p>Your selected files stay on the comparison desk.</p></aside>}
      {notice && <div className="studio-notice" role="status">SCRIB SAYS / {notice}</div>}
      {dossier && <ModelDossier model={dossier} onClose={() => setDossier(null)} onCompare={compareFromResult} />}
    </div>
  );
}
