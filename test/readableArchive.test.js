import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { decisionModels } from '../src/data/modelProfiles.js';
import { companies } from '../src/data/archiveData.js';
import { escapeHTML, renderArchiveContent, renderReadableDocument } from '../scripts/readableArchive.js';
import readableArchivePlugin, { fallbackMarker } from '../scripts/readableArchivePlugin.js';

const document = renderReadableDocument();

test('the readable HTML contains every full dossier, price context, sources and company without executing scripts', () => {
  assert.equal((document.match(/data-model-id=/g) || []).length, decisionModels.length);
  for (const model of decisionModels) {
    assert.ok(document.includes(`id="model-${model.id}"`));
    assert.ok(document.includes(escapeHTML(model.name)));
    assert.ok(document.includes(escapeHTML(model.priceNote)));
    assert.ok(document.includes(escapeHTML(model.priceSource)));
    assert.ok(document.includes(escapeHTML(model.releaseDate)));
  }
  for (const [family, company] of Object.entries(companies)) {
    assert.ok(document.includes(`data-company="${family}"`));
    assert.ok(document.includes(escapeHTML(company.name)));
    assert.ok(document.includes(escapeHTML(company.listingNote)));
    if (company.stock) assert.ok(document.includes(escapeHTML(company.stock.asOf)));
  }
  assert.doesNotMatch(document, /<script\b|<noscript\b|type="module"/i);
  assert.match(document, /23 model dossiers/);
  assert.match(document, /not a live quote/);
});

test('human-readable method includes real estimates and distinguishes scores from benchmarks', () => {
  assert.match(document, /input volume in millions × input rate/);
  assert.match(document, /not consumer subscription fees/);
  assert.match(document, /not measured benchmarks/);
  assert.match(document, /\$100 comparison ceiling/);
  assert.match(document, /Worked example: Coding \+ Cheap/);
  assert.match(document, /92\/100/);
  assert.match(document, /\$0.60/);
  assert.match(document, /historical|Historical/);
});

test('all fragment links in the standalone document have unique real destinations', () => {
  const ids = [...document.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  const anchors = [...document.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.ok(anchors.length > 23);
  for (const anchor of anchors) assert.ok(ids.includes(anchor), `Missing fragment: ${anchor}`);
});

test('build plugin fills the root HTML and emits an independent no-JavaScript page', () => {
  const plugin = readableArchivePlugin();
  const template = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const html = plugin.transformIndexHtml.handler(template);
  assert.ok(html.includes('<div id="root"><main class="readable-archive"'));
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assert.ok(!html.includes(fallbackMarker));
  assert.match(html, /href="\.\/archive.html"/);
  assert.equal((html.match(/data-model-id=/g) || []).length, 23);
  assert.throws(() => plugin.transformIndexHtml.handler('<html><head></head><body></body></html>'), /marker is missing/);
  const assets = [];
  plugin.generateBundle.call({ emitFile: (asset) => assets.push(asset) });
  assert.equal(assets[0].fileName, 'archive.html');
  assert.equal(assets[0].source, document);
  assert.match(renderArchiveContent({ fallback: true }), /when JavaScript is unavailable/);
});

test('plain content and URL attributes are HTML escaped, including real long-context conditions', () => {
  assert.equal(escapeHTML('<img src=x onerror="alert(1)"> & \'quoted\''), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;quoted&#39;');
  assert.match(document, /context &lt;200K tokens/);
  assert.match(document, /&amp;owner=exclude/);
});
