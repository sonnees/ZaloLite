import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDoNpR_1s0ey2ON3km_scFTffMEtGOf7YI",
  authDomain: "bang-2e904.firebaseapp.com",
  projectId: "bang-2e904",
  storageBucket: "bang-2e904.appspot.com",
  messagingSenderId: "1035224171288",
  appId: "1:1035224171288:web:fc6af3b47faea07498146d",
  measurementId: "G-7F4YN9FE8M"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}