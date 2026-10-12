import { homePath } from '../utils/route.js';

export default function Header({
  doctors,
  currentId,
  subtitle,
  caseCount,
  query,
  onQueryChange,
  onSelectDoctor,
  onEditDoctor,
  onAddDoctor,
}) {
  return (
    <header>
      <div className="header-left">
        <div className="doctor-row">
          <a className="btn btn-sm home-link" href={homePath} aria-label="Home" title="Home">
            ← Home
          </a>
          <select
            className="doctor-select"
            aria-label="Doctor"
            value={currentId}
            onChange={(e) => onSelectDoctor(e.target.value)}
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-sm" onClick={onEditDoctor}>
            Edit
          </button>
          <button type="button" className="btn btn-sm" onClick={onAddDoctor}>
            + Doctor
          </button>
        </div>
        <p>
          {subtitle} · {caseCount} {caseCount === 1 ? 'case' : 'cases'}
        </p>
      </div>
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Search cases, drugs, sutures…"
          autoComplete="off"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </header>
  );
}
