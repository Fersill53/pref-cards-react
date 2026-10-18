import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { formatWhen } from '../utils/history.js';

// Lists a doctor's saved changes, newest first. Restoring puts the doctor's cards
// back to how they were just before that change; later changes are undone too,
// but the current version is kept in history so the restore can itself be undone.
export default function HistoryDialog({ doctor, listVersions, onRestore, onClose }) {
  const [versions, setVersions] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listVersions()
      .then((list) => !cancelled && setVersions(list))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [listVersions]);

  function restore(version) {
    const message =
      `Put ${doctor.name}'s cards back to how they were before ` +
      `this change: ${version.summary} (${formatWhen(version.savedAt)})?\n\n` +
      'Any changes made after that are undone too. You can undo this restore from history.';
    if (window.confirm(message)) onRestore(version);
  }

  return (
    <Modal
      title={`History — ${doctor.name}`}
      onClose={onClose}
      footer={
        <>
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </>
      }
    >
      <p className="format-hint">
        Every saved change, newest first. The last 30 are kept.
      </p>
      {failed && <p className="empty-hint">Couldn&rsquo;t load the history. Check your connection.</p>}
      {!failed && versions === null && <p className="empty-hint">Loading…</p>}
      {versions?.length === 0 && <p className="empty-hint">No changes saved yet.</p>}
      {versions?.length > 0 && (
        <ul className="history-list">
          {versions.map((version) => (
            <li key={version.id} className="history-item">
              <div className="history-text">
                <div className="history-summary">{version.summary}</div>
                <div className="history-when">{formatWhen(version.savedAt)}</div>
              </div>
              <button type="button" className="btn btn-sm" onClick={() => restore(version)}>
                Restore to before
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
