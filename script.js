import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Espera a que todo el contenido HTML esté cargado antes de ejecutar el código
window.onload = async function() {
  const contenedor = document.getElementById("contenedorMesas");
  const pisos = 2;
  const mesasPorPiso = 10;
  const mesasPorFila = 5; // 5 mesas por fila

  // Creamos los pisos y las mesas
  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");
    pisoContenedor.innerHTML = `<h2>Piso ${piso}</h2>`; // Agregar título del piso
    contenedor.appendChild(pisoContenedor);

    for (let fila = 0; fila < 2; fila++) { // 2 filas por piso
      const filaContenedor = document.createElement("div");
      filaContenedor.classList.add("fila");
      pisoContenedor.appendChild(filaContenedor);

      for (let mesa = 1; mesa <= mesasPorFila; mesa++) {
        const numeroFormateado = (fila * mesasPorFila + mesa).toString().padStart(2, '0');
        const id = `piso${piso}-mesa${numeroFormateado}`;
        const mesaElemento = document.createElement("div");
        mesaElemento.classList.add("mesa");
        mesaElemento.innerText = `Mesa ${numeroFormateado}`;

        // Obtener el estado de la mesa desde Firestore
        const docRef = doc(db, "mesas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const estado = docSnap.data().estado;
          if (estado === "ocupada") {
            mesaElemento.classList.add("ocupada");
          }
        }

        // Al hacer clic en la mesa, cambiar el estado entre "ocupada" y "libre"
        mesaElemento.addEventListener("click", async () => {
          const nuevoEstado = mesaElemento.classList.contains("ocupada") ? "libre" : "ocupada";
          await setDoc(doc(db, "mesas", id), { estado: nuevoEstado });
          mesaElemento.classList.toggle("ocupada");
        });

        filaContenedor.appendChild(mesaElemento);

        // Establecemos el estado inicial de las mesas en Firestore si no existe
        const docSnapCheck = await getDoc(doc(db, "mesas", id));
        if (!docSnapCheck.exists()) {
          await setDoc(doc(db, "mesas", id), { estado: "libre" });
        }
      }
    }
  }
};

