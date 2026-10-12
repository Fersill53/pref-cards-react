function sectionText(section) {
  switch (section.type) {
    case 'pills':
      return [section.label, ...section.pills.map((p) => p.text)];
    case 'twoCol':
      return [section.label, ...section.columns.flatMap((col) => [col.label, col.content])];
    default:
      return [section.label, section.content];
  }
}

// Lower-cased text of everything on a card, plus its hidden keywords.
export function buildSearchText(c) {
  return [c.keywords, c.name, c.tag.label, c.intro, ...c.sections.flatMap(sectionText)]
    .join(' ')
    .replace(/\*/g, '')
    .toLowerCase();
}
