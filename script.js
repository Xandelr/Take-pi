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
  contenedor.innerHTML = ""; // Limpiar el contenedor antes de volver a cargar

  const pisos = 2;
  const mesasPorPiso = 10;

  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");
    contenedor.appendChild(pisoContenedor);

    const tituloPiso = document.createElement("h2");
    tituloPiso.innerText = `Piso ${piso}`;
    pisoContenedor.appendChild(tituloPiso);

    for (let fila = 0; fila < 2; fila++) {
      const filaContenedor = document.createElement("div");
      filaContenedor.classList.add("fila");
      pisoContenedor.appendChild(filaContenedor);

      for (let mesa = 1; mesa <= 5; mesa++) {
        const numeroMesa = (fila * 5 + mesa).toString().padStart(2, '0');
        const mesaId = `piso${piso}-mesa${numeroMesa}`;

        const mesaElemento = document.createElement("div");
        mesaElemento.classList.add("mesa");
        mesaElemento.innerText = `Mesa ${numeroMesa}`;

        const activarLink = document.createElement("a");
        activarLink.href = `activar.html?id=${mesaId}`;
        activarLink.innerText = "Activar";
        activarLink.classList.add("link-activar");
        activarLink.style.display = "block";

        const liberarLink = document.createElement("a");
        liberarLink.href = `liberar.html?id=${mesaId}`;
        liberarLink.innerText = "Liberar";
        liberarLink.classList.add("link-liberar");
        liberarLink.style.display = "block";

        mesaElemento.appendChild(activarLink);
        mesaElemento.appendChild(liberarLink);

        filaContenedor.appendChild(mesaElemento);

        const mesaRef = doc(db, "mesas", mesaId);
        const mesaDoc = await getDoc(mesaRef);

        if (mesaDoc.exists()) {
          const estado = mesaDoc.data().estado;
          if (estado === "ocupada") {
            mesaElemento.classList.add("ocupada");
            activarLink.style.display = "none";
          } else {
            liberarLink.style.display = "none";
          }
        } else {
          liberarLink.style.display = "none";
          console.log(`La mesa ${mesaId} no existe en Firestore.`);
        }
      }
    }
  }
}

// Cargar las mesas al inicio
window.onload = () => {
  cargarMesas();

  // Refrescar cada 5 segundos
  setInterval(cargarMesas, 5000);
};
