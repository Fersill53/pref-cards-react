import { useState } from 'react';
import Modal from './Modal.jsx';
import { newColumn, newPill, newSection } from '../data/factories.js';
import { moveItem } from '../utils/list.js';

const SECTION_TYPES = [
  ['pills', 'Pills (list of items)'],
  ['note', 'Note'],
  ['warn', 'Warning (amber)'],
  ['danger', 'Alert (red)'],
  ['twoCol', 'Two columns'],
];

const PILL_COLORS = [
  ['', 'Grey'],
  ['accent', 'Blue'],
  ['green', 'Green'],
  ['warn', 'Amber'],
  ['danger', 'Red'],
];

const TAG_COLORS = [
  ['spine', 'Blue'],
  ['cervical', 'Green'],
  ['other', 'Amber'],
];

function PillsEditor({ pills, onChange }) {
  const patch = (id, fields) =>
    onChange(pills.map((p) => (p.id === id ? { ...p, ...fields } : p)));

  return (
    <>
      {pills.map((pill, i) => (
        <div className="edit-row" key={pill.id}>
          <input
            type="text"
            className="grow"
            placeholder="Item"
            aria-label="Item"
            value={pill.text}
            onChange={(e) => patch(pill.id, { text: e.target.value })}
          />
          <select
            aria-label="Colour"
            value={pill.variant}
            onChange={(e) => patch(pill.id, { variant: e.target.value })}
          >
            {PILL_COLORS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn"
            aria-label="Move item up"
            disabled={i === 0}
            onClick={() => onChange(moveItem(pills, i, -1))}
          >
            ↑
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Move item down"
            disabled={i === pills.length - 1}
            onClick={() => onChange(moveItem(pills, i, 1))}
          >
            ↓
          </button>
          <button
            type="button"
            className="icon-btn danger"
            aria-label="Remove item"
            onClick={() => onChange(pills.filter((p) => p.id !== pill.id))}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-sm" onClick={() => onChange([...pills, newPill()])}>
        + Add item
      </button>
    </>
  );
}

function ColumnsEditor({ columns, onChange }) {
  const patch = (id, fields) =>
    onChange(columns.map((c) => (c.id === id ? { ...c, ...fields } : c)));

  return (
    <>
      {columns.map((col) => (
        <div className="edit-subblock" key={col.id}>
          <div className="edit-row">
            <input
              type="text"
              className="grow"
              placeholder="Box label (e.g. Fascia)"
              aria-label="Box label"
              value={col.label}
              onChange={(e) => patch(col.id, { label: e.target.value })}
            />
            <button
              type="button"
              className="icon-btn danger"
              aria-label="Remove box"
              onClick={() => onChange(columns.filter((c) => c.id !== col.id))}
            >
              ✕
            </button>
          </div>
          <textarea
            rows={2}
            placeholder="Text"
            aria-label="Box text"
            value={col.content}
            onChange={(e) => patch(col.id, { content: e.target.value })}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => onChange([...columns, newColumn()])}
      >
        + Add box
      </button>
    </>
  );
}

export default function CaseEditor({ initial, isNew, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(initial);
  const canSave = draft.name.trim() !== '';

  const set = (fields) => setDraft((d) => ({ ...d, ...fields }));
  const setSections = (fn) => setDraft((d) => ({ ...d, sections: fn(d.sections) }));
  const patchSection = (id, fields) =>
    setSections((list) => list.map((s) => (s.id === id ? { ...s, ...fields } : s)));

  function handleSave() {
    onSave({
      ...draft,
      name: draft.name.trim(),
      // Drop rows that were added but left empty.
      sections: draft.sections.map((s) => ({
        ...s,
        pills: s.pills.filter((p) => p.text.trim() !== ''),
        columns: s.columns.filter((c) => c.label.trim() !== '' || c.content.trim() !== ''),
      })),
    });
  }

  return (
    <Modal
      title={isNew ? 'Add case' : 'Edit case'}
      onClose={onClose}
      footer={
        <>
          {!isNew && (
            <button type="button" className="btn btn-danger" onClick={onDelete}>
              Delete case
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canSave}
            onClick={handleSave}
          >
            {isNew ? 'Add case' : 'Save'}
          </button>
        </>
      }
    >
      <label className="field">
        <span>Procedure name</span>
        <input
          type="text"
          autoFocus={isNew}
          placeholder="e.g. TLIF"
          value={draft.name}
          onChange={(e) => set({ name: e.target.value })}
        />
      </label>

      <div className="field-pair">
        <label className="field">
          <span>Tag</span>
          <input
            type="text"
            placeholder="e.g. Spine"
            value={draft.tag.label}
            onChange={(e) => set({ tag: { ...draft.tag, label: e.target.value } })}
          />
        </label>
        <label className="field">
          <span>Tag colour</span>
          <select
            value={draft.tag.kind}
            onChange={(e) => set({ tag: { ...draft.tag, kind: e.target.value } })}
          >
            {TAG_COLORS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Intro line (optional)</span>
        <input
          type="text"
          placeholder="Shown at the top of the card"
          value={draft.intro}
          onChange={(e) => set({ intro: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Extra search words (optional)</span>
        <input
          type="text"
          placeholder="Words that should find this card but aren't written on it"
          value={draft.keywords}
          onChange={(e) => set({ keywords: e.target.value })}
        />
      </label>

      <div className="edit-heading">Sections</div>
      <p className="format-hint">
        Formatting in notes: **bold**, *italic*, and each new line starts a new line on the card.
      </p>

      {draft.sections.map((section, i) => (
        <div className="edit-block" key={section.id}>
          <div className="edit-row">
            <input
              type="text"
              className="grow"
              placeholder="Section title (e.g. Sutures)"
              aria-label="Section title"
              value={section.label}
              onChange={(e) => patchSection(section.id, { label: e.target.value })}
            />
            <select
              aria-label="Section type"
              value={section.type}
              onChange={(e) => patchSection(section.id, { type: e.target.value })}
            >
              {SECTION_TYPES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="icon-btn"
              aria-label="Move section up"
              disabled={i === 0}
              onClick={() => setSections((list) => moveItem(list, i, -1))}
            >
              ↑
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Move section down"
              disabled={i === draft.sections.length - 1}
              onClick={() => setSections((list) => moveItem(list, i, 1))}
            >
              ↓
            </button>
            <button
              type="button"
              className="icon-btn danger"
              aria-label="Remove section"
              onClick={() => setSections((list) => list.filter((s) => s.id !== section.id))}
            >
              ✕
            </button>
          </div>

          {section.type === 'pills' && (
            <PillsEditor
              pills={section.pills}
              onChange={(pills) => patchSection(section.id, { pills })}
            />
          )}
          {section.type === 'twoCol' && (
            <ColumnsEditor
              columns={section.columns}
              onChange={(columns) => patchSection(section.id, { columns })}
            />
          )}
          {section.type !== 'pills' && section.type !== 'twoCol' && (
            <textarea
              rows={3}
              placeholder="Text"
              aria-label="Section text"
              value={section.content}
              onChange={(e) => patchSection(section.id, { content: e.target.value })}
            />
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-dashed"
        onClick={() => setSections((list) => [...list, newSection()])}
      >
        + Add section
      </button>
    </Modal>
  );
}
