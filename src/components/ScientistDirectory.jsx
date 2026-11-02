import { useId, useState } from 'react';
import styles from './ScientistDirectory.module.css';

/**
 * @typedef {Object} Pioneer
 * @property {string} id    Stable unique id, used as React key ('sp-1' ... 'sp-6')
 * @property {string} name
 * @property {number} age
 * @property {number} iq
 */

/**
 * @typedef {Object} ScientistDirectoryProps
 * @property {Pioneer[]} [initialData]   Defaults to SMART_PEOPLE
 */

/** @type {Pioneer[]} */
const SMART_PEOPLE = [
  { id: 'sp-1', name: 'Johann Goethe', age: 82, iq: 210 },
  { id: 'sp-2', name: 'Albert Einstein', age: 76, iq: 205 },
  { id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'sp-4', name: 'Isaac Newton', age: 84, iq: 190 },
  { id: 'sp-5', name: 'James Maxwell', age: 48, iq: 190 },
  { id: 'sp-6', name: 'William Sidis', age: 46, iq: 200 },
];

/**
 * Searchable, filterable, sortable directory of pioneers with delete and reset.
 * Only the raw inputs live in state; `visible` is derived during render.
 * @param {ScientistDirectoryProps} props
 */
export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const qId = useId();
  const iqId = useId();
  const sortId = useId();
  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

  const needle = query.trim().toLowerCase();
  const visible = people
    .filter((p) => p.name.toLowerCase().includes(needle) && p.iq >= minIq)
    .toSorted((a, b) => (sortBy === 'iq-desc' ? b.iq - a.iq : a.age - b.age));

  function handleDelete(id) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  function handleReset() {
    setPeople(initialData);
  }

  return (
    <section className={styles.directory} aria-label="Pioneer Directory">
      <form
        className={styles.controls}
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor={qId}>Name</label>
        <input
          id={qId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label htmlFor={iqId}>Min IQ</label>
        <input
          id={iqId}
          type="number"
          value={minIq}
          onChange={(e) =>
            setMinIq(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)
          }
        />
        <label htmlFor={sortId}>Sort by</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="iq-desc">IQ (high to low)</option>
          <option value="age-asc">Age (young to old)</option>
        </select>
      </form>
      <output className={styles.status} role="status" aria-live="polite">
        Found {visible.length} pioneers
      </output>
      <button type="button" className={styles.button} onClick={handleReset}>
        Reset
      </button>
      <ul className={styles.list}>
        {visible.map((p) => (
          <li key={p.id} className={styles.item}>
            {p.name} — IQ {p.iq}, age {p.age}
            <button
              type="button"
              className={styles.button}
              aria-label={`Delete ${p.name}`}
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
