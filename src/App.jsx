import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import GlobalNotes from './components/GlobalNotes.jsx';
import CaseCard from './components/CaseCard.jsx';
import CaseEditor from './components/CaseEditor.jsx';
import NotesEditor from './components/NotesEditor.jsx';
import DoctorEditor from './components/DoctorEditor.jsx';
import { cloneWithNewIds, newCase, newDoctor } from './data/factories.js';
import { buildSearchText } from './utils/search.js';
import { loadState, saveState } from './utils/storage.js';

export default function App() {
  const [state, setState] = useState(loadState);
  const [query, setQuery] = useState('');
  // Only one card is open at a time: its body overlays the cards below it.
  const [openId, setOpenId] = useState(null);
  // Which editor is showing: { type: 'case', caseId } | { type: 'notes' } |
  // { type: 'doctor', isNew } | null. caseId is null when adding a case.
  const [editing, setEditing] = useState(null);

  const { doctors } = state;
  const doctor = doctors.find((d) => d.id === state.currentId) ?? doctors[0];

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    document.title = `${doctor.name} — Surgical Preference Cards`;
  }, [doctor.name]);

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

  function updateDoctor(fn) {
    setState((s) => ({
      ...s,
      doctors: s.doctors.map((d) => (d.id === doctor.id ? fn(d) : d)),
    }));
  }

  function selectDoctor(id) {
    setState((s) => ({ ...s, currentId: id }));
    setQuery('');
    setOpenId(null);
  }

  function saveCase(saved) {
    updateDoctor((d) => ({
      ...d,
      cases: d.cases.some((c) => c.id === saved.id)
        ? d.cases.map((c) => (c.id === saved.id ? saved : c))
        : [...d.cases, saved],
    }));
    setEditing(null);
  }

  function deleteCase(target) {
    if (!window.confirm(`Delete "${target.name}" from ${doctor.name}'s cards?`)) return;
    updateDoctor((d) => ({ ...d, cases: d.cases.filter((c) => c.id !== target.id) }));
    setOpenId(null);
    setEditing(null);
  }

  function saveNotes(globalNotes) {
    updateDoctor((d) => ({ ...d, globalNotes }));
    setEditing(null);
  }

  function saveDoctor({ name, copyFromId }) {
    if (editing.isNew) {
      const source = doctors.find((d) => d.id === copyFromId);
      const created = source
        ? { ...cloneWithNewIds(source), name }
        : newDoctor({ name });
      setState((s) => ({ doctors: [...s.doctors, created], currentId: created.id }));
      setQuery('');
      setOpenId(null);
    } else {
      updateDoctor((d) => ({ ...d, name }));
    }
    setEditing(null);
  }

  function deleteDoctor() {
    const message = `Delete ${doctor.name} and all ${doctor.cases.length} of their cards? This can't be undone.`;
    if (!window.confirm(message)) return;
    setState((s) => {
      const remaining = s.doctors.filter((d) => d.id !== doctor.id);
      return { doctors: remaining, currentId: remaining[0].id };
    });
    setQuery('');
    setOpenId(null);
    setEditing(null);
  }

  const editingCase =
    editing?.type === 'case'
      ? doctor.cases.find((c) => c.id === editing.caseId) ?? null
      : null;

  return (
    <>
      <Header
        doctors={doctors}
        currentId={doctor.id}
        caseCount={doctor.cases.length}
        query={query}
        onQueryChange={handleSearch}
        onSelectDoctor={selectDoctor}
        onEditDoctor={() => setEditing({ type: 'doctor', isNew: false })}
        onAddDoctor={() => setEditing({ type: 'doctor', isNew: true })}
      />
      {/* key resets the open/closed panel when switching doctors */}
      <GlobalNotes
        key={doctor.id}
        notes={doctor.globalNotes}
        onEdit={() => setEditing({ type: 'notes' })}
      />
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
          doctor={editing.isNew ? null : doctor}
          doctors={doctors}
          onSave={saveDoctor}
          onDelete={deleteDoctor}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
