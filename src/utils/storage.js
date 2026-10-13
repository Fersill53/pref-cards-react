import { DEFAULT_SUBTITLE } from '../data/factories.js';
import { createSeedDoctor } from '../data/seed.js';
import { createLiuDoctor } from '../data/seedLiu.js';

const KEY = 'pref-cards:v1';

// Built-in doctors. Each is added once per browser; appliedSeeds remembers which
// ones already were, so a doctor the user deleted doesn't come back.
const SEEDS = [
  ['barkoh', createSeedDoctor],
  ['liu', createLiuDoctor],
];

// Fills in fields that didn't exist when the data was saved.
export function normalizeDoctor(doctor) {
  return {
    subtitle: DEFAULT_SUBTITLE,
    accent: 'blue',
    ...doctor,
    cases: doctor.cases.map((c) => ({
      draft: false,
      ...c,
      sections: c.sections.map((s) => ({ headers: [], rows: [], ...s })),
    })),
  };
}

// State shape: { doctors: doctor[], currentId, appliedSeeds: string[] }
export function loadState() {
  let state = { doctors: [], currentId: null, appliedSeeds: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Array.isArray(saved.doctors) && saved.doctors.length > 0) {
      state = {
        doctors: saved.doctors.map(normalizeDoctor),
        currentId: saved.currentId,
        // Data saved before seeds were tracked only ever had the first one.
        appliedSeeds: saved.appliedSeeds ?? ['barkoh'],
      };
    }
  } catch {
    // Unreadable or blocked storage: fall through to the seed data.
  }

  for (const [key, create] of SEEDS) {
    if (state.appliedSeeds.includes(key)) continue;
    state.doctors.push(create());
    state.appliedSeeds.push(key);
  }
  state.currentId ??= state.doctors[0].id;
  return state;
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the app keeps working for this visit.
  }
}
