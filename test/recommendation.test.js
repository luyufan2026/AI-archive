import test from 'node:test';
import assert from 'node:assert/strict';
import archiveData from '../src/data/archiveData.js';
import { decisionModels, recommendedPool } from '../src/data/modelProfiles.js';
import { filterAndSort } from '../src/utils/archive.js';
import { defaultUsage, estimateMonthlyCost, recommendModels } from '../src/utils/recommendation.js';

test('enriched dossiers preserve every original field and keep historical versions out of the shortlist', () => {
  assert.equal(decisionModels.length, 23);
  assert.equal(new Set(decisionModels.map((item) => item.id)).size, 23);
  for (const original of archiveData) {
    const dossier = decisionModels.find((item) => item.id === original.id);
    for (const [key, value] of Object.entries(original)) assert.deepEqual(dossier[key], value);
  }
  assert.equal(recommendedPool.length, 5);
  assert.equal(new Set(recommendedPool.map((item) => item.family)).size, 5);
  assert.ok(recommendedPool.every((item) => item.status === 'Reference verified'));
  assert.ok(decisionModels.filter((item) => item.status === 'Retired API').every((item) => !item.recommendable));
});

test('monthly estimates use millions of input/output tokens, not subscription fees', () => {
  const mini = decisionModels.find((item) => item.id === 2);
  assert.equal(estimateMonthlyCost(mini, defaultUsage), 0.8);
  assert.equal(estimateMonthlyCost(mini, { input: 10, output: 2 }), 7.2);
  assert.equal(estimateMonthlyCost(mini, { input: 0, output: 1 }), 1.6);
});

test('ranking is deterministic, bounded and does not mutate the source collection', () => {
  const original = JSON.stringify(decisionModels);
  const result = recommendModels(decisionModels, ['coding', 'cheap'], 20);
  assert.deepEqual(result.items.map(({ model }) => model.id), [22, 23, 2]);
  assert.equal(result.total, 5);
  assert.deepEqual(recommendModels(decisionModels, ['coding', 'cheap'], 20), result);
  assert.equal(result.items[0].fit, 92);
  for (const item of result.items) {
    assert.ok(item.fit >= 0 && item.fit <= 100);
    assert.ok(item.cost <= 20);
    assert.ok(item.reasons.every((reason) => ['coding', 'cheap'].includes(reason.id)));
  }
  assert.equal(JSON.stringify(decisionModels), original);
});

test('budget changes and volume changes impose real cutoffs, without assuming a free tier', () => {
  assert.equal(recommendModels(decisionModels, ['coding', 'cheap'], 0).items.length, 0);
  const highVolume = recommendModels(decisionModels, ['coding', 'cheap'], 20, { input: 50, output: 5 });
  assert.equal(highVolume.items.length, 0);
  assert.ok(recommendModels(decisionModels, ['coding', 'cheap'], 50, { input: 50, output: 5 }).items.length > 0);
  assert.equal(recommendModels(decisionModels, ['coding', 'cheap'], 20, { input: 0, output: 0 }).items.length, 0);
  assert.equal(recommendModels(decisionModels, ['coding', 'cheap'], 20, { input: -1, output: 2 }).items.length, 0);
});

test('unsupported image generation and unverified search do not become fake matches', () => {
  const image = recommendModels(decisionModels, ['image', 'creative'], 100);
  assert.deepEqual(image.items, []);
  assert.match(image.reason, /not image generators/);
  const search = recommendModels(decisionModels, ['search', 'research'], 100);
  assert.deepEqual(search.items.map(({ model }) => model.id), [23, 16]);
  assert.ok(search.items.every(({ model }) => model.capabilities.search));
});

test('ingredient count is validated after deduplicating and ignoring unknown IDs', () => {
  for (const selection of [[], ['coding'], ['coding', 'coding', 'not-an-ingredient'], ['coding', 'writing', 'research', 'cheap', 'speed', 'context']]) {
    assert.match(recommendModels(decisionModels, selection, 20).reason, /between 2 and 5/);
  }
});

test('search combines with filters and includes the additional dossiers', () => {
  assert.deepEqual(filterAndSort(decisionModels, { query: ' sonnet 5.5 ', family: 'Claude' }).map((item) => item.id), [21]);
  assert.equal(filterAndSort(decisionModels, { query: 'GEMINI', family: 'Claude' }).length, 0);
  assert.ok(filterAndSort(decisionModels, { query: 'agents' }).every((item) => item.strengths.includes('Agents')));
});
