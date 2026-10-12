import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import DoctorPage from './components/DoctorPage.jsx';
import DoctorEditor from './components/DoctorEditor.jsx';
import { DEFAULT_SUBTITLE, cloneWithNewIds, newDoctor } from './data/factories.js';
import { doctorPath, homePath, navigate, useRoute } from './utils/route.js';
import { loadState, saveState } from './utils/storage.js';

export default function App() {
  const [state, setState] = useState(loadState);
  const [addingDoctor, setAddingDoctor] = useState(false);
  const route = useRoute();

  const { doctors } = state;
  // A link to a doctor that no longer exists falls back to the home page.
  const doctor =
    route.view === 'doctor' ? doctors.find((d) => d.id === route.doctorId) ?? null : null;

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    document.title = doctor ? `${doctor.name} — ${doctor.subtitle}` : DEFAULT_SUBTITLE;
    // Each doctor has their own accent colour (see [data-accent] in index.css).
    document.documentElement.dataset.accent = doctor?.accent ?? 'blue';
  }, [doctor?.name, doctor?.subtitle, doctor?.accent]);

  function updateDoctor(id, fn) {
    setState((s) => ({ ...s, doctors: s.doctors.map((d) => (d.id === id ? fn(d) : d)) }));
  }

  function addDoctor({ copyFromId, ...fields }) {
    const source = doctors.find((d) => d.id === copyFromId);
    const created = source ? { ...cloneWithNewIds(source), ...fields } : newDoctor(fields);
    setState((s) => ({ ...s, doctors: [...s.doctors, created] }));
    setAddingDoctor(false);
    navigate(doctorPath(created.id));
  }

  function deleteDoctor(id) {
    setState((s) => ({ ...s, doctors: s.doctors.filter((d) => d.id !== id) }));
    navigate(homePath);
  }

  return (
    <>
      {doctor ? (
        // key gives each doctor (and each "open this card" link) a fresh page
        <DoctorPage
          key={`${doctor.id}/${route.caseId ?? ''}`}
          doctor={doctor}
          doctors={doctors}
          initialOpenId={route.caseId}
          onUpdate={(fn) => updateDoctor(doctor.id, fn)}
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
