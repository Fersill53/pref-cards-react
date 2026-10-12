import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import GlobalNotes from './components/GlobalNotes.jsx';
import CaseCard from './components/CaseCard.jsx';
import { cases } from './data/cases.jsx';
import { buildSearchText } from './utils/search.js';

const SURGEON = 'Dr. Barkoh';

// Searchable text per case: keywords plus everything rendered on the card.
const searchIndex = new Map(cases.map((c) => [c.id, buildSearchText(c)]));

export default function App() {
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = useState(() => new Set());

  const visibleCases = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return cases;
    return cases.filter((c) => searchIndex.get(c.id).includes(q));
  }, [query]);

  function handleSearch(value) {
    setQuery(value);
    // Cards filtered out by the search collapse, so they reappear closed.
    const q = value.toLowerCase().trim();
    if (!q) return;
    setOpenIds((prev) => {
      const next = new Set([...prev].filter((id) => searchIndex.get(id).includes(q)));
      return next.size === prev.size ? prev : next;
    });
  }

  function toggle(id) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <Header
        surgeon={SURGEON}
        caseCount={cases.length}
        query={query}
        onQueryChange={handleSearch}
      />
      <GlobalNotes />
      <main>
        <div className="cases-grid">
          {visibleCases.length === 0 && (
            <p className="no-results">No cases match your search.</p>
          )}
          {visibleCases.map((c) => (
            <CaseCard
              key={c.id}
              data={c}
              open={openIds.has(c.id)}
              onToggle={() => toggle(c.id)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
