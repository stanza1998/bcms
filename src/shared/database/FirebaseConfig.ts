import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgOSEMvtfbfcAu2MW7-J2IuFhCIBegv_w",
  authDomain: "vanwylbcms.firebaseapp.com",
  projectId: "vanwylbcms",
  storageBucket: "vanwylbcms.appspot.com",
  messagingSenderId: "145332773601",
  appId: "1:145332773601:web:9e81c3d75b47f4f779cda0",
  measurementId: "G-J62X65ENWV",
};

const app = initializeApp(firebaseConfig);
const firebaseAuthworkerApp = initializeApp(firebaseConfig, "authWorker");

export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const authWorker = getAuth(firebaseAuthworkerApp);
export const timestamp = Timestamp;
