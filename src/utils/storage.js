import { createSeedDoctor } from '../data/seed.js';

const KEY = 'pref-cards:v1';

// State shape: { doctors: doctor[], currentId }
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const state = JSON.parse(raw);
      if (Array.isArray(state.doctors) && state.doctors.length > 0) return state;
    }
  } catch {
    // Unreadable or blocked storage: fall through to the seed data.
  }
  const doctor = createSeedDoctor();
  return { doctors: [doctor], currentId: doctor.id };
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the app keeps working for this visit.
  }
}
