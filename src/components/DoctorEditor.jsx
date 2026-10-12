import { useState } from 'react';
import Modal from './Modal.jsx';

// doctor is null when adding a new one.
export default function DoctorEditor({ doctor, doctors, onSave, onDelete, onClose }) {
  const isNew = doctor === null;
  const [name, setName] = useState(doctor?.name ?? '');
  const [copyFromId, setCopyFromId] = useState('');
  const canSave = name.trim() !== '';

  function handleSubmit(e) {
    e.preventDefault();
    if (canSave) onSave({ name: name.trim(), copyFromId });
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
