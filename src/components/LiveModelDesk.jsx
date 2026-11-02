import React, { useLayoutEffect, useRef, useState } from 'react';
import { rankModelsForDesk } from '../utils/recommendation.js';
import { formatPrice } from '../utils/archive.js';

export default function LiveModelDesk({ models, recipe, onInspect, onCompare, motionPaused }) {
  const ranked = rankModelsForDesk(models, recipe.selected, recipe.budget, recipe.usage);
  const nodes = useRef(new Map());
  const previous = useRef(new Map());
  const [moves, setMoves] = useState({});
  const signature = ranked.map((item) => `${item.model.id}:${item.fit}:${item.eligible}`).join('|');
  useLayoutEffect(() => {
    const next = new Map(); const changes = {}; const animations = [];
    ranked.forEach(({ model }, index) => {
      const node = nodes.current.get(model.id);
      if (!node) return;
      node.getAnimations().forEach((animation) => animation.cancel());
      const rect = node.getBoundingClientRect();
      const parentRect = node.parentElement.getBoundingClientRect();
      const position = { left: rect.left - parentRect.left, top: rect.top - parentRect.top };
      const before = previous.current.get(model.id);
      next.set(model.id, { ...position, rank: index });
      if (before && before.rank !== index) {
        changes[model.id] = before.rank - index;
        if (!motionPaused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          animations.push(node.animate([
            { transform: `translate(${before.left - position.left}px, ${before.top - position.top}px)`, zIndex: 5 },
            { transform: 'translate(0, 0)', zIndex: 1 },
          ], { duration: 780, easing: 'cubic-bezier(.22,.72,.2,1)' }));
        }
      }
    });
    previous.current = next;
    setMoves(changes);
    return () => animations.forEach((animation) => animation.cancel());
    // Signature captures the order/eligibility that matters to the layout.
  }, [signature, motionPaused]);
  const eligible = ranked.filter((item) => item.eligible).length;
  return <section className="live-model-desk" aria-label="Live model arrangement">
    <div className="section-label"><span>THE SAME FIVE FILES</span><span>{String(eligible).padStart(2, '0')} WITHIN REACH</span></div>
    <div className="live-desk-heading"><h2>The order is the answer.</h2><span className="pencil-annotation">needs change → files move</span></div>
    <p className="live-desk-hint" role="status">{recipe.selected.length ? `${recipe.selected.length < 2 ? 'Preview only — add another need to make a shortlist. ' : ''}${eligible} of ${ranked.length} references meet the budget and capability requirements.` : 'Start with a need. Nothing has been ranked yet.'}</p>
    <ol className="live-file-stack">{ranked.map(({ model, cost, fit, eligible: fits, blockedReason }, index) => <li key={model.id} ref={(node) => { if (node) nodes.current.set(model.id, node); else nodes.current.delete(model.id); }} className={`live-model-file ${!fits ? 'is-outside' : ''} ${index === 0 && fit !== null && fits ? 'is-under-lamp' : ''}`} data-model-id={model.id} data-rank={index + 1}>
      <span className="live-file-rank">{String(index + 1).padStart(2, '0')}</span><div className="live-file-body"><p>{model.family} <span className={`rank-movement ${moves[model.id] > 0 ? 'moves-up' : ''}`}>{moves[model.id] ? `${moves[model.id] > 0 ? '↑' : '↓'} ${Math.abs(moves[model.id])} ${Math.abs(moves[model.id]) === 1 ? 'place' : 'places'}` : ''}</span></p><h3><button onClick={() => onInspect(model)}>{model.name}</button></h3><span className="file-cost">{formatPrice(cost)} / estimated month</span><p className="live-file-reason">{blockedReason || (fit === null ? model.bestFor : `${ranked[index].reasons.map((reason) => reason.label).slice(0, 2).join(' + ')} fit`)}</p><span className="file-check-stamp">CHECKED {model.recordCheckedAt}</span></div>
      <div className="live-file-score"><strong>{fit ?? '—'}<small>{fit === null ? 'UNRANKED' : '/100 FIT'}</small></strong><button onClick={() => onCompare(model.id)}>Compare +</button></div>
    </li>)}</ol>
    <p className="source-note">Same records, new arrangement. Scores are editorial estimates. Files outside the requirements stay visible. The full archive keeps all {models.length} dossiers.</p>
  </section>;
}
