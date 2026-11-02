// All recommendation rules live here. This is a local heuristic, not an AI API call.
export const ingredients = [
  { id: 'coding', label: 'Coding', short: '01', description: 'Code, debug, ship.' },
  { id: 'writing', label: 'Writing', short: '02', description: 'Words with a point.' },
  { id: 'research', label: 'Research', short: '03', description: 'Read. Reason. Repeat.' },
  { id: 'image', label: 'Image generation', short: '04', description: 'Pixels, not paragraphs.' },
  { id: 'search', label: 'Search', short: '05', description: 'Connect to search tools.' },
  { id: 'context', label: 'Long context', short: '06', description: 'Room for the whole file.' },
  { id: 'creative', label: 'Creative', short: '07', description: 'A less obvious answer.' },
  { id: 'accuracy', label: 'Accurate', short: '08', description: 'Careful reasoning. Still verify.' },
  { id: 'speed', label: 'Fast', short: '09', description: 'Less staring at a cursor.' },
  { id: 'ease', label: 'Easy to use', short: '10', description: 'Less integration effort.' },
  { id: 'cheap', label: 'Cheap', short: '11', description: 'Leave some rent money.' },
  { id: 'powerful', label: 'Powerful', short: '12', description: 'More difficult work.' },
];
export const defaultUsage = { input: 1, output: 0.25 };
export function estimateMonthlyCost(model, usage = defaultUsage) {
  return Math.max(0, Number(usage.input) || 0) * model.inputPrice + Math.max(0, Number(usage.output) || 0) * model.outputPrice;
}
export function ingredientScore(model, id, usage = defaultUsage) {
  if (id === 'cheap') return Math.max(0, Math.min(10, 10 - 3 * Math.log10(1 + estimateMonthlyCost(model, usage))));
  if (id === 'context') return Math.min(10, (model.contextTokens || 0) / 100000);
  if (id === 'powerful') return (model.scores.coding + model.scores.research + model.scores.accuracy) / 3;
  return model.scores[id] || 0;
}
function recognizedIngredients(selected) {
  return [...new Set(selected)].filter((id) => ingredients.some((item) => item.id === id));
}
function validUsage(usage) {
  const input = Number(usage.input); const output = Number(usage.output);
  return Number.isFinite(input) && Number.isFinite(output) && input >= 0 && output >= 0 && input + output > 0;
}
// The live desk and the final shortlist share this single evaluation path.
// Blocked models stay visible on the desk, with their actual reason, instead of disappearing.
export function rankModelsForDesk(models, selected, budget, usage = defaultUsage) {
  const ids = recognizedIngredients(selected);
  const volumeValid = validUsage(usage);
  const ceiling = Number(budget);
  const budgetValid = Number.isFinite(ceiling) && ceiling >= 0;
  return models.filter((model) => model.recommendable).map((model) => {
    const cost = estimateMonthlyCost(model, usage);
    const contributions = ids.map((id) => ({ id, label: ingredients.find((item) => item.id === id).label, value: ingredientScore(model, id, usage) }));
    const fit = ids.length ? Math.round(100 * contributions.reduce((sum, item) => sum + item.value, 0) / (ids.length * 10)) : null;
    const blockedReason = !volumeValid ? 'Enter a valid token volume' : !budgetValid ? 'Choose a valid budget' : ids.includes('image') && !model.capabilities.imageGeneration ? 'No image generation' : ids.includes('search') && !model.capabilities.search ? 'Search support unrecorded' : cost > ceiling ? 'Above your API budget' : '';
    return { model, cost, fit, contributions, reasons: [...contributions].sort((a, b) => b.value - a.value).slice(0, 3), eligible: !blockedReason, blockedReason };
  }).sort((a, b) => Number(b.eligible) - Number(a.eligible) || (ids.length ? b.fit - a.fit || a.cost - b.cost : 0) || a.model.id - b.model.id);
}
export function recommendModels(models, selected, budget, usage = defaultUsage) {
  const ids = recognizedIngredients(selected);
  if (ids.length < 2 || ids.length > 5) return { items: [], reason: 'Add between 2 and 5 ingredients before building your AI.' };
  if (ids.includes('image') && !models.some((model) => model.recommendable && model.capabilities.imageGeneration)) {
    return { items: [], reason: 'This collection has text-output models, not image generators. Image input is not image generation. Remove that ingredient to build a text-model recipe.' };
  }
  if (!validUsage(usage)) return { items: [], reason: 'Enter a positive monthly input or output volume.' };
  const ceiling = Number(budget);
  if (!Number.isFinite(ceiling) || ceiling < 0) return { items: [], reason: 'Choose a valid API budget.' };
  const ranked = rankModelsForDesk(models, ids, budget, usage).filter((item) => item.eligible);
  return { items: ranked.slice(0, 3), total: ranked.length, reason: ranked.length ? '' : 'No paid-rate estimate fits this recipe and budget. Raise the budget, reduce monthly volume, or remove a requirement. Free-tier quotas are not assumed.' };
}
