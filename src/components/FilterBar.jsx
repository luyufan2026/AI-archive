import React from 'react';
import { families, modelTypes, specialties } from '../data/archiveData.js';

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(({ value: optionValue, label: optionLabel }) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </div>
  );
}
const choices = (values) => values.map((value) => ({ value, label: value }));

export default function FilterBar({ family, type, specialty, priceBasis, sortMode, onFamilyChange, onTypeChange, onSpecialtyChange, onPriceBasisChange, onSortChange, onReset }) {
  return (
    <section className="filter-bar" aria-label="Archive filters and sorting">
      <SelectField id="family-filter" label="AI family" value={family} onChange={onFamilyChange} options={[{ value: 'all', label: 'All families' }, ...choices(families)]} />
      <SelectField id="type-filter" label="Model type" value={type} onChange={onTypeChange} options={[{ value: 'all', label: 'All types' }, ...choices(modelTypes)]} />
      <SelectField id="specialty-filter" label="Specialty" value={specialty} onChange={onSpecialtyChange} options={[{ value: 'all', label: 'All specialties' }, ...choices(specialties)]} />
      <SelectField id="basis-filter" label="Price basis" value={priceBasis} onChange={onPriceBasisChange} options={[{ value: 'all', label: 'All reference dates' }, ...choices(['Historical', 'Checked snapshot'])]} />
      <SelectField id="sort-mode" label="Sort" value={sortMode} onChange={onSortChange} options={[
        { value: 'default', label: 'Default' }, { value: 'name', label: 'Model A–Z' },
        { value: 'newest', label: 'Newest release' }, { value: 'oldest', label: 'Oldest release' },
        { value: 'input', label: 'Lowest input price' }, { value: 'output', label: 'Lowest output price' },
      ]} />
      <button type="button" onClick={onReset}>Reset filters</button>
    </section>
  );
}
