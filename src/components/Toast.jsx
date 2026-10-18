import { useEffect } from 'react';

const SHOW_FOR_MS = 10000;

// A short message at the bottom of the screen with an optional Undo button.
// Disappears on its own after a few seconds.
export default function Toast({ message, onUndo, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, SHOW_FOR_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast" role="status">
      <span className="toast-message">{message}</span>
      {onUndo && (
        <button
          type="button"
          className="toast-undo"
          onClick={() => {
            onUndo();
            onClose();
          }}
        >
          Undo
        </button>
      )}
      <button type="button" className="toast-close" aria-label="Dismiss" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
