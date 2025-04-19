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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

    for (let mesa = 1; mesa <= mesasPorPiso; mesa++) {
      const mesaId = `piso${piso}-mesa${mesa.toString().padStart(2, '0')}`;
      
      // Crear el div de la mesa
      const mesaElemento = document.createElement("div");
      mesaElemento.classList.add("mesa");
      mesaElemento.innerText = `Mesa ${mesa}`;

      // Crear los enlaces para activar y liberar
      const activarLink = document.createElement("a");
      activarLink.href = `activar.html?id=${mesaId}`;
      activarLink.innerText = "Activar";
      activarLink.classList.add("link-activar");

      const liberarLink = document.createElement("a");
      liberarLink.href = `liberar.html?id=${mesaId}`;
      liberarLink.innerText = "Liberar";
      liberarLink.classList.add("link-liberar");

      // Añadir los enlaces debajo del nombre de la mesa
      mesaElemento.appendChild(activarLink);
      mesaElemento.appendChild(liberarLink);
      
      pisoContenedor.appendChild(mesaElemento);

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
        liberarLink.style.display = "none"; // Ocultar liberar si no existe
      }
    }
  }
}

// Llamar la función para cargar las mesas cuando la página esté cargada
window.onload = cargarMesas;
