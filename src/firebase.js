

import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBPwtP1RTMkif_Kq-lvgzdHClWiPwPDZ6g',
  authDomain: 'scorescope-49a24.firebaseapp.com',
  projectId: 'scorescope-49a24',
  storageBucket: 'scorescope-49a24.appspot.com',
  messagingSenderId: '1013730826095',
  appId: '1:1013730826095:web:5a1a6b3837c05a4ad77a9a',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export default app;
