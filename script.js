import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";


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
    const pisos = 5;
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

                // Consulta estado en Firestore y escucha cambios en tiempo real
                const mesaRef = doc(db, "mesas", mesaId);
                onSnapshot(mesaRef, (mesaDoc) => {
                    if (mesaDoc.exists()) {
                        const estado = mesaDoc.data().estado;
                        mesaElemento.classList.toggle("ocupada", estado === "ocupada");
                        mesaElemento.classList.toggle("libre", estado !== "ocupada");
                    } else {
                        mesaElemento.classList.add("libre");
                    }
                });

                filaContenedor.appendChild(mesaElemento);
            }
            filasContenedor.appendChild(filaContenedor);
            pisoContenedor.appendChild(filasContenedor);
            contenedor.appendChild(pisoContenedor);
        }
    }
}

// Función para obtener la temperatura general desde la hoja de cálculo
async function obtenerTemperatura() {
    try {
        const res = await fetch("https://opensheet.elk.sh/1z_BT_SQfElGasAfei0jc1Cj-aB_a3WVV4AzdyqpHDnw/Hoja 1");
        if (!res.ok) {
            throw new Error(`Error al obtener datos: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        
        if (Array.isArray(data) && data.length > 0) {
            const ultimaFila = data[data.length - 1];
            // Verificar si ultimaFila tiene las propiedades 'temperatura' y 'fecha'
            if (ultimaFila && typeof ultimaFila.temperatura !== 'undefined' && typeof ultimaFila.fecha !== 'undefined') {
                const temperatura = parseFloat(ultimaFila.temperatura);
                const tempElemento = document.getElementById("temp-general");
                if (tempElemento && !isNaN(temperatura)) {
                    tempElemento.textContent = temperatura.toFixed(1) + " °C";
                } else {
                    tempElemento.textContent = "Dato inválido";
                }
            }
             else {
                console.error("Error: La última fila no contiene 'temperatura' o 'fecha'", ultimaFila);
                document.getElementById("temp-general").textContent = "Error de datos";
             }
        } else {
            document.getElementById("temp-general").textContent = "No hay datos";
        }
    } catch (error) {
        console.error("Error al obtener la temperatura:", error);
        document.getElementById("temp-general").textContent = "Error";
    }
}


window.onload = () => {
    cargarMesas();
    obtenerTemperatura();
    setInterval(obtenerTemperatura, 60000); // Actualiza cada 60 segundos
};
