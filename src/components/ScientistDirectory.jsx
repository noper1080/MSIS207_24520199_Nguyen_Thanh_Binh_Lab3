import { useState } from 'react';
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
 * Directory of pioneers with stable ids.
 * @param {ScientistDirectoryProps} props
 */
export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const [people] = useState(initialData);

  return (
    <section className={styles.directory} aria-label="Pioneer Directory">
      <ul className={styles.list}>
        {people.map((p) => (
          <li key={p.id} className={styles.item}>
            {p.name} — IQ {p.iq}, age {p.age}
          </li>
        ))}
      </ul>
    </section>
  );
}
