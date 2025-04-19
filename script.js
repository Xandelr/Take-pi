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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar las mesas
async function cargarMesas() {
  const contenedor = document.getElementById("contenedorMesas");

  // Definir número de pisos y mesas por piso
  const pisos = 2;
  const mesasPorPiso = 10;

  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");
    contenedor.appendChild(pisoContenedor);

    const tituloPiso = document.createElement("h2");
    tituloPiso.innerText = `Piso ${piso}`;
    pisoContenedor.appendChild(tituloPiso);

    // Crear filas de 5 mesas
    for (let fila = 0; fila < 2; fila++) {
      const filaContenedor = document.createElement("div");
      filaContenedor.classList.add("fila");
      pisoContenedor.appendChild(filaContenedor);

      for (let mesa = 1; mesa <= 5; mesa++) {
        const numeroMesa = (fila * 5 + mesa).toString().padStart(2, '0');
        const mesaId = `piso${piso}-mesa${numeroMesa}`;
        
        // Crear el div de la mesa
        const mesaElemento = document.createElement("div");
        mesaElemento.classList.add("mesa");
        mesaElemento.innerText = `Mesa ${numeroMesa}`;

        // Crear los enlaces para activar y liberar
        const activarLink = document.createElement("a");
        activarLink.href = `activar.html?id=${mesaId}`;
        activarLink.innerText = "Activar Mesa";
        activarLink.classList.add("link-activar");

        const liberarLink = document.createElement("a");
        liberarLink.href = `liberar.html?id=${mesaId}`;
        liberarLink.innerText = "Liberar Mesa";
        liberarLink.classList.add("link-liberar");

        // Añadir los enlaces debajo del nombre de la mesa
        mesaElemento.appendChild(activarLink);
        mesaElemento.appendChild(liberarLink);

        filaContenedor.appendChild(mesaElemento);

        // Obtener el estado de la mesa desde Firestore
        const mesaRef = doc(db, "mesas", mesaId);
        const mesaDoc = await getDoc(mesaRef);

        if (mesaDoc.exists()) {
          const estado = mesaDoc.data().estado;
          if (estado === "ocupada") {
            mesaElemento.classList.add("ocupada");
            activarLink.style.display = "none"; // Ocultar enlace de activar si ya está ocupada
          } else {
            liberarLink.style.display = "none"; // Ocultar enlace de liberar si ya está libre
          }
        } else {
          // Si la mesa no existe, tal vez quieras agregarla como "libre" por defecto
          console.log(`La mesa ${mesaId} no existe en Firestore.`);
          liberarLink.style.display = "none"; // Ocultar liberar si no existe
        }
      }
    }
  }
}

// Llamar la función para cargar las mesas cuando la página esté cargada
window.onload = cargarMesas;
