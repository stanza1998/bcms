import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken } from "firebase/messaging";

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
export const messaging = getMessaging(app);


getToken(messaging, { vapidKey: "BD4sFuoqXshWQ2vp3ETxwPjfmLbdxyw3vr7dIHrOaYPmbAh7GjrkKcX8G1gKOpjLsWo3_SYbj7xc0b-TAOyH150" }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});
