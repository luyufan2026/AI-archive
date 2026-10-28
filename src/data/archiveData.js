// Curated metadata archive. All prices are USD per 1 million text tokens.
// Historical prices are intentionally preserved, not advertised as current rates.
export const checkedAt = '2026-10-28';

export const companies = {
  ChatGPT: {
    name: 'OpenAI Group PBC', location: 'San Francisco, California, USA', listing: 'Private',
    listingNote: 'No publicly traded shares. A confidential draft S-1 was announced on June 8, 2026; that is not a completed IPO.',
    parent: 'Controlled by the OpenAI Foundation', stock: null,
    sources: [
      { label: 'Company structure', url: 'https://openai.com/our-structure/' },
      { label: 'IPO filing announcement', url: 'https://openai.com/index/openai-submits-confidential-s-1/' },
      { label: 'Company address', url: 'https://cdn.openai.com/pdf/oai_ca-safety-letter_8-11-25.pdf' },
    ],
  },
  Claude: {
    name: 'Anthropic, PBC', location: 'San Francisco, California, USA', listing: 'Private / IPO proposed',
    listingNote: 'S-1 filed October 26, 2026. ANT is a proposed Nasdaq ticker; it is not an available market quote in this archive.',
    parent: 'No listed parent recorded', stock: null,
    sources: [
      { label: 'Company location', url: 'https://www.anthropic.com/transparency/voluntary-commitments' },
      { label: 'Proposed IPO', url: 'https://www.anthropic.com/news/s1-sec' },
    ],
  },
  Gemini: {
    name: 'Google', location: 'Mountain View, California, USA', listing: 'Public parent',
    listingNote: 'Google is part of Alphabet. The quote shown is Alphabet Class A, not a separate Gemini stock.',
    parent: 'Alphabet Inc.',
    stock: { company: 'Alphabet Inc. Class A', ticker: 'GOOGL', exchange: 'Nasdaq', price: 324.89, currency: 'USD', asOf: '2026-10-28T16:00:01-04:00', label: 'Oct 28, 2026, 4:00 PM EDT · regular-session close', source: 'https://www.google.com/finance/quote/GOOGL:NASDAQ' },
    sources: [
      { label: 'Alphabet company filing', url: 'https://www.sec.gov/edgar/browse/?CIK=0001652044&owner=exclude' },
    ],
  },
  Grok: {
    name: 'SpaceX Super Intelligence LLC (formerly xAI)', location: 'Austin, Texas, USA', listing: 'Public parent',
    listingNote: 'Grok has no separate listed stock. The quote shown belongs to parent SpaceX. Its headquarters are in Starbase, Texas.',
    parent: 'Space Exploration Technologies Corp. (SpaceX)',
    stock: { company: 'Space Exploration Technologies Corp.', ticker: 'SPCX', exchange: 'Nasdaq', price: 145.23, currency: 'USD', asOf: '2026-10-28T16:00:01-04:00', label: 'Oct 28, 2026, 4:00 PM EDT · regular-session close', source: 'https://www.google.com/finance/quote/SPCX:NASDAQ' },
    sources: [
      { label: 'Operating company & location', url: 'https://x.ai/legal/terms-of-service' },
      { label: 'Parent company SEC filing', url: 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026066903/spacex-cursorformsx8.htm' },
      { label: 'SpaceX IPO announcement', url: 'https://ir.spacex.com/updates/releases-details/2026/Space-Exploration-Technologies-Corp--Announces-Pricing-of-Initial-Public-Offering/default.aspx' },
    ],
  },
  DeepSeek: {
    name: 'Hangzhou DeepSeek Artificial Intelligence Co., Ltd.', location: 'Hangzhou, Zhejiang, China', listing: 'Private',
    listingNote: 'No publicly traded shares or market stock quote recorded.',
    parent: 'Privately held', stock: null,
    sources: [
      { label: 'Official company terms', url: 'https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html' },
      { label: 'Location & ownership reference', url: 'https://en.wikipedia.org/wiki/DeepSeek' },
    ],
  },
};

const source = {
  gpt41: 'https://openai.com/index/gpt-4-1/',
  gpt4omini: 'https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/',
  claude4: 'https://www.anthropic.com/news/claude-4',
  claude37: 'https://www.anthropic.com/news/claude-3-7-sonnet',
  claude35: 'https://www.anthropic.com/news/3-5-models-and-computer-use',
  claude35price: 'https://www.anthropic.com/news/claude-3-5-sonnet',
  gemini25: 'https://developers.googleblog.com/en/gemini-2-5-thinking-model-updates/',
  geminiLite: 'https://developers.googleblog.com/en/gemini-25-flash-lite-is-now-stable-and-generally-available/',
  gemini20: 'https://developers.googleblog.com/en/gemini-2-family-expands/',
  geminiPrices: 'https://ai.google.dev/gemini-api/docs/pricing',
  grokFast: 'https://x.ai/news/grok-4-fast',
  grokCode: 'https://x.ai/news/grok-code-fast-1',
  grok46: 'https://x.ai/news/grok-4-6',
  grokPrices: 'https://docs.x.ai/developers/pricing',
  deepseekV3: 'https://api-docs.deepseek.com/news/news1226/',
  deepseekR1: 'https://api-docs.deepseek.com/news/news250120/',
  deepseekV31: 'https://api-docs.deepseek.com/news/news250821/',
  deepseekV32: 'https://api-docs.deepseek.com/news/news250929/',
};

const archiveData = [
  { id: 1, family: 'ChatGPT', name: 'GPT-4.1', releaseDate: '2025-04-14', releaseKind: 'API launch', type: 'Multimodal', strengths: ['Coding', 'Long context'], inputPrice: 2, outputPrice: 8, priceBasis: 'Historical', priceDate: '2025-04-14', priceNote: 'Published launch rate.', releaseSource: source.gpt41, priceSource: source.gpt41 },
  { id: 2, family: 'ChatGPT', name: 'GPT-4.1 mini', releaseDate: '2025-04-14', releaseKind: 'API launch', type: 'Lightweight multimodal', strengths: ['Coding', 'Long context'], inputPrice: 0.4, outputPrice: 1.6, priceBasis: 'Historical', priceDate: '2025-04-14', priceNote: 'Published launch rate.', releaseSource: source.gpt41, priceSource: source.gpt41 },
  { id: 3, family: 'ChatGPT', name: 'GPT-4.1 nano', releaseDate: '2025-04-14', releaseKind: 'API launch', type: 'Lightweight multimodal', strengths: ['Classification', 'Autocomplete'], inputPrice: 0.1, outputPrice: 0.4, priceBasis: 'Historical', priceDate: '2025-04-14', priceNote: 'Published launch rate.', releaseSource: source.gpt41, priceSource: source.gpt41 },
  { id: 4, family: 'ChatGPT', name: 'GPT-4o mini', releaseDate: '2024-07-18', releaseKind: 'Public launch', type: 'Lightweight multimodal', strengths: ['Vision', 'Customer support'], inputPrice: 0.15, outputPrice: 0.6, priceBasis: 'Historical', priceDate: '2024-07-18', priceNote: 'Published launch rate.', releaseSource: source.gpt4omini, priceSource: source.gpt4omini },
  { id: 5, family: 'Claude', name: 'Claude Opus 4', releaseDate: '2025-05-22', releaseKind: 'Public launch', type: 'Hybrid reasoning', strengths: ['Coding', 'Agents'], inputPrice: 15, outputPrice: 75, priceBasis: 'Historical', priceDate: '2025-05-22', priceNote: 'Published launch rate.', releaseSource: source.claude4, priceSource: source.claude4 },
  { id: 6, family: 'Claude', name: 'Claude Sonnet 4', releaseDate: '2025-05-22', releaseKind: 'Public launch', type: 'Hybrid reasoning', strengths: ['Coding', 'Agents'], inputPrice: 3, outputPrice: 15, priceBasis: 'Historical', priceDate: '2025-05-22', priceNote: 'Published launch rate.', releaseSource: source.claude4, priceSource: source.claude4 },
  { id: 7, family: 'Claude', name: 'Claude 3.7 Sonnet', releaseDate: '2025-02-24', releaseKind: 'Public launch', type: 'Hybrid reasoning', strengths: ['Coding', 'Reasoning'], inputPrice: 3, outputPrice: 15, priceBasis: 'Historical', priceDate: '2025-02-24', priceNote: 'Output rate includes thinking tokens.', releaseSource: source.claude37, priceSource: source.claude37 },
  { id: 8, family: 'Claude', name: 'Claude 3.5 Sonnet (October update)', releaseDate: '2024-10-22', releaseKind: 'Updated model launch', type: 'Multimodal', strengths: ['Coding', 'Computer use'], inputPrice: 3, outputPrice: 15, priceBasis: 'Historical', priceDate: '2024-10-22', priceNote: 'October update retained the earlier Sonnet price.', releaseSource: source.claude35, priceSource: source.claude35price },
  { id: 9, family: 'Gemini', name: 'Gemini 2.5 Pro', releaseDate: '2025-06-17', releaseKind: 'Stable / GA release', type: 'Hybrid reasoning', strengths: ['Coding', 'Reasoning'], inputPrice: 1.25, outputPrice: 10, priceBasis: 'Checked snapshot', priceDate: checkedAt, priceNote: 'Standard paid text tier, prompts ≤200K tokens. Above 200K: $2.50 input / $15 output.', releaseSource: source.gemini25, priceSource: source.geminiPrices },
  { id: 10, family: 'Gemini', name: 'Gemini 2.5 Flash', releaseDate: '2025-06-17', releaseKind: 'Stable / GA release', type: 'Hybrid reasoning', strengths: ['Long context', 'Reasoning'], inputPrice: 0.3, outputPrice: 2.5, priceBasis: 'Checked snapshot', priceDate: checkedAt, priceNote: 'Standard paid text tier. Output includes thinking tokens; audio pricing differs.', releaseSource: source.gemini25, priceSource: source.geminiPrices },
  { id: 11, family: 'Gemini', name: 'Gemini 2.5 Flash-Lite', releaseDate: '2025-07-22', releaseKind: 'Stable / GA release', type: 'Lightweight multimodal', strengths: ['Translation', 'Classification'], inputPrice: 0.1, outputPrice: 0.4, priceBasis: 'Historical', priceDate: '2025-07-22', priceNote: 'Published stable-release rate. Optional thinking supported.', releaseSource: source.geminiLite, priceSource: source.geminiLite },
  { id: 12, family: 'Gemini', name: 'Gemini 2.0 Flash', releaseDate: '2025-02-05', releaseKind: 'Stable / GA release', type: 'Multimodal', strengths: ['Long context', 'Tool use'], inputPrice: 0.1, outputPrice: 0.4, priceBasis: 'Historical', priceDate: '2025-02-05', priceNote: 'Published paid text rate; audio pricing differs.', releaseSource: source.gemini20, priceSource: source.gemini20 },
  { id: 13, family: 'Grok', name: 'Grok 4 Fast Reasoning', releaseDate: '2025-09-19', releaseKind: 'API launch', type: 'Reasoning', strengths: ['Reasoning', 'Search'], inputPrice: 0.2, outputPrice: 0.5, priceBasis: 'Historical', priceDate: '2025-09-19', priceNote: 'Launch rate below 128K context. At ≥128K: $0.40 input / $1 output. Search tool fees excluded.', releaseSource: source.grokFast, priceSource: source.grokFast },
  { id: 14, family: 'Grok', name: 'Grok 4 Fast Non-Reasoning', releaseDate: '2025-09-19', releaseKind: 'API launch', type: 'General text', strengths: ['Search', 'Tool use'], inputPrice: 0.2, outputPrice: 0.5, priceBasis: 'Historical', priceDate: '2025-09-19', priceNote: 'Launch rate below 128K context. At ≥128K: $0.40 input / $1 output. Search tool fees excluded.', releaseSource: source.grokFast, priceSource: source.grokFast },
  { id: 15, family: 'Grok', name: 'Grok Code Fast 1', releaseDate: '2025-08-28', releaseKind: 'Named public launch', type: 'Coding reasoning', strengths: ['Coding', 'Agents'], inputPrice: 0.2, outputPrice: 1.5, priceBasis: 'Historical', priceDate: '2025-08-28', priceNote: 'Published API rate, excluding partner launch promotions.', releaseSource: source.grokCode, priceSource: source.grokCode },
  { id: 16, family: 'Grok', name: 'Grok 4.6', releaseDate: '2026-08-12', releaseKind: 'Public launch', type: 'Hybrid reasoning', strengths: ['Coding', 'Agents'], inputPrice: 2, outputPrice: 6, priceBasis: 'Checked snapshot', priceDate: checkedAt, priceNote: 'Standard context <200K tokens. At ≥200K: $4 input / $12 output.', releaseSource: source.grok46, priceSource: source.grokPrices },
  { id: 17, family: 'DeepSeek', name: 'DeepSeek-V3', releaseDate: '2024-12-26', releaseKind: 'Public launch', type: 'General text', strengths: ['Coding', 'Tool use'], inputPrice: 0.27, outputPrice: 1.1, priceBasis: 'Historical', priceDate: '2025-02-08', priceNote: 'Announced post-promotion rate, effective February 8, 2025. Input is cache miss.', releaseSource: source.deepseekV3, priceSource: source.deepseekV3 },
  { id: 18, family: 'DeepSeek', name: 'DeepSeek-R1', releaseDate: '2025-01-20', releaseKind: 'Public launch', type: 'Reasoning', strengths: ['Reasoning', 'Coding'], inputPrice: 0.55, outputPrice: 2.19, priceBasis: 'Historical', priceDate: '2025-01-20', priceNote: 'Published launch rate. Input is cache miss.', releaseSource: source.deepseekR1, priceSource: source.deepseekR1 },
  { id: 19, family: 'DeepSeek', name: 'DeepSeek-V3.1', releaseDate: '2025-08-21', releaseKind: 'Public launch', type: 'Hybrid reasoning', strengths: ['Agents', 'Tool use'], inputPrice: 0.56, outputPrice: 1.68, priceBasis: 'Historical', priceDate: '2025-09-05', priceNote: 'Announced rate effective September 5, 2025 at 16:00 UTC. Input is cache miss.', releaseSource: source.deepseekV31, priceSource: 'https://cdn.deepseek.com/api-docs/v3.1_price_en.jpeg' },
  { id: 20, family: 'DeepSeek', name: 'DeepSeek-V3.2-Exp', releaseDate: '2025-09-29', releaseKind: 'Experimental release', type: 'Hybrid reasoning', strengths: ['Long context', 'Reasoning'], inputPrice: 0.28, outputPrice: 0.42, priceBasis: 'Historical', priceDate: '2025-09-29', priceNote: 'Announced rate effective September 29, 2025 at 10:00 UTC. Input is cache miss.', releaseSource: source.deepseekV32, priceSource: 'https://api-docs.deepseek.com/img/v3_2_price_en.jpeg' },
];

export const families = Object.keys(companies);
export const modelTypes = [...new Set(archiveData.map((item) => item.type))].sort();
export const specialties = [...new Set(archiveData.flatMap((item) => item.strengths))].sort();
export default archiveData;
