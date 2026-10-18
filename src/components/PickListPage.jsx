import { useEffect, useMemo, useState } from 'react';
import { doctorPath } from '../utils/route.js';
import { buildPickList, loadChecked, saveChecked } from '../utils/pickList.js';

// Full-screen checklist of what to pull for one case. Checkmarks stay on this
// phone until Reset is pressed.
export default function PickListPage({ doctor, c }) {
  const groups = useMemo(() => buildPickList(c), [c]);
  const [checked, setChecked] = useState(() => loadChecked(c.id));
  const [hideChecked, setHideChecked] = useState(false);

  useEffect(() => saveChecked(c.id, checked), [c.id, checked]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Ignore checkmarks left over for items that have since been removed from the card.
  const allIds = groups.flatMap((g) => g.sections.flatMap((s) => s.items.map((item) => item.id)));
  const total = allIds.length;
  const done = allIds.filter((id) => checked.has(id)).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  function toggle(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    if (done === 0 || window.confirm('Clear all checkmarks and start this pick list again?')) {
      setChecked(new Set());
    }
  }

  return (
    <div className="pick-page">
      <header className="pick-header">
        <div className="pick-header-row">
          <a className="btn btn-sm" href={doctorPath(doctor.id, c.id)}>
            ← Card
          </a>
          <div className="pick-title">
            <div className="pick-case">{c.name}</div>
            <div className="pick-doctor">{doctor.name} · Pick list</div>
          </div>
          <button type="button" className="btn btn-sm btn-danger" onClick={reset}>
            Reset
          </button>
        </div>
        {total > 0 && (
          <div className="pick-progress-row">
            <div
              className="pick-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={done}
              aria-label="Items pulled"
            >
              <div className="pick-progress-bar" style={{ width: `${percent}%` }} />
            </div>
            <span className={done === total ? 'pick-count complete' : 'pick-count'}>
              {done === total ? `All ${total} pulled ✓` : `${done} of ${total} pulled`}
            </span>
            <label className="check pick-hide">
              <input
                type="checkbox"
                checked={hideChecked}
                onChange={(e) => setHideChecked(e.target.checked)}
              />
              Hide pulled
            </label>
          </div>
        )}
      </header>

      <main className="pick-main">
        {total === 0 && (
          <p className="no-results">
            Nothing on this card is on the pick list yet. Edit the card and turn on “Include in
            pick list” for its instrument and supply sections.
          </p>
        )}

        {groups.map((group) => (
          <section key={group.status} className={`pick-group ${group.status}`}>
            <h2 className="pick-group-title">
              <span className="pick-dot" />
              {group.title}
              <span className="pick-group-count">{group.count}</span>
            </h2>
            {group.sections.map((section) => {
              const items = hideChecked
                ? section.items.filter((item) => !checked.has(item.id))
                : section.items;
              if (items.length === 0) return null;
              return (
                <div key={section.id} className="pick-section">
                  {section.label && <div className="section-label">{section.label}</div>}
                  <ul className="pick-items">
                    {items.map((item) => (
                      <li key={item.id}>
                        <label className={checked.has(item.id) ? 'pick-item done' : 'pick-item'}>
                          <input
                            type="checkbox"
                            checked={checked.has(item.id)}
                            onChange={() => toggle(item.id)}
                          />
                          <span className="pick-box" aria-hidden="true" />
                          <span className="pick-text">
                            <span className="pick-name">{item.name}</span>
                            {item.detail && <span className="pick-detail">{item.detail}</span>}
                          </span>
                          {item.qty && item.qty !== '—' && (
                            <span className="pick-qty">×{item.qty}</span>
                          )}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        ))}
      </main>
    </div>
  );
}
