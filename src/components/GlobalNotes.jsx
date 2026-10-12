import { globalNotes } from '../data/globalNotes.jsx';

export default function GlobalNotes() {
  return (
    <details className="global-notes">
      <summary>Global Preferences</summary>
      <div className="global-notes-grid">
        {globalNotes.map((note) => (
          <div key={note.label} className={note.warn ? 'gnote warn-note' : 'gnote'}>
            <div className="gnote-label">{note.label}</div>
            <div className="gnote-val">{note.content}</div>
          </div>
        ))}
      </div>
    </details>
  );
}
