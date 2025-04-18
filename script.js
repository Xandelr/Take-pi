import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

window.onload = async function() {
  const contenedor = document.getElementById("contenedorMesas");
  const pisos = 2; // 2 pisos
  const mesasPorPiso = 10; // 10 mesas por piso (2 filas de 5)
  const mesasPorFila = 5; // 5 mesas por fila

  // Creamos las mesas por piso
  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");

    // Crear el título del piso
    const tituloPiso = document.createElement("div");
    tituloPiso.classList.add("piso-titulo");
    tituloPiso.innerText = `Piso ${piso}`;
    pisoContenedor.appendChild(tituloPiso);

    // Crear las filas y las mesas dentro de cada piso
    for (let fila = 0; fila < 2; fila++) { // 2 filas por piso
      const filaContenedor = document.createElement("div");
      filaContenedor.classList.add("fila");
      pisoContenedor.appendChild(filaContenedor);

      for (let mesa = 1; mesa <= mesasPorFila; mesa++) {
        const numeroFormateado = (fila * mesasPorFila + mesa).toString().padStart(2, '0');
        const id = `piso${piso}-mesa${numeroFormateado}`;
        const mesaRef = doc(db, "mesas", id);
        const mesaDoc = await getDoc(mesaRef);
        const estado = mesaDoc.exists() ? mesaDoc.data().estado : "libre";

        const mesaElemento = document.createElement("div");
        mesaElemento.classList.add("mesa");
        mesaElemento.innerText = `Mesa ${numeroFormateado}`;

        // Cambiar el color de la mesa si está ocupada
        if (estado === "ocupada") {
          mesaElemento.classList.add("ocupada");
        }

        filaContenedor.appendChild(mesaElemento);
      }
    }

    // Agregar el piso al contenedor principal
    contenedor.appendChild(pisoContenedor);
  }
}

