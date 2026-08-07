import { firebaseConfig, firebaseConfigured } from "./firebase-config.js";

const SDK_VERSION = "12.1.0";
let servicesPromise = null;

export function isFirebaseConfigured() {
  return firebaseConfigured;
}

export async function getFirebaseServices() {
  if (!firebaseConfigured) {
    throw new Error("Firebase no está configurado.");
  }

  if (servicesPromise) {
    return servicesPromise;
  }

  servicesPromise = (async () => {
    const appModule = await import(
      `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app.js`
    );
    const firestoreModule = await import(
      `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-firestore.js`
    );
    const authModule = await import(
      `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-auth.js`
    );

    const app = appModule.initializeApp(firebaseConfig);

    return {
      app,
      db: firestoreModule.getFirestore(app),
      auth: authModule.getAuth(app),
      firestore: firestoreModule,
      authApi: authModule
    };
  })();

  return servicesPromise;
}
