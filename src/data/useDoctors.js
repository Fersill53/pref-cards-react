import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, runTransaction, setDoc } from 'firebase/firestore';
import { db } from './firebase.js';
import { loadState, normalizeDoctor, saveState } from '../utils/storage.js';

// Both versions return { doctors, ready, error, saveDoctor, removeDoctor }.
// saveDoctor adds the doctor if its id is new, otherwise replaces it.

// Cards live in Firestore, shared by everyone: one document per doctor in the
// "doctors" collection, kept up to date live. Two people editing the same
// doctor at the same moment: the last save wins.
function useCloudDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    seedIfEmpty()
      .catch(setError)
      .finally(() => {
        if (cancelled) return;
        unsubscribe = onSnapshot(
          collection(db, 'doctors'),
          (snapshot) => {
            const list = snapshot.docs.map((d) => normalizeDoctor(d.data()));
            setDoctors(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
            setReady(true);
          },
          setError
        );
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return {
    doctors,
    ready,
    error,
    saveDoctor: (doctor) => setDoc(doc(db, 'doctors', doctor.id), doctor).catch(setError),
    removeDoctor: (id) => deleteDoc(doc(db, 'doctors', id)).catch(setError),
  };
}

// The first browser to open the site against an empty database uploads its own
// cards (whatever it had saved locally, or the built-in doctors). meta/seed
// records that this happened so it never runs twice.
function seedIfEmpty() {
  const marker = doc(db, 'meta', 'seed');
  return runTransaction(db, async (tx) => {
    if ((await tx.get(marker)).exists()) return;
    loadState().doctors.forEach((doctor, order) => {
      tx.set(doc(db, 'doctors', doctor.id), { ...doctor, order });
    });
    tx.set(marker, { seededAt: Date.now() });
  });
}

// No Firebase configured: cards are saved in this browser only.
function useLocalDoctors() {
  const [state, setState] = useState(loadState);

  useEffect(() => saveState(state), [state]);

  return {
    doctors: state.doctors,
    ready: true,
    error: null,
    saveDoctor: (doctor) =>
      setState((s) => ({
        ...s,
        doctors: s.doctors.some((d) => d.id === doctor.id)
          ? s.doctors.map((d) => (d.id === doctor.id ? doctor : d))
          : [...s.doctors, doctor],
      })),
    removeDoctor: (id) =>
      setState((s) => ({ ...s, doctors: s.doctors.filter((d) => d.id !== id) })),
  };
}

export const useDoctors = db ? useCloudDoctors : useLocalDoctors;
