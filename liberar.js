import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBclR3QgQ2It0sQiQkkLqM_GvLu49nKPQ",
  authDomain: "takepi-314.firebaseapp.com",
  projectId: "takepi-314",
  storageBucket: "takepi-314.firebasestorage.app",
  messagingSenderId: "81758083824",
  appId: "1:81758083824:web:1156ba4749288a73928035"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Simulación: liberar mesa 1
await setDoc(doc(db, "mesas", "mesa1"), { estado: "libre" });
