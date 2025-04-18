import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

const contenedor = document.getElementById("contenedorMesas");

onSnapshot(collection(db, "mesas"), (snapshot) => {
  contenedor.innerHTML = "";
  snapshot.forEach((doc) => {
    const estado = doc.data().estado;
    const div = document.createElement("div");
    div.className = `mesa ${estado}`;
    div.innerText = doc.id;
    contenedor.appendChild(div);
  });
});
