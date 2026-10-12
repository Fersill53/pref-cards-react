import { useEffect, useMemo, useState } from 'react';
import Header from './Header.jsx';
import GlobalNotes from './GlobalNotes.jsx';
import CaseCard from './CaseCard.jsx';
import CaseEditor from './CaseEditor.jsx';
import NotesEditor from './NotesEditor.jsx';
import DoctorEditor from './DoctorEditor.jsx';
import { newCase } from '../data/factories.js';
import { doctorPath, navigate } from '../utils/route.js';
import { buildSearchText } from '../utils/search.js';

// One doctor's cards. onUpdate(fn) replaces this doctor with fn(doctor).
export default function DoctorPage({
  doctor,
  doctors,
  initialOpenId,
  onUpdate,
  onDelete,
  onAddDoctor,
}) {
  const [query, setQuery] = useState('');
  // Only one card is open at a time: its body overlays the cards below it.
  const [openId, setOpenId] = useState(initialOpenId ?? null);
  // Which editor is showing: { type: 'case', caseId } | { type: 'notes' } |
  // { type: 'doctor' } | null. caseId is null when adding a case.
  const [editing, setEditing] = useState(null);

  // Arriving from a home-page search result: bring the opened card into view.
  useEffect(() => {
    if (initialOpenId) {
      document.getElementById(`case-${initialOpenId}`)?.scrollIntoView({ block: 'start' });
    }
  }, [initialOpenId]);

  useEffect(() => {
    if (openId === null || editing !== null) return;
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
  }, [openId, editing]);

  // Searchable text per case: keywords plus everything rendered on the card.
  const searchIndex = useMemo(
    () => new Map(doctor.cases.map((c) => [c.id, buildSearchText(c)])),
    [doctor.cases]
  );

  const q = query.toLowerCase().trim();
  const visibleCases = q
    ? doctor.cases.filter((c) => searchIndex.get(c.id).includes(q))
    : doctor.cases;

  function handleSearch(value) {
    setQuery(value);
    // A card filtered out by the search collapses, so it reappears closed.
    const next = value.toLowerCase().trim();
    if (!next) return;
    setOpenId((prev) => (prev !== null && searchIndex.get(prev)?.includes(next) ? prev : null));
  }

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function saveCase(saved) {
    onUpdate((d) => ({
      ...d,
      cases: d.cases.some((c) => c.id === saved.id)
        ? d.cases.map((c) => (c.id === saved.id ? saved : c))
        : [...d.cases, saved],
    }));
    setEditing(null);
  }

  function deleteCase(target) {
    if (!window.confirm(`Delete "${target.name}" from ${doctor.name}'s cards?`)) return;
    onUpdate((d) => ({ ...d, cases: d.cases.filter((c) => c.id !== target.id) }));
    setOpenId(null);
    setEditing(null);
  }

  function saveNotes(globalNotes) {
    onUpdate((d) => ({ ...d, globalNotes }));
    setEditing(null);
  }

  function saveDoctor({ copyFromId, ...fields }) {
    onUpdate((d) => ({ ...d, ...fields }));
    setEditing(null);
  }

  function deleteDoctor() {
    const message = `Delete ${doctor.name} and all ${doctor.cases.length} of their cards? This can't be undone.`;
    if (window.confirm(message)) onDelete();
  }

  // The OPEN / HOLD key only matters for doctors whose tables use those tints.
  const showLegend = doctor.cases.some((c) =>
    c.sections.some((s) => s.type === 'table' && s.rows.some((r) => r.tone))
  );

  const editingCase =
    editing?.type === 'case'
      ? doctor.cases.find((c) => c.id === editing.caseId) ?? null
      : null;

  return (
    <>
      <Header
        doctors={doctors}
        currentId={doctor.id}
        subtitle={doctor.subtitle}
        caseCount={doctor.cases.length}
        query={query}
        onQueryChange={handleSearch}
        onSelectDoctor={(id) => navigate(doctorPath(id))}
        onEditDoctor={() => setEditing({ type: 'doctor' })}
        onAddDoctor={onAddDoctor}
      />
      <GlobalNotes notes={doctor.globalNotes} onEdit={() => setEditing({ type: 'notes' })} />
      {showLegend && (
        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot open" />
            OPEN — routine setup
          </div>
          <div className="legend-item">
            <span className="legend-dot hold" />
            HOLD — in room, unopened; open on surgeon request
          </div>
        </div>
      )}
      <main>
        <div className="cases-grid">
          {visibleCases.length === 0 && q && (
            <p className="no-results">No cases match your search.</p>
          )}
          {visibleCases.map((c) => (
            <CaseCard
              key={c.id}
              data={c}
              open={openId === c.id}
              onToggle={() => toggle(c.id)}
              onEdit={() => setEditing({ type: 'case', caseId: c.id })}
            />
          ))}
          {!q && (
            <button
              type="button"
              className="add-card"
              onClick={() => setEditing({ type: 'case', caseId: null })}
            >
              + Add case
            </button>
          )}
        </div>
      </main>

      {editing?.type === 'case' && (
        <CaseEditor
          initial={editingCase ?? newCase()}
          isNew={editingCase === null}
          onSave={saveCase}
          onDelete={() => deleteCase(editingCase)}
          onClose={() => setEditing(null)}
        />
      )}
      {editing?.type === 'notes' && (
        <NotesEditor
          notes={doctor.globalNotes}
          onSave={saveNotes}
          onClose={() => setEditing(null)}
        />
      )}
      {editing?.type === 'doctor' && (
        <DoctorEditor
          doctor={doctor}
          doctors={doctors}
          onSave={saveDoctor}
          onDelete={deleteDoctor}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
