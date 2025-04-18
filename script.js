import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Esperamos a que el contenido esté completamente cargado
window.onload = async function() {
  const contenedor = document.getElementById("contenedorMesas");
  const pisos = 2;
  const mesasPorPiso = 10;
  const mesasPorFila = 5; // 5 mesas por fila

  // Creamos los pisos y las mesas
  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");
    contenedor.appendChild(pisoContenedor);

    // Título del piso
    const tituloPiso = document.createElement("h2");
    tituloPiso.innerText = `Piso ${piso}`;
    pisoContenedor.appendChild(tituloPiso);

    // Dividimos las mesas en dos filas
    for (let fila = 0; fila < 2; fila++) {
      const filaContenedor = document.createElement("div");
      filaContenedor.classList.add("fila");
      pisoContenedor.appendChild(filaContenedor);

      for (let mesa = 1; mesa <= mesasPorFila; mesa++) {
        const numeroFormateado = (fila * mesasPorFila + mesa).toString().padStart(2, '0');
        const id = `piso${piso}-mesa${numeroFormateado}`;

        // Crear elemento de mesa
        const mesaElemento = document.createElement("div");
        mesaElemento.classList.add("mesa");
        mesaElemento.innerText = `Mesa ${numeroFormateado}`;
        filaContenedor.appendChild(mesaElemento);

        // Obtener el estado de la mesa desde Firestore
        const mesaDoc = await getDoc(doc(db, "mesas", id));
        if (mesaDoc.exists()) {
          const estado = mesaDoc.data().estado;
          if (estado === "ocupada") {
            mesaElemento.classList.add("ocupada");
          }
        }
      }
    }
  }
};

// Función para ocupar una mesa
async function ocuparMesa(id) {
  await setDoc(doc(db, "mesas", id), { estado: "ocupada" });
  console.log(`Mesa ${id} ocupada`);
}

// Función para liberar una mesa
async function liberarMesa(id) {
  await setDoc(doc(db, "mesas", id), { estado: "libre" });
  console.log(`Mesa ${id} liberada`);
}
