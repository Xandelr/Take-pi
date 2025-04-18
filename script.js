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
  const pisos = 2;
  const mesasPorPiso = 10;
  const mesasPorFila = 5;

  // Creamos las mesas por piso
  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");
    contenedor.appendChild(pisoContenedor);

    for (let fila = 0; fila < 2; fila++) {
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

        if (estado === "ocupada") {
          mesaElemento.classList.add("ocupada");
        }

        filaContenedor.appendChild(mesaElemento);
      }
    }
  }
}
