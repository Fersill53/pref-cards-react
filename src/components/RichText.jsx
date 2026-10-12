import { Fragment } from 'react';

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

function renderPart(part, key) {
  if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
    return <strong key={key}>{part.slice(2, -2)}</strong>;
  }
  if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
    return <em key={key}>{part.slice(1, -1)}</em>;
  }
  return part;
}

// Renders plain text with **bold**, *italic* and line breaks.
export default function RichText({ text }) {
  return (text ?? '').split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(TOKEN).map(renderPart)}
    </Fragment>
  ));
}
