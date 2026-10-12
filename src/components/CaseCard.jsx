const BLOCK_CLASS = {
  note: 'note-block',
  warn: 'warn-block',
  danger: 'danger-block',
};

function Pill({ pill }) {
  const { text, variant } = typeof pill === 'string' ? { text: pill } : pill;
  return <span className={variant ? `pill ${variant}` : 'pill'}>{text}</span>;
}

function SectionContent({ section }) {
  switch (section.type) {
    case 'pills':
      return (
        <div className="pill-row">
          {section.items.map((pill, i) => (
            <Pill key={i} pill={pill} />
          ))}
        </div>
      );
    case 'twoCol':
      return (
        <div className="two-col">
          {section.items.map((item) => (
            <div key={item.label}>
              <div className="mini-label">{item.label}</div>
              <div className="note-block small">{item.content}</div>
            </div>
          ))}
        </div>
      );
    default:
      return <div className={BLOCK_CLASS[section.type]}>{section.content}</div>;
  }
}

export default function CaseCard({ data, open, onToggle }) {
  const { name, tag, intro, sections } = data;

  function handleKeyDown(e) {
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
          <span className={`case-tag tag-${tag.kind}`}>{tag.label}</span>
          <span className="case-name">{name}</span>
        </div>
        <span className="case-chevron">▼</span>
      </div>
      {open && (
        <div className="case-body">
          {intro && <div className="note-block small intro">{intro}</div>}
          {sections.map((section, i) => (
            <div className="section" key={i}>
              {section.label && <div className="section-label">{section.label}</div>}
              <SectionContent section={section} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
