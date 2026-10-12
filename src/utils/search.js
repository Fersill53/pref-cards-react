function sectionText(section) {
  switch (section.type) {
    case 'pills':
      return [section.label, ...section.pills.map((p) => p.text)];
    case 'twoCol':
      return [section.label, ...section.columns.flatMap((col) => [col.label, col.content])];
    case 'table':
      return [section.label, ...section.headers, ...section.rows.flatMap((row) => row.cells)];
    default:
      return [section.label, section.content];
  }
}

const normalize = (parts) => parts.join(' ').replace(/\*/g, '').toLowerCase();

// Lower-cased text of everything on a card, plus its hidden keywords.
export function buildSearchText(c) {
  return normalize([c.keywords, c.name, c.tag.label, c.intro, ...c.sections.flatMap(sectionText)]);
}

// Title of the first section containing q (already lower-cased), or '' when the
// match is in the card's name, keywords or an untitled section.
export function matchedSection(c, q) {
  if (c.name.toLowerCase().includes(q)) return '';
  const hit = c.sections.find((s) => normalize(sectionText(s)).includes(q));
  return hit?.label ?? '';
}
