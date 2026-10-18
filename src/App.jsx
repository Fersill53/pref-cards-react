import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import DoctorPage from './components/DoctorPage.jsx';
import DoctorEditor from './components/DoctorEditor.jsx';
import PickListPage from './components/PickListPage.jsx';
import Toast from './components/Toast.jsx';
import { DEFAULT_SUBTITLE, cloneWithNewIds, newDoctor } from './data/factories.js';
import { useDoctors } from './data/useDoctors.js';
import { formatWhen } from './utils/history.js';
import { normalizeDoctor } from './utils/storage.js';
import { doctorPath, homePath, navigate, useRoute } from './utils/route.js';

export default function App() {
  const store = useDoctors();
  const { doctors, ready, error, saveDoctor } = store;
  const [addingDoctor, setAddingDoctor] = useState(false);
  // { message, undo? } for the bar at the bottom of the screen; id restarts its timer.
  const [toast, setToast] = useState(null);
  const route = useRoute();

  // A link to a doctor that no longer exists falls back to the home page.
  const doctor =
    route.view === 'home' ? null : doctors.find((d) => d.id === route.doctorId) ?? null;
  const pickCase =
    route.view === 'pick' ? doctor?.cases.find((c) => c.id === route.caseId) ?? null : null;

  useEffect(() => {
    document.title = doctor ? `${doctor.name} — ${doctor.subtitle}` : DEFAULT_SUBTITLE;
    // Each doctor has their own accent colour (see [data-accent] in index.css).
    document.documentElement.dataset.accent = doctor?.accent ?? 'blue';
  }, [doctor?.name, doctor?.subtitle, doctor?.accent]);

  function showToast(message, undo) {
    setToast({ id: Date.now(), message, undo });
  }

  // Saves a change to a doctor and offers to undo it.
  function changeDoctor(prev, next, message, summary) {
    saveDoctor(next, summary);
    showToast(message, () => saveDoctor(prev, `Undo: ${message}`));
  }

  function restoreVersion(version) {
    const restored = { ...normalizeDoctor(version.doctor), id: doctor.id };
    changeDoctor(
      doctor,
      restored,
      `Restored to before: ${version.summary}`,
      `Restored to before: ${version.summary} (${formatWhen(version.savedAt)})`
    );
  }

  function addDoctor({ copyFromId, ...fields }) {
    const source = doctors.find((d) => d.id === copyFromId);
    // order puts the newest doctor last
    const created = {
      ...(source ? cloneWithNewIds(source) : newDoctor()),
      ...fields,
      order: Date.now(),
    };
    saveDoctor(created);
    setAddingDoctor(false);
    navigate(doctorPath(created.id));
  }

  function deleteDoctor(target) {
    store.removeDoctor(target.id);
    navigate(homePath);
    showToast(`Deleted ${target.name}`, () => store.undeleteDoctor(target));
  }

  function restoreDeleted(entry) {
    store.undeleteDoctor(normalizeDoctor(entry.doctor));
    showToast(`Restored ${entry.doctor.name}`);
  }

  if (!ready) {
    return (
      <div className="app-status">
        {error ? (
          <>
            <strong>Couldn&rsquo;t load the cards.</strong>
            <span>Check your connection and reload the page.</span>
          </>
        ) : (
          'Loading cards…'
        )}
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="sync-error" role="alert">
          Couldn&rsquo;t reach the shared database — recent changes may not be saved.
        </div>
      )}

      {pickCase ? (
        <PickListPage doctor={doctor} c={pickCase} />
      ) : doctor ? (
        // key gives each doctor (and each "open this card" link) a fresh page
        <DoctorPage
          key={`${doctor.id}/${route.caseId ?? ''}`}
          doctor={doctor}
          doctors={doctors}
          initialOpenId={route.caseId}
          onUpdate={(fn, message) => changeDoctor(doctor, fn(doctor), message)}
          onDelete={() => deleteDoctor(doctor)}
          historySupported={store.historySupported}
          listVersions={store.historySupported ? () => store.listVersions(doctor.id) : null}
          onRestoreVersion={restoreVersion}
        />
      ) : (
        <Home
          doctors={doctors}
          deletedDoctors={store.deletedDoctors}
          onAddDoctor={() => setAddingDoctor(true)}
          onRestoreDeleted={restoreDeleted}
        />
      )}

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          onUndo={toast.undo}
          onClose={() => setToast(null)}
        />
      )}

      {addingDoctor && (
        <DoctorEditor
          doctor={null}
          doctors={doctors}
          onSave={addDoctor}
          onClose={() => setAddingDoctor(false)}
        />
      )}
    </>
  );
}
