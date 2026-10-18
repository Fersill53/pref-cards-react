// Builds a case's pick list from its pill and table sections, and keeps each
// phone's checkmarks in this browser only (never shared, never synced).

// Section titles that list things to pull. Used only when a section hasn't been
// switched on or off for the pick list in the case editor.
const PICK_TITLES =
  /instrument|suppl|suture|drug|medication|needle|port|stapl|clip|dressing|closing|closure|drain|equipment|must have|have in room|irrigation|extras|ioc setup/i;

export function canPick(section) {
  return section.type === 'pills' || section.type === 'table';
}

// Whether a section's items go on the pick list.
export function inPickList(section) {
  if (!canPick(section)) return false;
  if (typeof section.pickList === 'boolean') return section.pickList;
  // An untitled table usually continues the section above it.
  if (section.type === 'table' && !section.label.trim()) return true;
  return PICK_TITLES.test(section.label);
}

// Splits "Scope warmer · Microfiber cloth" into separate items, but not
// "MIS tubes (18mm · beveled)".
function splitItems(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === '·' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts.map((p) => p.trim()).filter(Boolean);
}

const STATUS_PREFIX = /^(OPEN|HOLD)\b[\s:—–-]*/i;
const strip = (text) => (text ?? '').replace(/\*/g, '').trim();

function pillItems(section) {
  return section.pills.flatMap((pill) => {
    let text = strip(pill.text);
    let status = 'pull';
    const prefix = STATUS_PREFIX.exec(text);
    if (prefix) {
      status = prefix[1].toLowerCase();
      text = text.slice(prefix[0].length);
    }
    return splitItems(text).map((name, i) => ({
      id: `${pill.id}:${i}`,
      name,
      qty: '',
      detail: '',
      status,
    }));
  });
}

function tableItems(section) {
  const headers = section.headers.map((h) => h.toLowerCase());
  let nameCol = headers.findIndex((h) => /item|instrument|suture|suppl/.test(h));
  if (nameCol < 0) nameCol = 0;
  const qtyCol = headers.findIndex((h) => /^(qty|quantity)$/.test(h.trim()));

  return section.rows
    .filter((row) => strip(row.cells[nameCol]))
    .flatMap((row) => {
      let status = row.tone || 'pull';
      const details = [];
      section.headers.forEach((_, i) => {
        if (i === nameCol || i === qtyCol) return;
        let cell = strip(row.cells[i]);
        const prefix = STATUS_PREFIX.exec(cell);
        if (prefix) {
          status = prefix[1].toLowerCase();
          cell = cell.slice(prefix[0].length);
        }
        if (cell) details.push(cell);
      });
      return splitItems(strip(row.cells[nameCol])).map((name, i) => ({
        id: `${row.id}:${i}`,
        name,
        qty: qtyCol >= 0 ? strip(row.cells[qtyCol]) : '',
        detail: details.join(' · '),
        status,
      }));
    });
}

export const PICK_GROUPS = [
  { status: 'open', title: 'Open on the field' },
  { status: 'hold', title: 'Pull — keep in room unopened' },
  { status: 'pull', title: 'Pull' },
];

// [{ status, title, count, sections: [{ id, label, items }] }], empty groups left out.
export function buildPickList(c) {
  const sections = c.sections
    .map((section, i) => ({
      section,
      // An untitled section takes the title of the nearest titled one above it.
      label:
        section.label ||
        c.sections.slice(0, i).reverse().find((s) => s.label)?.label ||
        '',
    }))
    .filter(({ section }) => inPickList(section))
    .map(({ section, label }) => ({
      id: section.id,
      label,
      items: section.type === 'pills' ? pillItems(section) : tableItems(section),
    }));

  return PICK_GROUPS.map((group) => {
    const groupSections = sections
      .map((s) => ({ ...s, items: s.items.filter((item) => item.status === group.status) }))
      .filter((s) => s.items.length > 0);
    return {
      ...group,
      sections: groupSections,
      count: groupSections.reduce((n, s) => n + s.items.length, 0),
    };
  }).filter((group) => group.count > 0);
}

export function pickListCount(c) {
  return buildPickList(c).reduce((n, group) => n + group.count, 0);
}

// Checked item ids for one case, saved on this device.
const key = (caseId) => `pref-cards:pick:${caseId}`;

export function loadChecked(caseId) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key(caseId))) ?? []);
  } catch {
    return new Set();
  }
}

export function saveChecked(caseId, checked) {
  try {
    if (checked.size === 0) localStorage.removeItem(key(caseId));
    else localStorage.setItem(key(caseId), JSON.stringify([...checked]));
  } catch {
    // Storage blocked: checkmarks last until the page is closed.
  }
}
