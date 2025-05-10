import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Función para cargar las mesas desde Firestore
async function cargarMesas() {
  const contenedor = document.getElementById("contenedorMesas");

  const pisos = 3;
  const mesasPorPiso = 10;

  // Cargar mesas por cada piso
  for (let piso = 1; piso <= pisos; piso++) {
    const pisoContenedor = document.createElement("div");
    pisoContenedor.classList.add("piso");

    const tituloPiso = document.createElement("h2");
    tituloPiso.textContent = `Piso ${piso}`;
    pisoContenedor.appendChild(tituloPiso);

    const filasContenedor = document.createElement("div");
    filasContenedor.classList.add("filas");

    // Cargar mesas en cada fila del piso
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

        // Consulta estado en Firestore y escucha cambios en tiempo real
        const mesaRef = doc(db, "mesas", mesaId);

        // Añadir un listener para actualizaciones en tiempo real
        onSnapshot(mesaRef, (mesaDoc) => {
          if (mesaDoc.exists()) {
            const estado = mesaDoc.data().estado;
            if (estado === "ocupada") {
              mesaElemento.classList.add("ocupada");
              mesaElemento.classList.remove("libre");
            } else {
              mesaElemento.classList.add("libre");
              mesaElemento.classList.remove("ocupada");
            }
          }
        });

        filaContenedor.appendChild(mesaElemento);
      }

      filasContenedor.appendChild(filaContenedor);
    }

    pisoContenedor.appendChild(filasContenedor);
    contenedor.appendChild(pisoContenedor);
  }
}

// Función para obtener la temperatura desde Google Sheets
function getData() {
  const SPREADSHEET_ID = 'AKfycbyeXSFIHyiyKSXHHSTj7JEKK2gKGZ3MrV1C_soF-5BJ2fjIWv4dQ5-Vqb3FvcZFEm8b'; // ID de tu hoja de cálculo
  const RANGE = 'Hoja1!A2:C';  // Ajusta el rango de las celdas que contienen los datos

  // Usamos la API de Google Sheets para obtener los datos
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE
  }).then((response) => {
    const data = response.result.values;
    if (data && data.length > 0) {
      // Obtener el último valor de la temperatura (última fila)
      const lastRow = data[data.length - 1];
      const temp = lastRow[1];  // Suponiendo que la temperatura está en la columna B

      // Mostrar la temperatura en el HTML
      const tempElement = document.getElementById('temp-piso');
      tempElement.textContent = `Última Temperatura: ${temp} °C`;
    } else {
      console.log("No se encontraron datos.");
    }
  });
}

// Función para cargar el cliente de Google API
function loadClient() {
  gapi.client.setApiKey('AIzaSyCtJGMuXjHXMpt_pi95LReusGAlHEgeKWU');  // Aquí debes reemplazar con tu propia clave de API de Google
  return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4');
}

// Función para iniciar la API
function start() {
  gapi.load('client:auth2', initClient);
}

// Función de inicialización
function initClient() {
  loadClient().then(() => {
    getData();  // Llamada para obtener los datos de la hoja de cálculo
  });
}

// Cargar mesas al iniciar la página
window.onload = cargarMesas;
