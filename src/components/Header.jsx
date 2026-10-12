export default function Header({ surgeon, caseCount, query, onQueryChange }) {
  return (
    <header>
      <div className="header-left">
        <h1>{surgeon}</h1>
        <p>Surgical Preference Cards · {caseCount} cases</p>
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
