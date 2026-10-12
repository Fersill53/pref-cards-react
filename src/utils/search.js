// Flattens a React node (string, element, array) into its plain text.
export function nodeText(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join(' ');
  if (node.props) return nodeText(node.props.children);
  return '';
}

function sectionText(section) {
  const parts = [section.label ?? ''];
  switch (section.type) {
    case 'pills':
      parts.push(...section.items.map((p) => (typeof p === 'string' ? p : p.text)));
      break;
    case 'twoCol':
      section.items.forEach((item) => parts.push(item.label, nodeText(item.content)));
      break;
    default:
      parts.push(nodeText(section.content));
  }
  return parts.join(' ');
}

export function buildSearchText(c) {
  return [
    c.keywords,
    c.name,
    c.tag.label,
    nodeText(c.intro),
    ...c.sections.map(sectionText),
  ]
    .join(' ')
    .toLowerCase();
}
