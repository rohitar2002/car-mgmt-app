import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXXAnkKCc8vDCzp84u3eIxPxU1Uwbh798",
  authDomain: "car-finance-mgmt-app.firebaseapp.com",
  projectId: "car-finance-mgmt-app",
  storageBucket: "car-finance-mgmt-app.firebasestorage.app",
  messagingSenderId: "964657361506",
  appId: "1:964657361506:web:cc0fdffc39a90e7153973b"
};

const app = getApps().length == 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const firestore = getFirestore(app);


export { app, auth, firestore };