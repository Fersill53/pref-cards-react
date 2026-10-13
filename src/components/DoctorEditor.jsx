import { useState } from 'react';
import Modal from './Modal.jsx';
import { DEFAULT_SUBTITLE } from '../data/factories.js';

// Each value has a matching [data-accent='…'] rule in index.css.
const ACCENTS = [
  ['blue', 'Blue'],
  ['indigo', 'Indigo'],
  ['purple', 'Purple'],
  ['magenta', 'Magenta'],
  ['pink', 'Pink'],
  ['orange', 'Orange'],
  ['lime', 'Lime'],
  ['green', 'Green'],
  ['mint', 'Mint'],
  ['teal', 'Teal'],
  ['silver', 'Silver'],
];

// doctor is null when adding a new one.
export default function DoctorEditor({ doctor, doctors, onSave, onDelete, onClose }) {
  const isNew = doctor === null;
  const [name, setName] = useState(doctor?.name ?? '');
  const [subtitle, setSubtitle] = useState(doctor?.subtitle ?? DEFAULT_SUBTITLE);
  const [accent, setAccent] = useState(doctor?.accent ?? 'blue');
  const [copyFromId, setCopyFromId] = useState('');
  const canSave = name.trim() !== '';

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      name: name.trim(),
      subtitle: subtitle.trim() || DEFAULT_SUBTITLE,
      accent,
      copyFromId,
    });
  }

  return (
    <Modal
      title={isNew ? 'Add doctor' : 'Edit doctor'}
      onClose={onClose}
      footer={
        <>
          {!isNew && (
            <button
              type="button"
              className="btn btn-danger"
              disabled={doctors.length < 2}
              title={doctors.length < 2 ? 'You need at least one doctor' : undefined}
              onClick={onDelete}
            >
              Delete doctor
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="doctor-form"
            className="btn btn-primary"
            disabled={!canSave}
          >
            {isNew ? 'Add doctor' : 'Save'}
          </button>
        </>
      }
    >
      <form id="doctor-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            autoFocus
            placeholder="Dr. Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Subtitle</span>
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </label>
        <div className="field">
          <span>
            Accent colour — {ACCENTS.find(([value]) => value === accent)?.[1] ?? accent}
          </span>
          <div className="swatches" role="radiogroup" aria-label="Accent colour">
            {ACCENTS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={accent === value}
                aria-label={label}
                title={label}
                data-accent={value}
                className={accent === value ? 'swatch selected' : 'swatch'}
                onClick={() => setAccent(value)}
              />
            ))}
          </div>
        </div>
        {isNew && (
          <label className="field">
            <span>Start from</span>
            <select value={copyFromId} onChange={(e) => setCopyFromId(e.target.value)}>
              <option value="">Blank — no preferences or cases</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Copy of {d.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </form>
    </Modal>
  );
}
