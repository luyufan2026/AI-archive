import { Localize } from '../i18n/LanguageContext.jsx';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { rankModelsForDesk } from '../utils/recommendation.js';
import { formatPrice } from '../utils/archive.js';

export default function LiveModelDesk({ models, recipe, onInspect, onCompare, motionPaused, result }) {
  const ranked = useMemo(() => rankModelsForDesk(models, recipe.selected, recipe.budget, recipe.usage), [models, recipe.selected, recipe.budget, recipe.usage]);
  const nodes = useRef(new Map());
  const previous = useRef(new Map());
  const [moves, setMoves] = useState({});
  const signature = ranked.map((item) => `${item.model.id}:${item.fit}:${item.eligible}`).join('|');
  useLayoutEffect(() => {
    const next = new Map(); const changes = {}; const animations = [];
    const entries = ranked.map(({ model }, index) => ({ id: model.id, index, node: nodes.current.get(model.id) })).filter(({ node }) => node);
    // Finish all writes, then measure all cards together, then start transforms.
    entries.forEach(({ node }) => node.getAnimations().forEach((animation) => animation.cancel()));
    const parentRect = entries[0]?.node.parentElement.getBoundingClientRect();
    const measured = entries.map(({ id, index, node }) => {
      const rect = node.getBoundingClientRect();
      const position = { left: rect.left - parentRect.left, top: rect.top - parentRect.top, rank: index };
      next.set(id, position);
      return { id, index, node, position, before: previous.current.get(id) };
    });
    const animate = !motionPaused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    measured.forEach(({ id, index, node, position, before }) => {
      if (!before || before.rank === index) return;
      changes[id] = before.rank - index;
      if (animate) animations.push(node.animate([
        { transform: `translate3d(${before.left - position.left}px, ${before.top - position.top}px, 0)` },
        { transform: 'translate3d(0, 0, 0)' },
      ], { duration: 650, easing: 'cubic-bezier(.22,.72,.2,1)' }));
    });
    previous.current = next;
    setMoves(changes);
    return () => animations.forEach((animation) => animation.cancel());
    // Signature captures the order/eligibility that matters to the layout.
  }, [signature, motionPaused]);
  const eligible = ranked.filter((item) => item.eligible).length;
  return <Localize><section className="live-model-desk" aria-label="Live model arrangement">
    <div className="live-desk-heading"><h2>{result ? 'Your matches' : 'Candidates'}</h2><span className="candidate-count">{result ? result.items.length : eligible}/{ranked.length}</span></div>
    <p className="live-desk-hint" role="status">{result ? '' : recipe.selected.length ? 'The order changes with your ingredients.' : 'Add ingredients to rank these models.'}</p>
    <ol className={`live-file-stack ${result ? 'files-served' : ''}`}>{ranked.map(({ model, cost, fit, eligible: fits, blockedReason }, index) => <li key={model.id} ref={(node) => { if (node) nodes.current.set(model.id, node); else nodes.current.delete(model.id); }} className={`live-model-file ${!fits ? 'is-outside' : ''} ${index === 0 && fit !== null && fits ? 'is-under-lamp' : ''} ${result?.items.some((item) => item.model.id === model.id) ? 'is-served' : result ? 'not-served' : ''}`} data-model-id={model.id} data-rank={index + 1} style={{ '--serve-index': index }}>
      <span className="live-file-rank">{String(index + 1).padStart(2, '0')}</span><div className="live-file-body"><p>{model.family} <span className={`rank-movement ${moves[model.id] > 0 ? 'moves-up' : ''}`}>{moves[model.id] ? `${moves[model.id] > 0 ? '↑' : '↓'} ${Math.abs(moves[model.id])} ${Math.abs(moves[model.id]) === 1 ? 'place' : 'places'}` : ''}</span></p><h3><button onClick={() => onInspect(model)}>{model.name}</button></h3><span className="file-cost">{formatPrice(cost)} / estimated month</span><p className="live-file-reason">{blockedReason || (fit === null ? model.bestFor : `${ranked[index].reasons.map((reason) => reason.label).slice(0, 2).join(' + ')} fit`)}</p><span className="file-check-stamp">CHECKED {model.recordCheckedAt}</span></div>
      <div className="live-file-score"><strong>{fit ?? '—'}<small>{fit === null ? 'UNRANKED' : '/100 FIT'}</small></strong><button onClick={() => onCompare(model.id)}>Compare +</button></div>
    </li>)}</ol>
    <p className="source-note">Editorial fit / 100 · estimated API cost / month.</p>
  </section></Localize>;
}
