import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBBclR3QgQ2It0sQiQkkLqM_GvLu49nKPQ",
  authDomain: "takepi-314.firebaseapp.com",
  projectId: "takepi-314",
  storageBucket: "takepi-314.appspot.com",
  messagingSenderId: "81758083824",
  appId: "1:81758083824:web:1156ba4749288a73928035"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función asincrónica para cambiar el estado de la mesa
async function activarMesa() {
  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get("id");  // <--- esto toma el ID como mesa1, mesa2, etc.

  if (mesaId) {
    // Cambiar el estado de esa mesa a "ocupada"
    await setDoc(doc(db, "mesas", mesaId), { estado: "ocupada" });
    alert(`¡Mesa ${mesaId} activada con éxito!`);
  } else {
    alert("No se especificó ninguna mesa en la URL.");
  }
}

// Llamar a la función al cargar la página
window.onload = activarMesa;
