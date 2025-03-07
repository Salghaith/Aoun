import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

const firebaseApp = initializeApp(firebaseConfig);

const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(firebaseApp);

export {firebaseApp, auth, db};
