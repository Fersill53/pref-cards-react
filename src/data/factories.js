import { uid } from '../utils/id.js';

// Data shapes (everything is plain JSON so it can be edited and saved):
//
// doctor   { id, name, globalNotes: note[], cases: case[] }
// note     { id, label, content, warn }
// case     { id, name, tag: { label, kind }, keywords, intro, sections: section[] }
// section  { id, label, type, content, pills: pill[], columns: column[] }
//            type 'note' | 'warn' | 'danger' use content
//            type 'pills' uses pills, type 'twoCol' uses columns
// pill     { id, text, variant }   variant: '' | 'accent' | 'green' | 'warn' | 'danger'
// column   { id, label, content }
//
// Text fields support **bold**, *italic* and line breaks (see RichText).

export const newPill = (text = '', variant = '') => ({ id: uid(), text, variant });

export const newColumn = (label = '', content = '') => ({ id: uid(), label, content });

export const newSection = (fields = {}) => ({
  id: uid(),
  label: '',
  type: 'pills',
  content: '',
  pills: [],
  columns: [],
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
  keywords: '',
  intro: '',
  sections: [],
  ...fields,
});

export const newDoctor = (fields = {}) => ({
  id: uid(),
  name: '',
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
