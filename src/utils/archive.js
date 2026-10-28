export function filterAndSort(items, { family = 'all', type = 'all', specialty = 'all', priceBasis = 'all', sortMode = 'default' } = {}) {
  const filtered = items.filter((item) => (
    (family === 'all' || item.family === family)
    && (type === 'all' || item.type === type)
    && (specialty === 'all' || item.strengths.includes(specialty))
    && (priceBasis === 'all' || item.priceBasis === priceBasis)
  ));
  const sorters = {
    name: (a, b) => a.name.localeCompare(b.name) || a.id - b.id,
    newest: (a, b) => b.releaseDate.localeCompare(a.releaseDate) || a.id - b.id,
    oldest: (a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.id - b.id,
    input: (a, b) => a.inputPrice - b.inputPrice || a.id - b.id,
    output: (a, b) => a.outputPrice - b.outputPrice || a.id - b.id,
  };
  if (sorters[sortMode]) filtered.sort(sorters[sortMode]);
  return filtered;
}

export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(value);
}
