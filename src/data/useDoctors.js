import { useEffect, useRef, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase.js';
import { loadState, normalizeDoctor, saveState } from '../utils/storage.js';
import { describeChange, isSameDoctor } from '../utils/history.js';

// Both versions return:
//   doctors           every doctor, in display order
//   ready, error
//   saveDoctor(doctor, summary?)   adds the doctor if its id is new, otherwise replaces it
//   removeDoctor(id)               deletes a doctor (cloud: moves it to the trash)
//   undeleteDoctor(doctor)         puts a deleted doctor back
//   historySupported               whether the next three exist
//   listVersions(id)               promise of that doctor's earlier versions, newest first
//   deletedDoctors                 trash: [{ id, deletedAt, doctor }], newest first

// How many earlier versions each doctor keeps, and how long deleted doctors stay
// in the trash before they're removed for good.
const MAX_VERSIONS = 30;
const TRASH_DAYS = 30;

// Cards live in Firestore, shared by everyone: one document per doctor in the
// "doctors" collection, kept up to date live. Two people editing the same
// doctor at the same moment: the last save wins.
//
// Every save first copies the doctor as it was into doctors/<id>/versions, so any
// change can be rolled back. Deleted doctors go to "deletedDoctors" (the trash).
function useCloudDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [deletedDoctors, setDeletedDoctors] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  // Latest doctors for saveDoctor to diff against, without re-creating callbacks.
  const doctorsRef = useRef([]);

  useEffect(() => {
    let unsubscribers = [];
    let cancelled = false;

    seedIfEmpty()
      .catch(setError)
      .finally(() => {
        if (cancelled) return;
        unsubscribers = [
          onSnapshot(
            collection(db, 'doctors'),
            (snapshot) => {
              const list = snapshot.docs.map((d) => normalizeDoctor(d.data()));
              list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              doctorsRef.current = list;
              setDoctors(list);
              setReady(true);
            },
            setError
          ),
          onSnapshot(
            collection(db, 'deletedDoctors'),
            (snapshot) => {
              const cutoff = Date.now() - TRASH_DAYS * 24 * 60 * 60 * 1000;
              const list = [];
              for (const d of snapshot.docs) {
                const entry = d.data();
                if (entry.deletedAt < cutoff) deleteDoc(d.ref).catch(() => {});
                else list.push({ id: d.id, ...entry });
              }
              setDeletedDoctors(list.sort((a, b) => b.deletedAt - a.deletedAt));
            },
            setError
          ),
        ];
      });

    return () => {
      cancelled = true;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  function saveDoctor(doctor, summary) {
    const prev = doctorsRef.current.find((d) => d.id === doctor.id);
    if (prev && isSameDoctor(prev, doctor)) return;

    const batch = writeBatch(db);
    batch.set(doc(db, 'doctors', doctor.id), doctor);
    if (prev) {
      batch.set(doc(versionsOf(doctor.id)), {
        savedAt: Date.now(),
        summary: summary ?? describeChange(prev, doctor),
        doctor: prev,
      });
    }
    batch
      .commit()
      .then(() => pruneVersions(doctor.id))
      .catch(setError);
  }

  function removeDoctor(id) {
    const prev = doctorsRef.current.find((d) => d.id === id);
    if (!prev) return;
    const batch = writeBatch(db);
    batch.set(doc(db, 'deletedDoctors', id), { deletedAt: Date.now(), doctor: prev });
    batch.delete(doc(db, 'doctors', id));
    batch.commit().catch(setError);
  }

  function undeleteDoctor(doctor) {
    const batch = writeBatch(db);
    batch.set(doc(db, 'doctors', doctor.id), doctor);
    batch.delete(doc(db, 'deletedDoctors', doctor.id));
    batch.commit().catch(setError);
  }

  async function listVersions(id) {
    const snapshot = await getDocs(
      query(versionsOf(id), orderBy('savedAt', 'desc'), limit(MAX_VERSIONS))
    );
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  return {
    doctors,
    ready,
    error,
    saveDoctor,
    removeDoctor,
    undeleteDoctor,
    historySupported: true,
    listVersions,
    deletedDoctors,
  };
}

const versionsOf = (doctorId) => collection(db, 'doctors', doctorId, 'versions');

async function pruneVersions(doctorId) {
  const snapshot = await getDocs(query(versionsOf(doctorId), orderBy('savedAt', 'desc')));
  await Promise.all(snapshot.docs.slice(MAX_VERSIONS).map((d) => deleteDoc(d.ref)));
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

// No Firebase configured: cards are saved in this browser only. Undo works;
// version history and the trash are cloud-only.
function useLocalDoctors() {
  const [state, setState] = useState(loadState);

  useEffect(() => saveState(state), [state]);

  const saveDoctor = (doctor) =>
    setState((s) => ({
      ...s,
      doctors: s.doctors.some((d) => d.id === doctor.id)
        ? s.doctors.map((d) => (d.id === doctor.id ? doctor : d))
        : [...s.doctors, doctor],
    }));

  return {
    doctors: state.doctors,
    ready: true,
    error: null,
    saveDoctor,
    removeDoctor: (id) =>
      setState((s) => ({ ...s, doctors: s.doctors.filter((d) => d.id !== id) })),
    undeleteDoctor: saveDoctor,
    historySupported: false,
    listVersions: null,
    deletedDoctors: [],
  };
}

export const useDoctors = db ? useCloudDoctors : useLocalDoctors;
