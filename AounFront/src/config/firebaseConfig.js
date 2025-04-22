import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Ensure Firebase App is initialized (No need to call initializeApp manually)

const authInstance = auth(); // Just initialize auth normally

const db = firestore();

export {authInstance as auth, db};
