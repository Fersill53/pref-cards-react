import { useMemo, useState } from 'react';
import { doctorPath, navigate } from '../utils/route.js';
import { buildSearchText, matchedSection } from '../utils/search.js';

const MAX_RESULTS = 30;

// "Dr. Ponce De Leon" -> "PD"
function initials(name) {
  const words = name.split(/\s+/).filter((w) => w && !/^dr\.?$/i.test(w));
  return (words.length ? words : [name])
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// [{ label, kind, count }] for a doctor's cases, most common first.
function tagCounts(cases) {
  const counts = new Map();
  for (const { tag } of cases) {
    if (!tag.label) continue;
    const key = `${tag.kind}/${tag.label}`;
    const entry = counts.get(key) ?? { ...tag, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function CaseLink({ doctor, c, detail }) {
  return (
    <a className="result-row" href={doctorPath(doctor.id, c.id)} data-accent={doctor.accent}>
      <span className="result-main">
        {c.tag.label && <span className={`case-tag tag-${c.tag.kind}`}>{c.tag.label}</span>}
        <span className="case-name">{c.name}</span>
        {c.draft && <span className="draft-badge">DRAFT</span>}
      </span>
      <span className="result-meta">
        {detail && <span className="result-detail">{detail}</span>}
        <span className="result-doctor">{doctor.name}</span>
      </span>
    </a>
  );
}

export default function Home({ doctors, onAddDoctor }) {
  const [query, setQuery] = useState('');

  // Every case from every doctor, with its searchable text.
  const allCases = useMemo(
    () =>
      doctors.flatMap((doctor) =>
        doctor.cases.map((c) => ({
          doctor,
          c,
          text: `${buildSearchText(c)} ${doctor.name.toLowerCase()}`,
        }))
      ),
    [doctors]
  );

  const q = query.toLowerCase().trim();
  const matches = q ? allCases.filter((entry) => entry.text.includes(q)) : [];
  const results = matches.slice(0, MAX_RESULTS);
  const drafts = allCases.filter((entry) => entry.c.draft);

  function handleSubmit(e) {
    e.preventDefault();
    if (results.length > 0) navigate(doctorPath(results[0].doctor.id, results[0].c.id));
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">OR reference · {plural(doctors.length, 'surgeon')}</div>
          <h1 className="hero-title">Surgical Preference Cards</h1>
          <p className="hero-sub">
            Every surgeon&rsquo;s setup, one search away. Find a procedure, an instrument or a
            suture across all cards.
          </p>

          <form className="hero-search" onSubmit={handleSubmit}>
            <span className="search-icon">⌕</span>
            <input
              type="text"
              autoFocus
              autoComplete="off"
              placeholder="Search all cards — vicryl, C-arm, TLIF…"
              aria-label="Search all cards"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">{doctors.length}</span>
              <span className="stat-label">{doctors.length === 1 ? 'Surgeon' : 'Surgeons'}</span>
            </div>
            <div className="stat">
              <span className="stat-num">{allCases.length}</span>
              <span className="stat-label">{allCases.length === 1 ? 'Case' : 'Cases'}</span>
            </div>
            <div className="stat">
              <span className={drafts.length ? 'stat-num warn' : 'stat-num'}>{drafts.length}</span>
              <span className="stat-label">{drafts.length === 1 ? 'Draft' : 'Drafts'} to review</span>
            </div>
          </div>
        </div>
      </section>

      <div className="home-body">
        {q ? (
          <section>
            <h2 className="home-heading">
              {matches.length === 0
                ? 'No matches'
                : `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}${
                    matches.length > MAX_RESULTS ? ` — showing the first ${MAX_RESULTS}` : ''
                  }`}
            </h2>
            {matches.length === 0 ? (
              <p className="no-results">Nothing on any card matches “{query.trim()}”.</p>
            ) : (
              <div className="result-list">
                {results.map(({ doctor, c }) => {
                  const section = matchedSection(c, q);
                  return (
                    <CaseLink
                      key={c.id}
                      doctor={doctor}
                      c={c}
                      detail={section && `in ${section}`}
                    />
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <>
            <section>
              <h2 className="home-heading">Surgeons</h2>
              <div className="doctor-grid">
                {doctors.map((doctor) => {
                  const draftCount = doctor.cases.filter((c) => c.draft).length;
                  return (
                    <a
                      key={doctor.id}
                      className="doctor-tile"
                      href={doctorPath(doctor.id)}
                      data-accent={doctor.accent}
                    >
                      <div className="tile-top">
                        <span className="monogram">{initials(doctor.name)}</span>
                        <div className="tile-id">
                          <div className="tile-name">{doctor.name}</div>
                          <div className="tile-sub">{doctor.subtitle}</div>
                        </div>
                      </div>
                      <div className="tile-tags">
                        {tagCounts(doctor.cases).map((tag) => (
                          <span key={`${tag.kind}/${tag.label}`} className={`case-tag tag-${tag.kind}`}>
                            {tag.label} · {tag.count}
                          </span>
                        ))}
                        {draftCount > 0 && (
                          <span className="draft-badge">{plural(draftCount, 'draft')}</span>
                        )}
                      </div>
                      <div className="tile-foot">
                        <span>
                          {plural(doctor.cases.length, 'case')} ·{' '}
                          {plural(doctor.globalNotes.length, 'global preference')}
                        </span>
                        <span className="tile-open">Open cards →</span>
                      </div>
                    </a>
                  );
                })}
                <button type="button" className="add-card doctor-add" onClick={onAddDoctor}>
                  + Add surgeon
                </button>
              </div>
            </section>

            {drafts.length > 0 && (
              <section>
                <h2 className="home-heading">Drafts awaiting surgeon review</h2>
                <div className="result-list">
                  {drafts.map(({ doctor, c }) => (
                    <CaseLink key={c.id} doctor={doctor} c={c} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
