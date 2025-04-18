import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBBclR3QgQ2It0sQiQkkLqM_GvLu49nKPQ",
  authDomain: "takepi-314.firebaseapp.com",
  projectId: "takepi-314",
  storageBucket: "takepi-314.appspot.com",
  messagingSenderId: "81758083824",
  appId: "1:81758083824:web:1156ba4749288a73928035"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Crear 10 mesas con padding
const crearMesas = async () => {
  for (let i = 1; i <= 10; i++) {
    const id = `mesa${String(i).padStart(2, "0")}`;
    await setDoc(doc(db, "mesas", id), { estado: "libre" });
    console.log(`Mesa ${id} creada`);
  }
  alert("¡10 mesas creadas correctamente con IDs ordenados!");
};

crearMesas();
