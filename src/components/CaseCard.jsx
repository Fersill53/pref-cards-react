import RichText from './RichText.jsx';

const BLOCK_CLASS = {
  note: 'note-block',
  warn: 'warn-block',
  danger: 'danger-block',
};

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
    default:
      return (
        <div className={BLOCK_CLASS[section.type]}>
          <RichText text={section.content} />
        </div>
      );
  }
}

export default function CaseCard({ data, open, onToggle, onEdit }) {
  const { name, tag, intro, sections } = data;

  function handleKeyDown(e) {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <div className={open ? 'case-card open' : 'case-card'}>
      <div
        className="case-header"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
      >
        <div className="case-title-row">
          {tag.label && <span className={`case-tag tag-${tag.kind}`}>{tag.label}</span>}
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
