import test from 'node:test';
import assert from 'node:assert/strict';
import { translateText } from '../src/i18n/translations.js';
import { decisionModels } from '../src/data/modelProfiles.js';
import { filterAndSort } from '../src/utils/archive.js';
import { renderReadableDocument } from '../scripts/readableArchive.js';

test('Traditional Chinese translates controls and compound metadata, preserving model names, dates and prices', () => {
  assert.equal(translateText('Cook my AI'), '烹調我的 AI');
  assert.equal(translateText('Coding / Agents / Writing'), '程式開發 / 代理工作流程 / 寫作');
  assert.equal(translateText('↑ 2 places'), '↑ 2 位');
  assert.equal(translateText('Remove GPT-4.1 mini from comparison'), '從比較中移除 GPT-4.1 mini');
  for (const value of ['GPT-4.1 mini','$0.60','2026-11-02']) assert.equal(translateText(value), value);
  assert.equal(translateText('Cook my AI','en'), 'Cook my AI');
});

test('Chinese archive search combines with canonical filters without changing source records', () => {
  const before = JSON.stringify(decisionModels);
  const results = filterAndSort(decisionModels, {query:'程式開發', family:'Claude'});
  assert.ok(results.length > 0);
  assert.ok(results.every(model=>model.family === 'Claude' && model.strengths.includes('Coding')));
  assert.equal(JSON.stringify(decisionModels), before);
});

test('both readable editions have a sticky return control and all dossiers without JavaScript', () => {
  for (const language of ['en','zh-Hant']) {
    const html=renderReadableDocument({language});
    assert.match(html, new RegExp(`<html lang="${language}"`));
    assert.match(html, /class="readable-back"/);
    assert.match(html, /position:sticky/);
    assert.match(html, new RegExp(`href="./\\?lang=${language}"`));
    assert.equal((html.match(/data-model-id=/g)||[]).length,23);
    assert.doesNotMatch(html, /<script|MANHATTAN NIGHT STUDIO \/ READABLE EDITION/);
  }
  const chinese=renderReadableDocument({language:'zh-Hant'});
  assert.match(chinese, /← 返回主網站/);
  assert.match(chinese, /每月 API/);
  assert.match(chinese, /href=".\/archive.html\?v=20261104" lang="en"/);
});
