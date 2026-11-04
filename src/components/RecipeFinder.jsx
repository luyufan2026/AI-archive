import React, { useCallback, useEffect, useRef, useState } from 'react';
import useDeskDrag from '../hooks/useDeskDrag.js';
import DragSlip from './DragSlip.jsx';
import LiveModelDesk from './LiveModelDesk.jsx';
import KitchenStation, { IngredientFlight } from './KitchenStation.jsx';
import { kitchenIngredients, recommendModels, defaultUsage } from '../utils/recommendation.js';
import { decisionCheckedAt, recommendedPool } from '../data/modelProfiles.js';

export default function RecipeFinder({ models, recipe, onRecipeChange, onInspect, onCompare, motionPaused }) {
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [flight, setFlight] = useState(null);
  const [note, setNote] = useState('');
  const trayRef = useRef(null); const resultsRef = useRef(null); const kitchenRef = useRef(null);
  const timers = useRef([]); const pendingResult = useRef(null);
  const { selected, budget, usage } = recipe;
  const busy = ['loading', 'stirring', 'plating'].includes(phase);
  const { bind, drag, ghostRef } = useDeskDrag(trayRef, (id, point) => { if (!selected.includes(id)) addIngredient(id, point); });
  const finishFlight = useCallback(() => setFlight(null), []);
  function clearTimers() { timers.current.forEach(clearTimeout); timers.current = []; }
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function change(patch) {
    if (busy) return;
    onRecipeChange({ ...recipe, ...patch });
    setResult(null); setPhase('idle'); setNote('');
  }
  function addIngredient(id, point) {
    if (busy) return;
    const ingredient = kitchenIngredients.find((item) => item.id === id);
    if (!ingredient) return;
    if (selected.includes(id)) { change({ selected: selected.filter((value) => value !== id) }); return; }
    if (selected.length >= 5) { setNote('Up to 5 ingredients. Remove one first.'); return; }
    change({ selected: [...selected, id] });
    if (point) setFlight({ ...point, label: ingredient.label, key: Date.now() });
  }
  function serve() {
    clearTimers(); setResult(pendingResult.current); setPhase('served');
    // The final files stay in the same place as the live candidates.
    if (window.matchMedia('(max-width: 760px)').matches) requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }));
  }
  function cook() {
    if (busy || selected.length < 2) return;
    clearTimers(); setNote(''); setFlight(null);
    pendingResult.current = recommendModels(models, selected, budget, usage);
    if (motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { serve(); return; }
    setResult(null); setPhase('loading');
    requestAnimationFrame(() => kitchenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    timers.current = [
      setTimeout(() => setPhase('stirring'), 850),
      setTimeout(() => { setResult(pendingResult.current); setPhase('plating'); }, 2700),
      setTimeout(serve, 3900),
    ];
  }
  useEffect(() => { if (motionPaused && busy) serve(); }, [motionPaused, busy]);
  const chosen = selected.map((id) => kitchenIngredients.find((item) => item.id === id)).filter(Boolean);
  return <>
    <DragSlip drag={drag} elementRef={ghostRef} />
    <IngredientFlight flight={flight} targetRef={trayRef} onFinish={finishFlight} motionPaused={motionPaused} />
    <div className="workspace-heading kitchen-heading"><h1>Cook your AI.</h1><p>Pick 2–5 ingredients.</p></div>
    <div className="recipe-workbench kitchen-workbench">
      <section className="ingredient-shelf" aria-label="Requirement ingredients">
        <div className="section-label"><h2>Ingredients</h2><span>{selected.length}/5</span></div>
        <div className="ingredient-grid">{kitchenIngredients.map((item) => <button key={item.id} className={`ingredient-card ${selected.includes(item.id) ? 'is-added' : ''}`} type="button" {...bind(item.id, item.label, busy)} onClick={(event) => { const r = event.currentTarget.getBoundingClientRect(); addIngredient(item.id, { x: r.left, y: r.top }); }} aria-label={item.label} aria-pressed={selected.includes(item.id)} disabled={busy}><strong>{item.label}</strong><span aria-hidden="true">{selected.includes(item.id) ? '−' : '+'}</span></button>)}</div>
        <p className="ingredient-instruction">Click or drag into the pot.</p>
        <details className="kitchen-settings"><summary>Budget: ${budget}/month</summary><fieldset className="budget-controller" disabled={busy}><legend>API budget / month</legend><div className="budget-buttons">{[0, 20, 50, 100].map((value) => <button key={value} type="button" aria-pressed={budget === value} onClick={() => change({ budget: value })}>${value}</button>)}</div></fieldset><div className="usage-inputs"><label>Input / M tokens<input type="number" min="0" max="1000" step="0.25" value={usage.input} disabled={busy} onChange={(e) => change({ usage: { ...usage, input: e.target.value === '' ? '' : Number(e.target.value) } })} /></label><label>Output / M tokens<input type="number" min="0" max="1000" step="0.25" value={usage.output} disabled={busy} onChange={(e) => change({ usage: { ...usage, output: e.target.value === '' ? '' : Number(e.target.value) } })} /></label></div><button className="text-button" disabled={busy} onClick={() => change({ usage: { ...defaultUsage } })}>Reset volume</button><p>Usage estimate, not a subscription. Tools, tax and caching excluded.</p></details>
        {note && <p className="kitchen-note" role="status">{note}</p>}
      </section>
      <div ref={kitchenRef} className="kitchen-center">
        <KitchenStation phase={phase} selected={chosen} trayRef={trayRef} dragOver={drag?.over} result={result} onRemove={addIngredient} onPoke={() => setNote('The cook is waiting for your ingredients.')} motionPaused={motionPaused} />
        <button className="build-button cook-button" disabled={busy || selected.length < 2} onClick={cook}>{busy ? 'Cooking…' : phase === 'served' ? 'Cook again' : 'Cook my AI'}<span aria-hidden="true">↗</span></button>
        {busy && <button className="skip-cooking" onClick={serve}>Skip to matches →</button>}
      </div>
      <div ref={resultsRef} className="kitchen-files" aria-busy={busy}><LiveModelDesk models={models} recipe={recipe} onInspect={onInspect} onCompare={onCompare} motionPaused={motionPaused} result={phase === 'served' ? result : null} />{phase === 'served' && result && !result.items.length && <p className="no-recipe" role="status">{result.reason}</p>}</div>
    </div>
    <details className="method-notes"><summary>Sources & scoring</summary><p>{recommendedPool.length} eligible references, checked {decisionCheckedAt}. Older versions stay in the archive. Equal-weight editorial scores, not measured benchmarks. Monthly cost = input M × input rate + output M × output rate. Budget and required capabilities act as cutoffs. The cooking animation illustrates these local rules; it does not call an AI.</p></details>
  </>;
}
