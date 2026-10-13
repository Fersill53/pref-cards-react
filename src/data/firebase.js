import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig.js';

// null until firebaseConfig.js is filled in.
export const db = firebaseConfig
  ? initializeFirestore(initializeApp(firebaseConfig), {
      // Keeps a copy on the device so cards still open with no connection;
      // edits made offline are sent when the connection returns.
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      ignoreUndefinedProperties: true,
    })
  : null;
