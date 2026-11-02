import { useState } from 'react';
import styles from './App.module.css';
import { DeveloperCard } from './components/DeveloperCard.jsx';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import { ScientistDirectory } from './components/ScientistDirectory.jsx';

const SQUADS = [
  { id: 'ces', name: 'Cerberus Esports' },
  { id: 'te', name: 'The Expendables' },
  { id: 'ge', name: 'Genius Esports' },
];

export default function App() {
  const [squadId, setSquadId] = useState('te');

  return (
    <main>
      <h1>Lab 3: React 19</h1>
      <section>
        <DeveloperCard />
      </section>
      <section>
        <ScientistDirectory />
      </section>
      <section>
        <fieldset className={styles.picker}>
          <legend>Squad</legend>
          {SQUADS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.squadButton}
              aria-pressed={squadId === s.id}
              onClick={() => setSquadId(s.id)}
            >
              {s.name}
            </button>
          ))}
        </fieldset>
        <PubgMatchTelemetry squadId={squadId} />
      </section>
    </main>
  );
}
