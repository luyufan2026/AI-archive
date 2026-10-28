import test from 'node:test';
import assert from 'node:assert/strict';
import data, { companies, families } from '../src/data/archiveData.js';
import { filterAndSort, formatPrice } from '../src/utils/archive.js';

test('20 unique records cover five families with four models each', () => {
  assert.equal(data.length, 20);
  assert.equal(new Set(data.map((item) => item.id)).size, 20);
  assert.equal(new Set(data.map((item) => item.name)).size, 20);
  assert.equal(families.length, 5);
  families.forEach((family) => assert.equal(data.filter((item) => item.family === family).length, 4));
  data.forEach((item) => {
    assert.ok(companies[item.family]);
    assert.match(item.releaseDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.inputPrice > 0 && item.outputPrice > 0);
    assert.match(item.releaseSource, /^https:\/\//);
    assert.match(item.priceSource, /^https:\/\//);
    assert.ok(item.priceDate && item.priceBasis && item.priceNote);
  });
});

test('combined filters and empty state reflect actual metadata', () => {
  assert.equal(filterAndSort(data, { family: 'Claude' }).length, 4);
  const selected = filterAndSort(data, { family: 'Claude', type: 'Hybrid reasoning', specialty: 'Agents' });
  assert.deepEqual(selected.map((item) => item.id), [5, 6]);
  assert.equal(filterAndSort(data, { family: 'Claude', specialty: 'Translation' }).length, 0);
  assert.equal(filterAndSort(data, { priceBasis: 'Checked snapshot' }).length, 3);
});

test('all sorts operate on numbers and dates without changing source order', () => {
  const originalIds = data.map((item) => item.id);
  for (const [sortMode, key] of [['input', 'inputPrice'], ['output', 'outputPrice']]) {
    const sorted = filterAndSort(data, { sortMode });
    assert.ok(sorted.every((item, index) => index === 0 || sorted[index - 1][key] <= item[key]));
  }
  assert.equal(filterAndSort(data, { sortMode: 'newest' })[0].name, 'Grok 4.6');
  assert.equal(filterAndSort(data, { sortMode: 'oldest' })[0].name, 'GPT-4o mini');
  const names = filterAndSort(data, { sortMode: 'name' }).map((item) => item.name);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
  assert.deepEqual(data.map((item) => item.id), originalIds);
  assert.deepEqual(filterAndSort(data).map((item) => item.id), originalIds);
});

test('unlisted companies have no invented quotes and parent stocks are identified', () => {
  for (const family of ['ChatGPT', 'Claude', 'DeepSeek']) assert.equal(companies[family].stock, null);
  for (const family of ['Gemini', 'Grok']) {
    assert.equal(companies[family].listing, 'Public parent');
    assert.ok(companies[family].stock.price > 0);
    assert.ok(companies[family].stock.asOf.includes('2026-10-28'));
    assert.ok(companies[family].stock.source);
  }
  assert.equal(formatPrice(0.1), '$0.10');
});
