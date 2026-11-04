import { translateText } from '../src/i18n/translations.js';
import { checkedAt, companies } from '../src/data/archiveData.js';
import { decisionModels, recommendedPool, decisionCheckedAt, formatContext, scoreDisclosure } from '../src/data/modelProfiles.js';
import { kitchenIngredients, defaultUsage, recommendModels } from '../src/utils/recommendation.js';
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
.readable-toolbar { position:sticky; top:0; z-index:20; display:flex; justify-content:space-between; align-items:center; gap:12px; box-sizing:border-box; max-width:1050px; margin:0 auto; padding:12px clamp(16px,4vw,40px); background:#e7e3d7; color:#262c24; border-bottom:1px solid #a7ad99; font:14px/1.5 Arial,'PingFang TC','Microsoft JhengHei',sans-serif; }
.readable-toolbar a { color:inherit; text-decoration:none; display:inline-block; padding:8px 0; }
.readable-toolbar .readable-back { padding:10px 14px; border:1px solid #665b4b; }
.readable-toolbar a[aria-current] { text-decoration:underline; text-underline-offset:5px; }
.readable-toolbar a:focus-visible { outline:2px solid #93472c; outline-offset:3px; }
html { scroll-padding-top:85px; }
.readable-archive { box-sizing:border-box; max-width:1050px; margin:30px auto; padding:clamp(20px,5vw,60px); background:#e7e3d7; color:#262c24; font:16px/1.65 Arial,'PingFang TC','Microsoft JhengHei',sans-serif; overflow-wrap:anywhere; }
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
    <header><h1>AI Archive</h1>
      <p>Model records, API prices and original sources.</p>
      <p>${decisionModels.length} model dossiers across five AI families.</p>
      <p class="note">${fallback ? 'This readable archive is available while the interactive studio loads, or when JavaScript is unavailable.' : 'Read the complete archive without JavaScript.'}</p>
      <nav aria-label="Readable archive sections"><a href="#experience">How the site works</a><a href="#method">Recommendation rules</a><a href="#models">All ${decisionModels.length} models</a><a href="#companies">Companies &amp; stocks</a>${fallback ? '<a href="./archive.html">Permanent readable edition</a>' : ''}</nav>
    </header>
    <section id="experience"><h2>How the site works</h2><ul>
      <li><strong>Cook my AI:</strong> Choose 2–5 needs, set an API budget, then cook to get up to three matches.</li>
      <li><strong>Compare Models:</strong> Compare up to three models side by side.</li>
      <li><strong>Explore Archive:</strong> Search and filter all model records; sort by name, release date or token price.</li>
    </ul></section>
    <section id="method"><details><summary>Recommendation rules &amp; API budget</summary>
      <p>${recommendedPool.length} reference-verified model versions enter the recipe engine: ${e(recommendedPool.map((model) => model.name).join(', '))}. Model references were checked ${decisionCheckedAt}. Historical and retired versions remain in the archive and do not enter recommendations.</p>
      <p><strong>Kitchen ingredients:</strong> ${e(kitchenIngredients.map((item) => item.label).join(', '))}.</p>
      <ol><li>Select 2–5 unique recognized ingredients. Validate a nonnegative monthly budget and a positive total input/output token volume.</li>
      <li>Estimate monthly API cost: <strong>input volume in millions × input rate + output volume in millions × output rate</strong>. Default volume: ${defaultUsage.input}M input and ${defaultUsage.output}M output. These are API usage estimates, not consumer subscription fees.</li>
      <li>Average the selected editorial 0–10 scores with equal weight, multiply by 10, then round to an integer fit score. Cheap uses <code>clamp(10 − 3 × log10(1 + monthly cost), 0, 10)</code>. Long Context uses <code>min(10, context tokens / 100,000)</code>. Powerful averages coding, research and accuracy.</li>
      <li>Search requires recorded search-tool support. Image generation requires image output. This collection has text-output models, so an image-generation recipe returns an explanation rather than a fabricated match.</li>
      <li>Remove models above the budget. Sort by fit descending, monthly cost ascending, then stable record ID. Return at most three recommendations. Changing requirements, budget or volume clears the served shortlist; live candidate rankings update immediately and the next cook serves the new matches.</li></ol>
      <p>Budget choices: $0, $20, $50 and $100. The top preset uses a $100 comparison ceiling. No free-tier quota, tax, search/tool charge or caching discount is assumed. Zero budget can return no paid-rate matches. Fit scores are editorial heuristics, not measured benchmarks, success probabilities or guarantees.</p>
      <h3>Worked example: Coding + Cheap</h3><p>Budget $20/month; volume 1M input + 0.25M output. Results calculated with the same engine as the interactive studio:</p>
      <div class="table-wrap"><table><thead><tr><th scope="col">Model</th><th scope="col">Editorial fit</th><th scope="col">Estimated month (USD)</th></tr></thead><tbody>${example.items.map(({ model, fit, cost }) => `<tr><td><a href="#model-${model.id}">${e(model.name)}</a></td><td>${fit}/100</td><td>${e(formatPrice(cost))}</td></tr>`).join('')}</tbody></table></div>
      <p>Each rate keeps its own reference date and conditions below. These snapshots do not automatically update; read the linked rate conditions before paying for API usage.</p>
    </details></section>
    <section id="models"><h2>All ${decisionModels.length} model dossiers</h2><p>Token prices are USD per 1M text tokens, split into uncached input and output. Released means the named public launch, update or catalog reference, not training dates. Unknown information is labeled rather than assumed.</p>
      <ol class="record-index">${decisionModels.map((model) => `<li><a href="#model-${model.id}">${e(model.name)}</a></li>`).join('')}</ol>
      ${decisionModels.map(modelRecord).join('\n')}
    </section>
    <section id="companies"><h2>Companies &amp; stock snapshots</h2><p>Company information and saved parent-company quotes are from ${checkedAt}. They are not live market prices or investment recommendations. Private companies have no invented public quote. Parent-company stocks are identified separately from AI products.</p>${Object.entries(companies).map(companyRecord).join('\n')}</section>
    <footer><p>AI Archive / Interactive Archive assignment. OpenAI Codex assisted with brainstorming, React component prototyping, interaction logic and debugging. The pencil studio and companion are editable SVG drawings; no generated backdrop is loaded.</p><p>${link('https://github.com/luyufan2026/AI-archive', 'Source repository')}</p></footer>
  </main>`;
}

export function renderReadableDocument({ language = 'en' } = {}) {
  const chinese = language === 'zh-Hant';
  const toolbar = `<div class="readable-toolbar"><a class="readable-back" href="./?lang=${language}">${chinese ? '← 返回主網站' : '← Back to website'}</a><div aria-label="${chinese ? '語言' : 'Language'}"><a href="./archive.html?v=20261104" lang="en" ${!chinese ? 'aria-current="page"' : ''}>English</a><span aria-hidden="true"> / </span><a href="./archive.zh-Hant.html?v=20261104" lang="zh-Hant" ${chinese ? 'aria-current="page"' : ''}>繁體中文</a></div></div>`;
  const content = chinese ? translateMarkup(renderArchiveContent()) : renderArchiveContent();
  return `<!doctype html>\n<html lang="${language}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${chinese ? 'AI 檔案 — 文字檔案' : 'AI Archive — Text archive'}</title><style>${readableStyles}</style></head><body style="margin:0;background:#171a16">${toolbar}${content}</body></html>`;
}
function translateMarkup(markup) {
  return markup.split(/(<[^>]+>)/g).map(part => {
    if (part.startsWith('<')) return part.replace('href="./archive.html"', 'href="./archive.zh-Hant.html"').replace('href="./"', 'href="./?lang=zh-Hant"');
    const decoded = part.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
    return escapeHTML(translateText(decoded));
  }).join('');
}
