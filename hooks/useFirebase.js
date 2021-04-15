import { useState } from 'react';

/**
 * @typedef {import('firebase')} firebase
 *
 * @returns {{
 *  app: (name?: string) => Promise<firebase.app.App>
 *  auth: (app?: firebase.app.App) => Promise<firebase.auth.Auth>
 *  firestore: (app?: firebase.app.App) => Promise<firebase.firestore.Firestore>
 *  messaging: (app?: firebase.app.App) => Promise<firebase.messaging.Messaging>
 *  storage: (app?: firebase.app.App) => Promise<firebase.storage.Storage>
 * }}
 */
// export function useFirebase() {
//   const [firebase, setFirebase] = useState(null);

//   async function importFirebase() {
//     if (firebase) return firebase;

//     const firebaseModule = await import('../utils/firebase').then(
//       (m) => m.default
//     );

//     setFirebase(firebaseModule);

//     return firebaseModule;
//   }

//   const app = async (name) => (await importFirebase()).app(name);
//   const auth = async (app) => (await importFirebase()).auth(app);
//   const firestore = async (app) => (await importFirebase()).firestore(app);
//   const messaging = async (app) => (await importFirebase()).messaging(app);
//   const storage = async (app) => (await importFirebase()).storage(app);

//   return { app, auth, firestore, messaging, storage };
// }

const firebaseWorker = new Worker(
  // @ts-ignore
  new URL('../workers/firebase.worker.js', import.meta.url)
);

function auth() {
  return {
    signInWithEmailAndPassword(email, password) {
      firebaseWorker.postMessage({
        type: 'auth',
        method: 'signInWithEmailAndPassword',
        arguments: [email, password],
      });
    },

    signOut() {
      firebaseWorker.postMessage({
        type: 'auth',
        method: 'signOut',
      });
    },

    signInWithPopup(provider) {
      firebaseWorker.postMessage({
        type: 'auth',
        method: 'signInWithPopup',
        arguments: [provider],
      });
    },
  };
}
