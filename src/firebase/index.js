import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALtJDJE-LQuuMKc8OVteAmpDv6x7YunI4",
  authDomain: "photo-app-d5ecd.firebaseapp.com",
  projectId: "photo-app-d5ecd",
  storageBucket: "photo-app-d5ecd.appspot.com",
  messagingSenderId: "938143577897",
  appId: "1:938143577897:web:0368689a7e164fe3672938",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore(app);

const storage = getStorage(app);

export { app as default, auth, db, storage };
