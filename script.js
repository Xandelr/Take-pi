import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Escuchar cambios en las mesas
onSnapshot(collection(db, "mesas"), (snapshot) => {
  // Limpiar todos los contenedores de piso
  document.querySelectorAll('.contenedorMesas').forEach(div => div.innerHTML = '');

  snapshot.forEach((doc) => {
    const idMesa = doc.id;
    const estado = doc.data().estado;
    
    // Separar piso y nombre de mesa desde el ID
    const [piso, mesa] = idMesa.split('-'); // ej: piso1-mesa02 → ['piso1', 'mesa02']
    
    // Buscar el contenedor correspondiente a ese piso
    const contenedor = document.querySelector(`.contenedorMesas[data-piso="${piso}"]`);
    
    if (contenedor) {
      const divMesa = document.createElement("div");
      divMesa.className = `mesa ${estado}`;
      divMesa.innerText = mesa; // muestra solo 'mesa01', 'mesa02', etc.
      contenedor.appendChild(divMesa);
    }
  });
});
