import Firebase from 'firebase';
import { FirebaseConfig } from './firebase-config';

Firebase.initializeApp(FirebaseConfig);
Firebase.auth();

export const FirebaseRef = Firebase.database().ref();
