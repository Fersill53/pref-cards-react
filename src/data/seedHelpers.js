import { newColumn, newPill, newRow, newSection } from './factories.js';

// Short builders used by the seed files.

const colored = (variant) => (text) => ({ text, variant });
export const accent = colored('accent');
export const warnPill = colored('warn');
export const dangerPill = colored('danger');
export const green = colored('green');
export const teal = colored('teal');

export const note = (label, content) => newSection({ label, type: 'note', content });
export const warn = (label, content) => newSection({ label, type: 'warn', content });
export const danger = (label, content) => newSection({ label, type: 'danger', content });
export const info = (label, content) => newSection({ label, type: 'info', content });

export const pills = (label, items) =>
  newSection({
    label,
    type: 'pills',
    pills: items.map((p) => (typeof p === 'string' ? newPill(p) : newPill(p.text, p.variant))),
  });

export const twoCol = (label, columns) =>
  newSection({
    label,
    type: 'twoCol',
    columns: columns.map(([colLabel, content]) => newColumn(colLabel, content)),
  });

// Row tones: OPEN = routine setup, HOLD = in room unopened, PLAIN = no tint.
export const OPEN = 'open';
export const HOLD = 'hold';
export const PLAIN = '';

// rows: [tone, ...cells]
export const table = (label, headers, rows) =>
  newSection({
    label,
    type: 'table',
    headers,
    rows: rows.map(([tone, ...cells]) => newRow(cells, tone)),
  });
