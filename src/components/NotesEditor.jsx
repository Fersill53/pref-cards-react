import { useState } from 'react';
import Modal from './Modal.jsx';
import { newNote } from '../data/factories.js';
import { moveItem } from '../utils/list.js';

export default function NotesEditor({ notes, onSave, onClose }) {
  const [draft, setDraft] = useState(notes);

  const patch = (id, fields) =>
    setDraft((list) => list.map((n) => (n.id === id ? { ...n, ...fields } : n)));

  return (
    <Modal
      title="Edit global preferences"
      onClose={onClose}
      footer={
        <>
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onSave(draft)}>
            Save
          </button>
        </>
      }
    >
      <p className="format-hint">
        Formatting: **bold**, *italic*, and each new line starts a new line on the card.
      </p>
      {draft.map((note, i) => (
        <div className="edit-block" key={note.id}>
          <div className="edit-row">
            <input
              type="text"
              className="grow"
              placeholder="Label (e.g. Bovie Settings)"
              aria-label="Label"
              value={note.label}
              onChange={(e) => patch(note.id, { label: e.target.value })}
            />
            <button
              type="button"
              className="icon-btn"
              aria-label="Move up"
              disabled={i === 0}
              onClick={() => setDraft((list) => moveItem(list, i, -1))}
            >
              ↑
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Move down"
              disabled={i === draft.length - 1}
              onClick={() => setDraft((list) => moveItem(list, i, 1))}
            >
              ↓
            </button>
            <button
              type="button"
              className="icon-btn danger"
              aria-label="Remove"
              onClick={() => setDraft((list) => list.filter((n) => n.id !== note.id))}
            >
              ✕
            </button>
          </div>
          <textarea
            rows={3}
            placeholder="Details"
            aria-label="Details"
            value={note.content}
            onChange={(e) => patch(note.id, { content: e.target.value })}
          />
          <label className="check">
            <input
              type="checkbox"
              checked={note.warn}
              onChange={(e) => patch(note.id, { warn: e.target.checked })}
            />
            Highlight as a warning
          </label>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-dashed"
        onClick={() => setDraft((list) => [...list, newNote()])}
      >
        + Add preference
      </button>
    </Modal>
  );
}
