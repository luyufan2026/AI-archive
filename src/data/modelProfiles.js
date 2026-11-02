import archiveData from './archiveData.js';

export const decisionCheckedAt = '2026-11-02';
export const scoreDisclosure = 'Editorial fit estimates, not benchmarks. Scores describe our reading of the linked model information.';
const baseScores = {
  Multimodal: [8, 8, 7, 0, 0, 8, 7, 7, 7],
  'Lightweight multimodal': [7, 7, 6, 0, 0, 7, 6, 9, 8],
  'Hybrid reasoning': [9, 8, 8, 0, 0, 8, 8, 6, 6],
  Reasoning: [8, 7, 8, 0, 0, 7, 8, 5, 6],
  'General text': [7, 7, 6, 0, 0, 7, 6, 8, 7],
  'Coding reasoning': [9, 6, 6, 0, 0, 6, 7, 9, 5],
};
const scoreKeys = ['coding', 'writing', 'research', 'image', 'search', 'creative', 'accuracy', 'speed', 'ease'];
const overrides = {
  1: { contextTokens: 1047576 },
  2: { contextTokens: 1047576, recommendable: true, status: 'Reference verified', profileSource: 'https://developers.openai.com/api/docs/models/gpt-4.1-mini', scores: { coding: 8, writing: 8, speed: 9 }, limitation: 'A smaller, older model. Validate difficult reasoning and migration plans before committing.' },
  3: { contextTokens: 1047576 }, 4: { contextTokens: 128000 },
  5: { contextTokens: 200000, status: 'Retired API', lifecycleSource: 'https://platform.claude.com/docs/en/about-claude/model-deprecations' },
  6: { contextTokens: 200000, status: 'Retired API', lifecycleSource: 'https://platform.claude.com/docs/en/about-claude/model-deprecations' },
  7: { contextTokens: 200000, status: 'Retired API', lifecycleSource: 'https://platform.claude.com/docs/en/about-claude/model-deprecations' },
  8: { contextTokens: 200000, status: 'Retired API', lifecycleSource: 'https://platform.claude.com/docs/en/about-claude/model-deprecations' },
  9: { contextTokens: 1048576, status: 'Existing users only', lifecycleSource: 'https://ai.google.dev/gemini-api/docs/models' },
  10: { contextTokens: 1048576, status: 'Existing users only', lifecycleSource: 'https://ai.google.dev/gemini-api/docs/models' },
  11: { contextTokens: 1048576, status: 'Existing users only', lifecycleSource: 'https://ai.google.dev/gemini-api/docs/models' },
  12: { contextTokens: 1048576 },
  13: { contextTokens: 2000000, status: 'Historical API', searchTools: true },
  14: { contextTokens: 2000000, status: 'Historical API', searchTools: true },
  15: { contextTokens: 256000, status: 'Historical API' },
  16: { contextTokens: 500000, recommendable: true, status: 'Reference verified', profileSource: 'https://docs.x.ai/developers/models/grok-4.6', searchTools: true, scores: { coding: 9, research: 8, search: 8, speed: 7 }, limitation: 'Long-context requests cost more. Search integrations add their own costs.' },
};

const additions = [
  { id: 21, family: 'Claude', name: 'Claude Sonnet 5.5', releaseDate: '2026-09-28', releaseKind: 'Public launch', type: 'Hybrid reasoning', strengths: ['Coding', 'Agents', 'Writing'], inputPrice: 2, outputPrice: 10, priceBasis: 'Checked snapshot', priceDate: decisionCheckedAt, priceNote: 'Standard text rate. Tool calls, caching and other service tiers excluded.', releaseSource: 'https://www.anthropic.com/claude-sonnet-5-5', priceSource: 'https://platform.claude.com/docs/en/models/overview', contextTokens: 1000000, recommendable: true, status: 'Reference verified', profileSource: 'https://platform.claude.com/docs/en/models/overview', scores: { coding: 9, writing: 9, research: 8, creative: 9, accuracy: 8, speed: 8, ease: 7 }, limitation: 'Higher output cost than the small models. Reasoning tokens and tools can raise the bill.' },
  { id: 22, family: 'DeepSeek', name: 'DeepSeek-V4.1-Flash-1017', releaseDate: '2026-10-17', releaseKind: 'Model update', type: 'Hybrid reasoning', strengths: ['Coding', 'Agents', 'Tool use'], inputPrice: 0.3, outputPrice: 1.2, priceBasis: 'Checked snapshot', priceDate: decisionCheckedAt, priceNote: 'Peak, uncached text rate. Off-peak: $0.15 input / $0.60 output. Tool requests excluded.', releaseSource: 'https://api-docs.deepseek.com/news/news261017/', priceSource: 'https://api-docs.deepseek.com/quick_start/pricing/', contextTokens: 1000000, recommendable: true, status: 'Reference verified', profileSource: 'https://api-docs.deepseek.com/quick_start/pricing/', scores: { coding: 9, writing: 7, research: 8, creative: 7, accuracy: 8, speed: 8, ease: 6 }, limitation: 'Peak/off-peak rates differ. Integrations and deployment need developer setup.' },
  { id: 23, family: 'Gemini', name: 'Gemini 3.8 Flash', releaseDate: '2026-09', releaseKind: 'Catalog update month; exact launch date not recorded', type: 'Hybrid reasoning', strengths: ['Coding', 'Agents', 'Long context', 'Search'], inputPrice: 0.75, outputPrice: 3.75, priceBasis: 'Checked snapshot', priceDate: decisionCheckedAt, priceNote: 'Standard introductory text rate through December 31, 2026; then $1.50 / $7.50. Search charges excluded.', releaseSource: 'https://aistudio.google.com/docs/models/gemini-3.8-flash', priceSource: 'https://ai.google.dev/gemini-api/docs/pricing', contextTokens: 1048576, recommendable: true, status: 'Reference verified', profileSource: 'https://aistudio.google.com/docs/models/gemini-3.8-flash', searchTools: true, hasFreeTier: true, scores: { coding: 9, writing: 8, research: 9, search: 9, creative: 8, accuracy: 8, speed: 8, ease: 7 }, limitation: 'Introductory pricing ends December 31. Free-tier quotas and paid search costs are separate.' },
];

const choiceNotes = {
  2: 'You need economical everyday coding and text work, a large input window, and a fast small model. Validate harder reasoning before relying on it.',
  16: 'You want a model with recorded search-tool integration and a 500K context window. Allow for separate search charges and higher long-context rates.',
  21: 'You prioritize code, agent workflows and extended writing, and can accept a higher output-token bill than the smaller models.',
  22: 'You want low-cost coding and agent workflows and are comfortable setting up an API integration. Budget using peak rates unless your schedule supports off-peak pricing.',
  23: 'You want long-context research, image input and search-tool support. Check introductory pricing and separate search charges before committing.',
};

function enrich(item) {
  const extra = overrides[item.id] || {};
  const merged = { ...item, ...extra };
  const scores = { ...Object.fromEntries(scoreKeys.map((key, index) => [key, (baseScores[item.type] || baseScores.Multimodal)[index]])), ...extra.scores, ...item.scores };
  const contextTokens = merged.contextTokens || null;
  const supportsVision = /multimodal/i.test(merged.type) || ['Claude', 'Gemini'].includes(merged.family) || [16, 22].includes(merged.id);
  return {
    ...merged, scores, contextTokens, recommendable: Boolean(merged.recommendable),
    status: merged.status || 'Historical reference',
    profileSource: merged.profileSource || merged.releaseSource,
    bestFor: merged.strengths.join(' / '),
    chooseIf: choiceNotes[merged.id] || `You are comparing the historical ${merged.strengths.slice(0, 2).join(' / ').toLowerCase()} release and have checked the linked availability and rate conditions.`,
    pros: [`Built for ${merged.strengths.slice(0, 2).join(' and ').toLowerCase()}.`, contextTokens ? `${formatContext(contextTokens)} context reference.` : 'Task details linked in the original release.'],
    cons: [merged.limitation || 'Historical reference; current availability and pricing need checking.', 'Not a dedicated image-generation model.'],
    modalities: `${supportsVision ? 'Text + image input' : 'Text input'} → text output`,
    capabilities: { imageGeneration: false, vision: supportsVision, search: Boolean(merged.searchTools) },
    access: merged.hasFreeTier ? 'Paid API / limited free tier' : 'Paid API / credits excluded',
  };
}

export function formatContext(tokens) {
  if (!tokens) return 'Not recorded';
  return tokens >= 1000000 ? `${(tokens / 1000000).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}M tokens` : `${Math.round(tokens / 1000)}K tokens`;
}
export const decisionModels = [...archiveData, ...additions].map(enrich);
export const recommendedPool = decisionModels.filter((item) => item.recommendable);
