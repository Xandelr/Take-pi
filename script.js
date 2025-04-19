import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
  contenedor.innerHTML = ""; // Limpiar para volver a construir

  const pisos = 2;
  const mesasPorPiso = 10;

  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");

    const tituloPiso = document.createElement("h2");
    tituloPiso.innerText = `Piso ${piso}`;
    pisoContenedor.appendChild(tituloPiso);

    for (let fila = 0; fila < 2; fila++) {
      const filaContenedor = document.createElement("div");
      filaContenedor.classList.add("fila");

      for (let mesa = 1; mesa <= 5; mesa++) {
        const numeroMesa = (fila * 5 + mesa).toString().padStart(2, '0');
        const mesaId = `piso${piso}-mesa${numeroMesa}`;

        const mesaElemento = document.createElement("div");
        mesaElemento.classList.add("mesa");
        mesaElemento.innerText = `Mesa ${numeroMesa}`;

        // Crear el enlace para activar o liberar dependiendo del estado
        const link = document.createElement("a");
        link.href = "#";
        link.classList.add("link-accion");
        link.innerText = "Cambiar estado";

        // Acciones para cambiar el estado
        link.addEventListener("click", async function (event) {
          event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

          // Obtener el estado actual de la mesa
          const mesaRef = doc(db, "mesas", mesaId);
          const mesaDoc = await getDoc(mesaRef);

          if (mesaDoc.exists()) {
            const estado = mesaDoc.data().estado;
            if (estado === "ocupada") {
              // Liberar la mesa
              await updateDoc(mesaRef, { estado: "libre" });
              mesaElemento.classList.remove("ocupada");
              alert(`¡Mesa ${numeroMesa} liberada!`);
            } else {
              // Activar la mesa (marcarla como ocupada)
              await updateDoc(mesaRef, { estado: "ocupada" });
              mesaElemento.classList.add("ocupada");
              alert(`¡Mesa ${numeroMesa} ocupada!`);
            }
          } else {
            console.log(`La mesa ${mesaId} no existe en Firestore.`);
          }
        });

        mesaElemento.appendChild(link);
        filaContenedor.appendChild(mesaElemento);
      }

      pisoContenedor.appendChild(filaContenedor);
    }

    contenedor.appendChild(pisoContenedor);
  }
}

// Cargar las mesas al inicio y actualizar cada 5 segundos
window.onload = () => {
  cargarMesas();
  setInterval(cargarMesas, 5000);
};
