import React, { useEffect, useRef, useState } from 'react';
import useDeskDrag from '../hooks/useDeskDrag.js';
import DragSlip from './DragSlip.jsx';
import ScribCompanion from './ScribCompanion.jsx';
import { ingredients, recommendModels, defaultUsage } from '../utils/recommendation.js';
import { formatPrice } from '../utils/archive.js';
import { recommendedPool, decisionCheckedAt } from '../data/modelProfiles.js';

const quips = {
  coding: 'Delegating the semicolons. Sensible.', writing: 'A personality, but make it billable.', research: 'Good. Bring sources, not vibes.',
  image: 'That is a text model. A small but important detail.', search: 'The internet. What could possibly go wrong?', context: 'You brought the entire folder, didn’t you?',
  creative: 'Finally. A little room for bad ideas.', accuracy: 'Confident and correct are different ingredients.', speed: 'Yes, yes. Your time is very precious.',
  ease: 'Fewer settings. Fewer existential questions.', cheap: 'Champagne taste. Tap-water budget.', powerful: 'Subtle. You want the big one.',
};

export default function RecipeFinder({ models, recipe, onRecipeChange, onInspect, onCompare }) {
  const [phase, setPhase] = useState('idle');
  const [cargo, setCargo] = useState('');
  const [quip, setQuip] = useState('Give me 2–5 ingredients. I’ll judge the recipe.');
  const [result, setResult] = useState(null);
  const trayRef = useRef(null);
  const { bind, drag } = useDeskDrag(trayRef, (id) => { if (!selected.includes(id)) addIngredient(id); });
  const collectTimer = useRef(null); const cookTimer = useRef(null); const resultsRef = useRef(null);
  const { selected, budget, usage } = recipe;
  useEffect(() => () => { clearTimeout(collectTimer.current); clearTimeout(cookTimer.current); }, []);
  function change(patch) {
    const nextRecipe = { ...recipe, ...patch };
    onRecipeChange(nextRecipe);
    // Once served, keep the visible shortlist in sync with budget, volume and ingredients.
    if (result) {
      const next = recommendModels(models, nextRecipe.selected, nextRecipe.budget, nextRecipe.usage);
      setResult(next);
      setCargo(next.items.length ? 'YOUR SHORTLIST' : 'A REALITY CHECK');
    }
  }
  function addIngredient(id) {
    if (phase === 'cooking' || !ingredients.some((item) => item.id === id)) return;
    if (selected.includes(id)) { change({ selected: selected.filter((value) => value !== id) }); setQuip('One less ingredient. Restraint. I like it.'); return; }
    if (selected.length >= 5) { setQuip('Five ingredients. This is a recipe, not a grocery store.'); return; }
    change({ selected: [...selected, id] }); setCargo(ingredients.find((item) => item.id === id).label); setQuip(quips[id]); setPhase('collecting');
    clearTimeout(collectTimer.current); collectTimer.current = setTimeout(() => { setCargo(''); setPhase('idle'); }, 780);
  }
  function build() {
    if (phase === 'cooking') return;
    if (selected.length < 2) { setQuip('One ingredient is not a personality. Add another.'); return; }
    clearTimeout(collectTimer.current); setCargo(''); setPhase('cooking'); setQuip('One moment. I’m separating your needs from your ambitions.');
    const snapshot = { ...recipe, selected: [...selected], usage: { ...usage } };
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 1700;
    cookTimer.current = setTimeout(() => {
      const next = recommendModels(models, snapshot.selected, snapshot.budget, snapshot.usage);
      setResult(next); setPhase('served'); setCargo(next.items.length ? 'YOUR SHORTLIST' : 'A REALITY CHECK');
      setQuip(next.items.length ? 'Dinner is served. Read the small print.' : 'The numbers disagree. Take it up with the numbers.');
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }));
    }, delay);
  }
  const busy = phase === 'cooking';
  return (
    <>
      <DragSlip drag={drag} />
      <div className="workspace-heading"><div><p className="eyebrow">01 / THE RECIPE ROOM</p><h1>A little instinct.<br /><em>A better AI.</em></h1></div><p className="heading-aside">Tell Scrib what matters.<br />He’ll mix you a shortlist.<br /><span>No accounts. No API calls. Just a little judgment.</span></p></div>
      <div className="recipe-workbench">
        <section className="ingredient-shelf" aria-label="Requirement ingredients"><div className="section-label"><span>YOUR INGREDIENTS</span><span>{selected.length} / 5 ADDED</span></div><h2>What are we making?</h2><p>Click a card or drag it into the mixing tray.</p><div className="ingredient-grid">{ingredients.map((item) => <button key={item.id} className={`ingredient-card ${selected.includes(item.id) ? 'is-added' : ''}`} type="button" {...bind(item.id, item.label, busy)} onClick={() => addIngredient(item.id)} aria-pressed={selected.includes(item.id)} disabled={busy}><span>{item.short} / {selected.includes(item.id) ? 'ADDED' : 'ADD +'}</span><strong>{item.label}</strong><small>{item.description}</small></button>)}</div></section>
        <section className={`mixing-station is-${phase}`} aria-label="AI recipe mixing machine"><div className="section-label"><span>PERSONAL INFERENCE / LAB 01</span><span className="status-lamp">{busy ? 'MIXING' : 'READY'}</span></div><div className="pet-workspace"><ScribCompanion mood={phase === 'collecting' ? 'collecting' : busy ? 'cooking' : phase === 'served' ? 'serving' : 'idle'} message={quip} cargo={cargo} onPoke={() => setQuip('I’m made of lines. You’re the one going in circles.')} variant="recipe" /><div className="machine-grille" aria-hidden="true" /></div>
          <div ref={trayRef} className={`mixing-tray ${drag?.over ? 'drag-over' : ''}`}><span className="tray-engraving">THE MIX / DROP INGREDIENTS HERE</span>{selected.length ? <div className="mixed-ingredients">{selected.map((id) => <button key={id} disabled={busy} onClick={() => addIngredient(id)} aria-label={`Remove ${ingredients.find((item) => item.id === id).label}`}>{ingredients.find((item) => item.id === id).label}<span>×</span></button>)}</div> : <p>Nothing in the tray.<br />A promising start to indecision.</p>}</div>
          <fieldset className="budget-controller" disabled={busy}><legend>MONTHLY API BUDGET / USD</legend><div className="budget-buttons">{[0, 20, 50, 100].map((value) => <button key={value} type="button" aria-pressed={budget === value} onClick={() => { change({ budget: value }); setQuip(value === 0 ? 'Free is a lovely price. Paid tokens have other ideas.' : 'A budget. How refreshingly specific.'); }}>${value}{value === 100 ? '+' : ''}</button>)}</div><p>$100+ uses a $100 comparison ceiling.</p></fieldset>
          <details className="usage-settings"><summary>Monthly volume: {usage.input}M in / {usage.output}M out</summary><div className="usage-inputs"><label>Input tokens (millions)<input type="number" min="0" max="1000" step="0.25" value={usage.input} disabled={busy} onChange={(event) => change({ usage: { ...usage, input: event.target.value === '' ? '' : Number(event.target.value) } })} /></label><label>Output tokens (millions)<input type="number" min="0" max="1000" step="0.25" value={usage.output} disabled={busy} onChange={(event) => change({ usage: { ...usage, output: event.target.value === '' ? '' : Number(event.target.value) } })} /></label></div><button disabled={busy} type="button" onClick={() => change({ usage: { ...defaultUsage } })}>Use default volume</button></details>
          <button className="build-button" disabled={busy || selected.length < 2} onClick={build}>{busy ? 'MIXING YOUR RECIPE…' : 'BUILD MY AI'}<span>{busy ? '···' : '↗'}</span></button><p className="machine-footnote">{recommendedPool.length} reference-verified models · checked {decisionCheckedAt}. Cost = input M × input rate + output M × output rate. No free quota, tools, tax or caching assumed.</p>
        </section>
      </div>
      <div ref={resultsRef} className="recipe-results" aria-live="polite" aria-busy={busy}>
        {result && <><div className="results-heading"><p className="eyebrow">FRESH FROM THE MACHINE</p><h2>{result.items.length ? 'Your shortlist. Served.' : 'This recipe needs a rethink.'}</h2><p>Fit scores are local editorial estimates, not benchmark results or a guarantee.</p></div>{result.items.length ? <div className="recommendation-grid">{result.items.map(({ model, cost, fit, reasons }, index) => <article className={`result-ticket result-${index}`} key={model.id}><div className="ticket-top"><span>{index === 0 ? 'BEST FIT' : `ALTERNATIVE 0${index + 1}`}</span><strong>{fit}<small>/100 fit</small></strong></div><p className="eyebrow">{model.family}</p><h3>{model.name}</h3><p className="ticket-price">{formatPrice(cost)}<small> / estimated month</small></p><ul>{reasons.map((reason) => <li key={reason.id}>{reason.label}: {reason.value.toFixed(1)}/10 editorial fit</li>)}</ul><p className="ticket-caveat">{model.cons[0]}</p><div className="ticket-actions"><button onClick={() => onInspect(model)}>Open dossier ↗</button><button onClick={() => onCompare(model.id)}>Compare +</button></div></article>)}</div> : <p className="no-recipe" role="status">{result.reason}</p>}</>}
      </div>
      <details className="method-notes"><summary>What is actually being mixed?</summary><p>Only reference-verified versions enter the shortlist. Selected requirements have equal weight. Fit is the mean of selected 0–10 editorial ratings ×10; Cheap uses a logarithmic cost score and Long Context uses the recorded token window. Budget is a hard cutoff for your entered volume. Search requires search-tool support; image generation requires an image-output model. Ties break by lower cost, then record ID.</p><p>This is a curated comparison tool, not a live benchmark. No answer is generated. Research/accuracy ratings do not guarantee factual correctness. Historical versions stay available in the archive but do not enter this shortlist.</p></details>
    </>
  );
}
