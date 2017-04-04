import Firebase from 'firebase';
import FirebaseConfig from './firebase.json';

export { Firebase };

Firebase.initializeApp(FirebaseConfig);
Firebase.auth();

export const FirebaseRef = Firebase.database().ref();
export const firebaseAuth = Firebase.auth
