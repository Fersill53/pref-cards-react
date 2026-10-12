import RichText from './RichText.jsx';

const BLOCK_CLASS = {
  note: 'note-block',
  warn: 'warn-block',
  danger: 'danger-block',
  info: 'info-block',
};

const STATUS = /^(OPEN|HOLD)(?=$|\s)/;

// A cell starting with OPEN or HOLD shows that word as a status badge.
function Cell({ text }) {
  const match = STATUS.exec(text ?? '');
  if (!match) return <RichText text={text} />;
  const status = match[1];
  return (
    <>
      <span className={`status-${status.toLowerCase()}`}>{status}</span>
      <RichText text={text.slice(status.length)} />
    </>
  );
}

function PrefTable({ headers, rows }) {
  return (
    <table className="pref-table">
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className={row.tone ? `${row.tone}-row` : undefined}>
            {headers.map((_, i) => (
              <td key={i}>
                <Cell text={row.cells[i]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SectionContent({ section }) {
  switch (section.type) {
    case 'pills':
      return (
        <div className="pill-row">
          {section.pills.map((pill) => (
            <span key={pill.id} className={pill.variant ? `pill ${pill.variant}` : 'pill'}>
              {pill.text}
            </span>
          ))}
        </div>
      );
    case 'twoCol':
      return (
        <div className="two-col">
          {section.columns.map((col) => (
            <div key={col.id}>
              <div className="mini-label">{col.label}</div>
              <div className="note-block small">
                <RichText text={col.content} />
              </div>
            </div>
          ))}
        </div>
      );
    case 'table':
      return <PrefTable headers={section.headers} rows={section.rows} />;
    default:
      return (
        <div className={BLOCK_CLASS[section.type]}>
          <RichText text={section.content} />
        </div>
      );
  }
}

export default function CaseCard({ data, open, onToggle, onEdit }) {
  const { name, tag, draft, intro, sections } = data;

  function handleKeyDown(e) {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <div id={`case-${data.id}`} className={open ? 'case-card open' : 'case-card'}>
      <div
        className="case-header"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
      >
        <div className="case-title-row">
          {(tag.label || draft) && (
            <div className="case-badges">
              {tag.label && <span className={`case-tag tag-${tag.kind}`}>{tag.label}</span>}
              {draft && <span className="draft-badge">DRAFT</span>}
            </div>
          )}
          <span className="case-name">{name}</span>
        </div>
        <div className="case-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            Edit
          </button>
          <span className="case-chevron">▼</span>
        </div>
      </div>
      {open && (
        <div className="case-body">
          {intro && (
            <div className="note-block small intro">
              <RichText text={intro} />
            </div>
          )}
          {sections.length === 0 && !intro && (
            <p className="empty-hint">Nothing on this card yet — use Edit to add sections.</p>
          )}
          {sections.map((section) => (
            <div className="section" key={section.id}>
              {section.label && <div className="section-label">{section.label}</div>}
              <SectionContent section={section} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
