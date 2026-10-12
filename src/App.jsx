import { useEffect, useMemo, useState } from 'react';
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
  // Only one card is open at a time: its body overlays the cards below it.
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (openId === null) return;
    function handlePointerDown(e) {
      if (!e.target.closest('.case-card.open')) setOpenId(null);
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpenId(null);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openId]);

  const visibleCases = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return cases;
    return cases.filter((c) => searchIndex.get(c.id).includes(q));
  }, [query]);

  function handleSearch(value) {
    setQuery(value);
    // A card filtered out by the search collapses, so it reappears closed.
    const q = value.toLowerCase().trim();
    if (!q) return;
    setOpenId((prev) => (prev !== null && searchIndex.get(prev).includes(q) ? prev : null));
  }

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
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
              open={openId === c.id}
              onToggle={() => toggle(c.id)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
