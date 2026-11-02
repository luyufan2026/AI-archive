import { checkedAt, companies } from '../src/data/archiveData.js';
import { decisionModels, recommendedPool, decisionCheckedAt, formatContext, scoreDisclosure } from '../src/data/modelProfiles.js';
import { ingredients, defaultUsage, recommendModels } from '../src/utils/recommendation.js';
import { formatPrice } from '../src/utils/archive.js';

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
const e = escapeHTML;
function link(url, label) {
  if (!/^https:\/\//.test(url)) throw new Error('Archive source links must use HTTPS.');
  return `<a href="${e(url)}" rel="noreferrer">${e(label)}</a>`;
}
function facts(items) {
  return `<dl>${items.map(([label, value]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>`;
}
function list(items) { return `<ul>${items.map((item) => `<li>${e(item)}</li>`).join('')}</ul>`; }

export const readableStyles = `
.readable-archive { box-sizing:border-box; max-width:1050px; margin:30px auto; padding:clamp(20px,5vw,60px); background:#e7e3d7; color:#262c24; font:16px/1.65 Arial,Helvetica,sans-serif; overflow-wrap:anywhere; }
.readable-archive * { box-sizing:border-box; }
.readable-archive a { color:#5d3925; text-underline-offset:3px; }
.readable-archive a:focus-visible { outline:2px solid #93472c; outline-offset:4px; }
.readable-archive .edition { font:12px/1.6 'Courier New',monospace; letter-spacing:.08em; }
.readable-archive h1 { font-size:clamp(38px,7vw,70px); letter-spacing:-.06em; line-height:1.05; margin:20px 0; }
.readable-archive h2 { font-size:28px; line-height:1.2; margin:38px 0 20px; }
.readable-archive h3 { font-size:24px; line-height:1.25; margin:12px 0 22px; }
.readable-archive h4 { margin:24px 0 8px; }
.readable-archive nav { display:flex; flex-wrap:wrap; gap:10px 22px; padding:20px 0; border-block:1px solid #a7ad99; }
.readable-archive article { border-top:1px solid #a7ad99; margin:28px 0; padding:22px 0 8px; scroll-margin-top:20px; }
.readable-archive dl { margin:0; }
.readable-archive dl>div { display:grid; grid-template-columns:180px 1fr; gap:16px; margin:12px 0; }
.readable-archive dt { color:#57624a; }
.readable-archive dd { margin:0; }
.readable-archive .record-number { font:12px/1.6 'Courier New',monospace; }
.readable-archive .record-index { columns:2; padding-left:22px; }
.readable-archive .record-index li { break-inside:avoid; margin-bottom:8px; }
.readable-archive .sources { display:flex; flex-wrap:wrap; gap:8px 20px; margin:20px 0; }
.readable-archive .note { padding:18px; border-left:3px solid #829064; background:#d9deca; }
.readable-archive table { border-collapse:collapse; width:100%; font-size:14px; }
.readable-archive th,.readable-archive td { padding:12px; border:1px solid #b2b79f; text-align:left; }
.readable-archive .table-wrap { overflow-x:auto; }
.readable-archive code { font-size:.9em; }
.readable-archive footer { border-top:1px solid #a7ad99; margin-top:40px; padding-top:20px; }
@media(max-width:600px) { .readable-archive { margin:0; } .readable-archive dl>div { display:block; } .readable-archive dt { font-size:13px; } .readable-archive .record-index { columns:1; } }
`;

function modelRecord(model) {
  const company = companies[model.family];
  return `<article id="model-${model.id}" data-model-id="${model.id}">
    <p class="record-number">FILE ${String(model.id).padStart(3, '0')} / ${e(model.family)} / ${e(model.status)}</p>
    <h3>${e(model.name)}</h3>
    ${facts([
      ['Company', company.name], ['Released / date reference', `${model.releaseDate} · ${model.releaseKind}`],
      ['Model type', model.type], ['Record last checked', model.recordCheckedAt], ['Best for / specialties', model.bestFor],
      ['Reference input price', `${formatPrice(model.inputPrice)} USD / 1M text tokens (uncached input)`],
      ['Reference output price', `${formatPrice(model.outputPrice)} USD / 1M text tokens`],
      ['Price basis / date', `${model.priceBasis} · ${model.priceDate}`], ['Price conditions', model.priceNote],
      ['Context', `${formatContext(model.contextTokens)}${model.contextTokens ? ` (${model.contextTokens.toLocaleString('en-US')} tokens)` : ''}`],
      ['Modality', model.modalities], ['Access', model.access],
      ['Image generation', model.capabilities.imageGeneration ? 'Recorded' : 'No; image input is a different capability'],
      ['Search tools', model.capabilities.search ? 'Recorded; tool charges excluded' : 'Unrecorded; not verified in this dossier'],
      ['Recommendation eligibility', model.recommendable ? `Eligible reference; checked ${decisionCheckedAt}` : 'Archive only; not in recommendation pool'],
    ])}
    <h4>Strengths</h4>${list(model.pros)}
    <h4>Limitations</h4>${list(model.cons)}
    <p><strong>Choose this model if:</strong> ${e(model.chooseIf)}</p>
    <p><strong>Editorial 0–10 fit scores:</strong> ${Object.entries(model.scores).map(([key, value]) => `${e(key)} ${e(value)}/10`).join(' · ')}.</p>
    <p>${e(scoreDisclosure)}</p>
    <p class="sources">${link(model.releaseSource, 'Release reference')}${link(model.priceSource, 'Price reference')}${link(model.profileSource, 'Model information')}${model.lifecycleSource ? link(model.lifecycleSource, 'Lifecycle reference') : ''}<a href="#company-${e(model.family.toLowerCase())}">Company &amp; stock snapshot</a></p>
  </article>`;
}

function companyRecord([family, company]) {
  return `<article id="company-${e(family.toLowerCase())}" data-company="${e(family)}">
    <p class="record-number">${e(family)} / COMPANY REFERENCE</p><h3>${e(company.name)}</h3>
    ${facts([['Location', company.location], ['Ownership / parent', company.parent], ['Listing status', company.listing], ['Company information checked', checkedAt]])}
    <p>${e(company.listingNote)}</p>
    ${company.stock ? `<p><strong>Saved stock quote:</strong> ${e(company.stock.ticker)} · ${e(formatPrice(company.stock.price))} USD / share · ${e(company.stock.company)} · ${e(company.stock.exchange)}.</p><p>Snapshot: ${e(company.stock.label)}. Timestamp: <time datetime="${e(company.stock.asOf)}">${e(company.stock.asOf)}</time>. This is a saved reference, not a live quote.</p>${link(company.stock.source, 'Stock reference source')}` : '<p>Stock price: N/A — no publicly traded shares recorded in this archive.</p>'}
    <p class="sources">${company.sources.map((source) => link(source.url, source.label)).join('')}</p>
  </article>`;
}

export function renderArchiveContent({ fallback = false } = {}) {
  const example = recommendModels(decisionModels, ['coding', 'cheap'], 20, defaultUsage);
  return `<main class="readable-archive" id="readable-archive">
    <header><p class="edition">MANHATTAN NIGHT STUDIO / READABLE EDITION</p><h1>AI Archive</h1>
      <p>An interactive AI archive and decision tool. Find an AI model for your requirements, compare models, and explore the companies, capabilities and costs behind them.</p>
      <p>${decisionModels.length} model dossiers across ChatGPT, Claude, Gemini, Grok and DeepSeek. All 20 original records are preserved, with three additional references.</p>
      <p class="note">${fallback ? 'This readable archive is available while the interactive studio loads, or when JavaScript is unavailable.' : 'This page contains the complete archive as ordinary HTML. Reading the records and source links requires no JavaScript.'} The immersive room, Scrib companion, filters, drag interactions and recipe builder are available in the <a href="./">interactive studio</a>.</p>
      <nav aria-label="Readable archive sections"><a href="#experience">How the site works</a><a href="#method">Recommendation rules</a><a href="#models">All ${decisionModels.length} models</a><a href="#companies">Companies &amp; stocks</a>${fallback ? '<a href="./archive.html">Permanent readable edition</a>' : '<a href="./">Enter the studio</a>'}</nav>
    </header>
    <section id="experience"><h2>How the site works</h2><ul>
      <li><strong>Find My AI:</strong> select or drag 2–5 requirement ingredients, set an API usage budget, then choose BUILD MY AI. The same five eligible model cards visibly rearrange as requirements change; blocked models stay visible with a reason. Scrib uses the studio mixing machine to pull up to three deterministic recommendations.</li>
      <li><strong>Compare Models:</strong> place up to three dossiers on a comparison desk to compare rates, use cases, capability notes, context, strengths and limitations.</li>
      <li><strong>Explore Archive:</strong> search and combine family, model type, specialty and price-basis filters. Sort by name, release date or input/output price, and read original source links.</li>
    </ul><p>Scrib is an abstract humanoid drawn from tangled SVG lines. Carrying, mixing and ticket delivery provide visual feedback. The companion does not call an AI service or generate responses. React state stores the current choices in the browser session; refresh resets them. No account, API key, backend or database is required.</p></section>
    <section id="method"><h2>Recommendation rules &amp; API budget</h2>
      <p>${recommendedPool.length} reference-verified model versions enter the recipe engine: ${e(recommendedPool.map((model) => model.name).join(', '))}. Model references were checked ${decisionCheckedAt}. Historical and retired versions remain in the archive and do not enter recommendations.</p>
      <p><strong>Requirement ingredients:</strong> ${e(ingredients.map((item) => item.label).join(', '))}.</p>
      <ol><li>Select 2–5 unique recognized ingredients. Validate a nonnegative monthly budget and a positive total input/output token volume.</li>
      <li>Estimate monthly API cost: <strong>input volume in millions × input rate + output volume in millions × output rate</strong>. Default volume: ${defaultUsage.input}M input and ${defaultUsage.output}M output. These are API usage estimates, not consumer subscription fees.</li>
      <li>Average the selected editorial 0–10 scores with equal weight, multiply by 10, then round to an integer fit score. Cheap uses <code>clamp(10 − 3 × log10(1 + monthly cost), 0, 10)</code>. Long Context uses <code>min(10, context tokens / 100,000)</code>. Powerful averages coding, research and accuracy.</li>
      <li>Search requires recorded search-tool support. Image generation requires image output. This collection has text-output models, so an image-generation recipe returns an explanation rather than a fabricated match.</li>
      <li>Remove models above the budget. Sort by fit descending, monthly cost ascending, then stable record ID. Return at most three recommendations. Changing requirements, budget or volume after serving recalculates the shortlist.</li></ol>
      <p>Budget choices: $0, $20, $50 and $100+. The $100+ option uses a $100 comparison ceiling. No free-tier quota, tax, search/tool charge or caching discount is assumed. Zero budget can return no paid-rate matches. Fit scores are editorial heuristics, not measured benchmarks, success probabilities or guarantees.</p>
      <h3>Worked example: Coding + Cheap</h3><p>Budget $20/month; volume 1M input + 0.25M output. Results calculated with the same engine as the interactive studio:</p>
      <div class="table-wrap"><table><thead><tr><th scope="col">Model</th><th scope="col">Editorial fit</th><th scope="col">Estimated month (USD)</th></tr></thead><tbody>${example.items.map(({ model, fit, cost }) => `<tr><td><a href="#model-${model.id}">${e(model.name)}</a></td><td>${fit}/100</td><td>${e(formatPrice(cost))}</td></tr>`).join('')}</tbody></table></div>
      <p>Each rate keeps its own reference date and conditions below. These snapshots do not automatically update; read the linked rate conditions before paying for API usage.</p>
    </section>
    <section id="models"><h2>All ${decisionModels.length} model dossiers</h2><p>Token prices are USD per 1M text tokens, split into uncached input and output. Released means the named public launch, update or catalog reference, not training dates. Unknown information is labeled rather than assumed.</p>
      <ol class="record-index">${decisionModels.map((model) => `<li><a href="#model-${model.id}">${e(model.name)}</a></li>`).join('')}</ol>
      ${decisionModels.map(modelRecord).join('\n')}
    </section>
    <section id="companies"><h2>Companies &amp; stock snapshots</h2><p>Company information and saved parent-company quotes are from ${checkedAt}. They are not live market prices or investment recommendations. Private companies have no invented public quote. Parent-company stocks are identified separately from AI products.</p>${Object.entries(companies).map(companyRecord).join('\n')}</section>
    <footer><p>AI Archive / Interactive Archive assignment. OpenAI Codex assisted with brainstorming, React component prototyping, interaction logic and debugging. The pencil studio and companion are editable SVG drawings; no generated backdrop is loaded.</p><p><a href="./">Interactive studio</a> · <a href="./archive.html">Readable archive</a> · ${link('https://github.com/luyufan2026/AI-archive', 'Source repository')}</p></footer>
  </main>`;
}

export function renderReadableDocument() {
  return `<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Readable AI Archive: 23 model dossiers, API token rates, companies, capabilities and recommendation rules. No JavaScript required."><title>AI Archive — Readable Archive &amp; Recommendation Rules</title><style>${readableStyles}</style></head><body style="margin:0;background:#171a16">${renderArchiveContent()}</body></html>`;
}
