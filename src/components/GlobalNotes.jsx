import RichText from './RichText.jsx';

export default function GlobalNotes({ notes, onEdit }) {
  return (
    <details className="global-notes">
      <summary>Global Preferences</summary>
      <div className="global-notes-actions">
        <button type="button" className="btn btn-sm" onClick={onEdit}>
          Edit preferences
        </button>
      </div>
      {notes.length === 0 ? (
        <p className="empty-hint">No global preferences yet.</p>
      ) : (
        <div className="global-notes-grid">
          {notes.map((note) => (
            <div key={note.id} className={note.warn ? 'gnote warn-note' : 'gnote'}>
              <div className="gnote-label">{note.label}</div>
              <div className="gnote-val">
                <RichText text={note.content} />
              </div>
            </div>
          ))}
        </div>
      )}
    </details>
  );
}
