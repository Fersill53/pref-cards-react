import { uid } from '../utils/id.js';

// Data shapes (everything is plain JSON so it can be edited and saved):
//
// doctor   { id, name, subtitle, accent, globalNotes: note[], cases: case[] }
//            accent: 'blue' | 'purple' | 'teal' | 'green'
// note     { id, label, content, warn }
// case     { id, name, tag: { label, kind }, draft, keywords, intro, sections: section[] }
//            tag.kind: 'spine' (blue) | 'cervical' (green) | 'other' (amber) | 'purple' | 'teal' | 'red'
// section  { id, label, type, content, pills: pill[], columns: column[], headers: string[], rows: row[] }
//            type 'note' | 'warn' | 'danger' | 'info' use content
//            type 'pills' uses pills, 'twoCol' uses columns, 'table' uses headers + rows
// pill     { id, text, variant }   variant: '' | 'accent' | 'green' | 'teal' | 'warn' | 'danger'
// column   { id, label, content }
// row      { id, tone, cells: string[] }   tone: '' | 'open' | 'hold'
//
// Text fields support **bold**, *italic* and line breaks (see RichText). A table
// cell starting with OPEN or HOLD shows that word as a status badge.

export const DEFAULT_SUBTITLE = 'Surgical Preference Cards';

export const newPill = (text = '', variant = '') => ({ id: uid(), text, variant });

export const newColumn = (label = '', content = '') => ({ id: uid(), label, content });

export const newRow = (cells = [], tone = '') => ({ id: uid(), tone, cells });

export const newSection = (fields = {}) => ({
  id: uid(),
  label: '',
  type: 'pills',
  content: '',
  pills: [],
  columns: [],
  headers: [],
  rows: [],
  ...fields,
});

export const newNote = (fields = {}) => ({
  id: uid(),
  label: '',
  content: '',
  warn: false,
  ...fields,
});

export const newCase = (fields = {}) => ({
  id: uid(),
  name: '',
  tag: { label: 'Spine', kind: 'spine' },
  draft: false,
  keywords: '',
  intro: '',
  sections: [],
  ...fields,
});

export const newDoctor = (fields = {}) => ({
  id: uid(),
  name: '',
  subtitle: DEFAULT_SUBTITLE,
  accent: 'blue',
  globalNotes: [],
  cases: [],
  ...fields,
});

// Deep copy that gives every object carrying an id a fresh one.
export function cloneWithNewIds(value) {
  if (Array.isArray(value)) return value.map(cloneWithNewIds);
  if (value && typeof value === 'object') {
    const copy = {};
    for (const [key, v] of Object.entries(value)) copy[key] = cloneWithNewIds(v);
    if ('id' in copy) copy.id = uid();
    return copy;
  }
  return value;
}
