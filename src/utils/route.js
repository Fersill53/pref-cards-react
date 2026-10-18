import { useEffect, useState } from 'react';

// The page is chosen by the URL hash, so the browser's back button works:
//   #/                          home
//   #/doctor/<id>               one doctor's cards
//   #/doctor/<id>/<caseId>      the same, with that card opened
//   #/doctor/<id>/<caseId>/pick that card's pick list
export const homePath = '#/';
export const doctorPath = (doctorId, caseId) =>
  caseId ? `#/doctor/${doctorId}/${caseId}` : `#/doctor/${doctorId}`;
export const pickListPath = (doctorId, caseId) => `#/doctor/${doctorId}/${caseId}/pick`;

function parse(hash) {
  const [section, doctorId, caseId, mode] = hash.replace(/^#\/?/, '').split('/');
  if (section === 'doctor' && doctorId && caseId && mode === 'pick') {
    return { view: 'pick', doctorId, caseId };
  }
  if (section === 'doctor' && doctorId) {
    return { view: 'doctor', doctorId, caseId: caseId ?? null };
  }
  return { view: 'home' };
}

export function navigate(path) {
  window.location.hash = path;
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
