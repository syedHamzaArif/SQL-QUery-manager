import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnXh7ucGEaJ3S4ocB6TmriSRa-D_8Hgeg",
  authDomain: "sql-query-manager.firebaseapp.com",
  projectId: "sql-query-manager",
  storageBucket: "sql-query-manager.appspot.com",
  messagingSenderId: "321918697451",
  appId: "1:321918697451:web:51b911384e108dc3fa23ae",
  measurementId: "G-430CY3J9YG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();

// if (typeof window != "undefined") {
// export const analytics = getAnalytics(app);
// }
