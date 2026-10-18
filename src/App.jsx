import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import DoctorPage from './components/DoctorPage.jsx';
import DoctorEditor from './components/DoctorEditor.jsx';
import PickListPage from './components/PickListPage.jsx';
import { DEFAULT_SUBTITLE, cloneWithNewIds, newDoctor } from './data/factories.js';
import { useDoctors } from './data/useDoctors.js';
import { doctorPath, homePath, navigate, useRoute } from './utils/route.js';

export default function App() {
  const { doctors, ready, error, saveDoctor, removeDoctor } = useDoctors();
  const [addingDoctor, setAddingDoctor] = useState(false);
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

  function deleteDoctor(id) {
    removeDoctor(id);
    navigate(homePath);
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
          onUpdate={(fn) => saveDoctor(fn(doctor))}
          onDelete={() => deleteDoctor(doctor.id)}
          onAddDoctor={() => setAddingDoctor(true)}
        />
      ) : (
        <Home doctors={doctors} onAddDoctor={() => setAddingDoctor(true)} />
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
