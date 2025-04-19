import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBBclR3QgQ2It0sQiQkkLqM_GvLu49nKPQ",
  authDomain: "takepi-314.firebaseapp.com",
  projectId: "takepi-314",
  storageBucket: "takepi-314.appspot.com",
  messagingSenderId: "81758083824",
  appId: "1:81758083824:web:1156ba4749288a73928035"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar las mesas
async function cargarMesas() {
  const contenedor = document.getElementById("contenedorMesas");

  const pisos = 2;
  const mesasPorPiso = 10;

  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");

    const tituloPiso = document.createElement("h2");
    tituloPiso.textContent = `Piso ${piso}`;
    pisoContenedor.appendChild(tituloPiso);

    const filasContenedor = document.createElement("div");
    filasContenedor.classList.add("filas");

    for (let fila = 0; fila < 2; fila++) {
      const filaContenedor = document.createElement("div");
      filaContenedor.classList.add("fila");

      for (let i = 1; i <= 5; i++) {
        const mesaNumero = fila * 5 + i;
        const numeroMesa = mesaNumero.toString().padStart(2, '0');
        const mesaId = `piso${piso}-mesa${numeroMesa}`;

        const mesaElemento = document.createElement("div");
        mesaElemento.classList.add("mesa");
        mesaElemento.textContent = `Mesa ${numeroMesa}`;

        // Consulta estado en Firestore
        const mesaRef = doc(db, "mesas", mesaId);
        const mesaDoc = await getDoc(mesaRef);

        if (mesaDoc.exists() && mesaDoc.data().estado === "ocupada") {
          mesaElemento.classList.add("ocupada");
        }

        filaContenedor.appendChild(mesaElemento);
      }

      filasContenedor.appendChild(filaContenedor);
    }

    pisoContenedor.appendChild(filasContenedor);
    contenedor.appendChild(pisoContenedor);
  }
}

// Cargar mesas al iniciar la página
window.onload = cargarMesas;
