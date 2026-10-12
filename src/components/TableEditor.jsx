import { newRow } from '../data/factories.js';
import { moveItem } from '../utils/list.js';

const TONES = [
  ['', 'No tint'],
  ['open', 'Open (green)'],
  ['hold', 'Hold (amber)'],
];

// Edits a table section's column headers and rows. onChange gets { headers, rows }.
export default function TableEditor({ headers, rows, onChange }) {
  const setHeaders = (next) => onChange({ headers: next, rows });
  const setRows = (next) => onChange({ headers, rows: next });
  const patchRow = (id, fields) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...fields } : r)));

  function setCell(row, index, value) {
    const cells = headers.map((_, i) => row.cells[i] ?? '');
    cells[index] = value;
    patchRow(row.id, { cells });
  }

  function removeColumn() {
    const count = headers.length - 1;
    onChange({
      headers: headers.slice(0, count),
      rows: rows.map((r) => ({ ...r, cells: r.cells.slice(0, count) })),
    });
  }

  return (
    <>
      <div className="mini-label">Columns</div>
      <div className="edit-row">
        {headers.map((header, i) => (
          <input
            key={i}
            type="text"
            className="grow"
            placeholder={`Column ${i + 1}`}
            aria-label={`Column ${i + 1} heading`}
            value={header}
            onChange={(e) => setHeaders(headers.map((h, j) => (j === i ? e.target.value : h)))}
          />
        ))}
        <button
          type="button"
          className="icon-btn"
          aria-label="Add column"
          title="Add column"
          disabled={headers.length >= 4}
          onClick={() => setHeaders([...headers, ''])}
        >
          +
        </button>
        <button
          type="button"
          className="icon-btn danger"
          aria-label="Remove last column"
          title="Remove last column"
          disabled={headers.length <= 1}
          onClick={removeColumn}
        >
          −
        </button>
      </div>

      <div className="mini-label">Rows</div>
      {rows.map((row, i) => (
        <div className="edit-row" key={row.id}>
          {headers.map((header, ci) => (
            <input
              key={ci}
              type="text"
              className="grow"
              placeholder={header || `Column ${ci + 1}`}
              aria-label={header || `Column ${ci + 1}`}
              value={row.cells[ci] ?? ''}
              onChange={(e) => setCell(row, ci, e.target.value)}
            />
          ))}
          <select
            aria-label="Row tint"
            value={row.tone}
            onChange={(e) => patchRow(row.id, { tone: e.target.value })}
          >
            {TONES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn"
            aria-label="Move row up"
            disabled={i === 0}
            onClick={() => setRows(moveItem(rows, i, -1))}
          >
            ↑
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Move row down"
            disabled={i === rows.length - 1}
            onClick={() => setRows(moveItem(rows, i, 1))}
          >
            ↓
          </button>
          <button
            type="button"
            className="icon-btn danger"
            aria-label="Remove row"
            onClick={() => setRows(rows.filter((r) => r.id !== row.id))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => setRows([...rows, newRow(headers.map(() => ''))])}
      >
        + Add row
      </button>
      <p className="format-hint table-hint">
        Start a cell with OPEN or HOLD to show it as a status badge.
      </p>
    </>
  );
}
