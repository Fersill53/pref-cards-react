import { useState } from 'react';
import Modal from './Modal.jsx';
import TableEditor from './TableEditor.jsx';
import { newColumn, newPill, newSection } from '../data/factories.js';
import { moveItem } from '../utils/list.js';

const SECTION_TYPES = [
  ['pills', 'Pills (list of items)'],
  ['note', 'Note'],
  ['warn', 'Warning (amber)'],
  ['danger', 'Alert (red)'],
  ['info', 'Info (teal)'],
  ['twoCol', 'Two columns'],
  ['table', 'Table'],
];

const TEXT_TYPES = ['note', 'warn', 'danger', 'info'];

const PILL_COLORS = [
  ['', 'Grey'],
  ['accent', 'Accent'],
  ['green', 'Green'],
  ['teal', 'Teal'],
  ['warn', 'Amber'],
  ['danger', 'Red'],
];

const TAG_COLORS = [
  ['spine', 'Blue'],
  ['cervical', 'Green'],
  ['other', 'Amber'],
  ['purple', 'Purple'],
  ['teal', 'Teal'],
  ['red', 'Red'],
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

  function changeType(section, type) {
    // A table needs at least one column to be editable.
    const headers =
      type === 'table' && section.headers.length === 0 ? ['Item', 'Status'] : section.headers;
    patchSection(section.id, { type, headers });
  }

  function handleSave() {
    onSave({
      ...draft,
      name: draft.name.trim(),
      // Drop rows that were added but left empty.
      sections: draft.sections.map((s) => ({
        ...s,
        pills: s.pills.filter((p) => p.text.trim() !== ''),
        columns: s.columns.filter((c) => c.label.trim() !== '' || c.content.trim() !== ''),
        rows: s.rows.filter((r) => r.cells.some((cell) => cell.trim() !== '')),
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

      <label className="check draft-check">
        <input
          type="checkbox"
          checked={draft.draft}
          onChange={(e) => set({ draft: e.target.checked })}
        />
        Mark as draft (shows a DRAFT badge on the card)
      </label>

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
              onChange={(e) => changeType(section, e.target.value)}
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
          {section.type === 'table' && (
            <TableEditor
              headers={section.headers}
              rows={section.rows}
              onChange={(fields) => patchSection(section.id, fields)}
            />
          )}
          {TEXT_TYPES.includes(section.type) && (
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
