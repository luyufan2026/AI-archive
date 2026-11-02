# AI Archive — Manhattan Night Studio

An interactive AI archive and decision tool for an Interactive Archive assignment. Enter a rainy Manhattan studio, give the resident line creature a recipe, and compare AI models before choosing one. The original metadata archive is preserved inside the filing cabinet.

Live site: https://luyufan2026.github.io/AI-archive/  
Source repository: https://github.com/luyufan2026/AI-archive

## Run locally

Use Node.js 20.19+ or 22.12+ (deployment uses Node 24).

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
npm run preview
```

React JSX is compiled by Vite into `dist/`. No API keys, login, backend, database, paid service or model API calls are required. The companion and recommendation engine run locally in the browser.

## Three ways into the studio

- **Find My AI:** click the CRT, then click or drag 2–5 ingredient cards into the mixing tray. Set a monthly API budget and input/output token volume. Scrib carries ingredients, pretends to mix, and serves up to three model recommendations. Once served, changing requirements, budget or volume recalculates the visible shortlist.
- **Compare Models:** choose or drag up to three dossiers onto the comparison desk. Compare input/output rates, use cases, editorial capability meters, context, strengths, limitations and “choose this model if…” notes. The original technical/company comparison is still available in the disclosure below the desk.
- **Explore Archive:** search, combine family/type/specialty/price-basis filters, sort by name/date/rates, inspect full dossiers, and open the original Companies & Stocks view. Selected comparison models remain selected while filtering and switching views.

Every drag interaction has a click alternative. Buttons support keyboard use; the native model dialog supports Escape, focus containment and a close button. A pause control stops ambient animation, and the interface respects `prefers-reduced-motion`. Mobile layouts simplify the scene and stack the workbench. In-session React state is reset on a page refresh; this prototype has no persistent account storage.

## Records, prices and availability

`src/data/archiveData.js` retains **all 20 original records**, four versions each from ChatGPT/OpenAI GPT, Claude, Gemini, Grok and DeepSeek. Original release, company, price and stock fields have not been overwritten.

`src/data/modelProfiles.js` adds context, modality, access, strengths/limitations and editorial fit scores, plus **three additional model references**: Claude Sonnet 5.5, DeepSeek-V4.1-Flash-1017 and Gemini 3.8 Flash. The complete archive now contains **23 dossiers**. Gemini 3.8 Flash has a recorded catalog-update month, not an invented exact launch day.

Five reference-verified versions, one per family, are eligible for recommendations: GPT-4.1 mini, Claude Sonnet 5.5, Gemini 3.8 Flash, Grok 4.6 and DeepSeek-V4.1-Flash-1017. Availability/model references were checked on **November 2, 2026**. Historical and retired versions remain visible for archival comparison but cannot enter the recommendation pool. Reference verified does not promise continuing access or make an old rate current.

Prices are **USD per one million text tokens**, split into uncached input and output. Each dossier retains its own rate date and conditions. Historical launch prices are labeled; checked snapshots do not update automatically. Long-context tiers, introductory rates and peak/off-peak conditions are recorded in the notes. The model pages and provider pricing links are visible in the dossiers. Search, tools, tax, caching discounts, free quotas and non-text prices are excluded from estimates. Image input is distinct from image generation: this collection contains text-output models, so an image-generation recipe returns an explanation instead of a fabricated match.

The original company and parent-stock references remain **October 28, 2026 snapshots**, not live quotes. Private companies have no invented public ticker or quote. Gemini and Grok stock references refer to their recorded parent companies, not standalone AI-product stocks. Released dates indicate the named public launch/update phase, not training dates.

Key recommendation references:

- [OpenAI GPT-4.1 mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini)
- [Anthropic model overview](https://platform.claude.com/docs/en/models/overview) and [model lifecycle](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Gemini 3.8 Flash](https://aistudio.google.com/docs/models/gemini-3.8-flash) and [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [xAI Grok 4.6](https://docs.x.ai/developers/models/grok-4.6)
- [DeepSeek October 17 update](https://api-docs.deepseek.com/news/news261017/) and [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/)

## How the recipe is scored

All rules are centralized in `src/utils/recommendation.js`.

1. Validate 2–5 unique recognized ingredients, a nonnegative budget, and positive total monthly token volume.
2. Consider only reference-verified eligible versions. Search requires recorded search-tool support; image generation requires image output.
3. Estimate monthly cost: **input volume in millions × input price + output volume in millions × output price**. Default: 1M input and 0.25M output tokens. This estimates API usage, not ChatGPT Plus or another consumer subscription. `$100+` explicitly uses a $100 comparison ceiling. A zero budget does not silently assume a free quota.
4. Average the selected 0–10 editorial scores with equal weight, then multiply by ten and round to an integer fit score. `Cheap = clamp(10 − 3 × log10(1 + estimated monthly cost), 0, 10)`; `Long context = min(10, recorded context tokens / 100,000)`; `Powerful` averages coding, research and accuracy.
5. Remove estimates exceeding the budget. Sort by fit descending, monthly cost ascending, then stable record ID. Return at most three, with the strongest selected contributions and a limitation.

Scores are **curated editorial heuristics, not measured benchmarks, scientific probabilities or guarantees**. “Accurate” and “Research” do not establish factual correctness. Recommendations are deterministic; they are not generated by an AI model. Users should read the source and pricing conditions before purchasing API usage.

Tests cover preservation of original records, filters/sorts/search, real cost cutoffs, deterministic ranking, invalid inputs and unsupported capabilities.

## Components and state

React `useState` manages the active room, archive filters/search/sort, comparison selection, recipe ingredients/budget/volume, companion activity, animation pause and model dialog. `useEffect` handles the brief mixing timer, pointer-following, dialog lifecycle and cleanup.

```text
src/
  assets/manhattan-studio.jpg
  components/
    DragSlip.jsx
    StudioScene.jsx
    ScribCompanion.jsx
    RecipeFinder.jsx
    ComparisonDesk.jsx
    ModelDossier.jsx
    ArchiveCard.jsx
    FilterBar.jsx
    CompanyCard.jsx
    ComparisonTable.jsx
  hooks/useDeskDrag.js
  data/
    archiveData.js
    modelProfiles.js
  utils/
    archive.js
    recommendation.js
  App.jsx
  App.css
  studio.css
  main.jsx
test/
  archive.test.js
  recommendation.test.js
  readableArchive.test.js
scripts/
  readableArchive.js
  readableArchivePlugin.js
.github/workflows/deploy.yaml
```

Only React, JavaScript, CSS, inline SVG and native pointer events are used. Scrib is an original seeded SVG line drawing; lightweight CSS animates breathing, carrying, mixing and ticket delivery. The room is a single compressed, AI-generated illustrative image with HTML hotspots and a small CSS rain layer. The skyline is a fictional Manhattan-inspired scene, not a live camera, weather feed or 3D simulation.

## GitHub Pages / class build requirements

`index.html` loads `src/main.jsx`, which mounts the React app using `createRoot`. `vite.config.js` enables the React plugin and uses `base: './'` so assets work under the repository subpath. `.gitignore` excludes `node_modules/`, `dist/`, local environment files and scratch outputs.

The existing **Publish Site to GitHub Pages** workflow in `.github/workflows/deploy.yaml` installs dependencies, runs tests, builds and deploys `dist/`. Pushing to `main` triggers publication. In repository **Settings → Pages**, the source is **GitHub Actions**. A manual run is also available under **Actions → Publish Site to GitHub Pages → Run workflow**. Deployment uses the existing repository and URL.

## Process and assistance

OpenAI Codex assisted with **brainstorming, React component prototyping, interaction logic and debugging**. The project's concept, requirements, reference direction and design decisions were developed through the student's iterative process. The studio backdrop was created with AI image generation; the companion and interface are implemented as editable project code. This is an interactive prototype, with clearly labeled curated data and estimates, rather than a live AI service or market terminal.

## Readable HTML / access without JavaScript

The root URL now ships a complete, visible HTML fallback containing the site explanation, scoring rules, all 23 dossiers, sources and company/stock snapshots. React replaces that fallback with the immersive studio once JavaScript runs. The same readable content is also published at **https://luyufan2026.github.io/AI-archive/archive.html**. It has ordinary links and headings and requires no scripts to read.

`scripts/readableArchive.js` generates this content directly from the existing archive, enriched profiles and recommendation engine, including a computed worked example. `scripts/readableArchivePlugin.js` inserts it into the initial HTML and emits the standalone page during every Vite build; it also serves the readable page in development. No duplicate model dataset, backend, new dependency or user-agent-specific content is introduced. Both humans and automated readers receive the same HTML.

The studio and workspace footer link to the readable edition. This improves access for text-only web readers; it cannot guarantee access from every AI product, cache, search index or network environment. `test/readableArchive.test.js` checks complete records, real fragment destinations, price notes, HTML escaping and the built-in generation hooks.
