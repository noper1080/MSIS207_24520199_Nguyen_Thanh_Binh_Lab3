import { DeveloperCard } from './components/DeveloperCard.jsx';
import { ScientistDirectory } from './components/ScientistDirectory.jsx';

export default function App() {
  return (
    <main>
      <h1>Lab 3: React 19</h1>
      <section>
        <DeveloperCard />
      </section>
      <section>
        <ScientistDirectory />
      </section>
    </main>
  );
}
