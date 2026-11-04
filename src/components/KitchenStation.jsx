import React, { useLayoutEffect, useRef } from 'react';
import ScribCompanion from './ScribCompanion.jsx';

// The paper flight is measured once. Only its transform changes during travel.
export function IngredientFlight({ flight, targetRef, onFinish, motionPaused }) {
  const node = useRef(null);
  useLayoutEffect(() => {
    if (!flight || !node.current) return;
    const target = targetRef.current?.getBoundingClientRect();
    if (!target || motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { onFinish(); return; }
    const animation = node.current.animate([
      { transform: `translate3d(${flight.x}px, ${flight.y}px, 0) rotate(-9deg)`, opacity: 1 },
      { transform: `translate3d(${target.left + target.width / 2 - 45}px, ${target.top - 35}px, 0) rotate(13deg)`, opacity: 1, offset: .7 },
      { transform: `translate3d(${target.left + target.width / 2 - 45}px, ${target.top + 25}px, 0) rotate(-6deg) scale(.55)`, opacity: 0 },
    ], { duration: 650, easing: 'cubic-bezier(.25,.7,.35,1)', fill: 'both' });
    animation.onfinish = onFinish;
    return () => animation.cancel();
  }, [flight, targetRef, motionPaused, onFinish]);
  return flight ? <div ref={node} className="ingredient-flight" aria-hidden="true">{flight.label}</div> : null;
}

const stages = { idle: 0, loading: 1, stirring: 2, plating: 3, served: 3 };
export default function KitchenStation({ phase, selected, trayRef, dragOver, result, onRemove, onPoke, motionPaused }) {
  const busy = ['loading', 'stirring', 'plating'].includes(phase);
  const currentStep = phase === 'idle' && selected.length ? 1 : stages[phase];
  const title = { idle: selected.length ? 'Ready to cook.' : 'Add your ingredients.', loading: 'Into the pot.', stirring: 'Scrib is stirring.', plating: 'Plating your matches.', served: result?.items.length ? 'Order up.' : 'No match this time.' }[phase];
  return <section className={`kitchen-station phase-${phase} ${dragOver ? 'pot-hovered' : ''}`} aria-label="Scrib’s cooking station">
    <ol className="cooking-steps" aria-label="Cooking progress">{['Add', 'Stir', 'Serve'].map((step, i) => <li key={step} aria-current={currentStep === i + 1 ? 'step' : undefined} className={currentStep >= i + 1 ? 'step-reached' : ''}>{step}</li>)}</ol>
    <div className="kitchen-stage">
      <span className="kitchen-shelf" aria-hidden="true" />
      <div className="kitchen-chef"><ScribCompanion variant="chef" mood={busy ? 'cooking' : phase === 'served' ? 'serving' : 'idle'} message="" onPoke={onPoke} motionPaused={motionPaused || busy} /></div>
      <div ref={trayRef} className={`cooking-pot ${dragOver ? 'drag-over' : ''}`} aria-label="Ingredient pot">
        <div className="pot-steam" aria-hidden="true"><i /><i /><i /></div>
        <div className="pot-rim" aria-hidden="true" />
        <div className="pot-ingredients">{selected.map(({ id, label }, index) => <button key={id} style={{ '--slip-index': index }} disabled={busy} onClick={() => onRemove(id)} aria-label={`Remove ${label}`}>{label}<span>×</span></button>)}</div>
        <div className="cooking-spoon" aria-hidden="true"><span /></div>
        <div className="pot-front" aria-hidden="true"><span>AI</span></div>
        <span className="pot-handle handle-left" aria-hidden="true" /><span className="pot-handle handle-right" aria-hidden="true" />
      </div>
      <div className="kitchen-hob" aria-hidden="true"><div className="hob-heat"><i /><i /><i /></div><div className="hob-knob" /></div>
      <div className="serving-plate" aria-hidden="true"><div className="plated-files">{(result?.items || []).map(({ model }, index) => <div key={model.id} style={{ '--file-index': index }}><span>{String(index + 1).padStart(2, '0')}</span>{model.name}</div>)}</div></div>
      <span className="kitchen-counter" aria-hidden="true" />
    </div>
    <p className="kitchen-status" role="status">{title}</p>
  </section>;
}
