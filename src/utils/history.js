// Helpers for undo and version history.

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function isSameDoctor(a, b) {
  return same(a, b);
}

// One line describing what changed between two versions of a doctor,
// e.g. 'Edited “TLIF”, Deleted “Kyphoplasty”'.
export function describeChange(prev, next) {
  const parts = [];
  if (prev.name !== next.name || prev.subtitle !== next.subtitle || prev.accent !== next.accent) {
    parts.push('Edited surgeon details');
  }
  if (!same(prev.globalNotes, next.globalNotes)) parts.push('Edited global preferences');

  const before = new Map(prev.cases.map((c) => [c.id, c]));
  const after = new Map(next.cases.map((c) => [c.id, c]));
  for (const c of next.cases) {
    if (!before.has(c.id)) parts.push(`Added “${c.name}”`);
    else if (!same(before.get(c.id), c)) parts.push(`Edited “${c.name}”`);
  }
  for (const c of prev.cases) {
    if (!after.has(c.id)) parts.push(`Deleted “${c.name}”`);
  }
  if (parts.length === 0 && !same(prev.cases.map((c) => c.id), next.cases.map((c) => c.id))) {
    parts.push('Reordered cases');
  }

  if (parts.length > 3) return `${parts.slice(0, 3).join(', ')} and ${parts.length - 3} more`;
  return parts.join(', ') || 'Saved changes';
}

// "Today 2:14 PM", "Yesterday 9:05 AM", "Oct 3, 4:40 PM"
export function formatWhen(timestamp) {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return `Today ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`;
  const day = date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  });
  return `${day}, ${time}`;
}
